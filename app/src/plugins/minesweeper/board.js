import { fromUrl } from 'geotiff';
import proj4 from 'proj4';

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
    this.image = null;
    this.center = [];
  }


  async fromGeoTIFF(url) {
    try {
      const tiff = await fromUrl(url);
      const image = await tiff.getImage();

      this.image = image;

      console.log(`Image origin: ${image.getOrigin()}`);
      console.log(`Image res: ${image.getResolution()}`);
      console.log(`Image bbox: ${image.getBoundingBox()}`);

      this.center = proj4("EPSG:4326", "EPSG:3857", image.getOrigin());
      
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
            isRevealed: false,
            isFlagged: false,
            element: null,
          });
        }

        this.board.push(row);
      }

      for (let y = 0; y < this.height; y++) {
        for (let x = 0; x < this.width; x++) {
          const adjacentMines = this.calculateAdjacentMines(x, y);
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
          isRevealed: false,
          isFlagged: false,
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
      console.warn(`Coordinates [${x}, ${y}] are out of bounds`);
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
      ? EVEN_NEIGHBOR_OFFSETS
      : ODD_NEIGHBOR_OFFSETS;

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
      }
    }
    return count;
  }

  isNextToMine(x, y) {
    const neighbors = this.getNeighborCoordinates(x, y);
    return neighbors.some(([nx, ny]) => this.isValidCoordinate(nx, ny)
                                          && this.board[ny][nx].isMine);
  }

  revealTile(x, y) {
    // Accumulate a list of revealed tile coordinates to update the rendering efficiently.
    let coordinatePairs = [[x, y]];

    const tile = this.get(x, y);
    if (tile.isRevealed || tile.isFlagged) return [];
    tile.isRevealed = true;

    // Check if the tile is a non-mine with adjacent mines, then stop recursion.
    if (tile.adjacentMines > 0 && !tile.isMine) {
      return coordinatePairs;
    }

    const neighbors = this.getNeighborCoordinates(x, y);
    neighbors.forEach(([nx, ny]) => {
      if (this.isValidCoordinate(nx, ny) && !this.board[ny][nx].isRevealed) {
        // Recursively reveal only if the neighbor is not a mine and has zero adjacent mines.
        if (!this.board[ny][nx].isMine && this.board[ny][nx].adjacentMines === 0) {
          coordinatePairs = coordinatePairs.concat(this.revealTile(nx, ny));
        } else if (!this.board[ny][nx].isMine) {
          // If the neighbor is not a mine but has adjacent mines, reveal it but do not recurse further.
          this.board[ny][nx].isRevealed = true;
          coordinatePairs.push([nx, ny]);
        }
      }
    });

    return coordinatePairs;
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
    this.enforceBounds(x, y);
    return this.board[y][x];
  }
}
