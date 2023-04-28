function translateMedia(item) {
  const i = item;
  if (i.text && i.text.includes('<--IMG-->')) {
    i.image = i.text.replaceAll('<--IMG-->', '');
    i.text = undefined;
    i.type = 'image';
  } else if (i.text && i.text.includes('<--COMPARE-->')) {
    i.compare = [
      i.text.replaceAll('<--COMPARE-->', '').split('|')[0],
      i.text.replaceAll('<--COMPARE-->', '').split('|')[1],
    ];
    i.type = 'compare';
  } else if (i.text && i.text.includes('<--SCRUB-->')) {
    i.scrub = i.text.replaceAll('<--SCRUB-->', '');
    i.type = 'scrub';
  } else if (i.text && i.text.includes('<--VID-->')) {
    i.video = i.text.replaceAll('<--VID-->', '');
    i.type = 'video';
  } else if (i.text && i.text.includes('<--AUTOPLAY-->')) {
    i.video = i.text.replaceAll('<--AUTOPLAY-->', '');
    i.autoplay = true;
    i.type = 'autoplay';
  } else if (i.mapInfo) {
    if (i.id.includes('@')) {
      const [id] = i.id.split('@');
      i.mapInfo.poi = id;
    }
    i.type = 'map';
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
        let { text } = current;
        const timeline = [{
          center: next.mapInfo.center,
          zoom: next.mapInfo.zoom,
          poi: next.mapInfo.poi,
          layers: ['EOxCloudless 2021'],
        }];

        i += 2;

        while (i < features.length
          && features[i].width === 1
          && features[i + 1]
          && features[i + 1].mapInfo
          || i < features.length
          && features[i] && features[i + 1]
          && (features[i].width === 2 && features[i + 1].width === 2)     
        ) {
          const c = features[i];
          const n = features[i + 1];

          translateMedia(c);
          translateMedia(n);

          if (c.width === 2 && n.width === 2) {
            if (c.type) {
              text += `\n\n${n.text}`;
              // Media is left
              c.textSide = 'left';
              timeline.push(c);
            } else {
              text += `\n\n${c.text}`;
              // Media is left
              n.textSide = 'right';
              timeline.push(n);
            }
          } else {
            text += `\n\n${c.text}`;
            timeline.push({
              center: n.mapInfo.center,
              zoom: n.mapInfo.zoom,
              poi: n.mapInfo.poi || '',
            });
          }

          i += 2;
        }

        timeline.map(e => e.duration = 1.0 / timeline.length);

        const block = {
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
