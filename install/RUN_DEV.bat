@echo off
REM =====================================================================
REM  Palma — run without packing (dev launch)
REM  Built by 1Z4K
REM =====================================================================
setlocal EnableExtensions
title Palma — dev run

set "SCRIPT_DIR=%~dp0"
set "SCRIPT_DIR=%SCRIPT_DIR:~0,-1%"
pushd "%SCRIPT_DIR%\.." >nul
set "ROOT=%CD%"
popd >nul

where node >nul 2>nul
if %errorlevel% neq 0 (
    echo node.js not installed. run BUILD.bat first.
    pause
    exit /b 1
)

pushd "%ROOT%"

if not exist vendor\hands.js (
    node fetch_vendor.js
    if %errorlevel% neq 0 (
        popd
        pause
        exit /b 1
    )
)

if not exist node_modules (
    call npm install
    if %errorlevel% neq 0 (
        popd
        pause
        exit /b 1
    )
)

call npx electron .
popd
