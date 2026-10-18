package com.chessengine.engine.player.ai;

import com.chessengine.engine.board.Board;
import com.chessengine.engine.board.Move;

public interface MoveStrategy {

    long getNumBoardsEvaluated();

    Move execute(Board board);
}

