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
    this.vectorLayer = new VectorLayer({ source: this.vectorSource });
    this.map = map;
    this.options = options;
    this.game = new HexSweeperGame(options, 0.2);

    map.addLayer(this.vectorLayer);
    this.setupGame();
  }

  async setupGame() {
    await this.game.fromGeoTIFF(this.options);
    const gridLayers = setupGrid(this.map, this.options, this.game);
    this.grid = gridLayers.grid;
    this.uids = gridLayers.uids;

    this.drawGameBoard();
    this.addEventListeners();

    this.updateAllTiles(
      this.game,
      this.grid,
      this.vectorSource,
      this.vectorLayer
    );
  }

  setupGrid() {
    return setupGrid(
      this.map,
      this.options,
      this.game,
    );
  }

  drawGameBoard() {
    return drawGameBoard(
      this.map,
      this.game,
      this.grid,
      this.vectorSource,
    );
  }

  addEventListeners() {
    this.map.on('click', (e) => handleMapClick(
      e,
      this.game,
      this.grid,
      this.vectorSource,
      // Pass in our callback to work with our state
      this.updateTile.bind(this),
    ));

    this.map.on('contextmenu', (e) => handleMapRightClick(
      e,
      this.game,
      this.grid,
      this.vectorSource,
    ));
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