import { Vector as VectorLayer } from 'ol/layer';
import { Vector as VectorSource } from 'ol/source';

import HexSweeperGame from './board';
import {
  setupGrid,
  drawGameBoard,
  updateTileVisuals,
  updateAllTileVisuals,
  handleMapClick,
  handleMapRightClick,
} from './index';

export default class Minesweeper {
  constructor(map, options) {
    this.vectorSource = new VectorSource();
    this.vectorLayer = new VectorLayer({
      source: this.vectorSource,
      name: 'Minesweep game board',
    });
    this.map = map;
    this.options = options;
    this.game = new HexSweeperGame(options);

    map.addLayer(this.vectorLayer);
    this.setupGame();
    this.clickEventHandlers = [];
    this.contextmenuEventHandlers = [];
  }

  async setupGame() {
    await this.game.fromGeoTIFF(this.options);
    const gridLayers = setupGrid(this.game);
    this.grid = gridLayers.grid;

    this.drawGameBoard();
    this.addEventListeners();

    this.updateAllTiles(
      this.game,
      this.grid,
      this.vectorSource,
      this.vectorLayer,
    );
  }

  get mineCount() {
    return this.game.board
      // Flatten the 2D array of tiles
      .reduce((acc, row) => [...acc, ...row], [])
      // Count all the mines in our board
      .reduce((count, tile) => tile.isMine ? count + 1 : count, 0);
  }

  get flagCount() {
    return this.game.board
      .reduce((acc, row) => [...acc, ...row], [])
      .reduce((count, tile) => tile.isFlagged ? count + 1 : count, 0);
  }

  get coveredMineCount() {
    // If the returned value is zero, i.e. there are no more covered mines, the user has won the game.
    return this.game.board
      .reduce((acc, row) => [...acc, ...row], [])
      .reduce((count, tile) => tile.isMine && (!tile.isRevealed && !tile.isFlagged) ? count + 1 : count, 0);
  }

  get isGameCompleted() {
    return this.coveredMineCount === 0;
  }

  revealAllTiles() {
    this.game.revealAllTiles();
    this.updateAllTiles();
    document.dispatchEvent(new Event('minesweeper:win'));
  }

  setupGrid() {
    return setupGrid(
      this.game,
    );
  }

  drawGameBoard() {
    return drawGameBoard(
      this.game,
      this.grid,
      this.vectorSource,
    );
  }

  addEventListeners() {
    const handleMapClickHandler = ((e) => handleMapClick(
      e,
      this.game,
      this.grid,
      this.vectorSource,
      // Pass in our callback to work with our state
      this.updateTile.bind(this),
      // eslint-disable-next-line no-extra-bind
    )).bind(this);
    this.clickEventHandlers.push(handleMapClickHandler);

    const handleMapRightClickHandler = ((e) => handleMapRightClick(
      e,
      this.game,
      this.grid,
      this.vectorSource,
      this.vectorLayer,
      // eslint-disable-next-line no-extra-bind
    )).bind(this);
    this.contextmenuEventHandlers.push(handleMapRightClickHandler);

    this.map.on('click', handleMapClickHandler);
    this.map.on('contextmenu', handleMapRightClickHandler);
  }

  removeEventListeners() {
    this.clickEventHandlers.forEach((h) => {
      this.map.un('click', h);
    });
    this.contextmenuEventHandlers.forEach((h) => {
      this.map.un('contextmenu', h);
    });
  }

  updateTile(x, y) {
    return updateTileVisuals(
      x,
      y,
      this.grid,
      this.vectorSource,
      this.vectorLayer,
      this.game,
    );
  }

  updateAllTiles() {
    return updateAllTileVisuals(
      this.game,
      this.grid,
      this.vectorSource,
      this.vectorLayer,
    );
  }
}
