# Todo App - Vue.js 3 + TypeScript + Vite

Esta é uma aplicação de lista de tarefas desenvolvida com Vue.js 3, TypeScript e Vite para o frontend, e Hono com Cloudflare Workers para o backend.

## Funcionalidades

- ✅ Adicionar novas tarefas
- ✅ Editar tarefas existentes (double-click)
- ✅ Marcar tarefas como concluídas
- ✅ Deletar tarefas
- ✅ Persistência de dados com Cloudflare KV
- ✅ Interface responsiva e moderna

## Estrutura do Projeto

### Frontend
```
src/
├── App.vue              # Componente raiz
├── main.ts              # Ponto de entrada
├── types.ts             # Definições de tipos
├── router/
│   └── index.ts         # Configuração de rotas
├── pages/
│   └── MainPage.vue     # Página principal
├── components/
│   ├── TodoList.vue     # Lista de tarefas
│   └── TaskItem.vue     # Item individual de tarefa
└── services/
    └── todoService.ts   # Serviço para comunicação com API
```

### Backend
```
my-todo-app-backend/
└── src/
    └── server.ts        # API Hono com endpoints CRUD
```

## Tecnologias Utilizadas

### Frontend
- **Vue.js 3** com Composition API
- **TypeScript** para tipagem
- **Vite** para build e dev server
- **Vue Router** para navegação
- **Cloudflare Pages** para hospedagem (opcional)

### Backend
- **Hono** framework para Cloudflare Workers
- **Cloudflare KV** para armazenamento
- **Cloudflare Workers** para API serverless

## Como Executar Localmente

### Pré-requisitos
- Node.js (versão 18 ou superior)
- PNPM ou NPM

### Instalar Dependências
```bash
# Frontend
pnpm install

# Backend
cd ../my-todo-app-backend
pnpm install
```

### Executar Modo Desenvolvimento
```bash
# Frontend (porta 5173-5176)
pnpm run dev

# Backend (porta 8787)
cd ../my-todo-app-backend
npx wrangler dev --local
```

A aplicação frontend estará disponível em `http://localhost:5173/`

## Como Fazer Deploy

### Backend (Cloudflare Workers)
```bash
cd ../my-todo-app-backend
npx wrangler deploy
```

### Frontend (Cloudflare Pages)
```bash
# Buildar para produção
pnpm run build

# Deploy (assumindo que tem Cloudflare Pages configurado)
npx wrangler pages deploy dist
```

Ou via dashboard do Cloudflare Pages conectando o repositório GitHub.

## API Endpoints

- `GET /api/todos` - Listar todas as tarefas
- `POST /api/todos` - Criar nova tarefa (`{ "task": "Descrição" }`)
- `PUT /api/todos/:id` - Atualizar tarefa (`{ "task": "...", "completed": true/false }`)
- `DELETE /api/todos/:id` - Deletar tarefa

## Melhorias Possíveis

- Adicionar autenticação
- Categorias/Labels para tarefas
- Ordenação por data/prioridade
- Tema escuro/claro
- Sincronização em tempo real
- Notificações push

## Contribuição

Para contribuir, faça um fork do projeto e crie uma branch com suas modificações.
