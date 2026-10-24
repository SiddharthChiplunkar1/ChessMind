import React, { useState, useCallback } from 'react'
import ChessBoard from './components/ChessBoard'
import PlayerPanel from './components/PlayerPanel'
import MoveHistory from './components/MoveHistory'
import GameControls from './components/GameControls'
import GameOverModal from './components/GameOverModal'
import { newGame, getGameState, getLegalMoves, makeMove, resetGame, undoMove } from './api/chessApi'
import './App.css'

const LANDING = 'LANDING'
const PLAYING = 'PLAYING'

const playSound = (type) => {
  const urls = {
    move: 'https://images.chesscomfiles.com/chess-themes/sounds/_MP3_/default/move-self.mp3',
    capture: 'https://images.chesscomfiles.com/chess-themes/sounds/_MP3_/default/capture.mp3',
    check: 'https://images.chesscomfiles.com/chess-themes/sounds/_MP3_/default/move-check.mp3',
    start: 'https://images.chesscomfiles.com/chess-themes/sounds/_MP3_/default/game-start.mp3',
    end: 'https://images.chesscomfiles.com/chess-themes/sounds/_MP3_/default/game-end.mp3'
  }
  if (urls[type]) new Audio(urls[type]).play().catch(() => {})
}

export default function App() {
  const [screen, setScreen]           = useState(LANDING)
  const [gameState, setGameState]     = useState(null)
  const [selectedCoord, setSelectedCoord] = useState(null)
  const [legalTargets, setLegalTargets]   = useState([])
  const [lastMove, setLastMove]       = useState(null)
  const [vsAI, setVsAI]               = useState(true)
  const [aiDepth, setAiDepth]         = useState(3)
  const [theme, setTheme]             = useState('classic')
  const [flipped, setFlipped]         = useState(false)
  const [showCoords, setShowCoords]   = useState(true)
  const [isLoading, setIsLoading]     = useState(false)
  const [error, setError]             = useState(null)

  React.useEffect(() => {
    document.body.dataset.theme = theme
  }, [theme])

  // ── Derived ───────────────────────────────────────────────────────
  const board      = gameState?.board ?? []
  const status     = gameState?.status ?? 'ACTIVE'
  const winner     = gameState?.winner ?? null
  const moveHistory = gameState?.moveHistory ?? []
  const currentPlayer = gameState?.currentPlayer ?? 'WHITE'
  const isInCheck  = gameState?.inCheck ?? false

  // Find the king tile of the current player if in check
  const checkKingCoord = (() => {
    if (!isInCheck || !gameState) return null
    const kingTile = board.find(
      t => t.occupied && t.pieceType === 'KING' && t.pieceAlliance === currentPlayer
    )
    return kingTile?.coordinate ?? null
  })()

  // ── Actions ────────────────────────────────────────────────────────

  const handleNewGame = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    setSelectedCoord(null)
    setLegalTargets([])
    setLastMove(null)
    try {
      const state = await newGame()
      setGameState(state)
      setScreen(PLAYING)
      playSound('start')
    } catch (e) {
      setError('Failed to start game. Is the backend running?')
    } finally {
      setIsLoading(false)
    }
  }, [])

  const handleReset = useCallback(async () => {
    if (!gameState?.gameId) return
    setIsLoading(true)
    setError(null)
    setSelectedCoord(null)
    setLegalTargets([])
    setLastMove(null)
    try {
      const state = await resetGame(gameState.gameId)
      setGameState(state)
    } catch (e) {
      setError('Failed to reset game.')
    } finally {
      setIsLoading(false)
    }
  }, [gameState])

  const handleUndo = useCallback(async () => {
    if (!gameState?.gameId) return
    setIsLoading(true)
    setError(null)
    setSelectedCoord(null)
    setLegalTargets([])
    setLastMove(null)
    try {
      const state = await undoMove(gameState.gameId)
      // If vs AI, undo again to revert AI's move too!
      if (vsAI && state.moveHistory.length > 0) {
        const state2 = await undoMove(gameState.gameId)
        setGameState(state2)
      } else {
        setGameState(state)
      }
      playSound('move')
    } catch (e) {
      setError('Failed to undo move.')
    } finally {
      setIsLoading(false)
    }
  }, [gameState, vsAI])

  const handleTileClick = useCallback(async (tile) => {
    if (!gameState || status !== 'ACTIVE' || isLoading) return

    // If AI is thinking (it's AI's turn in vsAI mode), don't allow clicks
    if (vsAI && currentPlayer === 'BLACK') return

    const coord = tile.coordinate

    // ── Piece already selected → try to move ──────────────────────
    if (selectedCoord !== null && legalTargets.includes(coord)) {
      setIsLoading(true)
      setError(null)
      const from = selectedCoord
      setSelectedCoord(null)
      setLegalTargets([])
      try {
        const newState = await makeMove(gameState.gameId, from, coord, vsAI, aiDepth)
        
        if (newState.status !== 'ACTIVE') {
          playSound('end')
        } else if (newState.isInCheck) {
          playSound('check')
        } else if (
          newState.capturedByWhite.length > (gameState.capturedByWhite?.length || 0) ||
          newState.capturedByBlack.length > (gameState.capturedByBlack?.length || 0)
        ) {
          playSound('capture')
        } else {
          playSound('move')
        }

        setGameState(newState)
        setLastMove({ from, to: coord })
      } catch (e) {
        setError(e.response?.data?.error ?? 'Illegal move.')
      } finally {
        setIsLoading(false)
      }
      return
    }

    // ── Click on own piece → select it ────────────────────────────
    if (tile.occupied && tile.pieceAlliance === currentPlayer) {
      if (selectedCoord === coord) {
        // Deselect
        setSelectedCoord(null)
        setLegalTargets([])
        return
      }
      setSelectedCoord(coord)
      try {
        const targets = await getLegalMoves(gameState.gameId, coord)
        setLegalTargets(targets)
      } catch {
        setLegalTargets([])
      }
      return
    }

    // ── Click on empty / opponent tile without a selected piece → deselect ──
    setSelectedCoord(null)
    setLegalTargets([])
  }, [gameState, status, isLoading, vsAI, aiDepth, currentPlayer, selectedCoord, legalTargets])

  const handleToggleMode = () => {
    setVsAI(v => !v)
    setSelectedCoord(null)
    setLegalTargets([])
  }

  // ── Landing screen ─────────────────────────────────────────────────
  if (screen === LANDING) {
    return (
      <div className="landing">
        <div className="landing-bg" />
        <div className="landing-content animate-fadein">
          <div className="landing-logo">♟</div>
          <h1 className="landing-title">ChessMind</h1>
          <p className="landing-subtitle">
            Play chess against the computer or challenge a friend locally.
          </p>
          <div className="landing-modes" style={{ marginTop: '36px' }}>
            <button
              id="start-vs-ai"
              className="btn btn-primary landing-btn"
              onClick={() => { setVsAI(true); handleNewGame() }}
              disabled={isLoading}
            >
              {isLoading ? <span className="spinner" /> : '🤖'}
              Play vs AI
            </button>
            <button
              id="start-2p"
              className="btn btn-secondary landing-btn"
              onClick={() => { setVsAI(false); handleNewGame() }}
              disabled={isLoading}
            >
              👥 2 Players
            </button>
          </div>
          {error && <p className="error-msg">{error}</p>}
        </div>
      </div>
    )
  }

  // ── Game screen ────────────────────────────────────────────────────
  return (
    <div className="app">
      {/* ── Header ──────────────────────────────────────────────── */}
      <header className="app-header">
        <div className="header-logo" onClick={() => setScreen(LANDING)}>
          <span className="header-icon">♟</span>
          <span className="header-title">ChessMind</span>
        </div>

        <div className="header-status">
          {status === 'ACTIVE' && (
            <>
              <span className={`turn-indicator ${currentPlayer.toLowerCase()}-turn`} />
              <span className="turn-label">
                {vsAI && currentPlayer === 'BLACK' ? 'AI thinking…' : `${currentPlayer}'s turn`}
              </span>
              {isInCheck && <span className="header-check-badge">CHECK</span>}
            </>
          )}
          {status === 'CHECKMATE' && (
            <span className="status-chip chip-checkmate">Checkmate — {winner} wins</span>
          )}
          {status === 'STALEMATE' && (
            <span className="status-chip chip-stalemate">Stalemate — Draw</span>
          )}
        </div>

        <button className="btn btn-secondary header-home-btn" onClick={() => setScreen(LANDING)}>
          ⌂ Home
        </button>
      </header>

      {/* ── Main layout ─────────────────────────────────────────── */}
      <main className="app-main">
        {/* Left sidebar */}
        <aside className="sidebar sidebar-left">
          <GameControls
            gameId={gameState?.gameId}
            vsAI={vsAI}
            aiDepth={aiDepth}
            theme={theme}
            flipped={flipped}
            showCoords={showCoords}
            isLoading={isLoading}
            gameStatus={status}
            theme={theme}
            onNewGame={handleNewGame}
            onReset={handleReset}
            onUndo={handleUndo}
            onToggleMode={handleToggleMode}
            onChangeDepth={(d) => setAiDepth(d)}
            onChangeTheme={setTheme}
            onFlip={() => setFlipped(f => !f)}
            onToggleCoords={() => setShowCoords(s => !s)}
          />
        </aside>

        {/* Board column */}
        <div className="board-column">
          {/* Black player (top) */}
          <PlayerPanel
            alliance="BLACK"
            capturedPieces={gameState?.capturedByBlack ?? []}
            isActive={currentPlayer === 'BLACK'}
            isInCheck={isInCheck && currentPlayer === 'BLACK'}
          />

          {error && (
            <div className="error-banner" onClick={() => setError(null)}>
              ⚠ {error} <span className="error-dismiss">×</span>
            </div>
          )}

          <ChessBoard
            boardTiles={board}
            currentPlayer={currentPlayer}
            legalTargets={legalTargets}
            selectedCoord={selectedCoord}
            lastMove={lastMove}
            checkKingCoord={checkKingCoord}
            flipped={flipped}
            showCoords={showCoords}
            onTileClick={handleTileClick}
          />

          {/* White player (bottom) */}
          <PlayerPanel
            alliance="WHITE"
            capturedPieces={gameState?.capturedByWhite ?? []}
            isActive={currentPlayer === 'WHITE'}
            isInCheck={isInCheck && currentPlayer === 'WHITE'}
          />
        </div>

        {/* Right sidebar */}
        <aside className="sidebar sidebar-right">
          <MoveHistory moves={moveHistory} />
        </aside>
      </main>

      {/* Game Over modal */}
      <GameOverModal
        status={status}
        winner={winner}
        moveCount={moveHistory.length}
        onNewGame={handleNewGame}
        onReset={handleReset}
      />
    </div>
  )
}
