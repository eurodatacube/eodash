import { Feature } from 'ol';
import { Polygon } from 'ol/geom';
import { Image, Vector as VectorLayer } from 'ol/layer';
import { Vector as VectorSource } from 'ol/source';
import { Style, Fill, Stroke } from 'ol/style';
import HexGrid from 'ol-ext/render/HexGrid';
import HexMap from 'ol-games/source/HexMap';

const createHexMap = (map) => {
  const grid = new HexGrid({ size: 4000, origin: map.getView().getCenter() });
  const hex = new HexMap({ hexGrid: grid });
  map.addLayer(new Image({ source: hex }));

  let board = new HexSweeperBoard();

  const text = false;
  hex.set('text', text);
  // grid.setLayout($('#layout').val());
  grid.setLayout('flat');
  // grid.setSize($('#size').val());
  grid.setSize('6000');

  const vector = new VectorLayer({
    source: new VectorSource(),
    style: new Style({ fill: new Fill({ color: 'red' }) }),
  });
  map.addLayer(vector);

  // Styles
  const greenStyle = new Style({
    fill: new Fill({ color: 'rgba(0,255,0,0.2)' }),
    stroke: new Stroke({ color: 'green', width: 1.25 }),
  });
  const blueStyle = new Style({
    fill: new Fill({ color: 'rgba(0,0,255,0.2)' }),
    stroke: new Stroke({ color: 'blue', width: 1.25 }),
  });
  const redStyle = new Style({
    fill: new Fill({ color: 'rgba(255,0,0,0.2)' }),
    stroke: new Stroke({ color: 'red', width: 1.25 }),
  });

  // Pointer move
  let current = [];
  let start = false;
  map.on(['pointermove', 'click'], (e) => {	// Coords
    const h = grid.coord2hex(e.coordinate);
    if (e.type != 'click' && h[0] == current[0] && h[1] == current[1]) return;
    current = h;

    // Move
    if (!text) {
      vector.getSource().clear();
      var c = grid.hex2cube(grid.coord2hex(e.coordinate));
      if (e.type == 'click') start = c;
      if (start) {
        const l = grid.cube_line(start, c);
        for (let i = 0; i < l.length; i++) {
          var ex = grid.getHexagon(grid.cube2hex(l[i]));
          var f = new Feature(new Polygon([ex]));
          f.setStyle(redStyle);
          vector.getSource().addFeature(f);
        }
        // popup.show(e.coordinate, `Move = ${l.length - 1} hexagon${l.length > 2 ? 's' : ''}`);
      }
      return;
    }

    // popup.hide();

    vector.getSource().clear();
    var ex = grid.getHexagon(h);
    var f = new Feature(new Polygon([ex]));
    vector.getSource().addFeature(f);

    let size = map.getSize();
    size = Math.round(Math.max(size[0], size[1]) / grid.getSize() * map.getView().getResolution() / Math.sqrt(3));
    switch (text) {
      case 'cube':
        var c = grid.hex2cube(h);
        // popup.show(e.coordinate, `x: ${c[0]}, y: ${c[1]}, z: ${c[2]}`);
        for (var x = -size; x <= size; x++) {
          if (x) {
            ex = grid.getHexagon(grid.cube2hex([c[0] + x, c[1] - x, c[2]]));
            f = new Feature(new Polygon([ex]));
            f.setStyle(greenStyle);
            vector.getSource().addFeature(f);
            ex = grid.getHexagon(grid.cube2hex([c[0] + x, c[1], c[2] - x]));
            f = new Feature(new Polygon([ex]));
            f.setStyle(blueStyle);
            vector.getSource().addFeature(f);
            ex = grid.getHexagon(grid.cube2hex([c[0], c[1] + x, c[2] - x]));
            f = new Feature(new Polygon([ex]));
            f.setStyle(redStyle);
            vector.getSource().addFeature(f);
          }
        }
        break;
      case 'axial':
        // popup.show(e.coordinate, `x: ${h[0]}, y: ${h[1]}`);
        for (var x = -size; x <= size; x++) {
          if (x) {
            ex = grid.getHexagon([h[0] + x, h[1]]);
            f = new Feature(new Polygon([ex]));
            f.setStyle(greenStyle);
            vector.getSource().addFeature(f);
            ex = grid.getHexagon([h[0], h[1] + x]);
            f = new Feature(new Polygon([ex]));
            f.setStyle(blueStyle);
            vector.getSource().addFeature(f);
          }
        }
        break;
      case 'offset':
        var o = grid.hex2offset(h);
        // popup.show(e.coordinate, `x: ${o[0]}, y: ${o[1]}`);
        for (var x = -size; x <= size; x++) {
          if (x) {
            ex = grid.getHexagon(grid.offset2hex([o[0] + x, o[1]]));
            f = new Feature(new Polygon([ex]));
            f.setStyle(greenStyle);
            vector.getSource().addFeature(f);
            ex = grid.getHexagon(grid.offset2hex([o[0], o[1] + x]));
            f = new Feature(new Polygon([ex]));
            f.setStyle(blueStyle);
            vector.getSource().addFeature(f);
          }
        }
        break;
      default: break;
    }
  });

  // // Handle menu
  // $('label').click(function () { $(this).prev().click(); });
  // $('input[name=action]').on('change', () => {
  //   const v = $('input[name=action]:checked').val();
  //   vector.getSource().clear();
  //   popup.hide();
  //   start = false;
  //   switch (v) {
  //     case 'axial':
  //     case 'offset':
  //     case 'cube':
  //       text = v;
  //       hex.showCoordiantes(v);
  //       break;
  //     default:
  //       text = false;
  //       hex.showCoordiantes(false);
  //       break;
  //   }
  // });
};

class HexSweeperBoard {
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
