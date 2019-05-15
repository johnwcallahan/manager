export const convertMegabytesTo = (data: number) => {
  // API v4 always returns nodebalancer transfer in MB, so we want to clean it up if it's too
  // big or too small
  const gb = 1073741824;
  const mb = 1048576;
  const kb = 1024;
  const totalToBytes = data * 1024 * 1024; // convert the MB to Bytes
  if (totalToBytes >= gb) {
    // convert bytes to GB
    return `${Math.max(Math.ceil(totalToBytes / gb)).toFixed(2)} GB`;
  }
  if (totalToBytes >= mb) {
    // convert bytes to MB
    return `${Math.max(Math.ceil((totalToBytes / mb) * 100) / 100).toFixed(
      2
    )} MB`;
  }
  if (totalToBytes >= kb) {
    // convert bytes to KB
    return `${Math.max(Math.ceil((totalToBytes / kb) * 100) / 100).toFixed(
      2
    )} KB`;
  }
  return `${totalToBytes} bytes`;
};

// Returns a human-readable version of the byte value passed in.
// Example: readableBytes(2097152) --> { value: 2, unit: 'MB', formatted: '2 MB }
// Value and unit are returned separately for flexibility of use.
interface ReadableBytesOptions {
  round?: number | Partial<Record<StorageSymbol, number>>;
  unit?: StorageSymbol;
}

type StorageSymbol = 'bytes' | 'KB' | 'MB' | 'GB' | 'TB';

const units: Record<StorageSymbol, number> = {
  bytes: 1,
  KB: 1024,
  MB: 1024 * 1024,
  GB: 1024 * 1024 * 1024,
  TB: 1024 * 1024 * 1024 * 1024
};

export const readableBytes = (num: number, options?: ReadableBytesOptions) => {
  if (num === 0) {
    return { value: 0, unit: 'bytes', formatted: '0 bytes' };
  }

  const symbol = findAppropriateUnit(num, options);

  const result = num / units[symbol];

  const roundedResult = roundResult(result, symbol, options);

  return {
    value: roundedResult,
    unit: symbol,
    formatted: roundedResult + ' ' + symbol
  };
};

const findAppropriateUnit = (value: number, options?: ReadableBytesOptions) => {
  if (options && options.unit) {
    return options.unit;
  } else if (value < units.KB) {
    return 'bytes';
  } else if (value < units.MB) {
    return 'KB';
  } else if (value < units.GB) {
    return 'MB';
  } else {
    return 'GB';
  }
};

export const roundResult = (
  result: number,
  symbol: StorageSymbol,
  options?: ReadableBytesOptions
) => {
  if (shouldRoundTo1DecimalPlace(result, symbol, options)) {
    // Round to 1 decimal place
    return Math.round(result * 10) / 10;
  } else if (shouldRoundTo2DecimalPlaces(result, symbol, options)) {
    // Round to 2 decimal places
    return Math.round(result * 100) / 100;
  } else {
    // Round to nearest whole number
    return Math.floor(result);
  }
};

export const shouldRoundTo1DecimalPlace = (
  result: number,
  symbol: StorageSymbol,
  options?: ReadableBytesOptions
) => {
  const shouldRoundOptions =
    options &&
    (options.round === 1 || (options.round && options.round[symbol] === 1));

  return (result >= 10 && result < 100) || shouldRoundOptions;
};

export const shouldRoundTo2DecimalPlaces = (
  result: number,
  symbol: StorageSymbol,
  options?: ReadableBytesOptions
) => {
  const shouldRoundOptions =
    options &&
    (options.round === 1 || (options.round && options.round[symbol] === 2));

  return (result > 0 && result < 10) || shouldRoundOptions;
};
