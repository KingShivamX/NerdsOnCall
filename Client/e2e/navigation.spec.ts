import { test, expect, Page } from "@playwright/test"

/** Wait for Next.js page — avoids flaky "load" event timeouts during dev compile. */
async function goto(page: Page, path: string) {
    await page.goto(path, { waitUntil: "domcontentloaded" })
}

/** Navbar links appear in both navbar and footer — always scope to navigation. */
function navbarLink(page: Page, name: string) {
    return page.getByRole("navigation").getByRole("link", { name })
}

/**
 * Public navigation E2E tests — verify marketing pages load correctly.
 *
 * Playwright navigation assertions:
 *   expect(page).toHaveURL(pattern)     — URL matches regex or string
 *   expect(page).toHaveTitle(pattern)  — document title check
 *   page.goBack()                       — browser back button
 */
test.describe("Public Page Navigation", () => {
    test("Features page loads from navbar", async ({ page }) => {
        await goto(page, "/")
        await expect(page.getByText("Master Any Subject")).toBeVisible({
            timeout: 15_000,
        })

        await navbarLink(page, "Features").click()
        await expect(page).toHaveURL(/\/features/)
    })

    test("Pricing page loads from navbar", async ({ page }) => {
        await goto(page, "/")
        await expect(page.getByText("Master Any Subject")).toBeVisible({
            timeout: 15_000,
        })

        await navbarLink(page, "Pricing").click()
        await expect(page).toHaveURL(/\/pricing/)
    })

    test("About page loads from navbar", async ({ page }) => {
        await goto(page, "/")
        await expect(page.getByText("Master Any Subject")).toBeVisible({
            timeout: 15_000,
        })

        await navbarLink(page, "About").click()
        await expect(page).toHaveURL(/\/about/)
    })

    test("protected dashboard redirects unauthenticated users to login", async ({
        page,
    }) => {
        await goto(page, "/dashboard")
        await expect(page).toHaveURL(/\/auth\/login/, { timeout: 10_000 })
    })
})
