import assert from 'node:assert/strict'
import { test } from 'node:test'
import {
  formatLoanAmountInput,
  isValidLoanAmount,
  isValidPincode,
} from '../src/utils/helpers.js'
import { casesToCsv, csvCell } from '../src/utils/csv.js'
import { fetchPincode } from '../src/utils/pincode.js'

test('loan validation rejects zero, empty and unsafe amounts', () => {
  for (const value of [
    '',
    '0',
    '00',
    '-100',
    '1.5',
    'Infinity',
    '9,007,199,254,740,992',
  ])
    assert.equal(isValidLoanAmount(value), false)
  for (const value of ['1', '7,25,000', '90,07,19,92,54,74,099'])
    assert.equal(isValidLoanAmount(value), true)
})

test('Indian amount formatting preserves precision for oversized input', () => {
  assert.equal(formatLoanAmountInput('0001234567'), '12,34,567')
  assert.equal(
    formatLoanAmountInput('9007199254740993'),
    '9,00,71,99,25,47,40,993',
  )
  assert.equal(formatLoanAmountInput(''), '')
})

test('pincodes require six digits and a nonzero prefix', () => {
  assert.equal(isValidPincode('400001'), true)
  for (const value of ['000001', '40000', '4000011', '40a001'])
    assert.equal(isValidPincode(value), false)
})

test('CSV escapes quotes, commas, newlines and spreadsheet formulas', () => {
  assert.equal(csvCell('A, "B"\nC'), '"A, ""B""\nC"')
  for (const value of [
    '=1+1',
    ' +SUM(1)',
    '@SUM(1)',
    '-1',
    '\t=1',
    '\u0000=1',
  ]) {
    assert.ok(csvCell(value).startsWith('"\''))
  }
  assert.equal(csvCell('Arun Sharma'), '"Arun Sharma"')
})

test('CSV includes all provided matching cases with readable statuses', () => {
  const csv = casesToCsv(
    [
      {
        caseNumber: '056',
        borrowerName: 'Test',
        caseCreatedBy: 'Agent',
        quoteGeneratedBy: 'N/A',
        loanAmount: 725000,
        status: 'pending',
      },
    ],
    [{ id: 'pending', label: 'Pending' }],
  )
  assert.ok(csv.startsWith('\uFEFF'))
  assert.equal(csv.split('\r\n').length, 2)
  assert.ok(csv.includes('"725000","Pending"'))
})

test('pincode service handles success, missing locations, errors and cancellation', async (context) => {
  const mockFetch = context.mock.method(globalThis, 'fetch', async () => ({
    ok: true,
    json: async () => [
      {
        Status: 'Success',
        PostOffice: [{ District: 'Mumbai', State: 'Maharashtra' }],
      },
    ],
  }))
  assert.deepEqual(await fetchPincode('400001'), {
    city: 'Mumbai',
    state: 'Maharashtra',
  })
  mockFetch.mock.mockImplementation(async () => ({
    ok: true,
    json: async () => [{ Status: 'Error' }],
  }))
  assert.equal(await fetchPincode('999999'), null)
  mockFetch.mock.mockImplementation(async () => ({ ok: false }))
  await assert.rejects(fetchPincode('400001'), /unavailable/)
  mockFetch.mock.mockImplementation(async (_url, { signal }) => {
    signal.throwIfAborted()
    return new Promise((_resolve, reject) =>
      signal.addEventListener('abort', () => reject(signal.reason), {
        once: true,
      }),
    )
  })
  const controller = new AbortController()
  const request = fetchPincode('400001', controller.signal)
  controller.abort()
  await assert.rejects(request, { name: 'AbortError' })
})

test('pincode requests abort after the eight-second timeout', async (context) => {
  context.mock.method(
    globalThis,
    'fetch',
    async (_url, { signal }) =>
      new Promise((_resolve, reject) => {
        signal.addEventListener('abort', () => reject(signal.reason), {
          once: true,
        })
      }),
  )
  await assert.rejects(fetchPincode('400001'), { name: 'AbortError' })
})
