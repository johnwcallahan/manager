import {
  formatBitsPerSecond,
  formatBytes,
  formatMagnitude,
  formatNumber,
  formatPercentage,
  getMetrics,
  getTotalTraffic
} from './statMetrics';

const data = [
  [0, 0.12],
  [0, 0.04],
  [0, 2.98],
  [0, 0],
  [0, 0.7],
  [0, 1.2],
  [0, 0],
  [0, 0],
];

describe('Stat Metrics', () => {
  const metrics = getMetrics(data);

  it('returns max', () => {
    expect(metrics.max).toBe(2.98);
    const newData = [...data, [0, 100]];
    expect(getMetrics(newData).max).toBe(100.00);
    expect(getMetrics([[0, 0], [0, 0]]).max).toBe(0);
  });

  it('returns average', () => {
    expect(metrics.average).toBe(1.008);
    expect(getMetrics([[0, 0]]).average).toBe(0);
    expect(getMetrics([[0, 0], [0, 0]]).average).toBe(0);
    expect(getMetrics([[0, 0], [0, 1]]).average).toBe(1);
    expect(getMetrics([[0, 0], [0, 100], [0, 100]]).average).toBe(100);
  });

  it('returns last', () => {
    expect(metrics.last).toBe(1.2);
    let newData = [...data, [0, 0]];
    expect(getMetrics(newData).last).toBe(1.2);
    newData = [...data, [0, 50]];
    expect(getMetrics(newData).last).toBe(50);
  });

  it('includes 0 in calculations when passed second arg', () => {
    const metricsWithZero = getMetrics(data, true);
    expect(metricsWithZero.max).toBe(2.98);
    expect(metricsWithZero.average).toBe(0.63);
    expect(metricsWithZero.last).toBe(0);

  });
});

describe('total traffic', () => {
  it('returns total traffic given the average', () => {
    const totalTraffic = getTotalTraffic(1, 2, 2);
    expect(totalTraffic.inTraffic).toBe(5400);
    expect(totalTraffic.outTraffic).toBe(10800);
    expect(totalTraffic.combinedTraffic).toBe(16200);
    expect(totalTraffic.combinedTraffic).toEqual(totalTraffic.inTraffic + totalTraffic.outTraffic);
  });
});

describe('format magnitude', () => {
  it('doesn\'t add magnitude when 1 < X < 999', () => {
    expect(formatMagnitude('612.12', 'b/s')).toBe('612.12 b/s');
    expect(formatMagnitude(1, 'b/s')).toBe('1.00 b/s');
    expect(formatMagnitude(99, 'b/s')).toBe('99.00 b/s');
    expect(formatMagnitude(99.09, 'b/s')).toBe('99.09 b/s');
  });

  it('milli', () => {
    expect(formatMagnitude('0.021', 'b/s')).toBe('21.00 mb/s');
    expect(formatMagnitude('0.001', 'b/s')).toBe('1.00 mb/s');
    expect(formatMagnitude('0.999', 'b/s')).toBe('999.00 mb/s');
  });

  it('kilo', () => {
    expect(formatMagnitude('6211.21', 'b/s')).toBe('6.21 kb/s');
    expect(formatMagnitude('1000', 'b/s')).toBe('1.00 kb/s');
    expect(formatMagnitude('555555', 'b/s')).toBe('555.55 kb/s');
  });

  it('mega', () => {
    expect(formatMagnitude('62232111.21', 'b/s')).toBe('62.23 Mb/s');
    expect(formatMagnitude('1000000', 'b/s')).toBe('1.00 Mb/s');
  });

  it('giga', () => {
    expect(formatMagnitude('62331232111.21', 'b/s')).toBe('62.33 Gb/s');
    expect(formatMagnitude('1000000000', 'b/s')).toBe('1.00 Gb/s');
  });
});

describe('format number', () => {
  it('always returns two decimal places', () => {
    expect(formatNumber(24)).toBe('24.00');
    expect(formatNumber(0)).toBe('0.00');
    expect(formatNumber(110)).toBe('110.00');
    expect(formatNumber(92.078)).toBe('92.08');
    expect(formatNumber(10000.07)).toBe('10000.07');
    expect(formatNumber(99.99)).toBe('99.99');
    expect(formatNumber(99.999)).toBe('100.00');
    expect(formatNumber(99.7)).toBe('99.70');
  });
});

describe('formatting', () => {
  it('formatPercent adds percent sign', () => {
    expect(formatPercentage(12)).toBe('12.00%');
    expect(formatPercentage(0)).toBe('0.00%');
    expect(formatPercentage(123456789)).toBe('123456789.00%');
  });
  it('formatBitsPerSecond adds unit', () => {
    expect(formatBitsPerSecond(12)).toBe('12.00 b/s');
    expect(formatBitsPerSecond(0)).toBe('0.00 b/s');
    expect(formatBitsPerSecond(123456789)).toBe('123.46 Mb/s');
  });
  it('formatBytes adds unit', () => {
    expect(formatBytes(12)).toBe('12.00 B');
    expect(formatBytes(0)).toBe('0.00 B');
    expect(formatBytes(123456789)).toBe('123.46 MB');
  });
});