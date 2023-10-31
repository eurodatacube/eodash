import { Feature } from 'ol';
import { Polygon } from 'ol/geom';
import { Image, Vector as VectorLayer } from 'ol/layer';
import { Vector as VectorSource } from 'ol/source';
import {
  Text, Style, Fill, Stroke,
} from 'ol/style';
import HexGrid from 'ol-ext/render/HexGrid';
import HexMap from 'ol-games/source/HexMap';

import HexSweeperGame from './board';

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

const updateTileVisuals = (x, y, grid, vectorSource, game) => {
  const [q, r] = game.convertGameCoordsToAxial(x, y);
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

  let style;
  if (tile.revealed) {
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
          text: tile.adjacentMines ? tile.adjacentMines.toString() : '',
          font: '20px Calibri,sans-serif',
          fill: new Fill({ color: '#000' }),
          stroke: new Stroke({ color: '#fff', width: 3 }),
        }),
      });
    }
  } else if (tile.flagged) {
    style = new Style({
      fill: new Fill({ color: 'blue' }),
      text: new Text({
        text: '⚑',
        font: '20px Calibri,sans-serif',
        fill: new Fill({ color: '#fff' }),
        stroke: new Stroke({ color: '#000', width: 3 }),
      }),
    });
  } else {
    style = new Style({
      fill: new Fill({ color: 'transparent' }), // Unrevealed tile color
      text: new Text({
        text: '',
        font: '20px Calibri,sans-serif',
      }),
    });
  }

  feature.setStyle(style);
  vectorSource.addFeature(feature);
};

const updateAllTileVisuals = (game, grid, vectorSource) => {
  for (let y = 0; y < game.height; y++) {
    for (let x = 0; x < game.width; x++) {
      updateTileVisuals(x, y, grid, vectorSource, game);
    }
  }
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
  // Get the axial coordinates of the clicked hexagon
  const [q, r] = grid.coord2hex(coordinate);
  const gameCoords = game.convertAxialToGameCoords(q, r);

  game.revealTile(gameCoords.x, gameCoords.y);
  updateTileVisuals(gameCoords.x, gameCoords.y, grid, vectorSource, game);
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
            text: tile.adjacentMines ? tile.adjacentMines.toString() : '0',
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
* Initializes and sets up the hex map game.
*
* @param {Object} map - The OpenLayers map instance.
*/
export const createHexMap = async (map) => {
  const grid = setupGrid(map);
  const vectorSource = new VectorSource();
  const game = new HexSweeperGame(40, 40, 0.2);

  // game.initializeBoard();
  await game.fromGeoTIFF('https://eox-gtif-public.s3.eu-central-1.amazonaws.com/ideas_data/Copernicus_DSM_30_N47_00_E014_00_DEM_COG.tif');
  map.on('click', (e) => handleMapClick(e, game, grid, vectorSource));
  drawGameBoard(map, game, grid, vectorSource);
  updateAllTileVisuals(game, grid, vectorSource);
};

export default {
  createHexMap,
};
