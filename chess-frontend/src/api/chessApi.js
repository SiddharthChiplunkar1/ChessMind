import axios from 'axios'

const api = axios.create({
  baseURL: '/api/chess',
  headers: { 'Content-Type': 'application/json' },
})

/** Start a new game, returns GameState */
export const newGame = () =>
  api.post('/new').then(r => r.data)

/** Get current game state */
export const getGameState = (gameId) =>
  api.get(`/state/${gameId}`).then(r => r.data)

/** Get legal moves for a piece at tileCoordinate */
export const getLegalMoves = (gameId, tileCoordinate) =>
  api.post('/legal-moves', { gameId, tileCoordinate }).then(r => r.data)

/** Make a player move. vsAI=true triggers AI response */
export const makeMove = (gameId, fromCoordinate, toCoordinate, vsAI = false, aiDepth = 3) =>
  api.post(`/move?vsAI=${vsAI}`, { gameId, fromCoordinate, toCoordinate, aiDepth }).then(r => r.data)

/** Trigger an AI move for the current player */
export const aiMove = (gameId, aiDepth = 3) =>
  api.post(`/ai-move/${gameId}?depth=${aiDepth}`).then(r => r.data)

/** Undo the last move */
export const undoMove = (gameId) =>
  api.post(`/undo/${gameId}`).then(r => r.data)

/** Reset game to starting position */
export const resetGame = (gameId) =>
  api.post(`/reset/${gameId}`).then(r => r.data)

export default api
