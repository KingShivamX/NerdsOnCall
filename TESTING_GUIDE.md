# NerdsOnCall — Complete Testing Guide (Interview Ready)

> **Who is this for?** You added three kinds of tests to this project. This file explains every piece in **simple words**, tied to **your real code**, plus **common interview questions** with answers you can say out loud.

---

## Table of Contents

1. [Big Picture — What Are Tests?](#1-big-picture--what-are-tests)
2. [Where Everything Lives in Your Project](#2-where-everything-lives-in-your-project)
3. [JUnit 5 — Deep Dive](#3-junit-5--deep-dive)
4. [Mockito — Deep Dive](#4-mockito--deep-dive)
5. [Your Java Tests — Line by Line](#5-your-java-tests--line-by-line)
6. [Playwright — Deep Dive](#6-playwright--deep-dive)
7. [Your Playwright Tests — Line by Line](#7-your-playwright-tests--line-by-line)
8. [JMeter — Deep Dive](#8-jmeter--deep-dive)
9. [Your JMeter Load Test — Line by Line](#9-your-jmeter-load-test--line-by-line)
10. [How to Run Everything](#10-how-to-run-everything)
11. [Interview Question Bank](#11-interview-question-bank)

---

## 1. Big Picture — What Are Tests?

Imagine you built a toy robot.

| Test type | Simple idea | Your project example |
|-----------|-------------|----------------------|
| **Unit test** | Check one small part alone (a wheel spins) | `AuthServiceTest` — login logic without real database |
| **Integration test** | Check parts work together (wheel + motor) | `PdfEmailIntegrationTest` — PDF + Spring context |
| **E2E test** | Pretend you are a real user clicking the website | Playwright — open homepage, click Sign In |
| **Load test** | Many fake users hit the server at once | JMeter — 10 users × 3 loops hitting `/health`, `/plans` |

**Why bother?**

- Catch bugs before users do.
- Change code safely (“if tests pass, I probably didn’t break login”).
- Prove quality in interviews and at work.

**Testing pyramid (interview favorite):**

```
        /\
       /  \     Few E2E (slow, expensive)     ← Playwright
      /----\
     /      \   Some integration               ← PdfEmailIntegrationTest
    /--------\
   /          \ Many unit tests (fast)         ← AuthServiceTest, PaymentServiceTest
  /____________\
```

Bottom = many fast unit tests. Top = few slow browser tests.

---

## 2. Where Everything Lives in Your Project

```
NerdsOnCall/
├── Server/
│   └── src/test/java/com/nerdsoncall/
│       ├── service/
│       │   ├── AuthServiceTest.java          ← JUnit + Mockito (best example)
│       │   ├── SubscriptionServiceTest.java  ← JUnit + Mockito + ArgumentCaptor
│       │   ├── PaymentServiceTest.java       ← JUnit only (no mocks)
│       │   ├── EmailServiceTest.java         ← Mockito + @SpringBootTest
│       │   └── PdfServiceTest.java           ← Real PDF generation
│       └── integration/
│           └── PdfEmailIntegrationTest.java ← Spring Boot integration
│
├── Client/
│   ├── playwright.config.ts                  ← Playwright settings
│   └── e2e/
│       ├── landing.spec.ts
│       ├── auth-login.spec.ts
│       └── navigation.spec.ts
│
└── jmeter/
    ├── NerdsOnCall-LoadTest.jmx              ← Load test plan
    └── run-load-test.bat                     ← One-click runner
```

**Maven dependency (Server):** `spring-boot-starter-test` in `pom.xml` brings in:

- JUnit 5 (Jupiter)
- Mockito
- AssertJ, Hamcrest, Spring Test helpers

You do **not** add JUnit/Mockito versions manually — Spring Boot manages them.

---

## 3. JUnit 5 — Deep Dive

### 3.1 What is JUnit?

JUnit is a **Java library that runs your test methods** and tells you pass ✅ or fail ❌.

- Old: JUnit 4 (`@RunWith`, `@Before`)
- **You use: JUnit 5 (Jupiter)** — package `org.junit.jupiter.api`

### 3.2 Core annotations (know these cold)

| Annotation | When it runs | Your project |
|------------|--------------|--------------|
| `@Test` | Marks a method as a test | Every `void login_...()` method |
| `@BeforeEach` | Before **each** `@Test` | `setUp()` — fresh user objects |
| `@AfterEach` | After each test | (you don’t use yet) |
| `@BeforeAll` | Once before all tests in class | static expensive setup |
| `@AfterAll` | Once after all tests | cleanup |
| `@DisplayName("human text")` | Pretty name in reports | `"login — returns JWT when valid"` |
| `@Disabled` | Skip this test | for broken/flaky tests |
| `@ParameterizedTest` | Same test, many inputs | (not in your code yet) |
| `@ExtendWith(...)` | Plug in extra framework | `MockitoExtension.class` |

### 3.3 Test method structure — AAA pattern

Every good test looks like this:

```java
@Test
void something_happens() {
    // Arrange — prepare data and mocks
    when(userService.findByEmail("x")).thenReturn(Optional.of(studentUser));

    // Act — call the real method you are testing
    String token = authService.login("x", "pass");

    // Assert — check result
    assertEquals("mock-jwt-token", token);

    // Verify (Mockito) — check side effects on mocks
    verify(jwtUtil).generateToken(...);
}
```

**Interview line:** “I follow Arrange–Act–Assert so tests read like a short story.”

### 3.4 Assertions you actually use

From `import static org.junit.jupiter.api.Assertions.*;`

| Method | Meaning | Example in your code |
|--------|---------|----------------------|
| `assertEquals(expected, actual)` | Same value | JWT string |
| `assertNotNull(x)` | Not null | token, pdf bytes |
| `assertTrue(condition)` | Must be true | `hasValidSubscription` |
| `assertFalse(condition)` | Must be false | expired token |
| `assertThrows(Exception.class, () -> { ... })` | Code must throw | login when user missing |
| `assertDoesNotThrow(() -> { ... })` | No exception | forgot password unknown email |

**Extra messages:**

```java
assertTrue(pdfBytes.length > 1000, "PDF should be at least 1KB");
```

Second argument = message if test fails (helps debugging).

### 3.5 `@ExtendWith(MockitoExtension.class)` vs `@SpringBootTest`

| Style | Starts Spring? | Speed | Use when |
|-------|----------------|-------|----------|
| `@ExtendWith(MockitoExtension.class)` | No | Fast | Unit test one service |
| `@SpringBootTest` | Yes (full app context) | Slower | Integration, beans wired |

`AuthServiceTest` = **fast unit test** (no Spring).

`PdfEmailIntegrationTest` = **integration** (real `PdfService` bean from Spring).

### 3.6 `ReflectionTestUtils` (Spring Test helper)

Some fields are set by Spring `@Value` or `@PostConstruct`. In unit tests you skip Spring and set them manually:

```java
ReflectionTestUtils.setField(authService, "frontendUrl", "http://localhost:3000");
ReflectionTestUtils.setField(paymentService, "razorpayKeySecret", TEST_SECRET);
```

**Simple explanation:** “I reach into the object and set private fields for testing.”

---

## 4. Mockito — Deep Dive

### 4.1 What is a mock?

A **mock** is a **fake object** that pretends to be a real dependency.

- Real `EmailService` → sends real email (slow, needs SMTP).
- Mock `EmailService` → you control what happens; no email leaves the machine.

**Interview one-liner:** “Mocks isolate the class under test so failures point to my logic, not the database or network.”

### 4.2 Key annotations

| Annotation | What it creates |
|------------|-----------------|
| `@Mock` | Fake dependency (`UserService`, `JwtUtil`, …) |
| `@InjectMocks` | **Real** class under test; Mockito fills `@Mock` fields into it |
| `@Spy` | Real object, but you can stub some methods (partial mock) |
| `@Captor` | Capture arguments passed to a mock (less common than manual captor) |

Your `AuthServiceTest`:

```java
@ExtendWith(MockitoExtension.class)
class AuthServiceTest {
    @Mock private UserService userService;
    @InjectMocks private AuthService authService;  // real AuthService, fake friends
}
```

### 4.3 Stubbing — `when(...).thenReturn(...)`

**Stub** = “When they call this method, return this fake answer.”

```java
when(userService.findByEmail("student@test.com"))
    .thenReturn(Optional.of(studentUser));

when(jwtUtil.generateToken("student@test.com", 1L, "STUDENT"))
    .thenReturn("mock-jwt-token");
```

**Matchers** (when you don’t care about exact value):

```java
import static org.mockito.ArgumentMatchers.*;

any()                    // any object
anyString()
anyLong()
anyBoolean()
eq("student@test.com")   // must equal this
argThat(user -> user.getResetToken() != null)  // custom logic
```

### 4.4 Verification — `verify(...)`

**Assert behavior**, not just return value:

```java
verify(authenticationManager).authenticate(any(UsernamePasswordAuthenticationToken.class));
verify(jwtUtil).generateToken("student@test.com", 1L, "STUDENT");
verify(userService, never()).saveUser(any());  // must NOT happen
verify(emailService, times(1)).sendPasswordResetEmail(...);  // exactly once
```

| Mockito method | Meaning |
|----------------|---------|
| `verify(mock).method()` | Called once (default) |
| `verify(mock, times(n))` | Called n times |
| `verify(mock, never())` | Never called |
| `verify(mock, atLeastOnce())` | ≥ 1 |
| `verifyNoInteractions(mock)` | Mock never touched |

### 4.5 `ArgumentCaptor` — inspect what was saved

From `SubscriptionServiceTest`:

```java
ArgumentCaptor<Subscription> captor = ArgumentCaptor.forClass(Subscription.class);
verify(subscriptionRepository).save(captor.capture());
assertEquals(6, captor.getValue().getSessionsUsed());
```

**Story:** “After increment, I capture the `Subscription` passed to `save()` and assert `sessionsUsed` became 6.”

### 4.6 Other Mockito tools (know for interviews)

```java
// Throw exception from mock
when(pdfService.generate(...)).thenThrow(new IOException("fail"));

// Void methods
doNothing().when(mock).voidMethod();
doThrow(new RuntimeException()).when(mock).voidMethod();

// InOrder — verify call order
InOrder inOrder = inOrder(mockA, mockB);
inOrder.verify(mockA).step1();
inOrder.verify(mockB).step2();

// Static mocking (Mockito 3.4+) — use sparingly
try (MockedStatic<SomeUtil> mocked = mockStatic(SomeUtil.class)) {
    mocked.when(SomeUtil::method).thenReturn("x");
}
```

### 4.7 Mockito vs real object vs `@SpringBootTest`

| Approach | EmailServiceTest style |
|----------|------------------------|
| `@ExtendWith(MockitoExtension.class)` | Best for pure unit tests |
| `MockitoAnnotations.openMocks(this)` in `@BeforeEach` | Older style; still works |
| `@SpringBootTest` + `@Mock` | Loads Spring; your `EmailServiceTest` does this — heavier |

**Tip for interviews:** Prefer `@ExtendWith(MockitoExtension.class)` for service unit tests unless you need Spring wiring.

### 4.8 Common mistakes

1. **Stubbing wrong argument** — `when(repo.findById(1L))` but code calls `findById(2L)` → mock returns null → NPE.
2. **Forgetting `verify`** — only checking return value when important side effect is `save()` or `send()`.
3. **Testing the mock** — asserting mock behavior that your code never triggers.
4. **Partial mocks on real DB** — still slow; use in-memory DB or pure mocks.

---

## 5. Your Java Tests — Line by Line

### 5.1 `AuthServiceTest.java` — star example

**What class is tested?** `AuthService` — login, logout, forgot/reset password.

**Dependencies mocked:**

- `AuthenticationManager` — Spring Security login
- `UserService` — find/save users
- `TutorStatusService` — tutor online/offline
- `JwtUtil` — create JWT
- `EmailService` — send emails
- `PasswordEncoder` — hash passwords

#### Test: `login_success_returnsJwtToken`

1. Stub: user exists, JWT string returned.
2. Act: `authService.login(email, password)`.
3. Assert: token equals `"mock-jwt-token"`.
4. Verify: `authenticationManager.authenticate(...)` and `jwtUtil.generateToken(...)`.

**Interview:** “We mock external systems so login test runs in milliseconds without MySQL or mail server.”

#### Test: `login_userNotFound_throwsException`

- `Optional.empty()` for email.
- `assertThrows(RuntimeException.class, () -> authService.login(...))`.
- Message `"User not found"`.

#### Test: `logout_student_updatesOnlineStatus` vs `logout_tutor_setsTutorOffline`

**Branching logic:** student uses `UserService.updateOnlineStatus`; tutor uses `TutorStatusService.setTutorOnline`.

- `verify(tutorStatusService, never()).setTutorOnline(...)` on student logout.

**Interview:** “I test both branches and use `never()` to prove the wrong path wasn’t taken.”

#### Test: `forgotPassword_existingUser_savesTokenAndSendsEmail`

- `verify(userService).saveUser(argThat(user -> user.getResetToken() != null))`.
- Email stub with `eq` and `anyString()` for token.

#### Test: `forgotPassword_unknownEmail_doesNothing`

**Security pattern:** don’t tell attacker if email exists.

- `assertDoesNotThrow`
- `verify(userService, never()).saveUser(any())`

**Interview:** “Prevent user enumeration — same response for unknown email.”

#### Test: `resetPassword_validToken_returnsTrue` / expired / `validateResetToken`

- Time-based logic with `LocalDateTime.now().plusHours(1)` vs `minusHours(1)`.
- Assert token cleared after successful reset.

---

### 5.2 `SubscriptionServiceTest.java`

**Business rules tested:**

| Method | Rule |
|--------|------|
| `hasValidSubscription` | ACTIVE + date in range |
| `canUserCreateSession` | sessions used < limit |
| Unlimited plan | `sessionsLimit = -1` → always true |
| `incrementSessionUsage` | saves with used+1 |
| `decrementSessionUsage` | won’t go below 0 → no save |
| `processExpiredSubscriptions` | status → EXPIRED |

**Star technique:** `ArgumentCaptor` on `subscriptionRepository.save()`.

---

### 5.3 `PaymentServiceTest.java` — no Mockito

**Why no mocks?** `verifyOrder` is pure HMAC math — test the real `PaymentService` with a test secret.

```java
paymentService = new PaymentService();
ReflectionTestUtils.setField(paymentService, "razorpayKeySecret", TEST_SECRET);
```

**Valid signature test:** helper `computeHmacSha256(orderId + "|" + paymentId, secret)` — same algorithm as Razorpay.

**Interview:** “Payment verification is cryptographic; I test with known inputs and a locally computed HMAC instead of calling Razorpay API.”

---

### 5.4 `EmailServiceTest.java`

**Mocks:** `JavaMailSender`, `PdfService`.

**Tests:**

- Happy path: PDF generated → mime message created → `mailSender.send`.
- PDF fails → `IOException`, email **never** sent (`verify(mailSender, never()).send(...)`).
- `buildReceiptEmailBody` — string contains user name, plan, brand.
- Password reset uses `SimpleMailMessage` (simpler than MIME).

**Note:** Uses `@SpringBootTest` — loads more than needed for unit tests; interview answer: “Could refactor to `@ExtendWith(MockitoExtension.class)` for speed.”

---

### 5.5 `PdfServiceTest.java` & `PdfEmailIntegrationTest.java`

**Unit (`PdfServiceTest`):**

- `new PdfService()` — no Spring.
- Assert PDF starts with `%PDF` (magic bytes).
- Size between 1KB and 1MB.
- Edge cases: null phone, null session limit.

**Integration (`PdfEmailIntegrationTest`):**

- `@SpringBootTest` + `@ActiveProfiles("test")`.
- `@Autowired PdfService` — real bean.
- Multiple plan types, structure checks (`%%EOF`, `stream`).

**Difference interview answer:**

- Unit: one class, fast, no Spring.
- Integration: Spring context, real wiring, catches config/bean issues.

---

## 6. Playwright — Deep Dive

### 6.1 What is Playwright?

Playwright **controls a real browser** (Chromium, Firefox, WebKit) with code. It clicks buttons, fills forms, checks text — like a robot user.

**E2E** = end-to-end = full path through UI.

Your config: `Client/playwright.config.ts`

### 6.2 File layout

| File | Role |
|------|------|
| `playwright.config.ts` | Global settings (URL, timeout, browser) |
| `e2e/*.spec.ts` | Actual tests |
| `package.json` scripts | `test:e2e`, `test:e2e:ui`, `test:e2e:headed` |

### 6.3 `playwright.config.ts` — every option explained

```typescript
testDir: "./e2e"           // where *.spec.ts live
forbidOnly: !!process.env.CI  // CI fails if you leave test.only()
retries: CI ? 2 : 0          // retry flaky tests on CI only
workers: 1                   // one test at a time (avoids Next.js race)
timeout: 60_000              // max 60s per test
reporter: [["html"], ["list"]]  // HTML report + console list
use: {
  baseURL: "http://localhost:3000"  // goto("/") → full URL
  navigationTimeout: 30_000
  trace: "on-first-retry"    // debug recording on retry
  screenshot: "only-on-failure"
}
projects: [{ name: "chromium", use: Desktop Chrome }]
webServer: {
  command: "npm run dev",
  url: "http://localhost:3000",
  reuseExistingServer: !CI  // use already-running dev server locally
}
```

### 6.4 Test structure

```typescript
import { test, expect, Page } from "@playwright/test"

test.describe("Group name", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/")
  })

  test("does something", async ({ page }) => {
    await expect(page.getByText("Hello")).toBeVisible()
  })
})
```

| Piece | Meaning |
|-------|---------|
| `test.describe` | Group related tests |
| `test.beforeEach` | Runs before each test in group |
| `test` / `test.only` / `test.skip` | Single case / run only this / skip |
| `{ page }` | Fresh browser tab per test |
| `expect(locator)` | Assertion (auto-waits) |

### 6.5 Locators — finding elements (priority order)

**Playwright wants you to find elements like users do (accessibility first):**

| API | Finds | Example |
|-----|-------|---------|
| `page.getByRole(role, { name })` | Buttons, links, headings | `getByRole("button", { name: /Sign In/i })` |
| `page.getByLabel(text)` | Input linked to label | `getByLabel("Email Address")` |
| `page.getByText(text)` | Visible text | `getByText("Master Any Subject")` |
| `page.getByPlaceholder` | placeholder attr | |
| `page.getByTestId("id")` | `data-testid` | best for stable tests |
| `page.locator("css")` | CSS selector | use when others fail |
| `page.getByRole("navigation").getByRole("link", { name: "Features" })` | **Chaining** — narrow scope | your navbar helper |

**Regex names:** `/Sign In/i` = case-insensitive match.

### 6.6 Actions — things you do

| Action | What it does | Your code |
|--------|--------------|-----------|
| `page.goto(url, { waitUntil })` | Navigate | `domcontentloaded` for Next.js |
| `locator.click()` | Click | Sign In, navbar links |
| `locator.fill(value)` | Clear + type | email/password |
| `locator.press("Enter")` | Key press | |
| `locator.check()` / `uncheck()` | Checkbox | |
| `locator.selectOption()` | Dropdown | |
| `page.goBack()` | Browser back | |
| `page.reload()` | Refresh | |

**Auto-wait:** Playwright waits until element is actionable before click/fill (big difference from raw Selenium).

### 6.7 Assertions — `expect`

| Assertion | Checks |
|-----------|--------|
| `await expect(locator).toBeVisible()` | On screen |
| `await expect(locator).toBeHidden()` | Not visible |
| `await expect(locator).toHaveText("x")` | Text content |
| `await expect(locator).toHaveAttribute("href", "/path")` | HTML attribute |
| `await expect(page).toHaveURL(/\/auth\/login/)` | Current URL (regex ok) |
| `await expect(page).toHaveTitle(/Nerds/)` | Document title |
| `await expect(locator).toBeEnabled()` | Not disabled |
| `await expect(locator).toHaveCount(3)` | Number of matches |

**Timeouts:**

```typescript
await expect(page.getByText("Hero")).toBeVisible({ timeout: 15_000 })
```

### 6.8 Waiting strategies (interview gold)

| Strategy | When |
|----------|------|
| Auto-wait on `expect` | Preferred — built-in retry |
| `waitUntil: "domcontentloaded"` | Next.js fast paint (your `goto` helper) |
| `page.waitForURL(...)` | After login redirect |
| `page.waitForSelector()` | Legacy; prefer expect |
| **Avoid** `page.waitForTimeout(5000)` | Flaky; fixed sleep |

### 6.9 Other Playwright features (know names)

| Feature | Purpose |
|---------|---------|
| `test.use({ storageState })` | Reuse login cookies |
| `page.context().storageState()` | Save auth state |
| `test.step("label", async () => {})` | Report steps |
| `trace viewer` | Replay failure (`npx playwright show-trace`) |
| `--ui` mode | Visual test runner |
| `--headed` | See browser |
| `PWDEBUG=1` | Slow motion (your config `slowMo`) |
| Fixtures | Custom `test.extend` for logged-in page |
| API testing | `request` context for REST without UI |
| Parallel | `workers: N` when app supports it |

### 6.10 Playwright vs Selenium (common interview)

| | Playwright | Selenium |
|--|------------|----------|
| Auto-wait | Built-in | Manual waits often |
| Speed | Faster, modern | Older WebDriver |
| Browser control | Own protocol | WebDriver standard |
| Test runner | Built-in | Needs JUnit/TestNG etc. |

---

## 7. Your Playwright Tests — Line by Line

### 7.1 Shared helper `goto`

```typescript
async function goto(page: Page, path: string) {
  await page.goto(path, { waitUntil: "domcontentloaded" })
}
```

**Why?** Next.js dev server compiles pages; `"load"` waits for all images — flaky. `domcontentloaded` = HTML ready.

### 7.2 `landing.spec.ts`

| Test | What it proves |
|------|----------------|
| Hero heading | Marketing text visible after auth check |
| Start Learning Now | Link `href` = `/auth/register?role=student` |
| Sign In | Navbar scoped click → `/auth/login` + “Welcome Back” |

**Pattern:** `getByRole("navigation")` avoids duplicate footer links.

### 7.3 `auth-login.spec.ts`

| Test | Needs backend? |
|------|----------------|
| Form visible | No |
| Empty submit → validation errors | No (client-side) |
| Invalid email format | No |
| Forgot password / Create account links | No |
| **Full login → dashboard** | **Yes** — API on `:8080` |

Login flow fills labels, clicks Sign In, `expect(page).toHaveURL(/\/dashboard/)`.

### 7.4 `navigation.spec.ts`

- Features, Pricing, About from navbar.
- `/dashboard` without login → redirect to `/auth/login` (auth guard).

### 7.5 Running Playwright

```bash
cd Client
npm run test:e2e          # headless
npm run test:e2e:ui       # interactive UI — best for learning
npm run test:e2e:headed   # see browser
```

**Prerequisites:**

1. Frontend: config starts `npm run dev` OR you run it yourself.
2. Login test: backend on `http://localhost:8080`.

---

## 8. JMeter — Deep Dive

### 8.1 What is JMeter?

Apache JMeter pretends to be **many users** sending HTTP requests to your server.

- **Functional test:** “Does `/health` return UP?” (can do in JMeter)
- **Load test:** “Can 10 users × 3 loops handle `/plans` without dying?”

### 8.2 Core concepts

| Term | Simple meaning |
|------|----------------|
| **Test Plan** | Whole recipe |
| **Thread Group** | How many fake users, how fast they start, how many loops |
| **Sampler** | One request (GET /health) |
| **Listener** | Shows results (tree, summary, HTML report) |
| **Assertion** | Pass/fail on response body or status code |
| **Config Element** | Shared settings (host, headers) |

### 8.3 Your thread group settings

From `NerdsOnCall-LoadTest.jmx`:

- **10 threads** = 10 virtual users
- **5 second ramp-up** = users start spread over 5s (not all at once)
- **3 loops** = each user runs all samplers 3 times
- **Total samples (rough):** 10 users × 3 loops × 4 endpoints = **120 requests** (plus think time if added)

### 8.4 HTTP pieces in your plan

| Sampler | Method | Assertions |
|---------|--------|------------|
| `/health` | GET | Body contains `UP`, status 200 |
| `/info` | GET | Body contains `NerdsOnCall` |
| `/plans` | GET | Status 200 |
| `/auth/login` | POST JSON | Body contains `token` |

**Variables:**

- `SERVER_HOST` = localhost
- `SERVER_PORT` = 8080
- `TEST_EMAIL`, `TEST_PASSWORD` — passed from `run-load-test.bat` via `-J` flags

### 8.5 Metrics in HTML report (interview)

| Metric | Meaning |
|--------|---------|
| **Throughput** | Requests per second |
| **Response time (avg/p90/p95)** | How slow |
| **Error %** | Failed requests |
| **Latency** | Time to first byte |
| **Connect time** | TCP handshake |

### 8.6 GUI vs CLI

| Mode | Command | When |
|------|---------|------|
| GUI | `jmeter.bat` → open JMX → green play | Building/debugging |
| CLI (non-GUI) | `jmeter -n -t plan.jmx -l results.jtl -e -o report/` | Real load test |

**Rule:** Big load tests = CLI only (GUI eats memory).

### 8.7 JMeter vs other tools

| Tool | Type |
|------|------|
| JMeter | Load, protocol-level |
| Playwright | Browser E2E |
| Postman | Manual/API collections |
| k6/Gatling | Code-based load (modern) |

---

## 9. Your JMeter Load Test — Line by Line

### 9.1 `run-load-test.bat` flow

1. Check JMeter installed at `C:\apache-jmeter-5.6.3`
2. Default or env `TEST_EMAIL` / `TEST_PASSWORD`
3. `curl` `/health` — **fail early** if backend down
4. Delete old `results.jtl` and `html-report` (JMeter won’t overwrite)
5. Run:

```bat
jmeter.bat -n -t NerdsOnCall-LoadTest.jmx -l results\results.jtl ^
  -JTEST_EMAIL=... -JTEST_PASSWORD=... -e -o results\html-report
```

6. Open `jmeter/results/html-report/index.html`

### 9.2 Login POST body

```json
{"email":"${__P(TEST_EMAIL,...)}","password":"${__P(TEST_PASSWORD)}"}
```

`${__P(...)}` = read JMeter **property** from `-J` on command line.

### 9.3 Before running

```bash
cd Server
mvn spring-boot:run
```

Then in another terminal:

```powershell
cd jmeter
$env:TEST_EMAIL="you@email.com"; $env:TEST_PASSWORD="secret"; .\run-load-test.bat
```

---

## 10. How to Run Everything

### Java (Server)

```bash
cd Server
mvn test                           # all tests
mvn test -Dtest=AuthServiceTest    # one class
mvn test -Dtest=AuthServiceTest#login_success_returnsJwtToken  # one method
```

### Playwright (Client)

```bash
cd Client
npx playwright install   # first time — downloads browsers
npm run test:e2e
```

### JMeter

```bash
# Backend running first
cd jmeter
.\run-load-test.bat
```

---

## 11. Interview Question Bank

### A. Testing fundamentals

**Q: What is unit vs integration vs E2E?**  
A: Unit = one class isolated with mocks. Integration = several real parts (Spring context). E2E = real browser user journey. We use all three: `AuthServiceTest`, `PdfEmailIntegrationTest`, Playwright.

**Q: What is the testing pyramid?**  
A: Many fast unit tests at bottom, fewer integration, fewest E2E at top — balance speed and confidence.

**Q: What is AAA?**  
A: Arrange, Act, Assert — structure every test clearly.

**Q: What is TDD?**  
A: Test-Driven Development — write test first, then code to pass. We mostly wrote tests after code here, but same tools apply.

**Q: Code coverage — 100%?**  
A: No — coverage shows lines hit, not quality. Focus on business rules (login, subscription limits, payment signature).

---

### B. JUnit 5

**Q: JUnit 4 vs 5?**  
A: JUnit 5 = Jupiter, `org.junit.jupiter`, `@ExtendWith` instead of `@RunWith`, lambda-friendly `assertThrows`, better extensions.

**Q: `@BeforeEach` vs `@BeforeAll`?**  
A: Before each test vs once per class. Use `@BeforeAll` only for expensive static setup (must be static method).

**Q: How do you test exceptions?**  
A: `assertThrows(RuntimeException.class, () -> service.method())` then assert message.

**Q: `@DisplayName` purpose?**  
A: Readable report names for humans and CI dashboards.

**Q: Parameterized tests?**  
A: `@ParameterizedTest` + `@CsvSource` or `@MethodSource` — one test, many inputs (good for validation rules).

---

### C. Mockito

**Q: What is Mockito?**  
A: Library to create mocks, stub return values, verify interactions.

**Q: `@Mock` vs `@InjectMocks`?**  
A: Mock = fake dependency. InjectMocks = real class under test with mocks injected into its fields/constructor.

**Q: `when` vs `verify`?**  
A: `when` = setup behavior before act. `verify` = check mock was called after act.

**Q: Difference between mock and spy?**  
A: Mock = all fake unless stubbed. Spy = real object, stub only some methods.

**Q: What is `ArgumentCaptor`?**  
A: Captures argument passed to mock method for detailed assertions — we used it on `subscriptionRepository.save()`.

**Q: `eq()` vs `any()`?**  
A: `eq` requires exact match; `any` accepts anything — use `eq` when value matters for behavior.

**Q: How to test void methods?**  
A: `verify(mock).voidMethod()` or `doThrow(...).when(mock).voidMethod()`.

**Q: Static/final mocking?**  
A: Hard with plain Mockito; need `mockito-inline` or redesign. Prefer not mocking statics.

**Q: Why mock `UserService` but test real `AuthService`?**  
A: We trust `UserService` has its own tests; `AuthService` tests focus on orchestration and rules.

---

### D. Spring testing

**Q: `@SpringBootTest`?**  
A: Boots full application context — integration tests, slower.

**Q: `@WebMvcTest` / `@DataJpaTest`?**  
A: Slice tests — only MVC layer or only JPA — faster than full boot.

**Q: `ReflectionTestUtils`?**  
A: Set private `@Value` fields without starting Spring — used in `AuthServiceTest` and `PaymentServiceTest`.

**Q: Testcontainers?**  
A: Docker DB for realistic integration tests — we don’t use it yet; H2 or mocks instead.

---

### E. Your domain-specific questions

**Q: How do you test login without a database?**  
A: Mock `UserService.findByEmail` and `JwtUtil.generateToken`, verify `AuthenticationManager.authenticate` called.

**Q: How do you test Razorpay payment verification?**  
A: Inject test secret, compute HMAC locally, assert `verifyOrder` true/false — no live API.

**Q: Why doesn’t forgot password throw for unknown email?**  
A: Security — prevent user enumeration; test asserts no save and no email.

**Q: How do you test PDF generation?**  
A: Assert byte array not null, starts with `%PDF`, reasonable size; optional save to file for manual check.

---

### F. Playwright

**Q: What is Playwright?**  
A: Microsoft’s browser automation for E2E tests — auto-wait, multi-browser, built-in test runner.

**Q: Locator best practices?**  
A: `getByRole`, `getByLabel`, `getByText` before CSS; chain from `navigation` to avoid duplicates.

**Q: How do you handle flaky tests?**  
A: Use `expect` not `sleep`, `domcontentloaded`, increase timeout for slow pages, `retries` on CI, `trace on-first-retry`.

**Q: `baseURL` benefit?**  
A: `page.goto("/auth/login")` instead of full URL — switch env easily.

**Q: `webServer` in config?**  
A: Playwright starts `npm run dev` before tests — CI doesn’t forget to start frontend.

**Q: How to test login in E2E?**  
A: Fill by label, click button, `expect(page).toHaveURL(/dashboard/)` — needs real backend.

**Q: How to reuse login across tests?**  
A: Save `storageState` after one login, `test.use({ storageState: 'auth.json' })`.

**Q: Playwright vs Cypress?**  
A: Playwright = multi-tab, multi-browser, faster parallel; Cypress = developer-friendly but mainly Chromium, different architecture.

**Q: API testing in Playwright?**  
A: `request.newContext()` — hit REST directly, faster than UI for some cases.

---

### G. JMeter

**Q: What is JMeter used for?**  
A: Performance and load testing — simulate many users, measure response times and errors.

**Q: Thread group parameters?**  
A: Threads = users, ramp-up = start spread, loops = repeat count.

**Q: What is a sampler?**  
A: One HTTP request (or FTP, JDBC, etc.).

**Q: What is an assertion in JMeter?**  
A: Validates response — we check `UP`, `200`, `token` in body.

**Q: Why non-GUI mode for load tests?**  
A: GUI consumes memory/CPU; CLI (`-n`) is stable for real load.

**Q: What is `.jtl` file?**  
A: Raw results log — used to generate HTML dashboard (`-e -o`).

**Q: Throughput vs response time?**  
A: Throughput = how many requests/sec server handles; response time = how long one request takes — both matter.

**Q: How do you find bottlenecks?**  
A: Increase threads, watch error % and p95 latency spike; profile DB/API; compare before/after deploy.

**Q: JMeter vs Postman?**  
A: Postman = dev-friendly API calls; JMeter = concurrency and metrics at scale.

---

### H. “Tell me about your project” (30-second pitch)

> “NerdsOnCall uses a three-layer test strategy. On the backend I wrote JUnit 5 unit tests with Mockito for `AuthService` and `SubscriptionService` — mocking repositories and email so tests run fast. Payment verification is tested with real HMAC logic and injected secrets. PDF and email have both isolated unit tests and a Spring Boot integration test. On the frontend, Playwright E2E tests cover the landing page, login validation, navigation, and auth redirects using role-based locators and `domcontentloaded` for Next.js stability. For performance, a JMeter plan hits health, info, plans, and login with 10 threads and generates an HTML report.”

---

## Quick Cheat Sheet (print this)

### JUnit

```java
@ExtendWith(MockitoExtension.class)
@BeforeEach void setUp() {}
@Test @DisplayName("...") void name() {}
assertEquals assertTrue assertFalse assertNotNull
assertThrows assertDoesNotThrow
```

### Mockito

```java
@Mock @InjectMocks
when(x.method()).thenReturn(y);
verify(x).method(); verify(x, never()).method();
ArgumentCaptor<T> c = ArgumentCaptor.forClass(T.class);
```

### Playwright

```typescript
page.goto path
getByRole getByLabel getByText
click fill
expect(...).toBeVisible toHaveURL toHaveAttribute
```

### JMeter

```
Thread Group → HTTP Samplers → Assertions → Listeners
CLI: jmeter -n -t plan.jmx -l out.jtl -e -o report/
```

---

## Security note (important)

Some test files contain **real email/password** for local practice (`auth-login.spec.ts`, JMeter variables). For public repos or interviews, say:

- “Credentials are test-only and should live in environment variables, not source control.”
- Use `process.env.TEST_USER_EMAIL` in Playwright and `-JTEST_PASSWORD` for JMeter.

---

*Last updated for the NerdsOnCall repo structure: JUnit/Mockito in `Server/`, Playwright in `Client/e2e/`, JMeter in `jmeter/`.*
