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
    this.game = new HexSweeperGame(options, 0.2);

    map.addLayer(this.vectorLayer);
    this.setupGame();
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

  get isGameCompleted() {
    // If this value remains zero, i.e. there are no more covered mines, the user has won the game.
    let coveredMineCount = 0;

    for (let y = 0; y < this.game.height; y++) {
      for (let x = 0; x < this.game.width; x++) {
        const tile = this.game.board[y][x];
        if (tile.isMine && (!tile.isRevealed && !tile.isFlagged)) {
          coveredMineCount++;
        }
      }
    }

    return coveredMineCount === 0;
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
      this.vectorLayer,
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
