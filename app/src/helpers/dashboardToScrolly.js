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
  let data = [];
  var i = 0;
  
  while (i < features.length) {
    let current = features[i];
    let next = features[i + 1];

    if (current.width === 4) {
      if (current.text.includes('<--SCRUB-->')) {
        data.push(buildVideoScrub(current));
      } else if (current.text.includes('<--VID-->')) {
        data.push(buildVideoPlayer(current));
      } else {
        data.push([current]);
      }

      i += 1;
      continue;
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

function buildStickyRight(current, next) {
  if (next.text && next.text.includes('<--IMG-->')) {
    next.image = next.text.replaceAll('<--IMG-->', '');
  } else if (next.text && next.text.includes('<--SCRUB-->')) {
    next.scrub = next.text.replaceAll('<--SCRUB-->', '');
  } else if (next.text && next.text.includes('<--VID-->')) {
    next.video = next.text.replaceAll('<--VID-->', '');
  }

  return [current, next];
}

function buildStickyLeft(current, next) {
  if (current.text && current.text.includes('<--IMG-->')) {
    current.image = current.text.replaceAll('<--IMG-->', '');
  } else if (current.text && current.text.includes('<--SCRUB-->')) {
    current.scrub = current.text.replaceAll('<--SCRUB-->', '');
  } else if (current.text && current.text.includes('<--VID-->')) {
    current.video = current.text.replaceAll('<--VID-->', '');
  }

  return [current, next];
}

function buildVideoScrub(current) {
  if (current.text && current.text.includes('<--SCRUB-->')) {
    current.scrub = current.text.replaceAll('<--SCRUB-->', '');
  }

  return [current];
}

function buildVideoPlayer (current) {
  if (current.text && current.text.includes('<--VID-->')) {
    current.video = current.text.replaceAll('<--VID-->', '');
  }

  return [current];
}