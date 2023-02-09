function translateMedia(item) {
  const i = item;

  if (i.text && i.text.includes('<--IMG-->')) {
    i.image = i.text.replaceAll('<--IMG-->', '');
  } else if (i.text && i.text.includes('<--SCRUB-->')) {
    i.scrub = i.text.replaceAll('<--SCRUB-->', '');
  } else if (i.text && i.text.includes('<--VID-->')) {
    i.video = i.text.replaceAll('<--VID-->', '');
  } else if (i.text && i.text.includes('<--AUTOPLAY-->')) {
    i.video = i.text.replaceAll('<--AUTOPLAY-->', '');
    i.autoplay = true;
  } else if (i.mapInfo) {
    let id = '';

    if (i.id.includes('@')) {
      [id] = i.id.split('@');
    }
    i.iframe = `${window.location.origin}/iframe?poi=${
      id
    }&z=${
      i.mapInfo.zoom
    }&lat=${
      i.mapInfo.center.lat
    }&lng=${
      i.mapInfo.center.lng
    }&embedMap=true`;
  }
}

function buildStickyRight(current, next) {
  const c = current;
  const n = next;

  translateMedia(n);

  return [c, n];
}

function buildStickyLeft(current, next) {
  const c = current;
  const n = next;

  translateMedia(c);

  return [c, n];
}

/**
 * Convert a given RACE dashboard to the scrollytelling format used by [`microscrolly`](https://github.com/spectrachrome/microscrolly).
 *
 * @param {object} features - The features of this dashboard which are about to be converted.
 *
 * @example
 *
 *     let scrollyStory = dashboardToScrolly(res.data);
 */
export default function dashboardToScrolly(features) {
  const data = [];
  let i = 0;

  while (i < features.length) {
    const current = features[i];
    const next = features[i + 1];

    if (current.width === 4) {
      translateMedia(current);
      data.push([current]);
      i += 1;
    } else if (current.width === 1 && next) {
      data.push(buildStickyRight(current, next, i));
      i += 2;
    } else if (current.width === 3 && next) {
      data.push(buildStickyLeft(current, next, i));
      i += 2;
    } else {
      i += 1;
    }
  }

  return data;
}
