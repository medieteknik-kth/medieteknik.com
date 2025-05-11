import type { ExpenseStatus } from '@/models/General'
import type Student from '@/models/Student'
import { filterItems } from '../../utility/expense/filterUtils'

describe('filterByStatusAndSearch', () => {
  interface TestCase {
    description: string
    input: {
      items: {
        title: string
        description: string
        student?: Student
        status: ExpenseStatus
      }[]
      statusFilter?: ExpenseStatus[]
      searchQuery?: string | null
    }
    expected: {
      title: string
      description: string
      student?: Student
      status: ExpenseStatus
    }[]
  }

  const testCases: TestCase[] = [
    {
      description: 'filters by status and search query',
      input: {
        items: [
          { title: 'Item 1', description: 'Description 1', status: 'PAID' },
          {
            title: 'Item 2',
            description: 'Description 2',
            status: 'UNCONFIRMED',
          },
          { title: 'Item 3', description: 'Description 3', status: 'PAID' },
        ],
        statusFilter: ['PAID'],
        searchQuery: 'Item',
      },
      expected: [
        { title: 'Item 1', description: 'Description 1', status: 'PAID' },
        { title: 'Item 3', description: 'Description 3', status: 'PAID' },
      ],
    },
    {
      description:
        'returns all items when no filters are applied (empty search and no status filter)',
      input: {
        items: [
          { title: 'Item 1', description: 'Description 1', status: 'PAID' },
          {
            title: 'Item 2',
            description: 'Description 2',
            status: 'UNCONFIRMED',
          },
          { title: 'Item 3', description: 'Description 3', status: 'PAID' },
        ],
        statusFilter: [],
        searchQuery: null,
      },
      expected: [
        { title: 'Item 1', description: 'Description 1', status: 'PAID' },
        {
          title: 'Item 2',
          description: 'Description 2',
          status: 'UNCONFIRMED',
        },
        { title: 'Item 3', description: 'Description 3', status: 'PAID' },
      ],
    },
    {
      description:
        'returns an empty array when no items match the filters (non-matching search and status)',
      input: {
        items: [
          { title: 'Item A', description: '', status: 'UNCONFIRMED' },
          { title: '', description: '', status: '' },
          { title: '', description: '', status: '' },
        ],
        statusFilter: ['PAID'],
        searchQuery:
          "This is a long string that doesn't match any item in the list",
      },
      expected: [],
    },
  ]

  for (const testCase of testCases) {
    it(testCase.description, () => {
      const { input, expected } = testCase
      const result = filterItems(
        input.items,
        input.searchQuery || '',
        input.statusFilter || []
      )
      expect(result).toEqual(expected)
    })
  }
})
