package com.chessengine.engine.player.ai;

import com.chessengine.engine.board.Board;

public interface BoardEvaluator {

    int evaluate(Board board, int depth);
}

