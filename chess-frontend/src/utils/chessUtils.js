/**
 * Returns the Unicode chess symbol for a given piece type and alliance.
 * White pieces = filled, Black pieces = outlined (standard chess Unicode).
 */
export const getPieceSymbol = (pieceType, alliance) => {
  const pieces = {
    WHITE: {
      KING:   '♔',
      QUEEN:  '♕',
      ROOK:   '♖',
      BISHOP: '♗',
      KNIGHT: '♘',
      PAWN:   '♙',
    },
    BLACK: {
      KING:   '♚',
      QUEEN:  '♛',
      ROOK:   '♜',
      BISHOP: '♝',
      KNIGHT: '♞',
      PAWN:   '♟',
    },
  }
  return pieces[alliance]?.[pieceType] ?? ''
}

/**
 * Map piece type string to a short display label.
 */
export const getPieceLabel = (pieceType) => {
  const labels = {
    KING: 'K', QUEEN: 'Q', ROOK: 'R', BISHOP: 'B', KNIGHT: 'N', PAWN: 'P',
  }
  return labels[pieceType] ?? '?'
}

/**
 * Map a piece type to its material value for display.
 */
export const getPieceValue = (pieceType) => {
  const values = {
    PAWN: 1, KNIGHT: 3, BISHOP: 3, ROOK: 5, QUEEN: 9, KING: 0,
  }
  return values[pieceType] ?? 0
}

/**
 * Calculate the material advantage score.
 * Returns { white: n, black: n, diff: n (positive = white ahead) }
 */
export const calcMaterialScore = (capturedByWhite = [], capturedByBlack = []) => {
  const sum = (arr) => arr.reduce((acc, p) => acc + getPieceValue(p.pieceType), 0)
  const wScore = sum(capturedByWhite)
  const bScore = sum(capturedByBlack)
  return { white: wScore, black: bScore, diff: wScore - bScore }
}

/**
 * Convert a tile coordinate (0-63) to algebraic notation (e.g. "e4")
 */
export const coordToAlgebraic = (coord) => {
  const files = ['a','b','c','d','e','f','g','h']
  const rank = 8 - Math.floor(coord / 8)
  const file = files[coord % 8]
  return `${file}${rank}`
}
