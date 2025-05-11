import test, { expect } from '@playwright/test'

test.beforeEach(async ({ page, browser }) => {
  await browser.newContext({
    serviceWorkers: 'block',
  })
  await page.context().clearCookies()

  await page.goto('http://localhost:3000/en/')

  await page.click('.accordion-login')

  const email = process.env.TEST_EMAIL || 'testuser'
  const password = process.env.TEST_PASSWORD || 'testpassword'

  await page.getByLabel('Email', { exact: true }).fill(email)
  await page.getByLabel('Password').fill(password)
  await page.getByTitle('Login', { exact: true }).click()

  await page.waitForURL('**/en', { waitUntil: 'networkidle' })
  await expect(page.getByTitle('New Expense')).toBeVisible()
  await expect(page.getByTitle('New Invoice')).toBeVisible()
  await expect(page.getByTitle('Your Uploads')).toBeVisible()
  await expect(page.getByTitle('Statistics')).toBeVisible()
  await expect(page.getByTitle('Admin')).toBeVisible()
})

test('💼 Detailed view', async ({ page }) => {
  const testExpense = new FormData()
  testExpense.append(
    'files',
    new File(
      [new Uint8Array([37, 80, 68, 70, 45, 49, 46, 52, 10])],
      'test.pdf',
      { type: 'application/pdf' }
    )
  )
  testExpense.append('date', '2023-10-01')
  testExpense.append('title', 'test')
  testExpense.append('description', 'test')
  testExpense.append(
    'categories',
    JSON.stringify([
      {
        id: 0,
        amount: '2000',
        author: 'Övrigt',
        category: 'Övrigt',
      },
    ])
  )

  const res = await page.request.post(
    'http://localhost:3000/api/rgbank/expenses',
    {
      headers: {
        'Access-Control-Allow-Credentials': 'true',
      },
      multipart: testExpense,
    }
  )

  expect(res.ok()).toBeTruthy()
  expect(res.status()).toBe(201)

  const id = (await res.json()).id
  expect(id).toBeDefined()

  await page.goto(`http://localhost:3000/en/expense/${id}`, {
    waitUntil: 'domcontentloaded',
  })

  await expect(page.getByText('Expense Details', { exact: true })).toBeVisible()

  await test.step('💵 Check expense details', async () => {
    const adminTab = page.getByRole('tab', { name: 'Admin' })

    expect(page.getByRole('tab', { name: 'Details' })).toBeVisible()
    expect(page.getByRole('tab', { name: 'Files' })).toBeVisible()
    expect(page.getByRole('tab', { name: 'Comments' })).toBeVisible()
    expect(adminTab).toBeVisible()

    const tableBody = page.locator('tbody > *')
    expect((await tableBody.all()).length).toBe(1)
    await expect(tableBody.first()).toHaveText('ÖvrigtÖvrigtSEK 2,000.00')

    await adminTab.click()

    await expect(page.getByText('Update Status', { exact: true })).toBeVisible()
    await expect(
      page.getByText('Update Categories', { exact: true })
    ).toBeVisible()
  })

  await test.step('⚡ Update status', async () => {
    const statusSelect = page.locator('select').first()
    const changeStatusButton = page.locator('button[type="submit"]').first()
    const commentInput = page.getByLabel('Comment')
    const currentStatus = page.locator('.badge').first()

    await expect(currentStatus).toHaveText('Unconfirmed')

    await statusSelect.selectOption('CLARIFICATION')
    await expect(changeStatusButton).toBeDisabled()
    await commentInput.fill('Test comment')
    await expect(changeStatusButton).toBeEnabled()
    await changeStatusButton.click()

    await page.waitForTimeout(2000)

    await expect(currentStatus).toHaveText('Clarification')

    await commentInput.fill('')
    await expect(changeStatusButton).toBeDisabled()
    await statusSelect.selectOption('REJECTED')
    await commentInput.fill('Test comment')
    await expect(changeStatusButton).toBeEnabled()

    await commentInput.fill('')
    await statusSelect.selectOption('CONFIRMED')
    await expect(changeStatusButton).toBeEnabled()
  })

  await test.step('⏹️ Update categories ', async () => {
    await page.getByTitle('Domain 1').click()
    await page.getByTitle('Search.').fill('Centralt')
    await page.waitForTimeout(200)
    await page.getByRole('option', { name: 'Centralt' }).click()

    await page.waitForTimeout(1000)

    await page.getByTitle('Category 1').click()
    await page.getByTitle('Search.').fill('Funktionärsfest')
    await page.waitForTimeout(200)
    await page.getByRole('option', { name: 'Funktionärsfest' }).click()

    await page.getByTitle('Amount (SEK) 1').fill('1000')

    await page.waitForTimeout(500)

    await page.getByTitle('Save Changes').click()
    await page.waitForLoadState('domcontentloaded')

    await expect(
      page.getByText('Expense Details', { exact: true })
    ).toBeVisible({ timeout: 6000 })

    // Just need to ensure that the table content has updated, 20s is enough
    await expect(page.locator('tbody')).toBeVisible({ timeout: 20_000 })

    const tableBody = page.locator('tbody > *')
    expect((await tableBody.all()).length).toBe(1)
    await expect(tableBody.first()).toHaveText(
      'CentraltFunktionärsfestSEK 1,000.00'
    )
  })
})
