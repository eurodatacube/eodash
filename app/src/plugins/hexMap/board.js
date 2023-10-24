import { fromUrl } from 'geotiff';

/**
 * Represents the game board and its possible states and calculations.
 */
export default class HexSweeperGame {
    /**
     * Create a new game board.
     *
     * @param {number} width - The width of the game board (in hex cells).
     * @param {number} height - The height of the game board (in hex cells).
     * @param {number} difficulty - The probability of a mine being in a cell.
     */
    constructor(width, height, difficulty) {
      this.width = width;
      this.height = height;
      this.difficulty = difficulty;
      this.board = [];
      this.initializeBoard();
    }
  
    async initializeBoardFromGeoTIFF(url) {
      try {
        const tiff = await fromUrl(url);
        const image = await tiff.getImage();
        const data = await image.readRasters({
            width: this.width,
            height: this.height,
            resampleMethod: 'bilinear'
        });
  
        // Assuming the data is a single band and the size matches the game board
        for (let y = 0; y < this.height; y++) {
          for (let x = 0; x < this.width; x++) {
            const value = data[0][y * this.width + x];
            const isMine = value > 500; // Adjust based on your data
            this.board[y][x].isMine = isMine;
            this.board[y][x].adjacentMines = this.calculateAdjacentMines(x, y);
          }
        }
      } catch (error) {
        console.error('Error loading GeoTIFF data:', error);
      }
    }
  
    initializeBoard() {
      for (let y = 0; y < this.height; y++) {
        const row = [];
        for (let x = 0; x < this.width; x++) {
          row.push({
            isMine: Math.random() < this.difficulty,
            adjacentMines: 0,
            revealed: false,
            flagged: false,
            element: null,
          });
        }
        this.board.push(row);
      }
  
      for (let y = 0; y < this.height; y++) {
        for (let x = 0; x < this.width; x++) {
          this.board[y][x].adjacentMines = this.calculateAdjacentMines(x, y);
        }
      }
    }
  
    /**
     * Calculate the number of adjacent mines to a given cell.
     *
     * @param {number} x - The x-coordinate of the cell.
     * @param {number} y - The y-coordinate of the cell.
     *
     * @returns {number} - The number of mines adjacent to the cell.
     */
    calculateAdjacentMines(x, y) {
      let count = 0;
  
      // This structure is used to account for the staggered nature of the board
      const neighbors = y % 2 === 0
        ? [[-1, -1], [0, -1], [-1, 0], [1, 0], [-1, 1], [0, 1]]
        : [[0, -1], [1, -1], [-1, 0], [1, 0], [0, 1], [1, 1]];
  
      // Accumulate the number of mines in the adjacent cells
      neighbors.forEach(([dx, dy]) => {
        const nx = x + dx;
        const ny = y + dy;
  
        if (
          nx >= 0
            && nx < this.width
            && ny >= 0
            && ny < this.height
            && this.board[ny]
            && this.board[ny][nx].isMine
        ) {
          count++;
        }
      });
  
      return count;
    }
  
    isMine(x, y) {
      return this.board[y] && this.board[y][x] && this.board[y][x].isMine;
    }
  
    get(x, y) {
      if (!(this.board[y] && this.board[y][x])) {
        throw console.error(`Cartesian board tile [${x}, ${y}] does not exist!`);
      }
  
      return this.board[y][x];
    }
  
    revealTile(x, y) {
      const tile = this.board[y][x];
      if (tile.revealed || tile.flagged) return;
      tile.revealed = true;
      // return tile;
    }
  }