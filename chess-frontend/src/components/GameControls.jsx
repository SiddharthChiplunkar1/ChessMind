import React from 'react'
import './GameControls.css'

const GameControls = ({
  gameId,
  vsAI,
  flipped,
  showCoords,
  aiDepth,
  isLoading,
  gameStatus,
  theme,
  onNewGame,
  onReset,
  onUndo,
  onToggleMode,
  onChangeDepth,
  onChangeTheme,
  onFlip,
  onToggleCoords,
}) => {
  return (
    <div className="game-controls">
      <div className="controls-header">
        <span className="controls-title">Game Settings</span>
      </div>

      {/* Mode toggle */}
      <div className="control-row">
        <span className="control-label">Mode</span>
        <div className="mode-toggle">
          <button
            className={`mode-btn ${!vsAI ? 'mode-active' : ''}`}
            onClick={() => vsAI && onToggleMode()}
            disabled={isLoading}
          >
            👥 2 Players
          </button>
          <button
            className={`mode-btn ${vsAI ? 'mode-active' : ''}`}
            onClick={() => !vsAI && onToggleMode()}
            disabled={isLoading}
          >
            🤖 vs AI
          </button>
        </div>
      </div>

      {/* AI Difficulty Slider */}
      {vsAI && (
        <div className="control-row ai-difficulty">
          <span className="control-label">
            Engine Depth: <span className="depth-value">{aiDepth}</span>
          </span>
          <input
            type="range"
            min="1"
            max="5"
            value={aiDepth}
            onChange={(e) => onChangeDepth(Number(e.target.value))}
            disabled={isLoading}
            className="depth-slider"
          />
          <div className="depth-labels">
            <span>Fast</span>
            <span>Slow</span>
          </div>
        </div>
      )}

      {/* Theme Selector */}
      <div className="control-row">
        <span className="control-label">Board Theme</span>
        <select 
          className="theme-select" 
          value={theme} 
          onChange={(e) => onChangeTheme(e.target.value)}
        >
          <option value="classic">Classic Green</option>
          <option value="wood">Wooden Board</option>
          <option value="ocean">Ocean Blue</option>
          <option value="slate">Dark Slate</option>
        </select>
      </div>

      {/* Actions */}
      <div className="control-row">
        <button
          id="btn-new-game"
          className="btn btn-primary control-action-btn"
          onClick={onNewGame}
          disabled={isLoading}
        >
          {isLoading ? (
            <span className="spinner" />
          ) : '♟'}
          New Game
        </button>
        <button
          className="btn btn-secondary control-action-btn"
          onClick={onUndo}
          disabled={isLoading || !gameId}
          title="Undo Last Move"
        >
          ⮌ Undo
        </button>
        <button
          id="btn-reset"
          className="btn btn-secondary control-action-btn"
          onClick={onReset}
          disabled={isLoading || !gameId}
        >
          ↺ Reset
        </button>
      </div>

      {/* Board options */}
      <div className="control-row">
        <span className="control-label">Board</span>
        <div className="toggle-group">
          <button
            id="btn-flip"
            className={`toggle-btn ${flipped ? 'toggle-on' : ''}`}
            onClick={onFlip}
            title="Flip board"
          >
            ⇅ Flip
          </button>
          <button
            id="btn-coords"
            className={`toggle-btn ${showCoords ? 'toggle-on' : ''}`}
            onClick={onToggleCoords}
            title="Toggle coordinates"
          >
            {showCoords ? '🔢 Coords' : '🔢 Coords'}
          </button>
        </div>
      </div>

      {/* Status chip */}
      {gameId && (
        <div className="game-id-chip">
          <span className="chip-dot" />
          <span className="chip-text">Game active</span>
        </div>
      )}
    </div>
  )
}

export default GameControls
