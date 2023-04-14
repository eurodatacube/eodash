function translateMedia(item) {
  const i = item;
  if (i.text && i.text.includes('<--IMG-->')) {
    i.image = i.text.replaceAll('<--IMG-->', '');
  } else if (i.text && i.text.includes('<--COMPARE-->')) {
    i.compare = [
      i.text.replaceAll('<--COMPARE-->', '').split('|')[0],
      i.text.replaceAll('<--COMPARE-->', '').split('|')[1],
    ];
  } else if (i.text && i.text.includes('<--SCRUB-->')) {
    i.scrub = i.text.replaceAll('<--SCRUB-->', '');
  } else if (i.text && i.text.includes('<--VID-->')) {
    i.video = i.text.replaceAll('<--VID-->', '');
  } else if (i.text && i.text.includes('<--AUTOPLAY-->')) {
    i.video = i.text.replaceAll('<--AUTOPLAY-->', '');
    i.autoplay = true;
  } else if (i.mapInfo) {
    if (i.id.includes('@')) {
      const [id] = i.id.split('@');
      i.mapInfo.poi = id;
    }
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
      if (next.mapInfo && features[i + 3] && features[i + 3].mapInfo) {
        translateMedia(next);
        console.log(next);
        var text = current.text;
        var timeline = [{
          center: next.mapInfo.center,
          zoom: next.mapInfo.zoom,
          duration: 0.0,
          layers: ['EOxCloudless 2021'],
        }];
        const mapInfo = next.mapInfo;
        i += 2;

        while (i < features.length && features[i].width === 1 && features[i + 1] && features[i + 1].mapInfo) {
          let c = features[i];
          let n = features[i + 1];

          const item = translateMedia(c);

          text += `\n\n${c.text}`;
          timeline.push({
            center: n.mapInfo.center,
            zoom: n.mapInfo.zoom,
            duration: 0.25,
          });
          i += 2;
        }

        var block = {
          width: 4,
          text,
          mapInfo: {
            poi: next.mapInfo.poi,
            baseLayer: 'EOxCloudless 2021',
            timeline,
          },
        };

        data.push([block]);
      } else {
        data.push(buildStickyRight(current, next, i));
      }
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
