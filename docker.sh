#!/bin/bash

# Study Planner - Docker Helper Script
# ====================================

set -e

# Cores para output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

function print_header() {
    echo -e "${BLUE}================================${NC}"
    echo -e "${BLUE}  Study Planner - Docker${NC}"
    echo -e "${BLUE}================================${NC}"
}

function print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

function print_error() {
    echo -e "${RED}✗ $1${NC}"
}

function print_info() {
    echo -e "${YELLOW}ℹ $1${NC}"
}

# Função: Build
function build() {
    print_header
    print_info "Building Docker images..."
    docker-compose build
    print_success "Build completed!"
}

# Função: Start Produção
function start_prod() {
    print_header
    print_info "Starting application in PRODUCTION mode..."
    docker-compose up -d
    print_success "Application started!"
    print_info "Frontend: http://localhost:3000"
    print_info "Backend: http://localhost:4000"
}

# Função: Start Desenvolvimento
function start_dev() {
    print_header
    print_info "Starting application in DEVELOPMENT mode..."
    docker-compose -f docker-compose.yml -f docker-compose.dev.yml up
}

# Função: Stop
function stop() {
    print_header
    print_info "Stopping application..."
    docker-compose down
    print_success "Application stopped!"
}

# Função: Logs
function logs() {
    print_header
    print_info "Showing logs (Ctrl+C to exit)..."
    docker-compose logs -f
}

# Função: Status
function status() {
    print_header
    docker-compose ps
}

# Função: Clean
function clean() {
    print_header
    print_info "Cleaning Docker resources..."
    read -p "⚠️  This will remove containers and volumes. Continue? (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        docker-compose down -v
        print_success "Cleaned!"
    else
        print_info "Cancelled"
    fi
}

# Função: Reset DB
function reset_db() {
    print_header
    print_info "Resetting database..."
    docker exec -it study-planner-backend npx prisma migrate reset --force
    print_success "Database reset!"
}

# Menu
function show_menu() {
    print_header
    echo ""
    echo "Usage: ./docker.sh [command]"
    echo ""
    echo "Commands:"
    echo "  build        Build Docker images"
    echo "  start        Start in production mode"
    echo "  dev          Start in development mode"
    echo "  stop         Stop all containers"
    echo "  logs         Show logs (follow mode)"
    echo "  status       Show containers status"
    echo "  clean        Remove containers and volumes"
    echo "  reset-db     Reset database"
    echo "  help         Show this menu"
    echo ""
}

# Main
case "$1" in
    build)
        build
        ;;
    start)
        start_prod
        ;;
    dev)
        start_dev
        ;;
    stop)
        stop
        ;;
    logs)
        logs
        ;;
    status)
        status
        ;;
    clean)
        clean
        ;;
    reset-db)
        reset_db
        ;;
    help|*)
        show_menu
        ;;
esac
