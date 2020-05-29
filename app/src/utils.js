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
  return `${moment.utc(tempDate[0]).format('YYYY-MM-DDTHH:mm:ss')}`;
}
