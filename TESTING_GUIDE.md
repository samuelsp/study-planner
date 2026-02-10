# Guia de Testes - Study Planner

Este guia fornece instruções sobre como verificar e testar a aplicação Study Planner.

## 🛠️ Testes de Backend

### 1. Conexão com Banco de Dados e Integridade de Dados
Para verificar se o servidor consegue se conectar ao banco de dados e recuperar informações:
```powershell
# Navegue até o diretório do servidor
cd study-planner/server

# Execute o script de verificação do banco
npx ts-node src/scripts/check_db.ts
```
Saída esperada: Um array JSON dos recursos atualmente no banco de dados.

### 2. Semeando Dados de Teste
Para adicionar dados de exemplo para fins de teste:
```powershell
# Execute o script de semente (seed)
npx ts-node src/scripts/seed_test.ts
```
Saída esperada: Uma mensagem confirmando a criação de um novo recurso (ex: "Created resource: Clean Code").

### 3. Verificação da API
Inicie o servidor em modo de desenvolvimento:
```powershell
npm run dev
```
Você pode acessar os endpoints da API (padrão: `http://localhost:3000`) usando ferramentas como Postman ou `curl`.

## 🎨 Testes de Frontend

### 1. Servidor de Desenvolvimento
Inicie o servidor de desenvolvimento do frontend:
```powershell
cd study-planner/client
npm run dev
```
Acesse a aplicação na URL fornecida no terminal (geralmente `http://localhost:5173`).

### 2. Cenários de Verificação Manual
- **Dashboard**: Verifique se os cartões de resumo exibem as contagens corretas.
- **Resources**: Verifique se os recursos criados via `seed_test.ts` aparecem na lista.
- **Notifications**: Verifique se as notificações são acionadas com base no cronograma de estudos.

## 🧪 Automações Futuras
> [!NOTE]
> Atualmente, o projeto utiliza scripts de verificação manual. Para crescimento futuro, considere adicionar:
> - **Jest**: Para testes unitários e de integração.
> - **Cypress/Playwright**: Para testes de interface (E2E).
