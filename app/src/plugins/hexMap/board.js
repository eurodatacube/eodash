import { fromUrl } from 'geotiff';

const EVEN_NEIGHBOR_OFFSETS = [[-1, -1], [0, -1], [-1, 0], [1, 0], [-1, 1], [0, 1]];
const ODD_NEIGHBOR_OFFSETS = [[0, -1], [1, -1], [-1, 0], [1, 0], [0, 1], [1, 1]];

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
  }

  async fromGeoTIFF(url) {
    try {
      const tiff = await fromUrl(url);
      const image = await tiff.getImage();
      const data = (await image.readRasters({
        width: this.width,
        height: this.height,
        resampleMethod: 'bilinear',
      }))[0];

      // Assuming the data is a single band and the size matches the game board
      for (let y = 0; y < this.height; y++) {
        const row = [];
        for (let x = 0; x < this.width; x++) {
          const value = data[y * this.width + x];

          row.push({
            isMine: value > 1500,
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
          const adjacentMines = this.calculateAdjacentMines(x, y);
          console.log(`Cell at (${x}, ${y}) has ${adjacentMines} adjacent mines`);
          this.board[y][x].adjacentMines = adjacentMines;
        }
      }

      console.log(this.board);
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

  enforceBounds(x, y) {
    if (this.isOutOfBounds(x, y)) {
      throw new Error('Coordinates are out of bounds');
    }
  }

  getNeighborCoordinates(x, y) {
    const offsets = (y % 2 === 0)
      ? EVEN_NEIGHBOR_OFFSETS
      : ODD_NEIGHBOR_OFFSETS;
    return offsets.map(([dx, dy]) => [x + dx, y + dy]);
  }

  /**
   * Convert axial coordinates to game board coordinates.
   *
   * @param {number} q - The axial column coordinate.
   * @param {number} r - The axial row coordinate.
   * @returns {{ x: number, y: number }} Game board coordinates.
   */
  convertAxialToGameCoords(q, r) {
    const x = q + Math.floor(r / 2);
    const y = r;
    return { x, y };
  }

  /**
   * Convert game board coordinates to axial coordinates.
   *
   * @param {number} x - The game board x coordinate.
   * @param {number} y - The game board y coordinate.
   * @returns {[number, number]} Axial coordinates [q, r].
   */
  convertGameCoordsToAxial(x, y) {
    this.enforceBounds(x, y);
    const q = x - Math.floor(y / 2);
    const r = y;
    return [q, r];
  }

  /**
   * Gets the count of adjacent mines for a given tile on the game board.
   *
   * @param {number} x - The game board x coordinate.
   * @param {number} y - The game board y coordinate.
   * @returns {number} The count of adjacent mines.
   */
  getAdjacentMineCount(x, y) {
    this.enforceBounds(x, y);
    const tile = this.get(x, y);
    console.log(`Coordinates: (${x}, ${y}), Tile: ${JSON.stringify(tile)}, Adjacent Mines: ${tile.adjacentMines}`);
    return tile.adjacentMines;
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

    const neighbors = y % 2 === 0
      ? [[-1, -1], [0, -1], [-1, 0], [1, 0], [-1, 1], [0, 1]]
      : [[0, -1], [1, -1], [-1, 0], [1, 0], [0, 1], [1, 1]];

    for (const [dx, dy] of neighbors) {
      const nx = x + dx;
      const ny = y + dy;

      if (nx >= 0
          && nx < this.width
          && ny >= 0
          && ny < this.height
          && this.board[ny]
          && this.board[ny][nx].isMine
      ) {
        count++;
        // console.log(`Mine detected at ${nx}, ${ny} when checking neighbors of ${x}, ${y}`);
      }
    }
    console.log(count);
    return count;
  }

  /*
  calculateAdjacentMines(x, y) {
    if (this.isMine(x, y)) return 0;

    console.log(neighbors);

    const neighbors = this.getNeighborCoordinates(x, y);
    return neighbors.reduce((count, [nx, ny]) => {
        if (this.isValidCoordinate(nx, ny) && this.board[ny][nx].isMine) {  // Note the corrected order of arguments
            count++;
        }
        console.log(count);
        return count;
    }, 0);

  }
*/
  revealArea(x, y) {
    const tile = this.revealTile(x, y);
    if (!tile || tile.adjacentMines > 0) return;
    const neighbors = this.getNeighborCoordinates(x, y);
    neighbors.forEach(([nx, ny]) => {
      if (this.isValidCoordinate(nx, ny) && !this.board[nx][ny].revealed) {
        this.revealArea(nx, ny);
      }
    });
  }

  revealTile(x, y) {
    const tile = this.get(x, y);
    if (tile.revealed || tile.flagged) return null;
    tile.revealed = true;
    return tile;
  }

  isValidCoordinate(x, y) {
    return !!(this.board[y] && this.board[y][x]);
  }

  isOutOfBounds(x, y) {
    return !this.isValidCoordinate(x, y);
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
