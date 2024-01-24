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
     */
  constructor(options) {
    this.size = options.size;
    this.locations = options.locations;
    this.selectedLocationIndex = options.selectedLocationIndex;
    this.board = [];
    this.center = [];
    this.gameSize = null;
    this.fieldCount = 0;
    this.mineCount = 0;
  }

  getUncoveredAreaPercent() {
    let uncoveredCount = 0;

    for (let j = 0; j < this.height; j++) {
      for (let i = 0; i < this.width; i++) {
        const tile = this.board[j][i];
        if (tile.isRevealed) {
          uncoveredCount++;
        }
      }
    }

    return uncoveredCount / this.fieldCount;
  }

  revealAllTiles() {
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        const tile = this.board[y][x];
        if (!tile.isMine) {
          tile.isRevealed = true;
        } else {
          tile.isFlagged = true;
        }
      }
    }
  }

  async fromGeoTIFF(options) {
    try {
      const tiff = await fromUrl(options.geotiff.url);
      const image = await tiff.getImage();
      // get currently zoomed to location index
      const location = this.locations[this.selectedLocationIndex];
      const { bbox } = location;
      // Convert geographic coordinates to distances using EPSG:3857
      const xmin = proj4(options.geotiff.projection, 'EPSG:3857', [bbox[0], bbox[1]]);
      const xmax = proj4(options.geotiff.projection, 'EPSG:3857', [bbox[2], bbox[3]]);

      const xDistance = xmax[0] - xmin[0];
      const yDistance = xmax[1] - xmin[1];

      // compute the width of a single hex (gameSize), divided by 2 but multiply by ~1.155 to
      // account for the below mentioned hexagon wider than taller
      this.gameSize = Math.round(xDistance / this.size / 1.75);

      // Adjust board dimensions based on actual distances
      this.width = this.size;
      this.height = Math.round(
        (yDistance / xDistance)
        * this.size
        // Account for the fact that hexagons are wider than tall
        * 1.18,
      );
      // Read the GeoTIFF data into a 1-dimensional array
      const [oX, oY] = image.getOrigin();
      const [imageResX, imageResY] = image.getResolution(image);

      let wnd = [
        Math.round((bbox[0] - oX) / imageResX),
        Math.round((bbox[1] - oY) / imageResY),
        Math.round((bbox[2] - oX) / imageResX),
        Math.round((bbox[3] - oY) / imageResY),
      ];
      wnd = [
        Math.min(wnd[0], wnd[2]),
        Math.min(wnd[1], wnd[3]),
        Math.max(wnd[0], wnd[2]),
        Math.max(wnd[1], wnd[3]),
      ];

      let data = (await image.readRasters({
        window: wnd,
        width: this.width,
        height: this.height,
      }))[0];

      // Flip the GeoTIFF upside down
      data = data.reverse();

      const flippedData = new Array(data.length);
      // Flip rows in our 1-dimensional array as if it were 2D
      for (let y = 0; y < this.height; y++) {
        for (let x = 0; x < this.width; x++) {
          const newData = data[y * this.width + (this.width - 1 - x)];
          flippedData[y * this.width + x] = newData;
        }
      }

      data = flippedData;
      const centerInLonLat = [bbox[0], bbox[1]];
      const center = proj4(options.geotiff.projection, 'EPSG:3857', centerInLonLat);
      // not actually center but left bottom corner of start of board but subtract ~1.5 hex
      this.center = [center[0] - 1.0 * this.gameSize, center[1] + 0.5 * this.gameSize];

      // Assuming the data is a single band and the size matches the game board
      for (let y = 0; y < this.height; y++) {
        const row = [];
        for (let x = 0; x < this.width; x++) {
          const value = data[y * this.width + x];
          let isMine;
          if (location.isMineCondition) {
            isMine = !Number.isNaN(value) && location.isMineCondition(value);
          } else {
            isMine = Math.round(Math.random());
          }
          row.push({
            isMine,
            adjacentMines: 0,
            isRevealed: false,
            isFlagged: false,
            element: null,
          });
        }

        this.board.push(row);
      }

      this.fieldCount = this.width * this.height;

      for (let y = 0; y < this.height; y++) {
        for (let x = 0; x < this.width; x++) {
          const cell = this.board[y][x];
          if (cell.isMine) {
            this.mineCount++;
          }
        }
      }

      for (let y = 0; y < this.height; y++) {
        for (let x = 0; x < this.width; x++) {
          const adjacentMines = this.calculateAdjacentMines(x, y);
          this.board[y][x].adjacentMines = adjacentMines;
        }
      }
    } catch (error) {
      console.error('Error loading GeoTIFF data:', error);
    }
  }

  /* eslint-disable class-methods-use-this */
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
    const q = x - Math.floor(y / 2);
    const r = y;
    return [q, r];
  }
  /* eslint-enable class-methods-use-this */

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

    // eslint-disable-next-line no-restricted-syntax
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

  revealTile(x, y) {
    // Accumulate a list of revealed tile coordinates to update the rendering efficiently.
    let coordinatePairs = [[x, y]];

    const tile = this.get(x, y);
    if (!tile) {
      return null;
    }
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
          // If the neighbor is not a mine but has adjacent mines,
          // reveal it but do not recurse further.
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
    if (!this.isOutOfBounds(x, y)) {
      return this.board[y][x];
    }
    return null;
  }
}
