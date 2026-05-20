@echo off
REM Run NerdsOnCall JMeter load test (non-GUI mode)
REM
REM STEP 1 — Start backend FIRST (separate terminal):
REM   cd c:\Coding\NerdsOnCall\Server
REM   mvn spring-boot:run
REM
REM STEP 2 — Set your login credentials (PowerShell):
REM   $env:TEST_EMAIL="your@email.com"; $env:TEST_PASSWORD="yourpassword"; .\run-load-test.bat
REM
REM Or set them inline in CMD before running:
REM   set TEST_EMAIL=your@email.com
REM   set TEST_PASSWORD=yourpassword
REM   run-load-test.bat

set JMETER_HOME=C:\apache-jmeter-5.6.3
set SCRIPT_DIR=%~dp0

if not exist "%JMETER_HOME%\bin\jmeter.bat" (
    echo ERROR: JMeter not found at %JMETER_HOME%
    exit /b 1
)

REM Default credentials — override by setting TEST_EMAIL / TEST_PASSWORD env vars
if not defined TEST_EMAIL set TEST_EMAIL=shivamhippalgave@gmail.com
if not defined TEST_PASSWORD set TEST_PASSWORD=Shiv@123

echo.
echo Checking backend at http://localhost:8080/health ...
curl -sf http://localhost:8080/health >nul 2>&1
if errorlevel 1 (
    echo.
    echo ERROR: Backend is NOT running on port 8080.
    echo Start it first:  cd c:\Coding\NerdsOnCall\Server  ^&^&  mvn spring-boot:run
    echo.
    exit /b 1
)
echo Backend is UP.

if not exist "%SCRIPT_DIR%results" mkdir "%SCRIPT_DIR%results"

REM JMeter refuses to overwrite previous result files on re-runs
if exist "%SCRIPT_DIR%results\results.jtl" del /f /q "%SCRIPT_DIR%results\results.jtl"
if exist "%SCRIPT_DIR%results\html-report" (
    echo Cleaning old html-report folder...
    rmdir /s /q "%SCRIPT_DIR%results\html-report"
)

echo.
echo Running load test with user: %TEST_EMAIL%
echo.

"%JMETER_HOME%\bin\jmeter.bat" -n ^
    -t "%SCRIPT_DIR%NerdsOnCall-LoadTest.jmx" ^
    -l "%SCRIPT_DIR%results\results.jtl" ^
    -JTEST_EMAIL=%TEST_EMAIL% ^
    -JTEST_PASSWORD=%TEST_PASSWORD% ^
    -e -o "%SCRIPT_DIR%results\html-report"

if errorlevel 1 (
    echo.
    echo JMeter finished with errors. Check results above.
    exit /b 1
)

echo.
echo Done. Open %SCRIPT_DIR%results\html-report\index.html for the report.
