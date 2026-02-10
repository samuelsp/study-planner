# Study Planner - Docker Helper Script (Windows PowerShell)
# ==========================================================

function Write-Header {
    Write-Host "================================" -ForegroundColor Blue
    Write-Host "  Study Planner - Docker" -ForegroundColor Blue
    Write-Host "================================" -ForegroundColor Blue
}

function Write-Success {
    param([string]$Message)
    Write-Host "✓ $Message" -ForegroundColor Green
}

function Write-Error {
    param([string]$Message)
    Write-Host "✗ $Message" -ForegroundColor Red
}

function Write-Info {
    param([string]$Message)
    Write-Host "ℹ $Message" -ForegroundColor Yellow
}

function Build-Images {
    Write-Header
    Write-Info "Building Docker images..."
    docker-compose build
    if ($LASTEXITCODE -eq 0) {
        Write-Success "Build completed!"
    } else {
        Write-Error "Build failed!"
        exit 1
    }
}

function Start-Production {
    Write-Header
    Write-Info "Starting application in PRODUCTION mode..."
    docker-compose up -d
    if ($LASTEXITCODE -eq 0) {
        Write-Success "Application started!"
        Write-Info "Frontend: http://localhost:3000"
        Write-Info "Backend: http://localhost:4000"
    } else {
        Write-Error "Failed to start application!"
        exit 1
    }
}

function Start-Development {
    Write-Header
    Write-Info "Starting application in DEVELOPMENT mode..."
    docker-compose -f docker-compose.yml -f docker-compose.dev.yml up
}

function Stop-Application {
    Write-Header
    Write-Info "Stopping application..."
    docker-compose down
    if ($LASTEXITCODE -eq 0) {
        Write-Success "Application stopped!"
    }
}

function Show-Logs {
    Write-Header
    Write-Info "Showing logs (Ctrl+C to exit)..."
    docker-compose logs -f
}

function Show-Status {
    Write-Header
    docker-compose ps
}

function Clean-Resources {
    Write-Header
    Write-Info "Cleaning Docker resources..."
    $response = Read-Host "⚠️  This will remove containers and volumes. Continue? (y/N)"
    if ($response -eq 'y' -or $response -eq 'Y') {
        docker-compose down -v
        Write-Success "Cleaned!"
    } else {
        Write-Info "Cancelled"
    }
}

function Reset-Database {
    Write-Header
    Write-Info "Resetting database..."
    docker exec -it study-planner-backend npx prisma migrate reset --force
    if ($LASTEXITCODE -eq 0) {
        Write-Success "Database reset!"
    } else {
        Write-Error "Failed to reset database!"
    }
}

function Show-Menu {
    Write-Header
    Write-Host ""
    Write-Host "Usage: .\docker.ps1 [command]"
    Write-Host ""
    Write-Host "Commands:"
    Write-Host "  build        Build Docker images"
    Write-Host "  start        Start in production mode"
    Write-Host "  dev          Start in development mode"
    Write-Host "  stop         Stop all containers"
    Write-Host "  logs         Show logs (follow mode)"
    Write-Host "  status       Show containers status"
    Write-Host "  clean        Remove containers and volumes"
    Write-Host "  reset-db     Reset database"
    Write-Host "  help         Show this menu"
    Write-Host ""
}

# Main Script
param(
    [Parameter(Position=0)]
    [string]$Command
)

switch ($Command) {
    "build" {
        Build-Images
        break
    }
    "start" {
        Start-Production
        break
    }
    "dev" {
        Start-Development
        break
    }
    "stop" {
        Stop-Application
        break
    }
    "logs" {
        Show-Logs
        break
    }
    "status" {
        Show-Status
        break
    }
    "clean" {
        Clean-Resources
        break
    }
    "reset-db" {
        Reset-Database
        break
    }
    default {
        Show-Menu
        break
    }
}
