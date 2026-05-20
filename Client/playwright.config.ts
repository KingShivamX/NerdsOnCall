import { defineConfig, devices } from "@playwright/test"

/**
 * Playwright configuration for NerdsOnCall frontend E2E tests.
 *
 * Run tests:
 *   npm run test:e2e          — headless (CI-friendly)
 *   npm run test:e2e:ui       — interactive UI mode (great for learning)
 *   npm run test:e2e:headed   — see the browser while tests run
 *
 * Prerequisites:
 *   1. Start the frontend:  npm run dev        (http://localhost:3000)
 *   2. For login tests:     start the backend  (http://localhost:8080)
 */
export default defineConfig({
    // Folder containing *.spec.ts test files
    testDir: "./e2e",

    // Fail the build on CI if test.only is left in source
    forbidOnly: !!process.env.CI,

    // Retry flaky tests on CI only
    retries: process.env.CI ? 2 : 0,

    // Single worker avoids dev-server race conditions during Next.js hot compile
    workers: 1,

    // Next.js first compile can be slow on cold start
    timeout: 60_000,

    // HTML report opens after a failed run (locally)
    reporter: [["html", { open: "never" }], ["list"]],

    use: {
        // Base URL for page.goto("/auth/login") style navigation
        baseURL: process.env.PLAYWRIGHT_BASE_URL ?? "http://localhost:3000",

        // Slow down actions in UI mode so you can watch the test run
        launchOptions: {
            slowMo: process.env.PWDEBUG ? 500 : 0,
        },

        // domcontentloaded is faster and more reliable than "load" with Next.js
        navigationTimeout: 30_000,

        // Capture trace on first retry — useful for debugging failures
        trace: "on-first-retry",

        // Screenshot only when a test fails
        screenshot: "only-on-failure",
    },

    projects: [
        {
            name: "chromium",
            use: { ...devices["Desktop Chrome"] },
        },
    ],

    // Auto-start dev server before tests (kills port confusion)
    webServer: {
        command: "npm run dev",
        url: "http://localhost:3000",
        reuseExistingServer: !process.env.CI,
        timeout: 120_000,
    },
})
