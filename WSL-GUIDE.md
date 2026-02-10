# 🐧 Guia Rápido: Docker no WSL

Guia passo-a-passo para executar o Study Planner usando Docker no Windows Subsystem for Linux (WSL).

## 📋 Pré-requisitos

- Windows 10/11 com WSL 2 instalado
- Distribuição Linux no WSL (Ubuntu recomendado)

### Verificar/Instalar WSL

```powershell
# No PowerShell (como Administrador)

# Verificar versão do WSL
wsl --version

# Se não tiver WSL, instalar:
wsl --install

# Listar distribuições disponíveis
wsl --list --online

# Instalar Ubuntu (recomendado)
wsl --install -d Ubuntu

# Definir WSL 2 como padrão
wsl --set-default-version 2
```

## 🐳 Instalando Docker

### Opção 1: Docker Desktop (Mais Fácil) ⭐

1. **Baixe e instale o Docker Desktop**
   - Link: https://docs.docker.com/desktop/install/windows-install/
   - Durante instalação: Marque "Use WSL 2 instead of Hyper-V"

2. **Configure integração WSL**
   - Abra Docker Desktop
   - Vá em: Settings → Resources → WSL Integration
   - Ative para sua distribuição (Ubuntu, etc)
   - Clique "Apply & Restart"

3. **Teste no WSL**
   ```bash
   # Abra o terminal WSL
   wsl
   
   # Verifique Docker
   docker --version
   docker compose version
   ```

### Opção 2: Docker Engine (Sem Desktop)

Apenas se não quiser usar Docker Desktop:

```bash
# No terminal WSL
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER

# Reinicie o WSL
exit
# No PowerShell: wsl --shutdown
# Abra WSL novamente

# Inicie Docker
sudo service docker start
```

## 🚀 Executando a Aplicação

### Método Rápido: Script Bridge (Windows → WSL) ⚡

Se você preferir executar comandos diretamente do **PowerShell/CMD do Windows** (sem abrir terminal WSL), use o script bridge:

```cmd
REM No PowerShell ou CMD (Windows)
cd C:\Users\s.pereira.da.cunha\Desktop\antigravity\study-planner

REM Build
docker-wsl.bat build

REM Iniciar
docker-wsl.bat start

REM Ver logs
docker-wsl.bat logs

REM Parar
docker-wsl.bat stop
```

Este script automaticamente:
- ✅ Detecta e verifica WSL instalado
- ✅ Redireciona comandos para Docker no WSL
- ✅ Mantém você no PowerShell/CMD do Windows
- ✅ Converte caminhos Windows para WSL automaticamente

**Vantagem**: Não precisa copiar projeto para WSL! Funciona direto do drive C:.

---

### Método Completo: Dentro do WSL 🐧

Para melhor performance (especialmente em desenvolvimento), execute dentro do WSL:

### Passo 1: Acesse o Projeto no WSL

**IMPORTANTE**: Para melhor performance, copie o projeto para dentro do WSL.

```bash
# Abra o terminal WSL
wsl

# Navegue até sua home
cd ~

# Copie o projeto (ajuste o caminho conforme necessário)
cp -r /mnt/c/Users/s.pereira.da.cunha/Desktop/antigravity/study-planner ~/
cd ~/study-planner
```

**Por que não usar `/mnt/c/`?**
- ❌ `/mnt/c/` = Sistema de arquivos Windows (LENTO para Docker)
- ✅ `~/` = Sistema de arquivos Linux no WSL (RÁPIDO para Docker)

### Passo 2: Build da Aplicação

```bash
# Dentro da pasta study-planner no WSL
docker compose build
```

**Tempo esperado**: 5-10 minutos no primeiro build.

### Passo 3: Iniciar a Aplicação

#### Modo Produção (recomendado para teste)

```bash
docker compose up -d
```

#### Modo Desenvolvimento (com hot-reload)

```bash
docker compose -f docker-compose.yml -f docker-compose.dev.yml up
```

### Passo 4: Acessar a Aplicação

Abra seu navegador no Windows:

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:4000

### Passo 5: Ver Logs (Opcional)

```bash
# Ver logs de todos os serviços
docker compose logs -f

# Ver logs apenas do backend
docker compose logs -f backend

# Ver logs apenas do frontend
docker compose logs -f frontend
```

### Passo 6: Parar a Aplicação

```bash
# Parar containers
docker compose down

# Parar e remover volumes (apaga banco de dados)
docker compose down -v
```

## 📝 Usando os Scripts Helper

O projeto inclui um script bash para facilitar:

```bash
# Tornar executável
chmod +x docker.sh

# Ver comandos disponíveis
./docker.sh help

# Build
./docker.sh build

# Iniciar
./docker.sh start

# Ver logs
./docker.sh logs

# Ver status
./docker.sh status

# Parar
./docker.sh stop
```

## 🔍 Comandos Úteis WSL + Docker

### Gerenciar WSL

```powershell
# No PowerShell

# Listar distribuições instaladas
wsl --list --verbose

# Parar WSL
wsl --shutdown

# Iniciar distribuição específica
wsl -d Ubuntu

# Definir distribuição padrão
wsl --set-default Ubuntu
```

### Gerenciar Docker

```bash
# No WSL

# Ver containers rodando
docker ps

# Ver todos os containers (incluindo parados)
docker ps -a

# Ver imagens
docker images

# Ver volumes
docker volume ls

# Limpar recursos não utilizados
docker system prune -a
```

### Acessar Arquivos

**Do Windows no WSL:**
- Abra o Explorer
- Digite na barra: `\\wsl$\Ubuntu\home\seu-usuario\study-planner`

