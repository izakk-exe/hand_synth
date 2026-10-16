@echo off
REM =====================================================================
REM  Palma — clean build artifacts
REM  Built by 1Z4K
REM =====================================================================
setlocal EnableExtensions
title Palma — clean

set "SCRIPT_DIR=%~dp0"
set "SCRIPT_DIR=%SCRIPT_DIR:~0,-1%"
pushd "%SCRIPT_DIR%\.." >nul
set "ROOT=%CD%"
popd >nul

echo this will delete:
echo   %ROOT%\node_modules
echo   %ROOT%\dist
echo   %ROOT%\vendor
echo   %SCRIPT_DIR%\output
echo.
set /p CONFIRM="type YES to continue: "
if /i not "%CONFIRM%"=="YES" (
    echo cancelled.
    pause
    exit /b 0
)

if exist "%ROOT%\node_modules"   rmdir /s /q "%ROOT%\node_modules"
if exist "%ROOT%\dist"           rmdir /s /q "%ROOT%\dist"
if exist "%ROOT%\vendor"         rmdir /s /q "%ROOT%\vendor"
if exist "%SCRIPT_DIR%\output"   rmdir /s /q "%SCRIPT_DIR%\output"

echo clean. run BUILD.bat to rebuild.
pause
