# 📚 Study Planner

Sistema de planejamento e gerenciamento de estudos com sessões programadas e recursos educacionais.

## 🚀 Quick Start

**Não sabe qual método usar?** → [DOCKER-DECISION.md](./DOCKER-DECISION.md)

### Opção 1: Com Docker (Recomendado)

**Windows (PowerShell):**
```powershell
# Build
.\docker.ps1 build

# Iniciar
.\docker.ps1 start

# Parar
.\docker.ps1 stop
```

**Linux/Mac:**
```bash
# Tornar executável (apenas primeira vez)
chmod +x docker.sh

# Build
./docker.sh build

# Iniciar
./docker.sh start

# Parar
./docker.sh stop
```

A aplicação estará disponível em:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:4000

📖 **Documentação completa**: [README.Docker.md](./README.Docker.md)

#### 🐧 WSL (Windows Subsystem for Linux):

**Forma rápida (do PowerShell/CMD Windows):**
```cmd
docker-wsl.bat build
docker-wsl.bat start
```

**Melhor performance (dentro do WSL):**
```bash
# No terminal WSL
cd ~/study-planner
./docker.sh build
./docker.sh start
```

📖 **Quick Start**: [WSL-QUICKSTART.md](./WSL-QUICKSTART.md)  
📖 **Guia completo**: [WSL-GUIDE.md](./WSL-GUIDE.md)

### Opção 2: Desenvolvimento Local (Sem Docker)

#### Backend
```bash
cd server
npm install
cp .env.example .env
npx prisma generate
npx prisma migrate deploy
npm run dev
```

#### Frontend
```bash
cd client
npm install
npm run dev
```

## 📁 Estrutura do Projeto

```
study-planner/
├── client/                 # Frontend React + Vite
│   ├── src/
│   │   ├── components/    # Componentes reutilizáveis
│   │   ├── pages/         # Páginas da aplicação
│   │   ├── layouts/       # Layouts
│   │   └── services/      # API clients
│   ├── Dockerfile
│   └── nginx.conf
│
├── server/                # Backend Node.js + Express
│   ├── src/
│   │   ├── controllers/   # Request handlers
│   │   ├── services/      # Lógica de negócio
│   │   └── routes/        # Rotas da API
│   ├── prisma/            # Schema e migrations
│   ├── Dockerfile
│   └── entrypoint.sh
│
├── docker-compose.yml     # Configuração Docker produção
├── docker-compose.dev.yml # Configuração Docker desenvolvimento
├── docker.ps1             # Helper script Windows
├── docker.sh              # Helper script Linux/Mac
└── README.Docker.md       # Documentação completa Docker
```

## 🛠️ Stack Tecnológica

### Frontend
- React 19
- TypeScript
- Vite
- Tailwind CSS v4
- React Router DOM
- Framer Motion
- Lucide Icons
- date-fns

### Backend
- Node.js
- Express
- TypeScript
- Prisma ORM
- SQLite
- node-cron (agendamento)
- nodemailer (notificações)

### DevOps
- Docker & Docker Compose
- Nginx (produção)
- Multi-stage builds

## 📊 Funcionalidades

- ✅ Dashboard com estatísticas de estudo
- ✅ Calendário de sessões de estudo
- ✅ Gerenciamento de recursos educacionais
- ✅ Sistema de notificações e lembretes
- ✅ Tracking de progresso
- ✅ Visualizações e relatórios

## 🔧 Comandos Docker Úteis

### Desenvolvimento com Hot Reload
```bash
# Windows
.\docker.ps1 dev

# Linux/Mac
./docker.sh dev
```

### Ver Logs
```bash
# Windows
.\docker.ps1 logs

# Linux/Mac
./docker.sh logs
```

### Verificar Status
```bash
# Windows
.\docker.ps1 status

# Linux/Mac
./docker.sh status
```

### Limpar Tudo
```bash
# Windows
.\docker.ps1 clean

# Linux/Mac
./docker.sh clean
```

## 📖 Documentação

- **Qual método usar?**: [DOCKER-DECISION.md](./DOCKER-DECISION.md) - Fluxograma de decisão 🗺️
- **Docker**: [README.Docker.md](./README.Docker.md) - Guia completo de Docker
- **WSL Quick Start**: [WSL-QUICKSTART.md](./WSL-QUICKSTART.md) - Start em 3 minutos no WSL ⚡
- **WSL**: [WSL-GUIDE.md](./WSL-GUIDE.md) - Guia completo para Windows Subsystem for Linux
- **Testes**: [TESTING_GUIDE.md](./TESTING_GUIDE.md) - Guia de testes
- **Copilot**: [.github/copilot-instructions.md](./.github/copilot-instructions.md) - Instruções para desenvolvimento

## 🧪 Testes

```bash
# Backend
cd server
npm test

# Frontend
cd client
npm test
```

## 📝 Variáveis de Ambiente

Copie o arquivo de exemplo:
```bash
cp .env.example .env
```

Principais variáveis:
- `PORT` - Porta do backend (padrão: 4000)
- `DATABASE_URL` - URL do banco SQLite
- `NODE_ENV` - Ambiente (development/production)
- `VITE_API_URL` - URL da API para o frontend

## 🤝 Contribuindo

1. Clone o repositório
2. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças (`git commit -m 'Add nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

## 📄 Licença

ISC

## 🐛 Problemas?

Consulte o [README.Docker.md](./README.Docker.md) para troubleshooting detalhado ou abra uma issue.

---

**Desenvolvido com ❤️ usando React, Node.js e Docker**