**Do WSL no Windows:**
```bash
# Acessar C: drive
cd /mnt/c/Users/seu-usuario/

# Acessar D: drive
cd /mnt/d/
```

## 🐛 Problemas Comuns

### 1. "docker: command not found"

**Solução:**
```bash
# Verifique se Docker está instalado
which docker

# Se usar Docker Desktop, verifique a integração WSL
# Settings → Resources → WSL Integration
```

### 2. "Cannot connect to Docker daemon"

**Solução:**
```bash
# Se usar Docker Engine (sem Desktop)
sudo service docker start

# Verificar status
sudo service docker status
```

### 3. Portas 3000/4000 já em uso

**Solução 1 - Encontrar e parar processo:**
```powershell
# No PowerShell
netstat -ano | findstr :3000
# Anote o PID e mate o processo
taskkill /PID <numero> /F
```

**Solução 2 - Usar outras portas:**
Edite `docker-compose.yml`:
```yaml
services:
  frontend:
    ports:
      - "3001:80"  # Mude para 3001
  backend:
    ports:
      - "4001:4000"  # Mude para 4001
```

### 4. Build muito lento

**Problema**: Projeto em `/mnt/c/`

**Solução**: Copie para `~/`:
```bash
cd ~
cp -r /mnt/c/path/to/study-planner ./
cd study-planner
docker compose build  # Muito mais rápido!
```

### 5. Hot-reload não funciona em desenvolvimento

**Solução**: Certifique-se que está no sistema de arquivos WSL (`~/`), não em `/mnt/c/`

### 6. "WSL 2 installation is incomplete"

**Solução:**
```powershell
# No PowerShell (Admin)
wsl --update
wsl --set-default-version 2
```

## 💡 Dicas Pro

### 1. Auto-start Docker no WSL

Adicione ao `~/.bashrc`:
```bash
# Auto-start Docker
if ! service docker status > /dev/null 2>&1; then
    sudo service docker start > /dev/null 2>&1
fi
```

### 2. Usar VS Code no WSL

```bash
# Instale a extensão "Remote - WSL" no VS Code

# No WSL, abra o projeto:
code .
```

### 3. Alias úteis

Adicione ao `~/.bashrc`:
```bash
# Docker shortcuts
alias dps='docker ps'
alias dcu='docker compose up'
alias dcd='docker compose down'
alias dcb='docker compose build'
alias dcl='docker compose logs -f'

# WSL shortcuts
alias cdsp='cd ~/study-planner'
```

Depois rode: `source ~/.bashrc`

### 4. Ver uso de recursos

```bash
# CPU e memória dos containers
docker stats

# Espaço em disco
docker system df
```

## 📚 Recursos Adicionais

- **WSL Documentation**: https://docs.microsoft.com/windows/wsl/
- **Docker Desktop WSL**: https://docs.docker.com/desktop/wsl/
- **VS Code Remote WSL**: https://code.visualstudio.com/docs/remote/wsl

## 🎯 Comparação: Qual Método Usar?

### Opção 1: Script Bridge (docker-wsl.bat) - PowerShell/CMD

```cmd
REM Execute do Windows PowerShell/CMD
docker-wsl.bat build
docker-wsl.bat start
```

**Quando usar:**
- ✅ Você prefere ficar no PowerShell/CMD do Windows
- ✅ Projeto já está no drive C: (não quer copiar)
- ✅ Uso ocasional/testes rápidos
- ⚠️ Performance ligeiramente inferior para desenvolvimento
- ⚠️ Hot-reload pode ser mais lento

### Opção 2: Terminal WSL Direto - Scripts Bash

```bash
# Execute dentro do terminal WSL
cd ~/study-planner
./docker.sh build
./docker.sh start
```

**Quando usar:**
- ✅ Melhor performance (especialmente desenvolvimento)
- ✅ Hot-reload mais rápido e confiável
- ✅ Desenvolvimento contínuo e ativo
- ✅ Você está confortável com Linux/Bash
- ⚠️ Requer copiar projeto para WSL

### Opção 3: Comandos Docker Nativos no WSL

```bash
# Execute dentro do terminal WSL
cd ~/study-planner
docker compose build
docker compose up -d
```

**Quando usar:**
- ✅ Máximo controle sobre Docker
- ✅ Você conhece bem Docker Compose
- ✅ Precisa de comandos Docker avançados
- ✅ Integração com CI/CD ou scripts customizados

### Recomendação

| Cenário | Método Recomendado |
|---------|-------------------|
| **Teste rápido/demo** | Script Bridge (docker-wsl.bat) |
| **Desenvolvimento ativo** | Terminal WSL com scripts bash |
| **Produção/Deploy** | Comandos Docker nativos no WSL |
| **Iniciante** | Script Bridge (mais fácil) |
| **Experiente** | Terminal WSL ou comandos nativos |

## ✅ Checklist de Instalação

- [ ] WSL 2 instalado e configurado
- [ ] Distribuição Linux (Ubuntu) instalada no WSL
- [ ] Docker Desktop instalado com integração WSL habilitada
- [ ] `docker --version` funciona no terminal WSL
- [ ] Projeto copiado para `~/study-planner`
- [ ] `docker compose build` executado com sucesso
- [ ] `docker compose up -d` iniciou os containers
- [ ] http://localhost:3000 acessível no navegador
- [ ] http://localhost:4000 retorna resposta da API

---

**Pronto!** 🎉 Sua aplicação está rodando no Docker via WSL!

Para mais detalhes, consulte: [README.Docker.md](./README.Docker.md)
