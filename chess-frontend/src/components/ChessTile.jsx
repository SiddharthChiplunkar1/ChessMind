import React from 'react'
import { getPieceSymbol } from '../utils/chessUtils'
import './ChessTile.css'

const ChessTile = ({
  tile,
  isSelected,
  isLegalTarget,
  isLastMoveFrom,
  isLastMoveTo,
  isInCheck,
  showCoords,
  onClick,
}) => {
  const row = Math.floor(tile.coordinate / 8)
  const col = tile.coordinate % 8
  const isLight = (row + col) % 2 === 0

  const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h']
  const rank = 8 - row
  const file = files[col]

  const tileClasses = [
    'chess-tile',
    isLight ? 'tile-light' : 'tile-dark',
    isSelected     ? 'tile-selected'   : '',
    isLegalTarget  ? 'tile-legal'      : '',
    isLastMoveFrom ? 'tile-lastmove'   : '',
    isLastMoveTo   ? 'tile-lastmove'   : '',
    isInCheck      ? 'tile-check'      : '',
  ].filter(Boolean).join(' ')

  return (
    <div
      className={tileClasses}
      onClick={onClick}
      data-coord={tile.coordinate}
      title={tile.position}
    >
      {/* Rank label on left edge */}
      {showCoords && col === 0 && (
        <span className="tile-rank-label">{rank}</span>
      )}
      {/* File label on bottom edge */}
      {showCoords && row === 7 && (
        <span className="tile-file-label">{file}</span>
      )}

      {/* Legal move dot / ring */}
      {isLegalTarget && (
        <div className={`legal-indicator ${tile.occupied ? 'legal-capture' : 'legal-move'}`} />
      )}

      {/* Piece */}
      {tile.occupied && (
        <span
          className={`piece piece-${tile.pieceAlliance?.toLowerCase()} ${isSelected ? 'piece-selected' : ''}`}
          data-piece={tile.pieceType}
        >
          {getPieceSymbol(tile.pieceType, tile.pieceAlliance)}
        </span>
      )}
    </div>
  )
}

export default ChessTile
