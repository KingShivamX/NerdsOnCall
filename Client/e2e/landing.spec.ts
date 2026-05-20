import { test, expect, Page } from "@playwright/test"

/** Wait for Next.js page — avoids flaky "load" event timeouts during dev compile. */
async function goto(page: Page, path: string) {
    await page.goto(path, { waitUntil: "domcontentloaded" })
}

/**
 * Landing page E2E tests — public homepage (no login required).
 *
 * Playwright test structure:
 *   test.describe()  — groups related tests
 *   test()           — a single test case
 *   expect()         — assertions (similar to JUnit assert* but for the browser)
 *
 * Common Playwright actions:
 *   page.goto(url)           — navigate to a page
 *   page.getByRole()         — find elements by accessibility role (preferred)
 *   page.getByText()         — find by visible text
 *   expect(locator).toBeVisible() — assert element is on screen
 */
test.describe("Landing Page", () => {
    test.beforeEach(async ({ page }) => {
        await goto(page, "/")
    })

    test("shows hero heading and brand name", async ({ page }) => {
        // Wait for auth check to finish (loading spinner disappears)
        await expect(page.getByText("Master Any Subject")).toBeVisible({
            timeout: 15_000,
        })
        await expect(page.getByText("With NerdsOnCall")).toBeVisible()

        // Navbar brand should always be visible
        await expect(
            page.getByRole("link", { name: "NerdsOnCall" })
        ).toBeVisible()
    })

    test("Start Learning Now button links to student registration", async ({
        page,
    }) => {
        await expect(page.getByText("Master Any Subject")).toBeVisible({
            timeout: 15_000,
        })

        // getByRole with 'link' finds <a> elements by their accessible name
        const registerLink = page.getByRole("link", {
            name: /Start Learning Now/i,
        })
        await expect(registerLink).toBeVisible()
        await expect(registerLink).toHaveAttribute(
            "href",
            "/auth/register?role=student"
        )
    })

    test("Sign In link in navbar navigates to login page", async ({ page }) => {
        await expect(page.getByText("Master Any Subject")).toBeVisible({
            timeout: 15_000,
        })

        // Scope to navbar to avoid duplicate links elsewhere on the page
        await page
            .getByRole("navigation")
            .getByRole("link", { name: "Sign In" })
            .click()

        await expect(page).toHaveURL(/\/auth\/login/)
        await expect(
            page.getByRole("heading", { name: "Welcome Back" })
        ).toBeVisible()
    })
})
