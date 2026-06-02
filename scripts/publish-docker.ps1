$ErrorActionPreference = 'Stop'

$ImageName = if ($env:DOCKERHUB_USERNAME) {
  "$($env:DOCKERHUB_USERNAME)/community-care-board"
} else {
  'narnacle/community-care-board'
}

if (-not (Test-Path '.env')) {
  Write-Error '.env file not found. Create it from .env.example with your Supabase credentials.'
}

Get-Content '.env' | ForEach-Object {
  if ($_ -match '^\s*([^#=]+)=(.*)$') {
    $name = $matches[1].Trim()
    $value = $matches[2].Trim()
    Set-Item -Path "env:$name" -Value $value
  }
}

if (-not $env:VITE_SUPABASE_URL -or -not $env:VITE_SUPABASE_ANON_KEY) {
  Write-Error 'VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY must be set in .env'
}

Write-Host "Building $ImageName:latest ..."
docker build `
  --build-arg "VITE_SUPABASE_URL=$($env:VITE_SUPABASE_URL)" `
  --build-arg "VITE_SUPABASE_ANON_KEY=$($env:VITE_SUPABASE_ANON_KEY)" `
  -t "${ImageName}:latest" .

Write-Host "Pushing $ImageName:latest ..."
docker push "${ImageName}:latest"

Write-Host "Done. Image published to ${ImageName}:latest"
