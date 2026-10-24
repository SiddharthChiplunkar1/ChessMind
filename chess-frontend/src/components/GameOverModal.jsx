import React, { useEffect, useState } from 'react'
import './GameOverModal.css'

const WINNER_LABELS = {
  WHITE: '♔ White Wins!',
  BLACK: '♚ Black Wins!',
  DRAW:  '🤝 Draw!',
}

const GameOverModal = ({ status, winner, moveCount, onNewGame, onReset }) => {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (status && status !== 'ACTIVE') {
      const t = setTimeout(() => setVisible(true), 200)
      return () => clearTimeout(t)
    } else {
      setVisible(false)
    }
  }, [status, winner])

  if (!visible) return null

  const isCheckmate = status === 'CHECKMATE'
  const isStalemate = status === 'STALEMATE'

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && setVisible(false)}>
      <div className="modal-card animate-fadein">
        <div className={`modal-icon ${winner === 'DRAW' ? 'icon-draw' : winner === 'WHITE' ? 'icon-white' : 'icon-black'}`}>
          {winner === 'DRAW' ? '½' : winner === 'WHITE' ? '♔' : '♚'}
        </div>

        <h2 className="modal-title">
          {isCheckmate ? 'Checkmate!' : 'Stalemate!'}
        </h2>
        <p className="modal-subtitle">{WINNER_LABELS[winner] ?? 'Game Over'}</p>

        <div className="modal-stat">
          <span className="stat-label">Total moves</span>
          <span className="stat-value">{moveCount}</span>
        </div>

        <div className="modal-description">
          {isCheckmate && winner !== 'DRAW' && (
            <p>
              {winner === 'WHITE'
                ? 'White delivered checkmate. The black king has no escape!'
                : 'The AI delivered checkmate. Well played — try again!'}
            </p>
          )}
          {isStalemate && (
            <p>No legal moves remain — the position is a draw by stalemate.</p>
          )}
        </div>

        <div className="modal-actions">
          <button id="modal-new-game" className="btn btn-primary" onClick={onNewGame}>
            ♟ New Game
          </button>
          <button id="modal-reset" className="btn btn-secondary" onClick={onReset}>
            ↺ Play Again
          </button>
        </div>
      </div>
    </div>
  )
}

export default GameOverModal
