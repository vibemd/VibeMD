# PowerShell script to test VibeMD Windows build
# Run this from the out/VibeMD-win32-x64 directory

Write-Host "=== VibeMD Windows Build Test ===" -ForegroundColor Cyan
Write-Host ""

# Check current directory
$currentDir = Get-Location
Write-Host "Current directory: $currentDir" -ForegroundColor Yellow

# Check if VibeMD.exe exists
if (Test-Path ".\VibeMD.exe") {
    Write-Host "[✓] VibeMD.exe found" -ForegroundColor Green
    $exeInfo = Get-Item ".\VibeMD.exe"
    Write-Host "    Size: $([math]::Round($exeInfo.Length / 1MB, 2)) MB" -ForegroundColor Gray
} else {
    Write-Host "[✗] VibeMD.exe NOT FOUND" -ForegroundColor Red
    Write-Host "    Please run this script from the out/VibeMD-win32-x64 directory" -ForegroundColor Red
    exit 1
}

# Check if icudtl.dat exists
if (Test-Path ".\icudtl.dat") {
    Write-Host "[✓] icudtl.dat found" -ForegroundColor Green
    $icuInfo = Get-Item ".\icudtl.dat"
    Write-Host "    Size: $([math]::Round($icuInfo.Length / 1MB, 2)) MB" -ForegroundColor Gray
} else {
    Write-Host "[✗] icudtl.dat NOT FOUND - ICU error expected!" -ForegroundColor Red
}

# Check if locales folder exists
if (Test-Path ".\locales") {
    $localeCount = (Get-ChildItem ".\locales" -Filter "*.pak").Count
    Write-Host "[✓] locales folder found with $localeCount locale files" -ForegroundColor Green
} else {
    Write-Host "[✗] locales folder NOT FOUND - ICU error expected!" -ForegroundColor Red
}

# Check resources folder
if (Test-Path ".\resources\app.asar") {
    Write-Host "[✓] resources/app.asar found" -ForegroundColor Green
    $asarInfo = Get-Item ".\resources\app.asar"
    Write-Host "    Size: $([math]::Round($asarInfo.Length / 1MB, 2)) MB" -ForegroundColor Gray
} else {
    Write-Host "[✗] resources/app.asar NOT FOUND" -ForegroundColor Red
}

Write-Host ""
Write-Host "=== Launching VibeMD ===" -ForegroundColor Cyan
Write-Host "Watch for ICU-related console output..." -ForegroundColor Yellow
Write-Host ""
Write-Host "Expected console output:" -ForegroundColor Gray
Write-Host "  [ICU] Pre-Electron ICU configuration for Windows x64" -ForegroundColor DarkGray
Write-Host "  [ICU] ✓ ICU data file found: <path>\icudtl.dat" -ForegroundColor DarkGray
Write-Host "  [ICU] ✓ File size: 10467680 bytes" -ForegroundColor DarkGray
Write-Host "  [ICU] ✓ Set ICU_DATA_FILE environment variable" -ForegroundColor DarkGray
Write-Host "  [ICU] ✓ Set command line switch icu-data-dir: <path>" -ForegroundColor DarkGray
Write-Host ""
Write-Host "If you see 'Invalid file descriptor to ICU data received', the fix didn't work." -ForegroundColor Yellow
Write-Host ""

# Redirect stderr to a file to capture errors
Write-Host "Launching VibeMD.exe (redirecting stderr to errors.txt)..." -ForegroundColor Cyan
Start-Process ".\VibeMD.exe" -RedirectStandardError "errors.txt" -NoNewWindow -PassThru

# Wait a moment and check for errors
Start-Sleep -Seconds 3

if (Test-Path "errors.txt") {
    $errors = Get-Content "errors.txt" -Raw
    if ($errors -match "Invalid file descriptor to ICU") {
        Write-Host ""
        Write-Host "[✗] ICU ERROR DETECTED!" -ForegroundColor Red
        Write-Host ""
        Write-Host "Error content:" -ForegroundColor Yellow
        Write-Host $errors -ForegroundColor Red
    } elseif ($errors.Trim().Length -gt 0) {
        Write-Host ""
        Write-Host "[!] Some errors detected:" -ForegroundColor Yellow
        Write-Host $errors -ForegroundColor Yellow
    } else {
        Write-Host ""
        Write-Host "[✓] No ICU errors in stderr (first 3 seconds)" -ForegroundColor Green
        Write-Host "    Check the application console for ICU confirmation messages" -ForegroundColor Gray
    }
}

Write-Host ""
Write-Host "=== Test Complete ===" -ForegroundColor Cyan
