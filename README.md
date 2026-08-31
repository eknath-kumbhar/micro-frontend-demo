# Micro Frontend Demo – Module Federation

A simple, real-life example of **Micro Frontend Architecture** using **Webpack 5 Module Federation**.

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                         HOST (Shell)                        │
│  - Loads all remotes                                        │
│  - Owns the shared store & event bus                        │
│  - Layout & routing                                         │
└──────────┬──────────┬──────────┬──────────┬─────────────────┘
           │          │          │          │
     ┌─────▼────┐ ┌───▼────┐ ┌───▼────┐ ┌───▼────┐
     │  Header  │ │Products│ │  Cart  │ │  User  │
     │ (remote) │ │(remote)│ │(remote)│ │(remote)│
     └──────────┘ └────────┘ └────────┘ └────────┘
```

### Remotes (4)

| Remote            | Port | Responsibility                   |
| ----------------- | ---- | -------------------------------- |
| `remote-header`   | 3001 | Top navigation, cart badge, user |
| `remote-products` | 3002 | Product catalog + "Add to Cart"  |
| `remote-cart`     | 3003 | Shopping cart                    |
| `remote-user`     | 3004 | Login / Logout / Profile         |

### State Management

- **Shared State** (owned by Host, consumed by all):
  - Cart items
  - Current user
  - Exposed via Module Federation (`host/sharedStore`)

- **Private State**:
  - Each remote keeps its own local UI state (`useState`)

### Communication Patterns

| Direction       | How it works                            |
| --------------- | --------------------------------------- |
| Host → Remote   | Shared store + EventBus                 |
| Remote → Host   | EventBus (`eventBus.emit`)              |
| Remote → Remote | EventBus (pub/sub)                      |
| Shared data     | Shared Redux-like store (Zustand style) |

## Quick Start

```bash
# Install dependencies for all apps
cd micro-frontend-demo
npm run install:all

# Start all apps (host + 4 remotes) together
npm start
```

Then open: **http://localhost:3000**

> The host depends on the four remote apps being live, so running the combined startup command is required to avoid remote script-loading failures.

## Project Structure

```
micro-frontend-demo/
├── package.json                 # Root scripts
├── host/                        # Shell application (port 3000)
├── remote-header/               # Header remote (3001)
├── remote-products/             # Products remote (3002)
├── remote-cart/                 # Cart remote (3003)
├── remote-user/                 # User remote (3004)
└── shared/                      # Shared utilities (EventBus, types)
```

## Key Concepts Demonstrated

1. **Module Federation** – dynamic loading of remotes
2. **Shared dependencies** – React & ReactDOM singleton
3. **Shared state** – cart + user
4. **Private state** – local to each remote
5. **Cross-app communication** via EventBus
6. **Host-remote** and **remote-remote** messaging

## Real-life Analogy

Think of an e-commerce site:

- **Host** = main layout / shell
- **Header** = always visible navigation
- **Products** = product listing page
- **Cart** = shopping cart drawer/page
- **User** = account / login section
