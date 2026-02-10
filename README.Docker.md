# 🐳 Study Planner - Guia Docker

Este guia explica como executar a aplicação Study Planner usando Docker e Docker Compose.

## 📋 Pré-requisitos

- [Docker](https://docs.docker.com/get-docker/) (versão 20.10 ou superior)
- [Docker Compose](https://docs.docker.com/compose/install/) (versão 2.0 ou superior)

Para verificar se estão instalados:
```bash
docker --version
docker-compose --version
```

## 🐧 Executando no WSL (Windows Subsystem for Linux)

O WSL é uma excelente opção para rodar Docker no Windows, oferecendo melhor performance e integração com o ecossistema Linux.

### Configuração do Docker no WSL

#### Opção 1: Docker Desktop (Recomendado)

1. **Instale o Docker Desktop no Windows**
   - Download: https://docs.docker.com/desktop/install/windows-install/
   - Durante a instalação, marque "Use WSL 2 instead of Hyper-V"

2. **Configure a integração WSL**
   - Abra Docker Desktop
   - Settings → Resources → WSL Integration
   - Habilite integração com suas distribuições WSL desejadas
   - Click "Apply & Restart"

3. **Verifique a instalação no WSL**
   ```bash
   # Abra seu terminal WSL (Ubuntu, Debian, etc)
   docker --version
   docker compose version
   ```

#### Opção 2: Docker Engine no WSL (Sem Docker Desktop)

1. **Dentro do seu WSL, instale o Docker Engine**
   ```bash
   # Atualizar pacotes
   sudo apt-get update
   sudo apt-get install ca-certificates curl gnupg lsb-release

   # Adicionar chave GPG oficial do Docker
   sudo mkdir -p /etc/apt/keyrings
   curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg

   # Adicionar repositório
   echo \
     "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
     $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

   # Instalar Docker
   sudo apt-get update
   sudo apt-get install docker-ce docker-ce-cli containerd.io docker-compose-plugin

   # Adicionar seu usuário ao grupo docker
   sudo usermod -aG docker $USER

   # Reiniciar WSL ou fazer logout/login
   ```

2. **Iniciar o serviço Docker**
   ```bash
   sudo service docker start
   ```

### Executando a Aplicação no WSL

#### 1. Acesse seu projeto no WSL

**IMPORTANTE**: Para melhor performance, o projeto deve estar no sistema de arquivos do WSL, não no `/mnt/c/`:

```bash
# ❌ EVITE: Usar arquivos em /mnt/c (lento)
cd /mnt/c/Users/s.pereira.da.cunha/Desktop/antigravity/study-planner

# ✅ RECOMENDADO: Copiar para home do WSL
cp -r /mnt/c/Users/s.pereira.da.cunha/Desktop/antigravity/study-planner ~/
cd ~/study-planner
```

**OU** clone diretamente no WSL:
```bash
cd ~
git clone <seu-repositorio> study-planner
cd study-planner
```

#### 2. Build das Imagens

```bash
docker compose build
```

#### 3. Iniciar a Aplicação

```bash
# Modo produção
docker compose up -d

# OU modo desenvolvimento
docker compose -f docker-compose.yml -f docker-compose.dev.yml up
```

#### 4. Acessar a Aplicação

**Do Windows ou WSL**, acesse no navegador:
- **Frontend**: http://localhost:3000
- **Backend**: http://localhost:4000

### Usar Scripts Bash no WSL

```bash
# Tornar executável
chmod +x docker.sh

# Usar os comandos
./docker.sh build
./docker.sh start
./docker.sh logs
./docker.sh stop
```

### Dicas e Troubleshooting WSL

#### Performance

✅ **Use sistema de arquivos nativo do WSL** (`~/` ou `/home/usuario/`)
- Build até 10x mais rápido
- Watch/Hot-reload funciona melhor
- Menos problemas de permissão

❌ **Evite `/mnt/c/`** para projetos Docker
- Performance degradada
- Problemas com inotify (file watching)
- Permissões complicadas

#### Iniciar Docker Automaticamente

Se usar Docker Engine (sem Desktop), adicione ao `~/.bashrc` ou `~/.zshrc`:
```bash
# Auto-start Docker
if ! service docker status > /dev/null 2>&1; then
    sudo service docker start > /dev/null 2>&1
fi
```

#### Verificar Status do Docker

```bash
# Status do serviço
sudo service docker status

# Listar containers rodando
docker ps

# Verificar se daemon está acessível
docker info
```

#### Portas Ocupadas

Se as portas 3000 ou 4000 estiverem em uso no Windows:
```bash
# Verificar processos usando portas
netstat.exe -ano | findstr :3000
netstat.exe -ano | findstr :4000
```

Ou modifique as portas no `docker-compose.yml`:
```yaml
services:
  frontend:
    ports:
      - "3001:80"  # Usar 3001 em vez de 3000
  backend:
    ports:
      - "4001:4000"  # Usar 4001 em vez de 4000
```

#### VS Code no WSL

Use a extensão **Remote - WSL** para editar arquivos:
```bash
# Dentro do WSL, abrir VS Code
code .
```

#### Resetar Docker no WSL

```bash
# Parar todos os containers
docker stop $(docker ps -aq)

# Remover todos os containers
docker rm $(docker ps -aq)

# Limpar volumes
docker volume prune

# Limpar sistema
docker system prune -a
```

## 🏗️ Arquitetura

A aplicação é composta por 2 serviços:

- **Backend**: API Node.js/Express com Prisma ORM (porta 4000)
- **Frontend**: Aplicação React com Vite servida por Nginx (porta 3000/80)

### Volumes
- `db-data`: Persiste o banco de dados SQLite em produção
- `db-data-dev`: Persiste o banco de dados SQLite em desenvolvimento

## 🚀 Modo Produção

### 1. Configuração Inicial

Copie o arquivo de exemplo de variáveis de ambiente:
```bash
cp .env.example .env
```

### 2. Build das Imagens

```bash
docker-compose build
```

Ou sem usar cache (build limpo):
```bash
docker-compose build --no-cache
```

### 3. Iniciar a Aplicação

```bash
docker-compose up -d
```

A aplicação estará disponível em:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:4000

### 4. Ver Logs

Ver logs de todos os serviços:
```bash
docker-compose logs -f
```

Ver logs de um serviço específico:
```bash
docker-compose logs -f backend
docker-compose logs -f frontend
```

### 5. Parar a Aplicação

```bash
docker-compose down
```

Para parar E remover volumes (⚠️ apaga o banco de dados):
```bash
docker-compose down -v
```

## 🔧 Modo Desenvolvimento

O modo desenvolvimento oferece:
- ✅ Hot reload (alterações de código refletem automaticamente)
- ✅ Volumes montados do código fonte
- ✅ Vite HMR (Hot Module Replacement)
- ✅ Nodemon para restart automático do backend

### Iniciar em Desenvolvimento

```bash
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up
```

Ou em background:
```bash
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up -d
```

A aplicação estará disponível em:
- **Frontend (Vite)**: http://localhost:5173
- **Backend API**: http://localhost:4000

### Rebuild em Desenvolvimento

Se adicionar novas dependências:
```bash
docker-compose -f docker-compose.yml -f docker-compose.dev.yml build
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up
```

## 📊 Gerenciamento do Banco de Dados

### Acessar o Container do Backend

```bash
docker exec -it study-planner-backend sh
```

### Executar Migrations Manualmente

```bash
docker exec -it study-planner-backend npx prisma migrate deploy
```

### Ver Status do Banco

```bash
docker exec -it study-planner-backend npx prisma migrate status
```

### Gerar Nova Migration (em desenvolvimento)

```bash
# Entre no container
docker exec -it study-planner-backend-dev sh

# Crie a migration
npx prisma migrate dev --name nome_da_migration
```

### Seed do Banco (Popular com Dados de Teste)

```bash
docker exec -it study-planner-backend npm run seed
```

## 🔍 Comandos Úteis

### Ver Status dos Containers

```bash
docker-compose ps
```

### Verificar Health dos Serviços

```bash
docker inspect study-planner-backend | grep -A 10 Health
docker inspect study-planner-frontend | grep -A 10 Health
```

### Acessar Shell do Container

Backend:
```bash
docker exec -it study-planner-backend sh
```

Frontend:
```bash
docker exec -it study-planner-frontend sh
```

### Ver Uso de Recursos

```bash
docker stats
```

### Limpar Recursos Não Utilizados

```bash
# Remover containers parados
docker-compose rm

# Limpar imagens não utilizadas
docker image prune

# Limpeza completa (cuidado!)
docker system prune -a --volumes
```

## 🧪 Testando a Aplicação

### 1. Verificar se os Serviços Estão Rodando

```bash
# Lista containers ativos
docker-compose ps

# Verifica saúde dos serviços
docker-compose ps --filter "health=healthy"
```

### 2. Testar API Backend

```bash
# Health check
curl http://localhost:4000/

# Listar sessões
curl http://localhost:4000/sessions

# Listar recursos
curl http://localhost:4000/resources
```

### 3. Testar Frontend

Abra no navegador: http://localhost:3000

## 🐛 Troubleshooting

### Erro: "Port already in use"

Algum serviço já está usando as portas 3000 ou 4000. Opções:

1. Parar os serviços locais
2. Mudar as portas no `docker-compose.yml`:
   ```yaml
   ports:
     - "3001:80"  # Usar 3001 em vez de 3000
     - "4001:4000"  # Usar 4001 em vez de 4000
   ```

### Erro: "Cannot connect to database"

```bash
# Verificar logs do backend
docker-compose logs backend

# Recriar o banco
docker-compose down -v
docker-compose up -d
```

### Estilos não Carregam no Frontend

```bash
# Rebuild do frontend
docker-compose build frontend --no-cache
docker-compose up -d frontend
```

### Container Reiniciando Constantemente

```bash
# Ver logs com timestamps
docker-compose logs --timestamps backend

# Ver últimos 100 logs
docker-compose logs --tail=100 backend
```

### Alterações no Código Não Refletem (Dev Mode)

Verifique se os volumes estão montados:
```bash
docker inspect study-planner-backend-dev | grep Mounts -A 20
```

Rebuilde os containers:
```bash
docker-compose -f docker-compose.yml -f docker-compose.dev.yml down
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up --build
```

## 📦 Build para Diferentes Ambientes

### Produção Local

```bash
docker-compose build
docker-compose up -d
```

### Staging/QA

Crie um `docker-compose.staging.yml`:
```yaml
version: '3.8'
services:
  backend:
    environment:
      - NODE_ENV=staging
  frontend:
    environment:
      - VITE_API_URL=https://api.staging.studyplanner.com
```

Execute:
```bash
docker-compose -f docker-compose.yml -f docker-compose.staging.yml up -d
```

## 📝 Variáveis de Ambiente

### Backend

| Variável | Descrição | Padrão |
|----------|-----------|--------|
| `PORT` | Porta do servidor | `4000` |
| `DATABASE_URL` | URL do banco SQLite | `file:/data/prod.db` |
| `NODE_ENV` | Ambiente de execução | `production` |

### Frontend

| Variável | Descrição | Padrão |
|----------|-----------|--------|
| `VITE_API_URL` | URL da API backend | `http://localhost:4000` |

## 🔐 Segurança

### Produção

- ✅ Imagens multi-stage reduzem tamanho e superfície de ataque
- ✅ Node Alpine Linux (imagem mínima)
- ✅ Nginx oculta versão do servidor
- ✅ Apenas dependências de produção no container final
- ⚠️ Configure HTTPS em ambiente de produção real
- ⚠️ Use variáveis de ambiente para secrets (nunca hardcode)

### Melhorias Recomendadas

1. **Scan de Vulnerabilidades**:
   ```bash
   docker scan study-planner-backend:latest
   ```

2. **Usuário Não-Root**: Adicione ao Dockerfile:
   ```dockerfile
   RUN addgroup -S appgroup && adduser -S appuser -G appgroup
   USER appuser
   ```

3. **Health Checks Robustos**: Já implementados no docker-compose

## 📚 Recursos Adicionais

- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose Reference](https://docs.docker.com/compose/compose-file/)
- [Nginx Configuration Guide](https://nginx.org/en/docs/)
- [Prisma Docker Guide](https://www.prisma.io/docs/guides/deployment/deployment-guides/deploying-to-docker)

## 🤝 Contribuindo

Ao adicionar novas features que requerem mudanças no Docker:

1. Atualize os Dockerfiles se necessário
2. Atualize o docker-compose.yml
3. Atualize este README
4. Teste em modo desenvolvimento E produção

## 📄 Licença

Este projeto segue a mesma licença do projeto principal.

---

**Dúvidas?** Abra uma issue no repositório ou consulte a documentação oficial do Docker.
