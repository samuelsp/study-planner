# 🗺️ Mapa de Decisão - Como Executar a Aplicação

Fluxograma para escolher o melhor método para você.

```
┌─────────────────────────────────────────────────┐
│  Você está no Windows?                          │
└─────────────────┬───────────────────────────────┘
                  │
         ┌────────┴────────┐
         │                 │
        SIM               NÃO
         │                 │
         │                 └──> Use: ./docker.sh
         │                      (Linux/Mac)
         │
         ▼
┌─────────────────────────────────────────────────┐
│  Você tem WSL instalado ou quer usar?           │
└─────────────────┬───────────────────────────────┘
                  │
         ┌────────┴────────┐
         │                 │
        SIM               NÃO
         │                 │
         │                 └──> Use: .\docker.ps1
         │                      (PowerShell nativo)
         │
         ▼
┌─────────────────────────────────────────────────┐
│  Qual sua prioridade?                           │
└─────────────────┬───────────────────────────────┘
                  │
    ┌─────────────┼─────────────┐
    │             │             │
FACILIDADE    PERFORMANCE   CONTROLE
    │             │             │
    │             │             │
    ▼             ▼             ▼
┌─────────┐  ┌─────────┐  ┌──────────┐
│ Bridge  │  │  WSL    │  │  Docker  │
│ Script  │  │ Scripts │  │ Commands │
└─────────┘  └─────────┘  └──────────┘
```

## 🎯 Escolha Rápida

### Para Iniciantes: Script Bridge

```cmd
REM PowerShell/CMD - mais fácil!
docker-wsl.bat build
docker-wsl.bat start
```

**Por que?**
- ✅ Passo único, sem complicações
- ✅ Não precisa aprender comandos WSL
- ✅ Funciona direto do diretório Windows
- ✅ Boa para testes e demos rápidos

### Para Desenvolvedores: Scripts WSL

```bash
# Terminal WSL - melhor performance!
cd ~/study-planner
./docker.sh build
./docker.sh start
```

**Por que?**
- ✅ Hot-reload mais rápido e confiável
- ✅ Melhor performance geral
- ✅ Ideal para desenvolvimento ativo
- ✅ Scripts simplificam comandos Docker

### Para Experts: Comandos Docker Diretos

```bash
# Terminal WSL - controle total!
cd ~/study-planner
docker compose build
docker compose up -d
docker compose logs -f
```

**Por que?**
- ✅ Máximo controle e flexibilidade
- ✅ Comandos Docker padrão da indústria
- ✅ Fácil adaptação para CI/CD
- ✅ Documentação oficial do Docker aplica direto

## 📊 Comparação de Métodos

| Característica | Bridge Script | WSL Scripts | Docker Direto |
|----------------|---------------|-------------|---------------|
| **Facilidade** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ |
| **Performance** | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| **Controle** | ⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| **Hot-reload** | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| **Iniciantes** | ✅ Sim | ⚠️ Médio | ❌ Não |
| **Windows Native** | ✅ Sim | ❌ Não | ❌ Não |
| **Precisa copiar?** | ❌ Não | ✅ Recomendado | ✅ Recomendado |

## 🚦 Guias Específicos

Escolheu seu método? Vá para o guia correspondente:

1. **Bridge Script**: [WSL-QUICKSTART.md](./WSL-QUICKSTART.md) → Seção 1
2. **WSL Scripts**: [WSL-GUIDE.md](./WSL-GUIDE.md) → Método Completo
3. **Docker Direto**: [README.Docker.md](./README.Docker.md) → Modo Produção

## 💡 Recomendação por Perfil

### 👶 "Nunca usei Docker antes"
→ Use: **Bridge Script** (docker-wsl.bat)
→ Guia: [WSL-QUICKSTART.md](./WSL-QUICKSTART.md)

### 💼 "Só quero testar a aplicação"
→ Use: **Bridge Script** (docker-wsl.bat)
→ Guia: [WSL-QUICKSTART.md](./WSL-QUICKSTART.md)

### 👨‍💻 "Vou desenvolver features"
→ Use: **WSL Scripts** (./docker.sh)
→ Guia: [WSL-GUIDE.md](./WSL-GUIDE.md)

### 🔧 "Já uso Docker diariamente"
→ Use: **Docker Direto** (docker compose)
→ Guia: [README.Docker.md](./README.Docker.md)

### 🏢 "Para deploy em produção"
→ Use: **Docker Direto** (docker compose)
→ Guia: [README.Docker.md](./README.Docker.md) → Seção Produção

## ❓ FAQ

**Q: Posso misturar métodos?**
A: Sim! Use Bridge para testes rápidos e WSL Scripts para desenvolvimento.

**Q: Qual é o mais rápido?**
A: WSL Scripts e Docker Direto têm a mesma performance (ambos rodam no WSL).

**Q: Preciso instalar algo antes?**
A: Sim, Docker Desktop com integração WSL. Veja: [WSL-GUIDE.md](./WSL-GUIDE.md)

**Q: Bridge Script é mais lento?**
A: Ligeiramente, especialmente para hot-reload. Para dev ativo, prefira WSL Scripts.

**Q: Posso usar no Linux puro?**
A: Sim! Use `./docker.sh` (funciona igual no Linux/Mac/WSL).

---

**Ainda com dúvidas?** Comece pelo mais fácil (Bridge Script) e evolua conforme necessário! 🚀
