#!/bin/sh
set -e

echo "🔍 Verificando banco de dados..."

# Criar diretório de dados se não existir
mkdir -p /data

# Executar migrations do Prisma
echo "🚀 Executando migrations do Prisma..."
npx prisma migrate deploy

# Verificar se o banco foi criado
if [ ! -f "/data/prod.db" ] && [ ! -f "/data/dev.db" ]; then
    echo "⚠️  Banco de dados não encontrado, será criado na primeira execução"
fi

echo "✅ Banco de dados pronto!"

# Executar o comando passado como argumento
echo "🎯 Iniciando aplicação..."
exec "$@"
