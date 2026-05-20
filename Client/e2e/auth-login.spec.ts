import { test, expect, Page } from "@playwright/test"

/** Wait for Next.js page — avoids flaky "load" event timeouts during dev compile. */
async function goto(page: Page, path: string) {
    await page.goto(path, { waitUntil: "domcontentloaded" })
}

/**
 * Login page E2E tests — form validation and navigation.
 *
 * These tests cover client-side validation (no backend needed) and
 * optionally a full login flow when TEST_USER_EMAIL / TEST_USER_PASSWORD
 * env vars are set and the backend is running.
 *
 * Playwright form interactions:
 *   page.fill(selector, value)  — clear and type into an input
 *   page.click(selector)        — click a button or link
 *   page.locator('#id')         — CSS selector (use sparingly; prefer getByRole)
 */
test.describe("Login Page", () => {
    test.beforeEach(async ({ page }) => {
        await goto(page, "/auth/login")
        // Wait for AuthPageGuard spinner to finish and the form to render
        await expect(
            page.getByRole("button", { name: /Sign In/i })
        ).toBeVisible({ timeout: 30_000 })
    })

    test("displays login form with email and password fields", async ({
        page,
    }) => {
        // Assert form elements exist using their labels (accessible queries)
        await expect(page.getByLabel("Email Address")).toBeVisible()
        await expect(page.getByLabel("Password")).toBeVisible()
        await expect(
            page.getByRole("button", { name: /Sign In/i })
        ).toBeVisible()
    })

    test("shows validation errors when submitting empty form", async ({
        page,
    }) => {
        await page.getByRole("button", { name: /Sign In/i }).click()

        await expect(page.getByText("Email is required")).toBeVisible()
        await expect(page.getByText("Password is required")).toBeVisible()
        await expect(page).toHaveURL(/\/auth\/login/)
    })

    test("shows error for invalid email format", async ({ page }) => {
        await page.getByLabel("Email Address").fill("not-an-email")
        await page.getByLabel("Password").fill("somepassword")
        await page.getByRole("button", { name: /Sign In/i }).click()

        await expect(
            page.getByText("Please enter a valid email")
        ).toBeVisible()
    })

    test("Forgot password link navigates to forgot-password page", async ({
        page,
    }) => {
        await page.getByRole("link", { name: "Forgot password?" }).click()
        await expect(page).toHaveURL(/\/auth\/forgot-password/)
    })

    test("Create account link navigates to registration page", async ({
        page,
    }) => {
        await page.getByRole("link", { name: "Create account" }).click()
        await expect(page).toHaveURL(/\/auth\/register/)
    })
})

/**
 * Full login flow — requires backend running on http://localhost:8080
 * Credentials hardcoded for local practice (do not commit to public repos).
 */
test.describe("Login Flow", () => {
    const TEST_EMAIL = "shivamhippalgave@gmail.com"
    const TEST_PASSWORD = "Shiv@123"

    test("successful login redirects to dashboard", async ({ page }) => {
        await goto(page, "/auth/login")
        await expect(
            page.getByRole("button", { name: /Sign In/i })
        ).toBeVisible({ timeout: 30_000 })

        await page.getByLabel("Email Address").fill(TEST_EMAIL)
        await page.getByLabel("Password").fill(TEST_PASSWORD)
        await page.getByRole("button", { name: /Sign In/i }).click()

        // Wait for redirect after API login + cookie set
        await expect(page).toHaveURL(/\/dashboard/, { timeout: 20_000 })
    })
})
