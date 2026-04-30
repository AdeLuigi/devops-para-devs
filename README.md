# DevOps para Devs

> O básico que o dev precisa saber — em 25 minutos, usando Node.js como fio condutor.

Uma API de tarefas usada como pretexto para colocar em prática os 5 pilares de DevOps que todo desenvolvedor deveria conhecer.

## O que você vai encontrar aqui

| # | Bloco | Conceito |
|---|-------|----------|
| 1 | Containers com Docker | Empacotar o app de uma vez por todas |
| 2 | CI/CD na prática | Automatizar o caminho do commit ao deploy |
| 3 | Ambientes e segredos | Separar configuração de código |
| 4 | Docker Compose | Orquestrar múltiplos containers |
| 5 | Observabilidade | Saber o que está acontecendo em produção |

---

## Bloco 1 — Containers com Docker

O problema clássico: Node 18 na sua máquina, Node 20 no servidor, lib instalada globalmente. Resultado: "funciona aqui...".

O `Dockerfile` é a receita do container — define a base, instala as dependências e dá a ignição:

```dockerfile
FROM node:20-alpine      # A Base: SO ultraleve + versão exata do Node
WORKDIR /app
COPY app/package*.json ./ # As Dependências: isola a instalação das libs
RUN npm install
COPY app/ .
EXPOSE 3001              # A Ponte: porta de comunicação com o mundo exterior
CMD ["node", "index.js"] # A Ignição: comando que inicia a API
```

```sh
make build   # docker build -t tasks-api .
make run     # docker run -p 3001:3001 tasks-api
```

---

## Bloco 2 — CI/CD na prática

O pipeline automatiza o caminho do `git push` até o deploy:

```
Push → Checkout → npm ci → npm test → docker build → Deploy
```

- **CI (Integração Contínua):** roda a cada push, detecta problemas antes do merge, feedback em minutos.
- **CD (Entrega Contínua):** deploy liberado automaticamente após os testes passarem.

Implementado com GitHub Actions em `.github/workflows/ci.yml`:

- **Gatilho:** push ou PR na `main`
- **O Escudo:** roda `make test` (instala dependências + executa testes)
- **A Esteira:** faz build da imagem Docker e push para o registry

```sh
make test    # cd app && yarn install --frozen-lockfile && yarn test
```

---

## Bloco 3 — Ambientes e segredos

Nunca commite segredos — jamais. Nem em repositório privado.

| Arquivo | O que fazer |
|---------|-------------|
| `.env.example` | Commitar — serve de documentação |
| `.env` | Nunca commitar — contém os valores reais |

Cada ambiente tem uma responsabilidade diferente:

- **Development:** debug ativo, banco local, hot-reload
- **Staging:** espelho de prod, testes de integração
- **Production:** usuários reais — zero tolerância a erro

---

## Bloco 4 — Docker Compose

Quando o app precisa de mais de um container, o Docker Compose orquestra tudo com um único comando.

Este projeto sobe 3 serviços juntos:

```
app         → Nossa API Node.js (porta 3001)
prometheus  → Coletor de métricas (porta 9090)
grafana     → Dashboard visual (porta 3000)
```

```sh
make up    # docker compose up --build
make down  # docker compose down
```

Dentro da rede do Compose os containers se comunicam pelo nome do serviço (`app`, `prometheus`, `grafana`) — não por `localhost`.

---

## Bloco 5 — Observabilidade

Saber o que está acontecendo em produção. Os três pilares:

- **Logs:** histórico estruturado em JSON — níveis debug, info, warn, error
- **Métricas:** latência, taxa de erro, CPU — base para alertas
- **Tracing:** requisição de ponta a ponta cruzando múltiplos serviços

A API expõe métricas no formato Prometheus em `/metrics` via `prom-client`. O Grafana consome esses dados e exibe um dashboard com:

- Total de requests
- Memória heap do Node.js
- Taxa de requests por rota (req/s)
- Latência P95 por rota

Acesse o dashboard em `http://localhost:3000` → login `admin` / `admin`.

---

## Como rodar

**Pré-requisitos:** Docker e Docker Compose instalados.

```sh
# Sobe a API + Prometheus + Grafana
make up
```

| Serviço | URL |
|---------|-----|
| API | http://localhost:3001/tasks |
| Métricas (raw) | http://localhost:3001/metrics |
| Prometheus | http://localhost:9090 |
| Grafana | http://localhost:3000 |

Para gerar dados no dashboard, faça alguns requests na API:

```sh
curl http://localhost:3001/tasks
curl -X POST http://localhost:3001/tasks \
  -H "Content-Type: application/json" \
  -d '{"title":"Estudar DevOps"}'
```

---

## 5 coisas para levar pra casa

1. **Dockerize desde o primeiro projeto** — acaba com o "funciona na minha máquina"
2. **Pipeline de CI desde o início** — detecta bugs antes de virar problema
3. **Nunca commite segredo** — nenhuma exceção, nem em repo privado
4. **Saiba ler YAML e fazer rollback** — `kubectl rollout undo` salva às 2h da manhã
5. **Escreva logs com contexto** — seu eu do futuro vai agradecer

---

## Leituras recomendadas

- [12factor.net](https://12factor.net)
- [docs.docker.com](https://docs.docker.com)
- [kubernetes.io/docs](https://kubernetes.io/docs)
- [getpino.io](https://getpino.io)
