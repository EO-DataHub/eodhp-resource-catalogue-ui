import { formatDate } from '@/utils/date';

const TESTING_DATE = '2024-10-14';

describe('Format date utils method', () => {
  it('should return date in ISO8601 format when passed a valid Date object', () => {
    const date = new Date(2024, 9, 14); // October 14, 2024
    const result = formatDate(date);
    console.log(result);
    expect(result).toBe(TESTING_DATE);
  });

  it('should return date in ISO8601 format when passed a valid date string', () => {
    const result = formatDate(TESTING_DATE);
    expect(result).toBe(TESTING_DATE);
  });

  it('should throw an error when an invalid date string is provided', () => {
    const invalidDate = 'invalid-date';
    expect(() => formatDate(invalidDate)).toThrow();
  });
});
