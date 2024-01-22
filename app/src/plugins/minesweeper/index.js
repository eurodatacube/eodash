import { Feature } from 'ol';
import { Polygon } from 'ol/geom';
import {
  Text, Style, Fill, Stroke,
} from 'ol/style';
import HexGrid from 'ol-ext/render/HexGrid';
import HexMap from 'ol-games/source/HexMap';

// eslint-disable-next-line
import HexSweeperGame from './board';

/**
 * Set up the game grid using HexGrid and HexMap.
 *
 * @param {Object} game - The game object.
 * @returns {Object} The created `HexGrid`.
 */
const setupGrid = (game) => {
  const grid = new HexGrid({
    size: game.gameSize,
    origin: game.center,
  });

  const hex = new HexMap({ hexGrid: grid });

  return {
    uids: [hex.ol_uid],
    grid,
  };
};

const getTileStyle = (tile) => {
  let style;
  if (tile.isRevealed === true) {
    if (tile.isMine) {
      style = new Style({
        stroke: new Stroke({ color: '#000', width: 1 }),
        fill: new Fill({ color: 'red' }),
        text: new Text({
          text: '💣',
          font: '16px Calibri,sans-serif',
          fill: new Fill({ color: '#fff' }),
          stroke: new Stroke({ color: '#000', width: 3 }),
        }),
      });
    } else {
      style = new Style({
        stroke: new Stroke({ color: '#000', width: 1 }),
        fill: new Fill({ color: '#fff0' }),
        text: new Text({
          text: tile.adjacentMines ? tile.adjacentMines.toString() : '0',
          font: '16px Calibri,sans-serif',
          fill: new Fill({ color: '#000' }),
          stroke: new Stroke({ color: '#fff', width: 3 }),
        }),
      });
    }
  } else if (tile.isFlagged) {
    style = new Style({
      stroke: new Stroke({ color: '#000', width: 1 }),
      fill: new Fill({ color: 'blue' }),
      text: new Text({
        text: '⚑',
        font: '16px Calibri,sans-serif',
        fill: new Fill({ color: '#fff' }),
        stroke: new Stroke({ color: '#000', width: 3 }),
      }),
    });
  } else {
    style = new Style({
      stroke: new Stroke({ color: '#000', width: 0.5 }),
      fill: new Fill({ color: '#aaa' }), // Unrevealed tile color
      text: new Text({
        text: '',
        font: '16px Calibri,sans-serif',
      }),
    });
  }

  return style;
};

const updateTileVisuals = (
  x,
  y,
  grid,
  vectorSource,
  vectorLayer,
  game,
) => {
  const [q, r] = game.convertGameCoordsToAxial(x + 1, y);
  const hexagonVertices = grid.getHexagon([q, r]);
  const feature = new Feature(new Polygon([hexagonVertices]));
  const tile = game.get(x, y);

  // Assign a unique identifier to the feature
  const featureId = `tile-${x}-${y}`;
  feature.setId(featureId);

  // Remove the existing feature if it already exists
  const existingFeature = vectorSource.getFeatureById(featureId);
  if (existingFeature) {
    vectorSource.removeFeature(existingFeature);
  }
  // Apply tile styling for mines, count, unexplored and flagged tiles.
  feature.setStyle(getTileStyle(tile));
  vectorSource.addFeature(feature);

  // Force redraw
  vectorLayer.changed();
};

const updateAllTileVisuals = (game, grid, vectorSource, vectorLayer) => {
  // Clear the existing features
  vectorSource.clear();

  for (let y = 0; y < game.height; y++) {
    for (let x = 0; x < game.width; x++) {
      updateTileVisuals(
        x,
        y,
        grid,
        vectorSource,
        vectorLayer,
        game,
      );
    }
  }

  // Force redraw
  vectorLayer.changed();
};

/**
* Handle a map click event.
*
* @param {Event} e - The click event.
* @param {Object} map - The OpenLayers map instance.
* @param {HexSweeperGame} game - The game instance.
* @param {Object} grid - The hex grid.
*/
const handleMapClick = (
  e,
  game,
  grid,
  vectorSource,
  updateTileVisualsCallback,
) => {
  e.stopPropagation();
  e.preventDefault();

  let hasUncoveredMine = false;

  const { coordinate } = e;
  // Get the axial coordinates of the clicked hexagon
  const [q, r] = grid.coord2hex(coordinate);
  const gameCoords = game.convertAxialToGameCoords(q, r);
  const [x, y] = [gameCoords.x - 1, gameCoords.y];

  const revealedCoordsList = game.revealTile(x, y);
  if (!revealedCoordsList) {
    return;
  }

  // eslint-disable-next-line no-restricted-syntax
  for (const [xx, yy] of revealedCoordsList) {
    hasUncoveredMine = hasUncoveredMine || game.get(xx, yy).isMine;
    updateTileVisualsCallback(xx, yy, grid, vectorSource, game);
  }

  if (hasUncoveredMine) {
    document.dispatchEvent(new Event('minesweeper:gameover'));
  } else {
    document.dispatchEvent(new Event('minesweeper:continue'));
  }
};

const handleMapRightClick = (e, game, grid, vectorSource, vectorLayer) => {
  e.stopPropagation();
  e.preventDefault();

  const { coordinate } = e;
  // Get the axial coordinates of the clicked hexagon
  const [q, r] = grid.coord2hex(coordinate);
  const gameCoords = game.convertAxialToGameCoords(q, r);
  const [x, y] = [gameCoords.x - 1, gameCoords.y];

  const tile = game.get(x, y);
  tile.isFlagged = !tile.isFlagged; // Toggle flag
  updateTileVisuals(x, y, grid, vectorSource, vectorLayer, game);
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

      const style = getTileStyle(tile);
      feature.setStyle(style);
      vectorSource.addFeature(feature);
    }
  }
};

export {
  setupGrid,
  updateTileVisuals,
  updateAllTileVisuals,
  handleMapClick,
  handleMapRightClick,
  getTileStyle,
  drawGameBoard,
};
