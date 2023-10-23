import { Feature } from 'ol';
import { Polygon } from 'ol/geom';
import { Image, Vector as VectorLayer } from 'ol/layer';
import { Vector as VectorSource } from 'ol/source';
import GeoTIFF from 'ol/source/GeoTIFF';
import { get as getProjection } from 'ol/proj';
import {
  Text, Style, Fill, Stroke,
} from 'ol/style';
import HexGrid from 'ol-ext/render/HexGrid';
import HexMap from 'ol-games/source/HexMap';
import { fromUrl } from 'geotiff';

/**
 * Convert axial coordinates to staggered Cartesian coordinates.
 *
 * @param {number} q - The axial column coordinate.
 * @param {number} r - The axial row coordinate.
 * @param {number} hexSize - Radial size of the hexagon.
 *
 * @returns {[number, number]} An array containing the Cartesian x and y coordinates.
 */
function axialToStaggeredCartesian(q, r, hexSize) {
  const x = hexSize * Math.sqrt(3) * (q + 0.5 * (r & 1)); // eslint-disable-line no-bitwise
  const y = hexSize * 1.5 * r;
  return [x, y];
}

/**
 * Set up the game grid using HexGrid and HexMap.
 *
 * @param {Object} map - The OpenLayers map instance.
 * @returns {Object} The created `HexGrid`.
 */
const setupGrid = (map) => {
  const size = 4000;
  const boardCenter = [1800595.69763, 6140325.34559]; // Vienna

  const grid = new HexGrid({
    size,
    origin: boardCenter,
  });

  const hex = new HexMap({ hexGrid: grid });
  map.addLayer(new Image({ source: hex }));

  return grid;
};

/**
* Handle a map click event.
*
* @param {Event} e - The click event.
* @param {Object} map - The OpenLayers map instance.
* @param {HexSweeperGame} game - The game instance.
* @param {Object} grid - The hex grid.
*/
const handleMapClick = (e, game, grid, vectorSource) => {
  const { coordinate } = e;

  // Get the axial coordinates of the clicked hexagon and convert to Cartesian
  let [q, r] = grid.coord2hex(coordinate);

  let xOffset = ((r % 2 !== 0) * 1) - r / 2;

  // Convert the hexagonal coordinate to the polygon vertices
  const hexagonVertices = grid.getHexagon([q, r]);

  // Create a new feature using the vertices
  const feature = new Feature(new Polygon([hexagonVertices]));

  let style;

  console.log(`Clicked on hexagon [${q}, ${r}]`);

  if (game.isMine(q + xOffset, r)) {
    // If it's a mine
    style = new Style({
      fill: new Fill({ color: 'red' }),
      text: new Text({
        text: '💣',
        fill: new Fill({ color: 'black' }),
        font: '20px sans-serif',
      }),
    });
  } else {
    // If it's not a mine, show the number of adjacent mines
    const mineCount = game.get(q + xOffset, r).adjacentMines;
    style = new Style({
      fill: new Fill({ color: 'rgba(0,0,255,0.2)' }),
      text: new Text({
        text: mineCount.toString() ?? 'x',
        fill: new Fill({ color: 'white' }),
        font: '20px sans-serif',
      }),
      stroke: new Stroke({ color: 'blue', width: 1.25 }),
    });
  }

  // Set the style to the feature
  feature.setStyle(style);

  // Clear any existing features from the vector source
  vectorSource.clear();

  // Add the new feature to the vector source
  vectorSource.addFeature(feature);
};

/**
 * Add a click event handler to the map.
 *
 * @param {Object} map - The OpenLayers map instance.
 * @param {HexSweeperGame} game - The game instance.
 * @param {Object} grid - The hex grid.
 * @param {Object} vectorSource - The vector source used for adding features to the map.
 */
const setupClickHandler = (map, game, grid, vectorSource) => {
  map.on('click', (e) => handleMapClick(e, game, grid, vectorSource));
};

/**
* Draw the game board by creating hexagon features and adding them to the map.
*
* @param {HexSweeperGame} game - The game instance.
* @param {Object} grid - The hex grid.
* @param {Object} map - The OpenLayers map instance.
*/
const drawGameBoard = (map, game, grid, vectorSource) => {
  for (let y = 0; y < game.height; y++) {
    // Make our edges straight again so the cell calculation works out
    let xOffset = ((y % 2 !== 0) * 1) - y / 2;
    if (y % 2 === 0) {
      xOffset += 1.0;
    } else {
      xOffset += 0.5;
    }

    for (let x = 0; x < game.width; x++) {
      const tile = game.board[y][x];
      const hexCoords = grid.getHexagon([x + xOffset, y]);
      const feature = new Feature(new Polygon([hexCoords]));

      let style;
      if (tile.isMine) {
        style = new Style({
          fill: new Fill({ color: 'red' }),
          text: new Text({
            text: '💣',
            font: '20px Calibri,sans-serif',
            fill: new Fill({ color: '#fff' }),
            stroke: new Stroke({ color: '#000', width: 3 }),
          }),
        });
      } else {
        style = new Style({
          fill: new Fill({ color: '#00f' }),
          text: new Text({
            text: tile.adjacentMines.toString(),
            font: '20px Calibri,sans-serif',
            fill: new Fill({ color: '#000' }),
            stroke: new Stroke({ color: '#fff', width: 3 }),
          }),
        });
      }
      feature.setStyle(style);
      vectorSource.addFeature(feature);
    }
  }

  const vectorLayer = new VectorLayer({
    source: vectorSource,
  });

  map.addLayer(vectorLayer);
};

/**
 * Represents the game board and its possible states and calculations.
 */
class HexSweeperGame {
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
      const data = await image.readRasters();

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

/**
* Initializes and sets up the hex map game.
*
* @param {Object} map - The OpenLayers map instance.
*/
export const createHexMap = async (map) => {
  const grid = setupGrid(map);
  const vectorSource = new VectorSource();
  const game = new HexSweeperGame(20, 10, 0.2);

  // game.initializeBoard();
  await game.initializeBoardFromGeoTIFF('https://eox-gtif-public.s3.eu-central-1.amazonaws.com/ideas_data/Copernicus_DSM_30_N47_00_E014_00_DEM_COG.tif');
  setupClickHandler(map, game, grid, vectorSource);
  drawGameBoard(map, game, grid, vectorSource);
};

export default {
  createHexMap,
};
