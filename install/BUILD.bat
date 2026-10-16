@echo off
REM =====================================================================
REM  hand synth — one-click build (install bay)
REM  Built by 1Z4K
REM =====================================================================
REM  double-click this file. it does the whole job:
REM    1) checks for node.js, auto-installs it via winget if missing
REM    2) downloads mediapipe + tone.js into vendor/
REM    3) installs electron + electron-builder (local, in the project)
REM    4) packs the Windows installer + portable .exe
REM    5) copies the finished exes to this install/ folder
REM =====================================================================

setlocal EnableExtensions EnableDelayedExpansion
title Hand Synth — build by 1Z4K

REM project root is one level up from this install bay
set "SCRIPT_DIR=%~dp0"
set "SCRIPT_DIR=%SCRIPT_DIR:~0,-1%"
pushd "%SCRIPT_DIR%\.." >nul
set "ROOT=%CD%"
popd >nul

echo.
echo  ============================================================
echo    HAND SYNTH  -  build bay
echo    project: %ROOT%
echo    built by 1Z4K
echo  ============================================================
echo.

REM ---------------------------------------------------------------------
REM  [1/5] node.js
REM ---------------------------------------------------------------------
echo [1/5] checking node.js...
where node >nul 2>nul
if %errorlevel%==0 (
    for /f "delims=" %%v in ('node -v') do echo       node found: %%v
    goto :node_ok
)

echo       node.js not found. trying winget...
where winget >nul 2>nul
if %errorlevel% neq 0 (
    echo.
    echo  ------------------------------------------------------------
    echo    node.js is not installed and winget is not available.
    echo    install node.js LTS manually:
    echo        https://nodejs.org/en/download
    echo    then double-click BUILD.bat again.
    echo  ------------------------------------------------------------
    pause
    exit /b 1
)

echo       installing node.js LTS via winget (accepts license automatically)...
winget install -e --id OpenJS.NodeJS.LTS --silent --accept-source-agreements --accept-package-agreements
if %errorlevel% neq 0 (
    echo.
    echo       winget install failed. install node.js manually:
    echo         https://nodejs.org/en/download
    pause
    exit /b 1
)

REM refresh PATH in this session so node is found right away
for /f "usebackq tokens=2,*" %%A in (`reg query "HKLM\SYSTEM\CurrentControlSet\Control\Session Manager\Environment" /v Path 2^>nul`) do set "SYSPATH=%%B"
for /f "usebackq tokens=2,*" %%A in (`reg query "HKCU\Environment" /v Path 2^>nul`) do set "USRPATH=%%B"
set "PATH=%SYSPATH%;%USRPATH%;%PATH%"

where node >nul 2>nul
if %errorlevel% neq 0 (
    echo       node installed but not on PATH yet. close this window,
    echo       open a NEW terminal, and run BUILD.bat again.
    pause
    exit /b 1
)
for /f "delims=" %%v in ('node -v') do echo       node installed: %%v

:node_ok
echo.

REM ---------------------------------------------------------------------
REM  [2/5] vendor libs
REM ---------------------------------------------------------------------
echo [2/5] fetching vendor libs (mediapipe + tone.js)...
pushd "%ROOT%"
node fetch_vendor.js
if %errorlevel% neq 0 (
    popd
    goto :fail
)
popd
echo.

REM ---------------------------------------------------------------------
REM  [3/5] npm install
REM ---------------------------------------------------------------------
echo [3/5] installing electron + electron-builder (first run takes a few minutes)...
pushd "%ROOT%"
if not exist node_modules (
    call npm install
    if %errorlevel% neq 0 (
        popd
        goto :fail
    )
) else (
    echo       node_modules already present, skipping install.
)
popd
echo.

REM ---------------------------------------------------------------------
REM  [4/5] pack
REM ---------------------------------------------------------------------
echo [4/5] packing windows .exe (nsis installer + portable)...
pushd "%ROOT%"
call npx electron-builder --win nsis portable --x64
if %errorlevel% neq 0 (
    popd
    goto :fail
)
popd
echo.

REM ---------------------------------------------------------------------
REM  [5/5] copy exes next to this script
REM ---------------------------------------------------------------------
echo [5/5] copying finished .exe files into install/...
if not exist "%SCRIPT_DIR%\output" mkdir "%SCRIPT_DIR%\output"
copy /y "%ROOT%\dist\HandSynth-*-x64-win.exe"    "%SCRIPT_DIR%\output\" >nul 2>nul
copy /y "%ROOT%\dist\HandSynth-*-portable.exe"   "%SCRIPT_DIR%\output\" >nul 2>nul
echo.

echo  ============================================================
echo    done. your .exe files:
echo.
dir /b "%SCRIPT_DIR%\output\*.exe"
echo.
echo    folder:  %SCRIPT_DIR%\output
echo    (full build output also in: %ROOT%\dist)
echo  ============================================================
echo    built by 1Z4K
echo.
pause
exit /b 0

:fail
echo.
echo  ------------------------------------------------------------
echo    build failed. scroll up for the error.
echo    common fixes:
echo      - run as administrator
echo      - disable antivirus temporarily (electron-builder writes
echo        a lot of files very fast; some AVs block it)
echo      - delete node_modules and dist, run again
echo  ------------------------------------------------------------
pause
exit /b 1
