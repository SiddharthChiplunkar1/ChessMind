package com.chessengine.service;

import com.chessengine.engine.Alliance;
import com.chessengine.engine.board.Board;
import com.chessengine.engine.board.BoardUtils;
import com.chessengine.engine.board.Move;
import com.chessengine.engine.board.MoveTransition;
import com.chessengine.engine.board.Tile;
import com.chessengine.engine.pieces.Piece;
import com.chessengine.engine.player.ai.AlphaBeta;
import com.chessengine.model.CapturedPiece;
import com.chessengine.model.GameState;
import com.chessengine.model.TileDTO;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;

@Service
public class GameService {

    // Holds active game sessions: gameId -> Board
    private final Map<String, Board> games = new ConcurrentHashMap<>();
    // Holds move history per game
    private final Map<String, List<String>> moveHistories = new ConcurrentHashMap<>();
    // Holds captured pieces per game
    private final Map<String, List<Piece>> capturedPieces = new ConcurrentHashMap<>();
    // Holds board position counts for threefold repetition
    private final Map<String, Map<String, Integer>> positionCounts = new ConcurrentHashMap<>();

    private static class GameSnapshot {
        final Board board;
        final List<String> moveHistory;
        final List<Piece> capturedPieces;
        final Map<String, Integer> positionCounts;

        GameSnapshot(Board board, List<String> mh, List<Piece> cp, Map<String, Integer> pc) {
            this.board = board;
            this.moveHistory = new ArrayList<>(mh);
            this.capturedPieces = new ArrayList<>(cp);
            this.positionCounts = new HashMap<>(pc);
        }
    }

    private final Map<String, Stack<GameSnapshot>> snapshots = new ConcurrentHashMap<>();

    /**
     * Creates a new game and returns the initial state.
     */
    public GameState newGame() {
        String gameId = UUID.randomUUID().toString();
        Board board = Board.createStandardBoard();
        games.put(gameId, board);
        moveHistories.put(gameId, new ArrayList<>());
        capturedPieces.put(gameId, new ArrayList<>());
        
        Map<String, Integer> counts = new HashMap<>();
        counts.put(board.toString(), 1);
        positionCounts.put(gameId, counts);
        snapshots.put(gameId, new Stack<>());
        
        return buildGameState(gameId, board);
    }

    /**
     * Gets the current game state.
     */
    public GameState getGameState(String gameId) {
        Board board = games.get(gameId);
        if (board == null) throw new RuntimeException("Game not found: " + gameId);
        return buildGameState(gameId, board);
    }

    /**
     * Returns legal destination coordinates for a piece at a given tile.
     */
    public List<Integer> getLegalMovesForPiece(String gameId, int tileCoordinate) {
        Board board = games.get(gameId);
        if (board == null) throw new RuntimeException("Game not found: " + gameId);

        List<Integer> destinations = new ArrayList<>();
        Tile tile = board.getTile(tileCoordinate);
        if (!tile.isTileOccupied()) return destinations;

        Piece piece = tile.getPiece();
        // Only show legal moves for the current player's pieces
        if (piece.getPieceAlliance() != board.currentPlayer().getAlliance()) return destinations;

        for (Move move : board.currentPlayer().getLegalMoves()) {
            if (move.getCurrentCoordinate() == tileCoordinate) {
                MoveTransition transition = board.currentPlayer().makeMove(move);
                if (transition.getMoveStatus().isDone()) {
                    destinations.add(move.getDestinationCoordinate());
                }
            }
        }
        return destinations;
    }

    /**
     * Executes a player move and optionally an AI move.
     */
    public GameState makeMove(String gameId, int fromCoordinate, int toCoordinate, boolean vsAI, int aiDepth) {
        Board board = games.get(gameId);
        if (board == null) throw new RuntimeException("Game not found: " + gameId);

        Move move = Move.MoveFactory.createMove(board, fromCoordinate, toCoordinate);
        if (move instanceof Move.NullMove) {
            throw new RuntimeException("Illegal move from " + fromCoordinate + " to " + toCoordinate);
        }

        MoveTransition transition = board.currentPlayer().makeMove(move);
        if (!transition.getMoveStatus().isDone()) {
            throw new RuntimeException("Move not executed: " + transition.getMoveStatus());
        }

        // Save Snapshot before applying changes
        snapshots.get(gameId).push(new GameSnapshot(board, moveHistories.get(gameId), capturedPieces.get(gameId), positionCounts.get(gameId)));

        // Track captured pieces
        if (move.isAttack()) {
            capturedPieces.get(gameId).add(move.getAttackedPiece());
        }

        Board newBoard = transition.getToBoard();
        moveHistories.get(gameId).add(move.toString());
        games.put(gameId, newBoard);

        // Update threefold repetition counts
        Map<String, Integer> counts = positionCounts.get(gameId);
        String positionStr = newBoard.toString();
        counts.put(positionStr, counts.getOrDefault(positionStr, 0) + 1);

        GameState state = buildGameState(gameId, newBoard);

        // If playing vs AI and game is still active, let the AI move
        if (vsAI && "ACTIVE".equals(state.getStatus())) {
            state = executeAiMove(gameId, aiDepth);
        }

        return state;
    }

