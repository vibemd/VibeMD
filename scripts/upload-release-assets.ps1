Param(
  [Parameter(Mandatory=$true)][string]$Version,
  [Parameter(Mandatory=$true,ValueFromRemainingArguments=$true)][string[]]$Files
)

$ErrorActionPreference = 'Stop'
if (-not (Get-Command gh -ErrorAction SilentlyContinue)) {
  Write-Error "GitHub CLI 'gh' not found. Install from https://cli.github.com/ and run 'gh auth login'."
}

$tag = "v$Version"
Write-Host "Ensuring release $tag exists..."
if (-not (gh release view $tag 2>$null)) {
  gh release create $tag --title "VibeMD $Version" --generate-notes | Out-Null
}

Write-Host "Uploading assets to $tag..."
gh release upload $tag @Files --clobber
Write-Host "Done."

