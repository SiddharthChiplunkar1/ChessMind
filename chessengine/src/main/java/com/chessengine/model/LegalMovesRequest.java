package com.chessengine.model;

public class LegalMovesRequest {
    private String gameId;
    private int tileCoordinate;

    public LegalMovesRequest() {}

    public String getGameId() { return gameId; }
    public void setGameId(String gameId) { this.gameId = gameId; }

    public int getTileCoordinate() { return tileCoordinate; }
    public void setTileCoordinate(int tileCoordinate) { this.tileCoordinate = tileCoordinate; }
}
