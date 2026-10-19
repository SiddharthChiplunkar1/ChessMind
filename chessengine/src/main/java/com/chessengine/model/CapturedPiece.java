package com.chessengine.model;

public class CapturedPiece {
    private String pieceType;
    private String pieceAlliance;

    public CapturedPiece() {}

    public CapturedPiece(String pieceType, String pieceAlliance) {
        this.pieceType = pieceType;
        this.pieceAlliance = pieceAlliance;
    }

    public String getPieceType() { return pieceType; }
    public void setPieceType(String pieceType) { this.pieceType = pieceType; }

    public String getPieceAlliance() { return pieceAlliance; }
    public void setPieceAlliance(String pieceAlliance) { this.pieceAlliance = pieceAlliance; }
}
