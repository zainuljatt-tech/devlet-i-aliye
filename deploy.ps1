# Run after: gh auth login
$ErrorActionPreference = "Stop"
$env:Path = "C:\Program Files\Git\bin;C:\Program Files\GitHub CLI;" + $env:Path
Set-Location $PSScriptRoot

$repo = "zainuljatt-tech/devlet-i-aliye"

git init -b main 2>$null
git add index.html hakkimizda.html misyon.html galeri.html teskilat.html iletisim.html style.css main.js netlify.toml .gitignore .github images/logo.png images/koy.png.jpeg images/ayasofya.png.jpeg "images/WhatsApp Image 2026-05-25 at 21.42.42.jpeg" "images/WhatsApp Image 2026-05-25 at 22.26.43.jpeg" "images/WhatsApp Image 2026-05-25 at 22.26.45.jpeg"
git commit -m "Deploy Devlet-i Aliyye website" 2>$null
if ($LASTEXITCODE -ne 0) { git commit --allow-empty -m "Deploy Devlet-i Aliyye website" }

gh repo create devlet-i-aliye --public --source=. --remote=origin --push 2>$null
if ($LASTEXITCODE -ne 0) {
  git remote remove origin 2>$null
  git remote add origin "https://github.com/$repo.git"
  git push -u origin main
}

gh api repos/zainuljatt-tech/devlet-i-aliye/pages -X POST -f build_type=workflow -f source[branch]=main -f source[path]=/ 2>$null

Write-Host ""
Write-Host "Site will be live at:"
Write-Host "https://zainuljatt-tech.github.io/devlet-i-aliye/"
Write-Host ""
Write-Host "If Pages is not enabled yet, open:"
Write-Host "https://github.com/zainuljatt-tech/devlet-i-aliye/settings/pages"
Write-Host "Source: GitHub Actions"
