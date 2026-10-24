import React from 'react'
import { getPieceSymbol, calcMaterialScore } from '../utils/chessUtils'
import './PlayerPanel.css'

const pieceOrder = ['QUEEN', 'ROOK', 'BISHOP', 'KNIGHT', 'PAWN']

const PlayerPanel = ({ alliance, capturedPieces = [], isActive, isInCheck, timeLabel }) => {
  const score = capturedPieces.reduce((sum, p) => {
    const vals = { PAWN: 1, KNIGHT: 3, BISHOP: 3, ROOK: 5, QUEEN: 9 }
    return sum + (vals[p.pieceType] || 0)
  }, 0)

  // Sort captured pieces by value descending
  const sorted = [...capturedPieces].sort(
    (a, b) => pieceOrder.indexOf(a.pieceType) - pieceOrder.indexOf(b.pieceType)
  )

  const isWhite = alliance === 'WHITE'

  return (
    <div className={`player-panel ${isActive ? 'player-active' : ''} ${isInCheck ? 'player-check' : ''}`}>
      <div className="player-info">
        <div className={`player-avatar ${isWhite ? 'avatar-white' : 'avatar-black'}`}>
          {isWhite ? '♔' : '♚'}
        </div>
        <div className="player-details">
          <span className="player-name">
            {isWhite ? 'White' : 'Black'}
            {isActive && <span className="active-dot" />}
          </span>
          <span className="player-role">
            {isWhite ? 'Human' : 'ChessMind AI'}
          </span>
        </div>
        {isInCheck && (
          <span className="check-badge">CHECK</span>
        )}
      </div>

      <div className="captured-pieces">
        {sorted.map((p, i) => (
          <span key={i} className={`cap-piece cap-${p.pieceAlliance?.toLowerCase()}`}>
            {getPieceSymbol(p.pieceType, p.pieceAlliance)}
          </span>
        ))}
        {score > 0 && <span className="material-score">+{score}</span>}
      </div>
    </div>
  )
}

export default PlayerPanel
