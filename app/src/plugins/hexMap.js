import { Feature } from 'ol';
import { Polygon } from 'ol/geom';
import { Image, Vector as VectorLayer } from 'ol/layer';
import { Vector as VectorSource } from 'ol/source';
import { Style, Fill, Stroke } from 'ol/style';
import HexGrid from 'ol-ext/render/HexGrid';
import HexMap from 'ol-games/source/HexMap';

const createHexMap = (map) => {
  const size = 4000;
  const boardCenter = [16.363449, 48.210033];  // Vienna

  const grid = new HexGrid({
    size,
    origin: map.getView().getCenter(),
  });
  const hex = new HexMap({ hexGrid: grid });
  map.addLayer(new Image({ source: hex }));

  // Initialize our HexSweeper game
  let game = new HexSweeperGame(20, 10, 0.2);
  game.initializeBoard();

  const vectorSource = new VectorSource();

  map.on('click', (e) => {
    const clickedFeatures = map.getFeaturesAtPixel(e.pixel);

    if (clickedFeatures.length) {
      const clickedHexagonCoords = clickedFeatures[0].getGeometry().getCoordinates()[0][0];  // Obtain the first coordinate from the polygon definition.
      const hx = clickedHexagonCoords[0];
      const hy = clickedHexagonCoords[1];

      // Now, find this hexagon in the hx and hy arrays:
      const clickedHexIndex = hx.findIndex((coord, index) => {
        return coord[0] === clickedHexagonCoords[0] && hy[index][1] === clickedHexagonCoords[1];
      });

      if (clickedHexIndex !== -1) {
        // Convert hex index to board position (x, y)
        const boardY = Math.floor(clickedHexIndex / game.width);
        const boardX = clickedHexIndex % game.width;

        if (boardY >= 0 && boardY < game.height && boardX >= 0 && boardX < game.width) {
          const tile = game.board[boardY][boardX];

          console.log(`Clicked at: (${boardX}, ${boardY})`);

          if (tile.isMine) {
            clickedFeatures[0].setStyle(redStyle);
          } else {
            const textStyle = new Text({
              text: tile.adjacentMines.toString(),
              font: '20px Calibri,sans-serif',
              fill: new Fill({ color: '#000' }),
              stroke: new Stroke({ color: '#fff', width: 3 })
            });

            clickedFeatures[0].setStyle(new Style({
              fill: new Fill({ color: '#eee' }),
              text: textStyle
            }));
          }
        } else {
          console.error(`Clicked outside the board boundaries. Board indices: (${boardX}, ${boardY}), Actual coordinates: (${clickedHexagonCoords[0]}, ${clickedHexagonCoords[1]})`);
        }
      } else {
        console.error('Hexagon not found');
      }
    }
  });



  // Create OpenLayers features for each hexagon
  for (let y = 0; y < game.height; y++) {
      for (let x = 0; x < game.width; x++) {
          const tile = game.board[y][x];
          const hexCoords = grid.getHexagon([x, y]);
          console.log(`Hex coords for board (${x}, ${y}):`, hexCoords);
          const feature = new Feature(new Polygon([hexCoords]));

          // Assign style based on the tile state
          let style;
          if (tile.isMine) {
              style = new Style({
                  fill: new Fill({ color: 'red' }),
                  text: new Text({
                      text: '💣',
                      font: '20px Calibri,sans-serif',
                      fill: new Fill({ color: '#fff' }),
                      stroke: new Stroke({ color: '#000', width: 3 })
                  })
              });
          } else {
            style = new Style({
              fill: new Fill({ color: '#00f' }), // This will make the hexagons blue
              text: tile.adjacentMines > 0 ? new Text({
                  text: tile.adjacentMines.toString(),
                  font: '20px Calibri,sans-serif',
                  fill: new Fill({ color: '#000' }),
                  stroke: new Stroke({ color: '#fff', width: 3 })
              }) : null
            });
          }
          feature.setStyle(style);
          vectorSource.addFeature(feature);
      }
  }

  // Create a vector layer to contain the hexagons
  const vector = new VectorLayer({
    source: new VectorSource(),
    style: function (feature) {
      const style = feature.getStyle();
      if (style.getText() && typeof style.getText().getText === 'function') {
          return style;
      } else {
          // This is a failsafe. It clones the style and removes the text component if it's not valid.
          const newStyle = style.clone();
          newStyle.setText(null);
          return newStyle;
      }
    }
  });


  map.addLayer(vector);
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

    for (let [dx, dy] of neighbors) {
      let nx = x + dx;
      let ny = y + dy;

      if (
        nx >= 0 &&
        nx < this.width &&
        ny >= 0 &&
        ny < this.height &&
        this.board[ny] &&
        this.board[ny][nx].isMine
      ) {
        count++;
      }
    }

    return count;
  }

  revealTile(x, y) {
    const tile = this.board[y][x];
    if (tile.revealed || tile.flagged) return;
    tile.revealed = true;
    return tile;
  }
}

export {
  createHexMap,
};
