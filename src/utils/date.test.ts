import { formatDate } from '@/utils/date';

describe('Formate date utils method', () => {
  it('should return date in ISO8601 format when passed a valid Date object', () => {
    const date = new Date(2024, 9, 14); // October 14, 2024
    const result = formatDate(date);
    expect(result).toBe('2024-10-14');
  });

  it('should return date in ISO8601 format when passed a valid date string', () => {
    const date = '2024-10-14';
    const result = formatDate(date);
    expect(result).toBe('2024-10-14');
  });

  it('should return current date in ISO8601 format when no date is provided', () => {
    const result = formatDate('');
    const expectedDate = new Date().toISOString().slice(0, 10); // Extracts YYYY-MM-DD from current date
    expect(result).toBe(expectedDate);
  });

  it('should throw an error when an unsupported formatType is provided', () => {
    const date = new Date();
    expect(() => formatDate(date, false, 'UNKNOWN')).toThrow(
      'Format type: UNKNOWN not implemented',
    );
  });

  it('should throw an error when an invalid date string is provided', () => {
    const invalidDate = 'invalid-date';
    expect(() => formatDate(invalidDate)).toThrow();
  });
});
