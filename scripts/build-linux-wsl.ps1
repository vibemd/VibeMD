Param(
  [string]$Distro = "Ubuntu",
  [string]$Arch = "x64"
)

$ErrorActionPreference = 'Stop'
if (-not (Get-Command wsl -ErrorAction SilentlyContinue)) {
  Write-Error "WSL not found. Enable Windows Subsystem for Linux and install a distro (e.g., Ubuntu)."
}

$repoWin = (Resolve-Path '.').Path
$repoWsl = & wsl -d $Distro bash -lc "wslpath -a \"$repoWin\"" 2>$null
if (-not $repoWsl) {
  $repoWsl = & wsl bash -lc "wslpath -a \"$repoWin\""
}

Write-Host "WSL Distro: $Distro"
Write-Host "Repo (Windows): $repoWin"
Write-Host "Repo (WSL): $repoWsl"

Write-Host "Installing Linux packaging tools if needed..."
& wsl -d $Distro bash -lc "sudo apt-get update -y && sudo apt-get install -y build-essential fakeroot dpkg-dev rpm" | Out-Host

Write-Host "Building Linux ($Arch) via WSL..."
& wsl -d $Distro bash -lc "set -euo pipefail; cd $repoWsl && npm install --no-audit --no-fund && npm run build:linux-$Arch" | Out-Host

Write-Host "Done. Artifacts should be under out/make/deb/$Arch and out/make/rpm/$Arch"

