import React, { useState, useCallback } from 'react'
import ChessTile from './ChessTile'
import './ChessBoard.css'

const ChessBoard = ({
  boardTiles,
  currentPlayer,
  legalTargets,
  selectedCoord,
  lastMove,
  checkKingCoord,
  flipped,
  showCoords,
  onTileClick,
}) => {
  // boardTiles is a flat array of 64 TileDTO objects (index 0=a8, 63=h1)
  const tiles = flipped ? [...boardTiles].reverse() : boardTiles

  const lastMoveCoords = lastMove
    ? [lastMove.from, lastMove.to]
    : []

  return (
    <div className="board-wrapper">
      <div className="chess-board">
        {tiles.map((tile) => (
          <ChessTile
            key={tile.coordinate}
            tile={tile}
            isSelected={tile.coordinate === selectedCoord}
            isLegalTarget={legalTargets.includes(tile.coordinate)}
            isLastMoveFrom={lastMoveCoords[0] === tile.coordinate}
            isLastMoveTo={lastMoveCoords[1] === tile.coordinate}
            isInCheck={tile.coordinate === checkKingCoord}
            showCoords={showCoords}
            onClick={() => onTileClick(tile)}
          />
        ))}
      </div>
    </div>
  )
}

export default ChessBoard
