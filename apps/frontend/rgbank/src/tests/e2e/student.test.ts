import test, { expect } from '@playwright/test'

test.beforeEach(async ({ page, browser }) => {
  await browser.newContext({
    serviceWorkers: 'block',
  })
  await page.context().clearCookies()

  await page.goto('http://localhost:3000/en/')
})

test('👤 Login flow (email & password)', async ({ page }) => {
  await expect(page.getByTitle('Statistics')).toBeVisible()

  await page.click('.accordion-login')

  const email = process.env.TEST_EMAIL || 'testuser'
  const password = process.env.TEST_PASSWORD || 'testpassword'

  await page.getByLabel('Email', { exact: true }).fill(email)
  await page.getByLabel('Password').fill(password)
  await page.getByTitle('Login', { exact: true }).click()

  await page.waitForLoadState('domcontentloaded')
  let cookieFound = false
  for (let i = 0; i < 20; i++) {
    const cookies = await page.context().cookies()
    if (cookies.some((cookie) => cookie.name === 'access_token_cookie')) {
      cookieFound = true
      break
    }
    await page.waitForTimeout(100)
  }
  expect(cookieFound).toBeTruthy()

  await expect(page.getByTitle('New Expense')).toBeVisible()
  await expect(page.getByTitle('New Invoice')).toBeVisible()
  await expect(page.getByTitle('Your Uploads')).toBeVisible()
  await expect(page.getByTitle('Statistics')).toBeVisible()
  await expect(page.getByTitle('Admin')).toBeVisible()
})
