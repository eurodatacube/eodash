import moment from 'moment';

export function padLeft(str, pad, size) {
  let out = str;
  while (out.length < size) {
    out = pad + str;
  }
  return out;
}

export function shTimeFunction(date) {
  let tempDate = date;
  if (!Array.isArray(tempDate)) {
    tempDate = [tempDate];
  }
  const momentutc = moment.utc(tempDate[0]);
  const defaultFormat = 'YYYY-MM-DDTHH:mm:ss';
  const alternativeFormat = 'YYYY-MM-DD';
  if (momentutc.seconds() === 0 && momentutc.hours() === 0 && momentutc.minutes() === 0) {
    // if only day input, format as an interval to next day
    const momentutcNextDay = momentutc.add(1, 'days');
    return `${momentutc.format(alternativeFormat)}/${momentutcNextDay.format(alternativeFormat)}`;
  }
  // otherwise return single date with full format
  return `${momentutc.format(defaultFormat)}/${momentutc.format(defaultFormat)}`;
}
