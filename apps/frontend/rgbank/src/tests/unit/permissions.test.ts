import type Committee from '@/models/Committee'
import type { RGBankPermissions } from '@/models/Permission'
import { canChangeExpense, canViewExpenses } from '../../utility/expense/admin'

describe('canViewExpense', () => {
  interface TestCase {
    description: string
    input?: RGBankPermissions
    expected: boolean
  }

  const testCases: TestCase[] = [
    {
      description: 'no permissions provided',
      input: undefined,
      expected: false,
    },
    {
      description: 'permissions with view level 0 should deny access',
      input: {
        access_level: 0,
        view_permission_level: 0,
      },
      expected: false,
    },
    {
      description: 'permissions with view level 1 should allow access',
      input: {
        access_level: 0,
        view_permission_level: 1,
      },
      expected: true,
    },
    {
      description: 'permissions with view level 2 should allow access',
      input: {
        access_level: 0,
        view_permission_level: 2,
      },
      expected: true,
    },
  ]

  for (const testCase of testCases) {
    test(testCase.description, () => {
      const result = canViewExpenses(testCase.input)
      expect(result).toBe(testCase.expected)
    })
  }
})

describe('canChangeExpense', () => {
  interface TestCase {
    description: string
    input: {
      studentCommittees: Committee[]
      committee?: Committee
      permissions?: RGBankPermissions
    }
    expected: boolean
  }

  const exampleCommitteeA: Committee = {
    committee_id: '1',
    author_type: 'COMMITTEE',
    email: 'test@medieteknik.com',
    hidden: false,
    logo_url: 'https://example.com/logo.png',
    total_documents: 0,
    total_events: 6,
    total_media: 0,
    total_news: 5,
    translations: [
      {
        description: 'Test Committee A',
        language_code: 'en',
        title: 'Test Committee A',
      },
    ],
  }

  const exampleCommitteeB: Committee = {
    committee_id: '2',
    author_type: 'COMMITTEE',
    email: 'another_test@medieteknik.com',
    hidden: false,
    logo_url: 'https://example.com/logo.png',
    total_documents: 2,
    total_events: 3,
    total_media: 4,
    total_news: 5,
    translations: [
      {
        description: 'Test Committee B',
        language_code: 'en',
        title: 'Test Committee B',
      },
    ],
  }

  const testCases: TestCase[] = [
    {
      description: 'no permissions provided and no committee specified',
      input: {
        studentCommittees: [],
        committee: undefined,
        permissions: undefined,
      },
      expected: false,
    },
    {
      description: 'no permissions provided but a committee is specified',
      input: {
        studentCommittees: [],
        committee: exampleCommitteeA,
        permissions: undefined,
      },
      expected: false,
    },
    {
      description:
        'valid permissions with matching committee in student committees',
      input: {
        studentCommittees: [exampleCommitteeA],
        committee: exampleCommitteeA,
        permissions: { view_permission_level: 1, access_level: 0 },
      },
      expected: true,
    },
    {
      description: 'valid permissions but no committee specified',
      input: {
        studentCommittees: [],
        committee: undefined,
        permissions: { view_permission_level: 2, access_level: 0 },
      },
      expected: true,
    },
    {
      description: 'committee specified but not present in student committees',
      input: {
        studentCommittees: [exampleCommitteeB],
        committee: exampleCommitteeA,
        permissions: { view_permission_level: 1, access_level: 0 },
      },
      expected: false,
    },
  ]

  for (const testCase of testCases) {
    test(testCase.description, () => {
      const result = canChangeExpense(
        testCase.input.studentCommittees,
        testCase.input.committee,
        testCase.input.permissions
      )
      expect(result).toBe(testCase.expected)
    })
  }
})
