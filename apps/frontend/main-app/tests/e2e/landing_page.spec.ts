import { expect, test } from '@playwright/test'

test.beforeEach(async ({ page }) => {
  await page.goto('http://localhost:3000/en')
})

test.describe('Landing page', () => {
  test('should display the landing page and cookie popup', async ({ page }) => {
    const websiteTitle = await page.title()
    expect(websiteTitle).toBe('Medieteknik - KTH')

    const title = page.locator('h1')
    await expect(title).toHaveText('Media Technology')

    // Ensure that the cookie popup is visible
    const cookiePopup = page.getByRole('dialog')
    await expect(cookiePopup).toBeVisible()

    const cookieTitle = page.locator('#cookie-title')
    await expect(cookieTitle).toHaveText('🍪 Cookies')

    const cookieDescription = page.locator('#cookie-description')
    await expect(cookieDescription).toHaveText(
      'This website uses cookies to ensure you get the best experience on our website. Review your settings via the cog icon in the top right.'
    )

    const acceptButton = page.getByRole('button', { name: 'Accept all' })
    await acceptButton.click()
    await expect(cookiePopup).not.toBeVisible()

    const description = page.locator('h2')
    await expect(description).toHaveText('Royal Institute of Technology')
  })

  test('header should contain the correct links', async ({ page }) => {
    const acceptButton = page.getByRole('button', { name: 'Accept all' })
    await acceptButton.click()

    const nav = page.locator('#header-navigation-menu')
    await expect(nav).toBeVisible()

    const links = await nav.locator('a').count()
    expect(links).toBe(2)

    // Check first link
    const firstLink = nav.locator('a').first()
    await expect(firstLink).toHaveText('News & Events')

    // Check second link
    const secondLink = nav.locator('a').last()
    await expect(secondLink).toHaveText('Education')

    const dropdowns = await nav.locator('button').count()
    expect(dropdowns).toBe(1)

    // Check dropdown
    const dropdownButton = nav.locator('button')
    await dropdownButton.click()

    const dropdownMenu = page.locator('#dropdown-content')
    await expect(dropdownMenu).toBeVisible()

    const dropdownLinks = await dropdownMenu.locator('a').count()
    expect(dropdownLinks).toBe(7)
  })
})
