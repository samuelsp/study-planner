# Stage 1: Builder
FROM node:20-alpine AS builder

WORKDIR /app

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

# Copiar arquivos de dependências
COPY package*.json ./
COPY prisma ./prisma/

# Instalar apenas dependências de produção
RUN npm ci --omit=dev

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
