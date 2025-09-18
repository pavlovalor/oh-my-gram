# Skill Showcase – Instagram‑Style Social Platform

![GitHub repo size](https://img.shields.io/github/repo-size/pavlovalor/oh-my-gram)
![GitHub package.json dev/peer/optional dependency version](https://img.shields.io/github/package-json/dependency-version/pavlovalor/oh-my-gram/dev/typescript)
![GitHub Created At](https://img.shields.io/github/created-at/pavlovalor/oh-my-gram)
![GitHub last commit](https://img.shields.io/github/last-commit/pavlovalor/oh-my-gram)


A full‑stack, microservice‑oriented clone of Instagram that demonstrates modern engineering skills and tooling. The project delivers a minimal yet complete social‑media experience – feeds, stories, chat, subscriptions, search and recommendations – while showcasing production‑grade patterns such as event‑driven architecture, CQRS, polyglot persistence and a monorepo workflow.

---

## ✨ Key Functionalities

| Domain            | Features                                                        |
| ----------------- | --------------------------------------------------------------- |
| **Social Feed**   | Infinite scroll, image/video posts, like & comment interactions |
| **Profiles**      | Editable bio, avatar, grid/list views, follower counts          |
| **Subscriptions** | Follow / unfollow, private vs. public accounts, notifications   |
| **Chat**          | Real‑time 1‑to‑1 and group messaging, typing indicators         |
| **Discovery**     | Search by username / hashtags, algorithmic recommendations      |
| **Notifications** | Cross‑service push for likes, follows, comments & messages      |

---

## 🏗️ Tech Stack

| Layer              | Technology                                                                                                                       | Purpose                                     |
| ------------------ | -------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------- |
| **API & Services** | **NestJS** microservices                                                                                                         | Business logic, validation, CQRS            |
| **Event Backbone** | **NATS JetStream**                                                                                                               | Reliable async messaging, sagas             |
| **Datastores**     | **PostgreSQL** – relational core <br> **MongoDB** – document / feed timelines <br> **Redis** – caching, pub/sub, session storage | Polyglot persistence optimized per workload |
| **Frontend**       | **React 18** + **Astro**                                                                                                         | Island‑architecture SPA with partial SSR    |
| **Dev Workflow**   | **pnpm workspaces** / **Nx** monorepo                                                                                            | Unified scripts, generators, linting        |
| **Infra**          | Docker Compose / K8s Helm charts                                                                                                 | Local dev & cloud‑native deploy             |

---

## 🖼️ High‑Level Architecture

```mermaid
---
config:
  theme: redux
---
flowchart LR
 subgraph s1["Entry"]
        GatewayPublicHTTP["HTTP Gateway<br>[Public]"]
        GatewayBackofficeHTTP["HTTP Gateway<br>[Backoffice]"]
        GatewayPublicWS["WS Gateway<br>[Public]"]
        GatewayBackofficeWS["WS Gateway<br>[Backoffice]"]
  end
 subgraph s2["Core"]
        n3["Service<br>[Identity]"]
        n4["Service<br>[Profile]"]
        n5["Service<br>[Feed]"]
        n6["Service<br>[Chat]"]
        n9["Cache<br>[Redis]"]
        n8["Database<br>[Mongo]"]
        n7["Database<br>[Postgres]"]
  end
    FrontendPublic(["Frontend<br>[Public]"]) --> GatewayPublicHTTP
    FrontendBackoffice(["Frontend<br>[Backoffice]"]) --> GatewayBackofficeHTTP
    GatewayPublicWS --> FrontendPublic
    GatewayBackofficeWS --> FrontendBackoffice
    GatewayPublicHTTP --> n1["Command/Query bus"]
    GatewayBackofficeHTTP --> n1
    n2["Event bus"] --> GatewayBackofficeWS & GatewayPublicWS
    n1 --> n3 & n4 & n5 & n6
    n6 --> n9 & n8
    n5 --> n9
    n4 --> n9
    n3 --> n7
    n3 --> n9
    GatewayPublicHTTP@{ shape: rounded}
    GatewayBackofficeHTTP@{ shape: rounded}
    GatewayPublicWS@{ shape: rounded}
    GatewayBackofficeWS@{ shape: rounded}
    n3@{ shape: rect}
    n4@{ shape: rect}
    n5@{ shape: rect}
    n6@{ shape: rect}
    n9@{ shape: db}
    n8@{ shape: db}
    n7@{ shape: db}
    n1@{ shape: h-cyl}
    n2@{ shape: h-cyl}

```

*Gateway exposes BFF endpoints; each bounded‑context service handles its own database and publishes domain events.*

---

## 📁 Repository Structure (Monorepo)

```
root/
├─ apps/
│  ├─ gateway.public-http/        # HTTP entry points
│  ├─ gateway.public-ws/          # WS entry point for user application
│  ├─ service.identity/           # manages identity-related data
│  ├─ web.public/                 # public react js app
│  └─ ...
├─ packages/
│  ├─ config.eslint/              # holds different eslint configs and rulesets
│  ├─ config.typescript/          # holds basic tsconfig settings
│  ├─ module.authn/               # authentication module
│  ├─ schema.identity-postgres/   # database schema for the identity core + worker service group
│  ├─ schema.profile-postgres/    # database schema for the profile service group
│  └─ ...
├─ docker/
└─ scripts/
```

---

## 🚀 Getting Started (Local Dev)

```bash
# 1. Clone & install deps
pnpm install

# 2. Spin up infrastructure
pnpm run docker:start

# 3. Start all services & frontend
pnpm run dev
```

Navigate to `http://localhost:8080` for the React UI.

---

## 🧩 Core Design Highlights

1. **Event‑Driven Saga Workflows** – cross‑service transactions with JetStream.
2. **CQRS + Outbox** – write models in Postgres, read models in Mongo for timelines.
3. **Idempotent Handlers & DLQs** – resiliency to message replay.
4. **Gateway BFF Pattern** – single entry‑point optimised per‑device.
5. **Modular Monorepo** – shared tooling yet independent deploy artefacts.

---

## 📝 License

Released under MIT License — see `LICENSE` file for details.
