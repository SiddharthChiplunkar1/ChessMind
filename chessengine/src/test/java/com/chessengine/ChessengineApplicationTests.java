package com.chessengine;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

import com.chessengine.engine.board.Board;

@SpringBootTest
class ChessengineApplicationTests {

	@Test
	void contextLoads() {
		Board board = Board.createStandardBoard();
		System.out.println(board);
	}

}
