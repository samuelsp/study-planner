@echo off
REM Study Planner - WSL Bridge Script
REM Permite executar comandos Docker no WSL a partir do Windows
REM ============================================================

setlocal

set SCRIPT_DIR=%~dp0
set WSL_PATH=/mnt/%SCRIPT_DIR::=%
set WSL_PATH=%WSL_PATH:\=/%
set WSL_PATH=%WSL_PATH:C=/c%
set WSL_PATH=%WSL_PATH:D=/d%
set WSL_PATH=%WSL_PATH:E=/e%

REM Verificar se WSL está instalado
wsl --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] WSL nao esta instalado ou nao esta configurado corretamente.
    echo.
    echo Por favor, instale o WSL primeiro:
    echo   wsl --install
    echo.
    echo Ou consulte: WSL-GUIDE.md
    exit /b 1
)

REM Verificar se Docker está acessível no WSL
wsl docker --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Docker nao esta acessivel no WSL.
    echo.
    echo Por favor, instale o Docker Desktop com integracao WSL habilitada.
    echo Consulte: WSL-GUIDE.md
    exit /b 1
)

echo ================================
echo   Study Planner - Docker (WSL)
echo ================================
echo.

if "%1"=="" goto show_help
if "%1"=="help" goto show_help
if "%1"=="build" goto build
if "%1"=="start" goto start
if "%1"=="dev" goto dev
if "%1"=="stop" goto stop
if "%1"=="logs" goto logs
if "%1"=="status" goto status
if "%1"=="clean" goto clean
if "%1"=="reset-db" goto reset_db
goto show_help

:build
echo [INFO] Executando build no WSL...
wsl bash -c "cd '%WSL_PATH%' && docker compose build"
goto end

:start
echo [INFO] Iniciando aplicacao em modo PRODUCAO via WSL...
wsl bash -c "cd '%WSL_PATH%' && docker compose up -d"
if %errorlevel% equ 0 (
    echo [SUCCESS] Aplicacao iniciada!
    echo.
    echo Frontend: http://localhost:3000
    echo Backend:  http://localhost:4000
)
goto end

:dev
echo [INFO] Iniciando aplicacao em modo DESENVOLVIMENTO via WSL...
echo [INFO] Pressione Ctrl+C para parar
wsl bash -c "cd '%WSL_PATH%' && docker compose -f docker-compose.yml -f docker-compose.dev.yml up"
goto end

:stop
echo [INFO] Parando aplicacao...
wsl bash -c "cd '%WSL_PATH%' && docker compose down"
if %errorlevel% equ 0 (
    echo [SUCCESS] Aplicacao parada!
)
goto end

:logs
echo [INFO] Mostrando logs (Ctrl+C para sair)...
wsl bash -c "cd '%WSL_PATH%' && docker compose logs -f"
goto end

:status
echo [INFO] Status dos containers:
echo.
wsl bash -c "cd '%WSL_PATH%' && docker compose ps"
goto end

:clean
echo [WARNING] Isso vai remover containers e volumes (banco de dados sera apagado).
set /p CONFIRM="Continuar? (s/N): "
if /i not "%CONFIRM%"=="s" (
    echo [INFO] Cancelado
    goto end
)
echo [INFO] Limpando recursos Docker...
wsl bash -c "cd '%WSL_PATH%' && docker compose down -v"
if %errorlevel% equ 0 (
    echo [SUCCESS] Recursos limpos!
)
goto end

:reset_db
echo [INFO] Resetando banco de dados...
wsl bash -c "cd '%WSL_PATH%' && docker exec -it study-planner-backend npx prisma migrate reset --force"
if %errorlevel% equ 0 (
    echo [SUCCESS] Banco de dados resetado!
)
goto end

:show_help
echo Uso: docker-wsl.bat [comando]
echo.
echo Comandos:
echo   build        Build das imagens Docker no WSL
echo   start        Iniciar em modo producao
echo   dev          Iniciar em modo desenvolvimento
echo   stop         Parar todos os containers
echo   logs         Mostrar logs (modo follow)
echo   status       Status dos containers
echo   clean        Remover containers e volumes
echo   reset-db     Resetar banco de dados
echo   help         Mostrar este menu
echo.
echo Para configurar Docker no WSL, consulte: WSL-GUIDE.md
goto end

:end
endlocal
