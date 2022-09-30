import getMapInstance from './map';

class MapCursor {
  /**
   * Map Cursor component to avoid more components overriding
   * their demands for cursor
   * @param {*} map ol map
   */
  constructor(map) {
    this.map = map;
    this.cursorRegistry = {};
  }

  setCursor() {
    // find the pointer with most reservations and set it
    const pointerCounts = Object.keys(this.cursorRegistry).reduce(
      (prev, curr) => {
        const pointer = this.cursorRegistry[curr];
        if (pointer) {
          // eslint-disable-next-line no-param-reassign
          prev[pointer] = (prev[pointer] || 0) + 1;
        }
        return prev;
      },
      {},
    );
    const max = Math.max(...Object.values(pointerCounts));
    if (max !== -Infinity) {
      const maxOccuredPointer = Object.keys(pointerCounts)
        .filter((key) => pointerCounts[key] === max);
      this.map.getTargetElement().style.cursor = maxOccuredPointer;
    } else {
      this.map.getTargetElement().style.cursor = '';
    }
  }

  reserveCursor(objectId, type) {
    // track occurence
    this.cursorRegistry[objectId] = type;
    this.setCursor();
  }
}

/**
 * similar to the map, all instances of the MapCursor class
 * are stored here.
 */
const mapCursorRegistry = {};

/**
 * Returns the cursor with the given id.
 * Will instantiate a new cursor if not already existing.
 * @param {string} id id of cursor
 * @param {Object} options options
 * @param {Array} options.mapId optional constraining extent
 * @returns {Map} ol map
 */
export default function getMapCursor(id, options = {}) {
  const cursor = mapCursorRegistry[id];
  if (!cursor) {
    const { map } = getMapInstance(options.mapId);
    mapCursorRegistry[id] = new MapCursor(map);
  }
  return mapCursorRegistry[id];
}
