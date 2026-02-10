# Stage 1: Builder
FROM node:20-alpine AS builder

WORKDIR /app

# Instalar OpenSSL e dependências necessárias para Prisma
RUN apk add --no-cache openssl openssl-dev

# Copiar arquivos de dependências
COPY package*.json ./
COPY prisma ./prisma/

# Instalar dependências incluindo dev dependencies (necessário para build)
RUN npm ci

# Copiar código fonte
COPY . .

# Gerar Prisma Client
RUN npx prisma generate

# Compilar TypeScript
RUN npm run build

# Stage 2: Production
FROM node:20-alpine AS production

WORKDIR /app

# Instalar OpenSSL 3.x e outras dependências necessárias
RUN apk add --no-cache openssl libssl3 ca-certificates

# Copiar arquivos de dependências
COPY package*.json ./
COPY prisma ./prisma/

# Instalar apenas dependências de produção
RUN npm ci --omit=dev

# Variáveis de ambiente para Prisma
ENV PRISMA_QUERY_ENGINE_LIBRARY=/app/node_modules/.prisma/client/libquery_engine-linux-musl-openssl-3.0.x.so.node
ENV PRISMA_CLI_QUERY_ENGINE_TYPE=library

# Gerar Prisma Client
RUN npx prisma generate

# Copiar código compilado do builder
COPY --from=builder /app/dist ./dist

# Copiar script de entrypoint
COPY entrypoint.sh ./
RUN chmod +x entrypoint.sh

# Expor porta do servidor
EXPOSE 4000

# Usar entrypoint para rodar migrations antes de iniciar
ENTRYPOINT ["./entrypoint.sh"]

# Comando padrão para iniciar o servidor
CMD ["node", "dist/index.js"]
