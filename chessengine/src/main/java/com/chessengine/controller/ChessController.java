package com.chessengine.controller;

import com.chessengine.model.GameState;
import com.chessengine.model.LegalMovesRequest;
import com.chessengine.model.MoveRequest;
import com.chessengine.service.GameService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/chess")
public class ChessController {

    private final GameService gameService;

    public ChessController(GameService gameService) {
        this.gameService = gameService;
    }

    /**
     * POST /api/chess/new
     * Starts a new game and returns the initial game state.
     */
    @PostMapping("/new")
    public ResponseEntity<GameState> newGame() {
        GameState state = gameService.newGame();
        return ResponseEntity.ok(state);
    }

    /**
     * GET /api/chess/state/{gameId}
     * Returns the current state of a game.
     */
    @GetMapping("/state/{gameId}")
    public ResponseEntity<GameState> getGameState(@PathVariable String gameId) {
        GameState state = gameService.getGameState(gameId);
        return ResponseEntity.ok(state);
    }

    /**
     * POST /api/chess/legal-moves
     * Returns legal destination coordinates for the piece at the given tile.
     */
    @PostMapping("/legal-moves")
    public ResponseEntity<List<Integer>> getLegalMoves(@RequestBody LegalMovesRequest request) {
        List<Integer> moves = gameService.getLegalMovesForPiece(request.getGameId(), request.getTileCoordinate());
        return ResponseEntity.ok(moves);
    }

    /**
     * POST /api/chess/move
     * Executes a player move. If vsAI=true the AI responds automatically.
     */
    @PostMapping("/move")
    public ResponseEntity<GameState> makeMove(
            @RequestBody MoveRequest request,
            @RequestParam(defaultValue = "false") boolean vsAI) {
        int depth = request.getAiDepth() != null ? request.getAiDepth() : 3;
        GameState state = gameService.makeMove(request.getGameId(), request.getFromCoordinate(), request.getToCoordinate(), vsAI, depth);
        return ResponseEntity.ok(state);
    }

    /**
     * POST /api/chess/ai-move/{gameId}
     * Triggers an AI move for the current player.
     */
    @PostMapping("/ai-move/{gameId}")
    public ResponseEntity<GameState> aiMove(
            @PathVariable String gameId,
            @RequestParam(defaultValue = "3") int depth) {
        GameState state = gameService.executeAiMove(gameId, depth);
        return ResponseEntity.ok(state);
    }

    /**
     * POST /api/chess/undo/{gameId}
     * Undoes the last move.
     */
    @PostMapping("/undo/{gameId}")
    public ResponseEntity<GameState> undoMove(@PathVariable String gameId) {
        GameState state = gameService.undoMove(gameId);
        return ResponseEntity.ok(state);
    }

    /**
     * POST /api/chess/reset/{gameId}
     * Resets the game to starting position.
     */
    @PostMapping("/reset/{gameId}")
    public ResponseEntity<GameState> resetGame(@PathVariable String gameId) {
        GameState state = gameService.resetGame(gameId);
        return ResponseEntity.ok(state);
    }

    /**
     * Global exception handler for this controller.
     */
    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<Map<String, String>> handleError(RuntimeException ex) {
        return ResponseEntity.badRequest().body(Map.of("error", ex.getMessage()));
    }
}
