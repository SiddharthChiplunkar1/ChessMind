import React, { useRef, useEffect } from 'react'
import './MoveHistory.css'

const MoveHistory = ({ moves = [] }) => {
  const bottomRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [moves])

  // Pair moves: [[w1, b1], [w2, b2], ...]
  const pairs = []
  for (let i = 0; i < moves.length; i += 2) {
    pairs.push([moves[i], moves[i + 1]])
  }

  const exportPGN = () => {
    let pgn = ''
    pairs.forEach(([w, b], i) => {
      pgn += `${i + 1}. ${w} ${b || ''} `
    })
    const blob = new Blob([pgn.trim()], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `chessmind-game.pgn`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="move-history">
      <div className="move-history-header">
        <span className="move-history-title">Move History</span>
        <div className="move-history-actions">
          <span className="move-count">{moves.length} moves</span>
          {moves.length > 0 && (
            <button className="export-btn" onClick={exportPGN} title="Export PGN">
              ⭳
            </button>
          )}
        </div>
      </div>

      <div className="move-history-body">
        {pairs.length === 0 && (
          <p className="move-history-empty">No moves yet — make your first move!</p>
        )}
        {pairs.map(([white, black], idx) => (
          <div key={idx} className="move-pair">
            <span className="move-number">{idx + 1}.</span>
            <span className="move-white">{white}</span>
            {black && <span className="move-black">{black}</span>}
          </div>
        ))}
        <div ref={bottomRef} />
      </div>
    </div>
  )
}

export default MoveHistory
