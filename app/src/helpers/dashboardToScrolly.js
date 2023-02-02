function buildStickyRight(current, next) {
  const c = current;
  const n = next;

  if (n.text && n.text.includes('<--IMG-->')) {
    n.image = n.text.replaceAll('<--IMG-->', '');
  } else if (n.text && n.text.includes('<--SCRUB-->')) {
    n.scrub = n.text.replaceAll('<--SCRUB-->', '');
  } else if (n.text && n.text.includes('<--VID-->')) {
    n.video = n.text.replaceAll('<--VID-->', '');
  }

  return [c, n];
}

function buildStickyLeft(current, next) {
  const c = current;
  const n = next;

  if (c.text && c.text.includes('<--IMG-->')) {
    c.image = c.text.replaceAll('<--IMG-->', '');
  } else if (c.text && c.text.includes('<--SCRUB-->')) {
    c.scrub = c.text.replaceAll('<--SCRUB-->', '');
  } else if (c.text && c.text.includes('<--VID-->')) {
    c.video = c.text.replaceAll('<--VID-->', '');
  }

  return [c, n];
}

function buildVideoScrub(current) {
  const c = current;

  if (c.text && c.text.includes('<--SCRUB-->')) {
    c.scrub = c.text.replaceAll('<--SCRUB-->', '');
  }

  return [c];
}

function buildVideoPlayer(current) {
  const c = current;

  if (c.text && c.text.includes('<--VID-->')) {
    c.video = c.text.replaceAll('<--VID-->', '');
  }

  return [c];
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
      if (current.text.includes('<--SCRUB-->')) {
        data.push(buildVideoScrub(current));
      } else if (current.text.includes('<--VID-->')) {
        data.push(buildVideoPlayer(current));
      } else {
        data.push([current]);
      }

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
