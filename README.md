# NetAtlas

**Network Discovery & Monitoring Platform**

Plataforma open source para descoberta, inventário e monitoramento de redes locais. Combine uma web app moderna com um agente coletor local para obter visibilidade sobre dispositivos conectados, portas abertas e riscos básicos de segurança.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Stack](https://img.shields.io/badge/Stack-Next.js%20%7C%20Supabase%20%7C%20Python-000?style=flat)](https://github.com)

---

## Projeto

### Nome

**NetAtlas** — Network Discovery & Monitoring Platform

### Descrição

O NetAtlas é uma plataforma self-hosted composta por uma aplicação web (Next.js + Supabase) e um agente coletor local em Python/Nmap. Juntos, eles descobrem dispositivos na rede, escaneiam portas abertas, classificam riscos de segurança e mantêm um inventário histórico acessível via dashboard.

### Objetivo

Oferecer visibilidade prática sobre redes domésticas e de pequenas empresas — quem está conectado, o que está exposto e quais riscos merecem atenção — sem depender de soluções proprietárias ou complexas.

### Motivação

Redes locais frequentemente carecem de observabilidade. Roteadores não mostram o quadro completo; ferramentas enterprise são caras ou excessivas para homelabs e PMEs. O NetAtlas preenche essa lacuna com uma stack moderna, código aberto e fluxo de uso simples: instalar o agente, executar um scan, visualizar resultados no dashboard.

---

## Features

### Atuais (pré-desenvolvimento)

> O repositório está em fase de preparação. Nenhuma funcionalidade de produto foi implementada ainda.

- Documentação de planejamento e arquitetura
- Estrutura de contexto para desenvolvimento assistido por IA
- Convenções de código e design system documentados

### Planejadas (MVP v1.0.0)

| Área               | Funcionalidades                                                                 |
| ------------------ | ------------------------------------------------------------------------------- |
| **Autenticação**   | Cadastro, login, logout, recuperação de senha via Supabase Auth                 |
| **Dashboard**      | Métricas de rede, dispositivos recentes, gráfico de histórico, skeleton loading |
| **NetAtlas Agent** | CLI Python, descoberta ARP/ping, scan Nmap, envio via API REST                  |
| **Inventário**     | Listagem com busca/filtros, detalhe de dispositivo, histórico de scans          |
| **Riscos**         | Motor de classificação (Baixo/Médio/Alto), painel e detalhe com recomendações   |
| **Agentes**        | Registro com token, listagem de status, revogação                               |
| **Exportação**     | Download de scans em JSON e CSV                                                 |
| **Demo**           | Página pública com dados fictícios                                              |

### Futuras (pós-MVP)

- Alertas e notificações em tempo real
- Agendamento de scans recorrentes
- Integração com ferramentas de SIEM
- Suporte expandido cross-platform (Windows/macOS)
- CLI de instalação one-liner (`curl | bash` / `pip install`)
- Badge live de status no README (GitHub Actions + Shields.io)

---

## Arquitetura

```
┌─────────────────┐         HTTPS / REST          ┌──────────────────────┐
│  NetAtlas Agent │  ───────────────────────────►   │   Web App (Next.js)  │
│  Python + Nmap  │   Bearer Token (agente)       │   Vercel             │
│  Rede local     │                               │   Route Handlers     │
└─────────────────┘                               └──────────┬───────────┘
                                                               │
                                                               ▼
                                                    ┌──────────────────────┐
                                                    │      Supabase        │
                                                    │  Auth · Postgres ·   │
                                                    │  RLS · Realtime      │
                                                    └──────────────────────┘
```

### Web App

Aplicação Next.js 16 (App Router) hospedada na Vercel. Responsável pela interface do usuário, autenticação via Supabase SSR, APIs REST para o agente e processamento do motor de riscos no backend.

### NetAtlas Agent

CLI Python que roda na rede local do usuário. Executa descoberta de hosts (ARP + ping sweep), scan de portas via Nmap e envia resultados autenticados para a plataforma.

### Supabase

Backend-as-a-Service: autenticação de usuários, banco PostgreSQL com Row Level Security, e opcionalmente Realtime para atualização do dashboard.

### Fluxo de dados

1. Usuário registra um agente no dashboard e recebe um token Bearer (exibido uma única vez).
2. Agente executa `netatlas scan --token TOKEN --api URL`.
3. Agente valida conectividade (`GET /api/health`), cria scan (`POST /api/scans`).
4. Discovery identifica hosts; Nmap escaneia portas por dispositivo.
5. Agente envia dispositivos e portas (`POST /api/devices`).
6. Backend classifica riscos automaticamente.
7. Agente finaliza scan (`PATCH /api/scans/:id`).
8. Dashboard atualiza via polling (30s) ou Supabase Realtime.

---

## Stack

| Camada       | Tecnologias                                        |
| ------------ | -------------------------------------------------- |
| **Frontend** | Next.js 16, TypeScript, Tailwind CSS, shadcn/ui    |
| **Backend**  | Next.js Route Handlers, Supabase (Auth + Postgres) |
| **Agente**   | Python 3.11+, Nmap, subprocess / nmap3             |
| **Infra**    | Vercel, Supabase, GitHub Actions                   |
| **Testes**   | Vitest, pytest, Playwright                         |
| **Monorepo** | Turborepo                                          |

---

## Roadmap

| Sprint | Semanas | Objetivo                                     | Versão       |
| ------ | ------- | -------------------------------------------- | ------------ |
| **1**  | 1–2     | Fundação: setup, auth, layout, dark mode, CI | v0.1.0-alpha |
| **2**  | 3–4     | Dashboard, métricas, APIs REST do agente     | v0.2.0-alpha |
| **3**  | 5–6     | NetAtlas Agent: CLI, ARP, Nmap, MAC/hostname | v0.3.0-alpha |
| **4**  | 7–8     | Integração agente ↔ plataforma, inventário   | v0.4.0-beta  |
| **5**  | 9–10    | Histórico de scans, motor de riscos          | v0.5.0-beta  |
| **6**  | 11–12   | Comparação de scans, gráficos, export, demo  | v0.6.0-rc    |
| **7**  | 13–14   | E2E, documentação, CI/CD, produção           | v1.0.0       |

**Estimativa total:** 14 semanas · ~196h · sprints de 2 semanas

---

## Instalação

> Setup completo será documentado a partir do Sprint 1. Abaixo, o fluxo previsto.

### Pré-requisitos

- Node.js 20+
- npm ou pnpm
- Conta Supabase
- Conta Vercel (deploy)
- Python 3.11+ e Nmap (para o agente, Sprint 3+)

### Web App (em breve)

```bash
git clone https://github.com/seu-usuario/netatlas.git
cd netatlas
cp .env.example .env.local
# Preencher NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY
npm install
npm run dev
```

### NetAtlas Agent (em breve)

```bash
pip install netatlas-agent
netatlas scan --token SEU_TOKEN --api https://sua-instancia.vercel.app
```

### Supabase

1. Criar projeto em [supabase.com](https://supabase.com)
2. Executar migrations em `supabase/migrations/`
3. Configurar variáveis de ambiente na Vercel

---

## Contribuição

Contribuições são bem-vindas! Consulte [CONTRIBUTING.md](CONTRIBUTING.md) para:

- Conventional Commits (em português)
- Convenção de branches (`feature/*`, `fix/*`, `docs/*`, `chore/*`)
- Template de Pull Request
- Padrões de código TypeScript e Python
- Organização de componentes, páginas, APIs e tabelas Supabase

Antes de abrir um PR:

1. Crie uma issue descrevendo a mudança
2. Siga as convenções do projeto
3. Garanta que CI passa (lint, typecheck, build)
4. Atualize documentação quando aplicável

---

## Licença

Este projeto está licenciado sob a [MIT License](LICENSE).

---

<p align="center">
  <strong>Desenvolvido por <a href="https://github.com/44lain" target="_blank" rel="noopener noreferrer">-lain</a></strong>
</p>
