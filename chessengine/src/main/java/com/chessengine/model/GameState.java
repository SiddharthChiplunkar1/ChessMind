package com.chessengine.model;

import java.util.List;

public class GameState {
    private String gameId;
    private List<TileDTO> board;
    private String currentPlayer;
    private boolean isInCheck;
    private boolean isInCheckMate;
    private boolean isInStaleMate;
    private List<String> legalMoves;
    private String status; // "ACTIVE", "CHECKMATE", "STALEMATE"
    private String winner;
    private List<String> moveHistory;
    private List<CapturedPiece> capturedByWhite;
    private List<CapturedPiece> capturedByBlack;

    public GameState() {}

    // Getters and Setters
    public String getGameId() { return gameId; }
    public void setGameId(String gameId) { this.gameId = gameId; }

    public List<TileDTO> getBoard() { return board; }
    public void setBoard(List<TileDTO> board) { this.board = board; }

    public String getCurrentPlayer() { return currentPlayer; }
    public void setCurrentPlayer(String currentPlayer) { this.currentPlayer = currentPlayer; }

    public boolean isInCheck() { return isInCheck; }
    public void setInCheck(boolean inCheck) { isInCheck = inCheck; }

    public boolean isInCheckMate() { return isInCheckMate; }
    public void setInCheckMate(boolean inCheckMate) { isInCheckMate = inCheckMate; }

    public boolean isInStaleMate() { return isInStaleMate; }
    public void setInStaleMate(boolean inStaleMate) { isInStaleMate = inStaleMate; }

    public List<String> getLegalMoves() { return legalMoves; }
    public void setLegalMoves(List<String> legalMoves) { this.legalMoves = legalMoves; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getWinner() { return winner; }
    public void setWinner(String winner) { this.winner = winner; }

    public List<String> getMoveHistory() { return moveHistory; }
    public void setMoveHistory(List<String> moveHistory) { this.moveHistory = moveHistory; }

    public List<CapturedPiece> getCapturedByWhite() { return capturedByWhite; }
    public void setCapturedByWhite(List<CapturedPiece> capturedByWhite) { this.capturedByWhite = capturedByWhite; }

    public List<CapturedPiece> getCapturedByBlack() { return capturedByBlack; }
    public void setCapturedByBlack(List<CapturedPiece> capturedByBlack) { this.capturedByBlack = capturedByBlack; }
}
