import { test, expect, type Page } from '@playwright/test'

/** Navigate from app start to the menu view. */
async function goToMenu(page: Page) {
  await page.goto('/')
  await page.getByRole('button', { name: /A08/ }).first().click()
  await page.getByRole('button', { name: /进入点餐|Enter/ }).click()
}

/** Toggle theme from light to dark (aria-label: 切换至夜间模式). */
async function toggleToDark(page: Page) {
  await page.getByRole('button', { name: /切换至夜间模式|Switch to dark mode/ }).click()
}

/** Toggle theme from dark to light (aria-label: 切换至浅色模式). */
async function toggleToLight(page: Page) {
  await page.getByRole('button', { name: /切换至浅色模式|Switch to light mode/ }).click()
}

/** Navigate from menu to order view by adding an item and submitting. */
async function goToOrder(page: Page) {
  await goToMenu(page)
  await page.getByRole('button', { name: '锅底' }).click()
  const productCards = page.locator('article')
  await productCards.nth(0).locator('button').last().click()
  await page.getByRole('button', { name: '加入本桌购物车' }).click()
  await page.getByRole('button', { name: '确认并提交订单' }).click()
}

/** Navigate from order to checkout view. */
async function goToCheckout(page: Page) {
  await goToOrder(page)
  await page.getByRole('button', { name: '去结账' }).click()
}

