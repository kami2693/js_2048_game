'use strict';

class Game {
  constructor(initialState = null) {
    this.size = 4;
    this.score = 0;
    this.status = 'idle';

    this.board = initialState
      ? initialState.map((row) => [...row])
      : this.createEmptyBoard();
    this.updateMessage();
  }

  createEmptyBoard() {
    return Array.from({ length: this.size }, () => Array(this.size).fill(0));
  }

  moveLeft() {
    let moved = false;

    for (let row = 0; row < 4; row++) {
      let newRow = this.board[row].filter((tile) => tile !== 0);

      for (let col = 0; col < newRow.length - 1; col++) {
        if (newRow[col] !== 0 && newRow[col] === newRow[col + 1]) {
          newRow[col] *= 2;
          newRow[col + 1] = 0;
          this.score += newRow[col];
          moved = true;
        }
      }

      newRow = newRow.filter((tile) => tile !== 0);

      while (newRow.length < 4) {
        newRow.push(0);
      }

      if (JSON.stringify(this.board[row]) !== JSON.stringify(newRow)) {
        moved = true;
      }

      this.board[row] = newRow;
    }

    if (moved) {
      this.createRandomTile();
      this.checkStatus();
    }

    return moved;
  }

  moveRight() {
    this.board = this.board.map((row) => row.reverse());

    const moved = this.moveLeft();

    this.board = this.board.map((row) => row.reverse());

    return moved;
  }

  moveUp() {
    this.transpose();

    const moved = this.moveLeft();

    this.transpose();

    return moved;
  }

  moveDown() {
    this.transpose();

    const moved = this.moveRight();

    this.transpose();

    return moved;
  }

  transpose() {
    this.board = this.board[0].map((_, colIndex) =>
      this.board.map((row) => row[colIndex]),
    );
  }

  getScore() {
    return this.score;
  }

  getState() {
    return this.board.map((row) => [...row]);
  }

  getStatus() {
    return this.status;
  }

  start() {
    this.status = 'playing';
    this.board = this.createEmptyBoard();
    this.score = 0;
    this.createRandomTile();
    this.createRandomTile();
    this.updateMessage();
  }

  restart() {
    this.board = this.createEmptyBoard();
    this.score = 0;
    this.status = 'playing';
    this.createRandomTile();
    this.createRandomTile();
    this.updateMessage();
  }

  createRandomTile() {
    const emptyTiles = [];

    for (let row = 0; row < this.size; row++) {
      for (let col = 0; col < this.size; col++) {
        if (this.board[row][col] === 0) {
          emptyTiles.push({ row, col });
        }
      }
    }

    if (emptyTiles.length > 0) {
      const { row, col } =
        emptyTiles[Math.floor(Math.random() * emptyTiles.length)];

      this.board[row][col] = Math.random() < 0.9 ? 2 : 4;
      this.checkStatus();
    } else {
      this.status = 'lose';
      this.updateMessage();
    }
  }

  checkStatus() {
    // Check for win
    for (let row = 0; row < this.size; row++) {
      for (let col = 0; col < this.size; col++) {
        if (this.board[row][col] === 2048) {
          this.status = 'win';
          this.updateMessage();

          return;
        }
      }
    }

    // Check for lose
    let hasEmptyTile = false;
    let canMove = false;

    // Check for empty tiles
    for (let row = 0; row < this.size; row++) {
      for (let col = 0; col < this.size; col++) {
        if (this.board[row][col] === 0) {
          hasEmptyTile = true;
          break;
        }
      }

      if (hasEmptyTile) {
        break;
      }
    }

    // Check for possible merges
    for (let row = 0; row < this.size; row++) {
      for (let col = 0; col < this.size; col++) {
        const current = this.board[row][col];

        // Check horizontal merge
        if (col < this.size - 1 && current === this.board[row][col + 1]) {
          canMove = true;
          break;
        }

        // Check vertical merge
        if (row < this.size - 1 && current === this.board[row + 1][col]) {
          canMove = true;
          break;
        }
      }

      if (canMove) {
        break;
      }
    }

    if (!hasEmptyTile && !canMove) {
      this.status = 'lose';
      this.updateMessage();
    }
  }

  updateMessage() {
    const messageLose = document.querySelector('.message-lose');
    const messageWin = document.querySelector('.message-win');
    const messageStart = document.querySelector('.message-start');

    if (messageLose && messageWin && messageStart) {
      messageLose.classList.add('hidden');
      messageWin.classList.add('hidden');
      messageStart.classList.add('hidden');

      switch (this.status) {
        case 'idle':
          messageStart.classList.remove('hidden');
          break;

        case 'playing':
          break;

        case 'win':
          messageWin.classList.remove('hidden');
          break;

        case 'lose':
          messageLose.classList.remove('hidden');
          break;
      }
    }
  }
}

module.exports = Game;
