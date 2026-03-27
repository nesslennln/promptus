# 🎴 PROMPTUS — Progressive Web App (PWA)

Juego educativo tipo **roguelike de cartas** para el taller de Inteligencia Artificial (FES Acatlán). Construyes el *prompt perfecto* combinando cartas (técnicas, contexto y ética). El sistema evalúa tus prompts con **Claude (Anthropic)** y guarda puntajes en un **leaderboard** global que el administrador puede **reiniciar**.

## Objetivo del repo
Este repositorio se está reconstruyendo **desde cero** como una PWA moderna:

- Instalable en **iOS**, **Android** y **PC** (PWA)
- **Siempre online** (progreso y puntajes en servidor)
- **Login ultra simple**: escribir nombre (nombre **único**)
- Evaluación de prompts vía **Claude API** (API Key guardada en backend)
- **Leaderboard** global + **reset admin** (contraseña admin definida por taller)

## Plan (alto nivel)

### Monorepo
- `frontend/`: React + TypeScript + PWA
- `backend/`: Node.js + Express + PostgreSQL + Prisma

### Backend
- Endpoints: auth (nombre único), juego/evaluación, leaderboard, admin reset
- La API Key de Claude **solo** vive en variables de entorno del backend (nunca en el frontend)

### Admin
- Reset de leaderboard y borrado de partidas (para empezar limpio en el taller)
- Password admin (env): `nesslol2020`

## Estado
- 🚧 En construcción: scaffolding PWA + API + BD.

## Próximos pasos
1. Crear estructura `frontend/` y `backend/`.
2. Configurar Prisma + esquema PostgreSQL.
3. Implementar evaluación con Claude en el backend.
4. Implementar UI manteniendo la **estética** original (tema oscuro + neón + tipografías).

---

**Autor:** `nesslennln`