    /**
     * Executes an AI (AlphaBeta) move on the current board.
     */
    public GameState executeAiMove(String gameId, int aiDepth) {
        Board board = games.get(gameId);
        if (board == null) throw new RuntimeException("Game not found: " + gameId);

        AlphaBeta alphaBeta = new AlphaBeta(aiDepth);
        Move bestMove = alphaBeta.execute(board);

        if (bestMove instanceof Move.NullMove) {
            return buildGameState(gameId, board);
        }

        MoveTransition transition = board.currentPlayer().makeMove(bestMove);
        if (transition.getMoveStatus().isDone()) {
            // Save Snapshot before applying changes
            snapshots.get(gameId).push(new GameSnapshot(board, moveHistories.get(gameId), capturedPieces.get(gameId), positionCounts.get(gameId)));

            if (bestMove.isAttack()) {
                capturedPieces.get(gameId).add(bestMove.getAttackedPiece());
            }
            Board newBoard = transition.getToBoard();
            moveHistories.get(gameId).add(bestMove.toString());
            games.put(gameId, newBoard);

            // Update threefold repetition counts
            Map<String, Integer> counts = positionCounts.get(gameId);
            String positionStr = newBoard.toString();
            counts.put(positionStr, counts.getOrDefault(positionStr, 0) + 1);

            return buildGameState(gameId, newBoard);
        }

        return buildGameState(gameId, board);
    }

    public GameState undoMove(String gameId) {
        Stack<GameSnapshot> stack = snapshots.get(gameId);
        if (stack != null && !stack.isEmpty()) {
            GameSnapshot snapshot = stack.pop();
            games.put(gameId, snapshot.board);
            moveHistories.put(gameId, snapshot.moveHistory);
            capturedPieces.put(gameId, snapshot.capturedPieces);
            positionCounts.put(gameId, snapshot.positionCounts);
        }
        return getGameState(gameId);
    }

    /**
     * Resets a game to the starting position.
     */
    public GameState resetGame(String gameId) {
        Board board = Board.createStandardBoard();
        games.put(gameId, board);
        moveHistories.put(gameId, new ArrayList<>());
        capturedPieces.put(gameId, new ArrayList<>());

        Map<String, Integer> counts = new HashMap<>();
        counts.put(board.toString(), 1);
        positionCounts.put(gameId, counts);
        snapshots.put(gameId, new Stack<>());

        return buildGameState(gameId, board);
    }

    // ─────────────────────── private helpers ────────────────────────

    private GameState buildGameState(String gameId, Board board) {
        GameState state = new GameState();
        state.setGameId(gameId);
        state.setBoard(buildBoardDTO(board));
        state.setCurrentPlayer(board.currentPlayer().getAlliance().name());
        state.setInCheck(board.currentPlayer().isInCheck());
        state.setInCheckMate(board.currentPlayer().isInCheckMate());
        state.setInStaleMate(board.currentPlayer().isInStaleMate());

        List<String> legalMoveStrings = board.currentPlayer().getLegalMoves().stream()
                .map(m -> m.getCurrentCoordinate() + "-" + m.getDestinationCoordinate())
                .collect(Collectors.toList());
        state.setLegalMoves(legalMoveStrings);

        int maxRepetition = 0;
        if (positionCounts.containsKey(gameId)) {
            maxRepetition = positionCounts.get(gameId).values().stream().max(Integer::compareTo).orElse(0);
        }

        if (board.currentPlayer().isInCheckMate()) {
            state.setStatus("CHECKMATE");
            state.setWinner(board.currentPlayer().getOpponent().getAlliance().name());
        } else if (board.currentPlayer().isInStaleMate() || maxRepetition >= 3) {
            state.setStatus("STALEMATE");
            state.setWinner("DRAW");
        } else {
            state.setStatus("ACTIVE");
        }

        state.setMoveHistory(moveHistories.getOrDefault(gameId, Collections.emptyList()));

        // Separate captured pieces by who captured them
        List<Piece> allCaptured = capturedPieces.getOrDefault(gameId, Collections.emptyList());
        List<CapturedPiece> capturedByWhite = allCaptured.stream()
                .filter(p -> p.getPieceAlliance() == Alliance.BLACK)
                .map(p -> new CapturedPiece(p.getPieceType().name(), p.getPieceAlliance().name()))
                .collect(Collectors.toList());
        List<CapturedPiece> capturedByBlack = allCaptured.stream()
                .filter(p -> p.getPieceAlliance() == Alliance.WHITE)
                .map(p -> new CapturedPiece(p.getPieceType().name(), p.getPieceAlliance().name()))
                .collect(Collectors.toList());
        state.setCapturedByWhite(capturedByWhite);
        state.setCapturedByBlack(capturedByBlack);

        return state;
    }

    private List<TileDTO> buildBoardDTO(Board board) {
        List<TileDTO> tiles = new ArrayList<>();
        for (int i = 0; i < BoardUtils.NUM_TILES; i++) {
            Tile tile = board.getTile(i);
            String position = BoardUtils.INSTANCE.getPositionAtCoordinate(i);
            if (tile.isTileOccupied()) {
                Piece piece = tile.getPiece();
                tiles.add(new TileDTO(i, position, true,
                        piece.getPieceType().name(),
                        piece.getPieceAlliance().name()));
            } else {
                tiles.add(new TileDTO(i, position, false, null, null));
            }
        }
        return tiles;
    }
}
