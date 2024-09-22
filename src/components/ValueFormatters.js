export const numberToPercents = (value) => {
  if (value == null) {
    return null;
  }
  return `${(value * 100).toFixed(1)}%`;
};

export const numberToPlusPercents = (value) => {
  if (value == null) {
    return null;
  }
  return `+${(value * 100).toFixed(1)}%`;
};

export const numberToSeconds = (value) => {
  if (value == null) {
    return null;
  }
  return `${value} s.`;
};

export const numberToMeters = (value) => {
  if (value == null) {
    return null;
  }
  return `${value} m.`;
};

export const numberToMPs = (value) => {
  if (value == null) {
    return null;
  }
  return `${value} MP`;
};
