# ⚡ WSL Quick Start - 3 Minutos

Guia ultra-rápido para rodar a aplicação no WSL.

## 🎯 3 Formas de Executar

### 1️⃣ Mais Fácil - Do Windows (PowerShell/CMD)

```cmd
cd C:\Users\s.pereira.da.cunha\Desktop\antigravity\study-planner
docker-wsl.bat build
docker-wsl.bat start
```

✅ Não precisa abrir terminal WSL
✅ Funciona direto do seu diretório Windows

### 2️⃣ Mais Rápido - Dentro do WSL

```bash
# Abra terminal WSL
wsl

# Copie projeto para WSL (só primeira vez)
cp -r /mnt/c/Users/s.pereira.da.cunha/Desktop/antigravity/study-planner ~/
cd ~/study-planner

# Execute
./docker.sh build
./docker.sh start
```

✅ Melhor performance
✅ Hot-reload mais confiável

### 3️⃣ Controle Total - Comandos Docker Diretos

```bash
# No terminal WSL
cd ~/study-planner
docker compose build
docker compose up -d
```

✅ Máximo controle
✅ Para usuários experientes

## 🚀 Acesse

Abra no navegador (Windows ou WSL):
- Frontend: http://localhost:3000
- Backend: http://localhost:4000

## 📚 Guia Completo

Para instalação, troubleshooting e dicas: [WSL-GUIDE.md](./WSL-GUIDE.md)

## ❓ Problemas?

**Docker não encontrado?**
```powershell
# Instale Docker Desktop com integração WSL
# https://docs.docker.com/desktop/install/windows-install/
```

**WSL não instalado?**
```powershell
wsl --install
```

**Portas ocupadas?**
Edite `docker-compose.yml` e mude as portas 3000/4000 para outras.

---

**Escolha seu método e comece! 🎉**
