import test, { expect } from '@playwright/test'
import path from 'node:path'

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

  await page.waitForLoadState('domcontentloaded')

  await page.waitForTimeout(2000)

  const navItem = page.getByTitle('New Invoice')
  await expect(navItem).toBeVisible()
  await navItem.click()

  await page.waitForTimeout(5000)

  await expect(
    page.getByText('Upload your invoice', { exact: true })
  ).toBeVisible()
})

test('✨ Invalid payment status', async ({ page }) => {
  await page.getByLabel('No, I am going to pay.').check()

  await expect(
    page.getByRole('button', { name: 'Register it as an expense' })
  ).toBeVisible()

  await page.getByLabel('Yes, I have paid.').check()

  await expect(
    page.getByRole('button', { name: 'Register it as an expense' })
  ).toBeVisible()
})

test('📂 Invalid files', async ({ page }) => {
  await page.getByLabel('Yes, the chapter has paid.').check()

  await page
    .getByTitle('Upload files')
    .setInputFiles(path.join(__dirname, 'big.png'))

  expect(
    (
      await page
        .getByText('The file is too large. The maximum size is 5 MB.')
        .all()
    ).length
  ).toBeGreaterThanOrEqual(1)

  await page
    .getByTitle('Upload files')
    .setInputFiles(path.join(__dirname, 'invalid.ico'))

  expect(
    (
      await page
        .getByText(
          'The file format is invalid. Please upload a file in jpeg, jpg, png, avif, webp, pdf format.'
        )
        .all()
    ).length
  ).toBeGreaterThanOrEqual(1)
})

test('📛 Invalid name (too long)', async ({ page }) => {
  await page.getByLabel('Yes, the chapter has paid.').check()

  const nameInput = page.getByTitle('Name your invoice')
  await nameInput.fill('a'.repeat(256))

  await expect(
    page.getByText('Maximum length exceeded (150 characters)')
  ).toBeVisible()
})

test('💻 Submitting invoice form', async ({ page }) => {
  await expect(
    page.getByRole('button', { name: 'Back to upload' })
  ).toBeVisible()

  const submitButton = page.getByTitle('Submit Invoice')
  const finalizeButton = page.getByTitle('Finalize Invoice')

  // Fill in the form fields
  expect(finalizeButton).toBeDisabled()

  await page.getByLabel('Yes, the chapter has paid.').check()

  await page.getByTitle('Name your invoice').fill('Test Invoice')
  await page
    .getByTitle('Upload files')
    .setInputFiles(path.join(__dirname, 'test.png'))

  await page.getByLabel('Description').fill('Test Description')

  await page
    .getByLabel('The file I have uploaded is the original invoice.')
    .check()

  await page
    .getByLabel('Date of the invoice*', { exact: true })
    .fill('2023-10-01')
  await page
    .getByLabel('Due date of the invoice*', { exact: true })
    .fill('2023-12-01')

  expect(finalizeButton).toBeDisabled()

  await page.getByTitle('Domain 1').click()
  await page.getByTitle('Search for a domain').fill('Övrigt')
  await page.getByRole('option', { name: 'Övrigt' }).click()

  await page.waitForTimeout(1000)

  await page.getByTitle('Category 1').click()
  await page.getByTitle('Search for a category').fill('Övrigt')
  await page.getByRole('option', { name: 'Övrigt' }).click()

  await page.getByTitle('Amount (SEK) 1').fill('2000')

  await page.getByTitle('File 1').click()
  await page.getByTitle('Search for a file').fill('test.png')
  await page.getByRole('option', { name: 'test.png' }).click()

  await expect(finalizeButton).toBeEnabled()

  await finalizeButton.click()

  await expect(submitButton).toBeVisible()
  await submitButton.click()

  await page.waitForURL('**/en', { waitUntil: 'domcontentloaded' })
})
