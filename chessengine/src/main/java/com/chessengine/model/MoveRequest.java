package com.chessengine.model;

public class MoveRequest {
    private String gameId;
    private int fromCoordinate;
    private int toCoordinate;
    private Integer aiDepth;

    public MoveRequest() {}

    public String getGameId() { return gameId; }
    public void setGameId(String gameId) { this.gameId = gameId; }

    public int getFromCoordinate() { return fromCoordinate; }
    public void setFromCoordinate(int fromCoordinate) { this.fromCoordinate = fromCoordinate; }

    public int getToCoordinate() { return toCoordinate; }
    public void setToCoordinate(int toCoordinate) { this.toCoordinate = toCoordinate; }

    public Integer getAiDepth() { return aiDepth; }
    public void setAiDepth(Integer aiDepth) { this.aiDepth = aiDepth; }
}
