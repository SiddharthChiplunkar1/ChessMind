package com.chessengine.model;

public class TileDTO {
    private int coordinate;
    private String position; // algebraic notation e.g. "e4"
    private boolean occupied;
    private String pieceType;   // "PAWN", "ROOK", etc.
    private String pieceAlliance; // "WHITE" or "BLACK"

    public TileDTO() {}

    public TileDTO(int coordinate, String position, boolean occupied, String pieceType, String pieceAlliance) {
        this.coordinate = coordinate;
        this.position = position;
        this.occupied = occupied;
        this.pieceType = pieceType;
        this.pieceAlliance = pieceAlliance;
    }

    public int getCoordinate() { return coordinate; }
    public void setCoordinate(int coordinate) { this.coordinate = coordinate; }

    public String getPosition() { return position; }
    public void setPosition(String position) { this.position = position; }

    public boolean isOccupied() { return occupied; }
    public void setOccupied(boolean occupied) { this.occupied = occupied; }

    public String getPieceType() { return pieceType; }
    public void setPieceType(String pieceType) { this.pieceType = pieceType; }

    public String getPieceAlliance() { return pieceAlliance; }
    public void setPieceAlliance(String pieceAlliance) { this.pieceAlliance = pieceAlliance; }
}
