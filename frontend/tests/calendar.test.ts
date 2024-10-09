import { getPreviousMonthLastWeekToCurrent } from '../src/components/calendar/util';

describe('getPreviousMonthLastWeekToCurrent', () => {
  
    const testCases = [
      {
        description: 'October 2024 (month starting on Tuesday)',
        input: new Date(2024, 9, 1),
        expected: [new Date(2024, 8, 30)]
      },
      {
        description: 'September 2024 (month starting on Sunday)',
        input: new Date(2024, 8, 1),
        expected: [
          new Date(2024, 7, 26),
          new Date(2024, 7, 27),
          new Date(2024, 7, 28),
          new Date(2024, 7, 29),
          new Date(2024, 7, 30),
          new Date(2024, 7, 31)
        ]
      },
      {
        description: 'July 2024 (month starting on Monday)',
        input: new Date(2024, 6, 1),
        expected: []
      },
      {
        description: 'August 2024 (month starting on Thursday)',
        input: new Date(2024, 7, 1),
        expected: [
          new Date(2024, 6, 29),
          new Date(2024, 6, 30),
          new Date(2024, 6, 31)
        ]
      },
      {
        description: 'February 2024 (leap year, month starting on Thursday)',
        input: new Date(2024, 1, 1),
        expected: [
          new Date(2024, 0, 29),
          new Date(2024, 0, 30),
          new Date(2024, 0, 31)
        ]
      },
      {
        description: 'March 2024 (after leap year, month starting on Friday)',
        input: new Date(2024, 2, 1),
        expected: [
          new Date(2024, 1, 26),
          new Date(2024, 1, 27),
          new Date(2024, 1, 28),
          new Date(2024, 1, 29)
        ]
      }
    ];

    testCases.forEach(({ description, input, expected }) => {
      test(description, () => {
        const result = getPreviousMonthLastWeekToCurrent(input);
        expect(result).toEqual(expected);
      });
    });
  

  test('Returned dates are in chronological order', () => {
    const testDate = new Date(2024, 8, 1); // September 2024
    const result = getPreviousMonthLastWeekToCurrent(testDate);
    for (let i = 1; i < result.length; i++) {
      expect(result[i].getTime()).toBeGreaterThan(result[i-1].getTime());
    }
  });

  test('Returned dates are all from the previous month', () => {
    const testDate = new Date(2024, 8, 1); // September 2024
    const result = getPreviousMonthLastWeekToCurrent(testDate);
    result.forEach(date => {
      expect(date.getMonth()).toBe(testDate.getMonth() - 1);
    });
  });

  test('Function handles year rollover correctly', () => {
    const testDate = new Date(2025, 0, 1); // January 2025
    const result = getPreviousMonthLastWeekToCurrent(testDate);
    result.forEach(date => {
      expect(date.getFullYear()).toBe(2024);
      expect(date.getMonth()).toBe(11); // December is 11 in JavaScript
    });
  });
});