test.describe('夜间模式（深色主题）- E2E 验收测试', () => {
  test('REQ-001.1: 浅色模式下 TopBar 显示主题切换按钮，aria-label 为「切换至夜间模式」', async ({ page }) => {
    await goToMenu(page)
    const toggleBtn = page.getByRole('button', { name: '切换至夜间模式' })
    await expect(toggleBtn).toBeVisible()
    await expect(page.locator('html')).not.toHaveClass(/dark/)
  })

  test('REQ-001.2: 点击切换按钮后 html 获得 dark class，aria-label 变为「切换至浅色模式」', async ({ page }) => {
    await goToMenu(page)
    await toggleToDark(page)
    await expect(page.locator('html')).toHaveClass(/dark/)
    await expect(page.getByRole('button', { name: '切换至浅色模式' })).toBeVisible()
  })

  test('REQ-001.3: 深色模式下点击切换按钮切回浅色主题', async ({ page }) => {
    await goToMenu(page)
    await toggleToDark(page)
    await expect(page.locator('html')).toHaveClass(/dark/)
    await toggleToLight(page)
    await expect(page.locator('html')).not.toHaveClass(/dark/)
    await expect(page.getByRole('button', { name: '切换至夜间模式' })).toBeVisible()
  })

  test('REQ-001.4: 切换为深色主题时显示提示消息「已切换为夜间模式」', async ({ page }) => {
    await goToMenu(page)
    await toggleToDark(page)
    await expect(page.getByText('已切换为夜间模式')).toBeVisible()
  })

  test('REQ-001.5: 切换为浅色主题时显示提示消息「已切换为浅色模式」', async ({ page }) => {
    await goToMenu(page)
    await toggleToDark(page)
    await toggleToLight(page)
    await expect(page.getByText('已切换为浅色模式')).toBeVisible()
  })

  test('REQ-001.6: 主题切换不丢失当前页面状态（购物车内容保持）', async ({ page }) => {
    await goToMenu(page)
    // Add an item to cart
    await page.getByRole('button', { name: '锅底' }).click()
    const productCards = page.locator('article')
    await productCards.nth(0).locator('button').last().click()
    await page.getByRole('button', { name: '加入本桌购物车' }).click()
    await expect(page.getByText('本桌购物车').first()).toBeVisible()
    // Toggle dark mode — cart content should persist
    await toggleToDark(page)
    await expect(page.getByText('本桌购物车').first()).toBeVisible()
  })

  test('REQ-002.1: 深色主题覆盖绑定餐桌页', async ({ page }) => {
    await page.goto('/')
    await page.evaluate(() => localStorage.setItem('dark-mode', 'true'))
    await page.reload()
    await expect(page.locator('html')).toHaveClass(/dark/)
    await expect(page.getByRole('button', { name: /A08/ }).first()).toBeVisible()
  })

  test('REQ-002.2: 深色主题覆盖欢迎页', async ({ page }) => {
    await page.goto('/')
    await page.evaluate(() => localStorage.setItem('dark-mode', 'true'))
    await page.reload()
    await page.getByRole('button', { name: /A08/ }).first().click()
    await expect(page.locator('html')).toHaveClass(/dark/)
    await expect(page.getByRole('button', { name: /进入点餐|Enter/ })).toBeVisible()
  })

  test('REQ-002.3: 深色主题覆盖菜单点餐页', async ({ page }) => {
    await goToMenu(page)
    await toggleToDark(page)
    await expect(page.locator('html')).toHaveClass(/dark/)
    await expect(page.getByRole('button', { name: '锅底' })).toBeVisible()
  })

  test('REQ-002.4: 深色主题覆盖订单履约页', async ({ page }) => {
    await goToOrder(page)
    await toggleToDark(page)
    await expect(page.locator('html')).toHaveClass(/dark/)
    await expect(page.getByRole('button', { name: '去结账' })).toBeVisible()
  })

  test('REQ-002.5: 深色主题覆盖结账支付页', async ({ page }) => {
    await goToCheckout(page)
    await toggleToDark(page)
    await expect(page.locator('html')).toHaveClass(/dark/)
    await expect(page.getByRole('button', { name: /确认支付/ })).toBeVisible()
  })

  test('REQ-003.1: 深色主题刷新后保持，localStorage 持久化', async ({ page }) => {
    await goToMenu(page)
    await toggleToDark(page)
    await expect(page.locator('html')).toHaveClass(/dark/)
    const stored = await page.evaluate(() => localStorage.getItem('dark-mode'))
    expect(stored).toBe('true')
    await page.reload()
    await expect(page.locator('html')).toHaveClass(/dark/)
  })

  test('REQ-003.2: 浅色主题刷新后保持，localStorage 持久化', async ({ page }) => {
    await goToMenu(page)
    await toggleToDark(page)
    await toggleToLight(page)
    await expect(page.locator('html')).not.toHaveClass(/dark/)
    const stored = await page.evaluate(() => localStorage.getItem('dark-mode'))
    expect(stored).toBe('false')
    await page.reload()
    await expect(page.locator('html')).not.toHaveClass(/dark/)
  })

  test('REQ-003.3: 首次访问默认浅色主题，localStorage 无 dark-mode 记录', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('html')).not.toHaveClass(/dark/)
    const stored = await page.evaluate(() => localStorage.getItem('dark-mode'))
    expect(stored).toBeNull()
  })

  test('REQ-004.1: 主题切换与老人模式独立共存', async ({ page }) => {
    await goToMenu(page)
    // Enable dark mode
    await toggleToDark(page)
    await expect(page.locator('html')).toHaveClass(/dark/)
    // Enable elderly mode
    await page.getByRole('button', { name: '切换至老人模式' }).click()
    await expect(page.locator('html')).toHaveClass(/elderly/)
    // Both active simultaneously
    await expect(page.locator('html')).toHaveClass(/dark/)
    await expect(page.locator('html')).toHaveClass(/elderly/)
    // Toggle dark off — elderly should remain
    await toggleToLight(page)
    await expect(page.locator('html')).not.toHaveClass(/dark/)
    await expect(page.locator('html')).toHaveClass(/elderly/)
    // Toggle dark back on
    await toggleToDark(page)
    await expect(page.locator('html')).toHaveClass(/dark/)
    await expect(page.locator('html')).toHaveClass(/elderly/)
  })

  test('REQ-004.2: 主题切换与语言切换独立共存', async ({ page }) => {
    await goToMenu(page)
    await toggleToDark(page)
    await expect(page.locator('html')).toHaveClass(/dark/)
    // Switch language to English (button shows "EN" when in Chinese)
    await page.getByRole('button', { name: '切换语言' }).click()
    // Dark mode should still be active
    await expect(page.locator('html')).toHaveClass(/dark/)
    // Toggle button should now have English aria-label
    await expect(page.getByRole('button', { name: 'Switch to light mode' })).toBeVisible()
    // Toggle to light — should work in English UI
    await page.getByRole('button', { name: 'Switch to light mode' }).click()
    await expect(page.locator('html')).not.toHaveClass(/dark/)
    await expect(page.getByRole('button', { name: 'Switch to dark mode' })).toBeVisible()
  })
})
