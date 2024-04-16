import { Feature } from 'ol';
import { Polygon } from 'ol/geom';
import {
  Text, Style, Fill, Stroke,
} from 'ol/style';
import HexGrid from 'ol-ext/render/HexGrid';

// eslint-disable-next-line
import HexSweeperGame from './board';

/**
 * Generate a pseudorandom 128-bit hash from a string to use as a seed.
 *
 * @param {String} str - The seed string.
 * @returns {Array} Four 32-bit numbers used as starting values for the `splitmix32` PRNG.
 */
function cyrb128(str) {
  let h1 = 1779033703, h2 = 3144134277,
      h3 = 1013904242, h4 = 2773480762;
  for (let i = 0, k; i < str.length; i++) {
      k = str.charCodeAt(i);
      h1 = h2 ^ Math.imul(h1 ^ k, 597399067);
      h2 = h3 ^ Math.imul(h2 ^ k, 2869860233);
      h3 = h4 ^ Math.imul(h3 ^ k, 951274213);
      h4 = h1 ^ Math.imul(h4 ^ k, 2716044179);
  }
  h1 = Math.imul(h3 ^ (h1 >>> 18), 597399067);
  h2 = Math.imul(h4 ^ (h2 >>> 22), 2869860233);
  h3 = Math.imul(h1 ^ (h3 >>> 17), 951274213);
  h4 = Math.imul(h2 ^ (h4 >>> 19), 2716044179);
  h1 ^= (h2 ^ h3 ^ h4), h2 ^= h1, h3 ^= h1, h4 ^= h1;

  return [h1 >>> 0, h2 >>> 0, h3 >>> 0, h4 >>> 0];
}

/**
 * Implementation of the fast and simple `splitmix32` PRNG algorithm.
 *
 * @param {Number} a - Initial seed value.
 * @returns {Number} The generated random number.
 */
function splitmix32(a) {
  return function() {
    a |= 0;
    a = a + 0x9e3779b9 | 0;
    let t = a ^ a >>> 16;
    t = Math.imul(t, 0x21f0aaad);
    t = t ^ t >>> 15;
    t = Math.imul(t, 0x735a2d97);
    return ((t = t ^ t >>> 15) >>> 0) / 4294967296;
   }
 }

/**
 * Get a seedable random bbox within world bounds.
 *
 * @param {Object} worldBounds - The bounding box in which the random bbox should be generated.
 * @param {Object} horizontalExtent - How wide the generated bbox should be.
 * @param {Object} seedString - Optional parameter to make the random generation deterministic and repeatable.
 * @returns {Array} The generated bbox as a [long, lat, long, lat] array.
 */
function getRandomBoundingBox(worldBounds, horizontalExtent, seedString) {
  var rng;

  if (seedString === undefined) {
    rng = Math.random;
  } else {
    // Generate a 128-bit hash from the seed string
    const hash = cyrb128(seedString);
    // Use one of the hash values to seed the PRNG
    rng = splitmix32(hash[0]);
  }

  // Calculate vertical extent
  const verticalExtent = horizontalExtent / 1.18;

  // World bounds in the format [minLongitude, minLatitude, maxLongitude, maxLatitude]
  const [minWorldLon, minWorldLat, maxWorldLon, maxWorldLat] = worldBounds;

  // Calculate the maximum latitude and longitude for the origin point to ensure the bounding box fits within the worldBounds
  const maxOriginLat = maxWorldLat - verticalExtent;
  const maxOriginLon = maxWorldLon - horizontalExtent;

  // Ensure the origin point is selected such that the bounding box will fit within the worldBounds
  const originLatRange = maxOriginLat - minWorldLat;
  const originLonRange = maxOriginLon - minWorldLon;

  // Randomly select origin point
  const originLat = minWorldLat + rng() * originLatRange;
  const originLon = minWorldLon + rng() * originLonRange;

  // Calculate the bottom-right corner of the bounding box
  const bottomRightLat = originLat + verticalExtent;
  const bottomRightLon = originLon + horizontalExtent;

  // Return the new bounding box.
  return [originLon, originLat, bottomRightLon, bottomRightLat];
}

/**
 * Set up the game grid using HexGrid.
 *
 * @param {Object} game - The game object.
 * @returns {Object} The created `HexGrid`.
 */
const setupGrid = (game) => {
  const grid = new HexGrid({
    size: game.gameSize,
    origin: game.center,
  });
  return {
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
  document.dispatchEvent(new Event('minesweeper:continue'));
};

/**
* Draw the game board by creating hexagon features and adding them to the map.
*
* @param {HexSweeperGame} game - The game instance.
* @param {Object} grid - The hex grid.
* @param {Object} map - The OpenLayers map instance.
*/
const drawGameBoard = (game, grid, vectorSource) => {
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
