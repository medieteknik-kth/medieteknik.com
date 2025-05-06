import { sortByCreatedAt } from '../../utility/sortUtils'

describe('sortByCreatedAt', () => {
  interface TestCase {
    description: string
    input: { items: { created_at: string | Date }[]; descending: boolean }
    expected: { created_at: string | Date }[]
  }

  const testCases: TestCase[] = [
    {
      description: 'sorts items in descending order by created_at',
      input: {
        items: [
          { created_at: '2023-10-01T12:00:00Z' },
          { created_at: '2023-10-02T12:00:00Z' },
          { created_at: '2023-10-03T12:00:00Z' },
        ],
        descending: true,
      },
      expected: [
        { created_at: '2023-10-03T12:00:00Z' },
        { created_at: '2023-10-02T12:00:00Z' },
        { created_at: '2023-10-01T12:00:00Z' },
      ],
    },
    {
      description: 'sorts items in ascending order by created_at',
      input: {
        items: [
          { created_at: '2023-10-01T12:00:00Z' },
          { created_at: '2023-10-02T12:00:00Z' },
          { created_at: '2023-10-03T12:00:00Z' },
        ],
        descending: false,
      },
      expected: [
        { created_at: '2023-10-01T12:00:00Z' },
        { created_at: '2023-10-02T12:00:00Z' },
        { created_at: '2023-10-03T12:00:00Z' },
      ],
    },
    {
      description:
        'handles empty array without throwing an error and returns an empty array',
      input: {
        items: [],
        descending: true,
      },
      expected: [],
    },
    {
      description:
        'handles invalid date formats without throwing an error and returns the original array',
      input: {
        items: [
          { created_at: 'invalid-date' },
          { created_at: 'another-invalid-date' },
          { created_at: new Date('2023-10-01') }, // valid date
        ],
        descending: true,
      },
      expected: [
        { created_at: 'invalid-date' },
        { created_at: 'another-invalid-date' },
        { created_at: new Date('2023-10-01') }, // valid date
      ],
    },
  ]

  for (const testCase of testCases) {
    it(testCase.description, () => {
      const { items, descending } = testCase.input
      const result = sortByCreatedAt(items, descending, true)
      expect(result).toEqual(testCase.expected)
    })
  }
})
