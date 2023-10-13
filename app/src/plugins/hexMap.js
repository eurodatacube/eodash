import { Feature } from 'ol';
import { Polygon } from 'ol/geom';
import { Image, Vector as VectorLayer } from 'ol/layer';
import { Vector as VectorSource } from 'ol/source';
import { Style, Fill, Stroke } from 'ol/style';
import HexGrid from 'ol-ext/render/HexGrid';
import HexMap from 'ol-games/source/HexMap';

/**
 * Sets up the game grid using HexGrid and HexMap.
 *
 * @param {Object} map - The OpenLayers map instance.
 * @returns {Object} The created hex grid.
 */
const setupGrid = (map) => {
  const size = 4000;
  const boardCenter = [16.363449, 48.210033]; // Vienna

  const grid = new HexGrid({
    size,
    origin: boardCenter,
  });

  const hex = new HexMap({ hexGrid: grid });
  map.addLayer(new Image({ source: hex }));

  return grid;
};

/**
* Handles a map click event.
*
* @param {Event} e - The click event.
* @param {Object} map - The OpenLayers map instance.
* @param {HexSweeperGame} game - The game instance.
* @param {Object} grid - The hex grid.
*/
const handleMapClick = (e, map, game) => {
  const clickedFeatures = map.getFeaturesAtPixel(e.pixel);

  if (clickedFeatures.length) {
    const clickedHexagonCoords = clickedFeatures[0].getGeometry().getCoordinates()[0][0];
    const hx = clickedHexagonCoords[0];
    const hy = clickedHexagonCoords[1];

    const clickedHexIndex = hx
      .findIndex((coord, index) => coord[0] === clickedHexagonCoords[0]
        && hy[index][1] === clickedHexagonCoords[1]);

    if (clickedHexIndex !== -1) {
      const boardY = Math.floor(clickedHexIndex / game.width);
      const boardX = clickedHexIndex % game.width;
      const tile = game.board[boardY][boardX];

      if (tile.isMine) {
        clickedFeatures[0].setStyle(new Style({
          fill: new Fill({ color: 'red' }),
        }));
      } else {
        const textStyle = new Text({
          text: tile.adjacentMines.toString(),
          font: '20px Calibri,sans-serif',
          fill: new Fill({ color: '#000' }),
          stroke: new Stroke({ color: '#fff', width: 3 }),
        });

        clickedFeatures[0].setStyle(new Style({
          fill: new Fill({ color: '#eee' }),
          text: textStyle,
        }));
      }
    }
  }
};

/**
* Adds a click event handler to the map.
*
* @param {Object} map - The OpenLayers map instance.
* @param {HexSweeperGame} game - The game instance.
* @param {Object} grid - The hex grid.
*/
const setupClickHandler = (map, game, grid) => {
  map.on('click', (e) => handleMapClick(e, map, game, grid));
};

/**
* Draws the game board by creating hexagon features and adding them to the map.
*
* @param {HexSweeperGame} game - The game instance.
* @param {Object} grid - The hex grid.
* @param {Object} map - The OpenLayers map instance.
*/
const drawGameBoard = (game, grid, map) => {
  const vectorSource = new VectorSource();

  for (let y = 0; y < game.height; y++) {
    for (let x = 0; x < game.width; x++) {
      const tile = game.board[y][x];
      const hexCoords = grid.getHexagon([x, y]);
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
          text: tile.adjacentMines > 0 ? new Text({
            text: tile.adjacentMines.toString(),
            font: '20px Calibri,sans-serif',
            fill: new Fill({ color: '#000' }),
            stroke: new Stroke({ color: '#fff', width: 3 }),
          }) : null,
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

class HexSweeperGame {
  constructor(width, height, difficulty) {
    this.width = width;
    this.height = height;
    this.difficulty = difficulty;
    this.board = [];
    this.initializeBoard();
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

  calculateAdjacentMines(x, y) {
    let count = 0;

    const neighbors = y % 2 === 0
      ? [[-1, -1], [0, -1], [-1, 0], [1, 0], [-1, 1], [0, 1]]
      : [[0, -1], [1, -1], [-1, 0], [1, 0], [0, 1], [1, 1]];

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
export const createHexMap = (map) => {
  const grid = setupGrid(map);

  const game = new HexSweeperGame(20, 10, 0.2);
  game.initializeBoard();

  setupClickHandler(map, game, grid);
  drawGameBoard(game, grid, map);
};

export default {
  createHexMap,
};
