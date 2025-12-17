# Feature Voting System - Requirements

## Overview

A system that allows users to propose features, vote on them, and track their status through completion.

---

## Domain Model

### Entities

#### User
- `id`: string (ObjectId)
- `name`: string
- `email`: string (unique)
- `password`: string (hashed)
- `createdAt`: Date
- `updatedAt`: Date

#### Feature
- `id`: string (ObjectId)
- `title`: string
- `description`: string
- `author`: User (reference)
- `status`: FeatureStatus
- `voteCount`: number (denormalized)
- `createdAt`: Date
- `updatedAt`: Date

#### Vote
- `id`: string (ObjectId)
- `user`: User (reference)
- `feature`: Feature (reference)
- `type`: VoteType (UP | DOWN)
- `createdAt`: Date

### Enums

```typescript
enum FeatureStatus {
  OPEN = 'OPEN',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  REJECTED = 'REJECTED'
}

enum VoteType {
  UP = 'UP',
  DOWN = 'DOWN'
}
```

### Relationships

- User 1:N Feature (a user can create many features)
- User 1:N Vote (a user can cast many votes)
- Feature 1:N Vote (a feature can have many votes)
- Constraint: User can only vote once per feature (unique: user + feature)

---

## REST API

### Authentication

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/api/auth/register` | No | Register new user |
| `POST` | `/api/auth/login` | No | Login, returns JWT |

#### Register
```
POST /api/auth/register
Body: {
  "name": "Alice",
  "email": "alice@example.com",
  "password": "securepass123"
}
Response: {
  "id": "...",
  "name": "Alice",
  "email": "alice@example.com",
  "token": "jwt..."
}
```

#### Login
```
POST /api/auth/login
Body: {
  "email": "alice@example.com",
  "password": "securepass123"
}
Response: {
  "id": "...",
  "name": "Alice",
  "email": "alice@example.com",
  "token": "jwt..."
}
```

### Users

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/api/users/me` | Yes | Get current user |
| `GET` | `/api/users/:id` | Yes | Get user by ID |

#### Get Current User
```
GET /api/users/me
Headers: Authorization: Bearer <token>
Response: {
  "id": "...",
  "name": "Alice",
  "email": "alice@example.com",
  "createdAt": "..."
}
```

### Features

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/api/features` | Yes | Create feature |
| `GET` | `/api/features` | No | List features |
| `GET` | `/api/features/:id` | No | Get feature by ID |
| `PATCH` | `/api/features/:id/status` | Yes | Update status (author only) |
| `DELETE` | `/api/features/:id` | Yes | Delete feature (author only) |

#### Create Feature
```
POST /api/features
Headers: Authorization: Bearer <token>
Body: {
  "title": "Dark Mode",
  "description": "Add dark theme support for better night viewing"
}
Response: {
  "id": "...",
  "title": "Dark Mode",
  "description": "...",
  "author": { "id": "...", "name": "Alice" },
  "status": "OPEN",
  "voteCount": 0,
  "createdAt": "..."
}
```

#### List Features
```
GET /api/features?sort=votes&status=OPEN&page=1&limit=10
Response: {
  "data": [...],
  "meta": {
    "total": 50,
    "page": 1,
    "limit": 10,
    "totalPages": 5
  }
}
```

Query Parameters:
- `sort`: `votes` | `newest` | `oldest` (default: `votes`)
- `status`: `OPEN` | `IN_PROGRESS` | `COMPLETED` | `REJECTED` (optional)
- `page`: number (default: 1)
- `limit`: number (default: 10, max: 50)

#### Get Feature
```
GET /api/features/:id
Response: {
  "id": "...",
  "title": "Dark Mode",
  "description": "...",
  "author": { "id": "...", "name": "Alice" },
  "status": "OPEN",
  "voteCount": 15,
  "upvotes": 18,
  "downvotes": 3,
  "userVote": "UP",  // null if not voted, requires auth
  "createdAt": "...",
  "updatedAt": "..."
}
```

#### Update Status
```
PATCH /api/features/:id/status
Headers: Authorization: Bearer <token>
Body: {
  "status": "COMPLETED"
}
Response: {
  "id": "...",
  "status": "COMPLETED",
  ...
}
```

#### Delete Feature
```
DELETE /api/features/:id
Headers: Authorization: Bearer <token>
Response: {
  "success": true
}
```

### Votes

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/api/features/:id/vote` | Yes | Vote on feature |
| `DELETE` | `/api/features/:id/vote` | Yes | Remove vote |
| `GET` | `/api/features/:id/votes` | No | Get vote stats |

#### Vote on Feature
```
POST /api/features/:id/vote
Headers: Authorization: Bearer <token>
Body: {
  "type": "UP"  // UP or DOWN
}
Response: {
  "id": "...",
  "type": "UP",
  "featureId": "...",
  "createdAt": "..."
}
```

Note: If user already voted, this updates the vote type.

#### Remove Vote
```
DELETE /api/features/:id/vote
Headers: Authorization: Bearer <token>
Response: {
  "success": true
}
```

#### Get Vote Stats
```
GET /api/features/:id/votes
Response: {
  "upvotes": 18,
  "downvotes": 3,
  "total": 15
}
```

### Health

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/api/health` | No | Basic health check |
| `GET` | `/api/health/ready` | No | Readiness check (DB, cache) |

---

## Project Structure

### Backend

```
backend/
├── src/
│   ├── server.ts              # Entry point
│   ├── di-container.ts        # Inversify IoC container
│   │
│   ├── config/
│   │   ├── index.ts           # Config aggregator
│   │   ├── database.ts        # MongoDB connection
│   │   └── env.ts             # Environment variables
│   │
│   ├── routes/
│   │   ├── index.ts           # Route aggregator
│   │   ├── health.routes.ts
│   │   ├── auth.routes.ts
│   │   ├── user.routes.ts
│   │   ├── feature.routes.ts
│   │   └── vote.routes.ts
│   │
│   ├── controllers/
│   │   ├── health.controller.ts
│   │   ├── auth.controller.ts
│   │   ├── user.controller.ts
│   │   ├── feature.controller.ts
│   │   └── vote.controller.ts
│   │
│   ├── services/
│   │   ├── auth.service.ts
│   │   ├── user.service.ts
│   │   ├── feature.service.ts
│   │   └── vote.service.ts
│   │
│   ├── repositories/
│   │   ├── user.repository.ts
│   │   ├── feature.repository.ts
│   │   └── vote.repository.ts
│   │
│   ├── models/
│   │   ├── user.model.ts
│   │   ├── feature.model.ts
│   │   └── vote.model.ts
│   │
│   ├── schemas/
│   │   ├── auth.schema.ts
│   │   ├── user.schema.ts
│   │   ├── feature.schema.ts
│   │   └── vote.schema.ts
│   │
│   ├── interfaces/
│   │   ├── user.interface.ts
│   │   ├── feature.interface.ts
│   │   ├── vote.interface.ts
│   │   ├── repository.interface.ts
│   │   └── service.interface.ts
│   │
│   ├── guards/
│   │   └── jwt-auth.guard.ts
│   │
│   ├── errors/
│   │   ├── index.ts
│   │   ├── not-found.error.ts
│   │   ├── unauthorized.error.ts
│   │   ├── forbidden.error.ts
│   │   └── validation.error.ts
│   │
│   ├── types/
│   │   └── di.types.ts        # Inversify symbols
│   │
│   └── utils/
│       ├── logger.ts          # Pino logger
│       ├── cache.ts           # Cache wrapper (node-cache/Redis)
│       └── password.ts        # bcrypt helpers
│
├── migrations/
│   └── (ts-migrate-mongoose files)
│
├── tests/
│   ├── unit/
│   └── integration/
│
├── package.json
├── tsconfig.json
├── vitest.config.ts
├── .env.example
└── .env
```

#### Stack

- Runtime: Node.js + TypeScript
- Framework: Fastify 5
- Database: MongoDB (Mongoose 9)
- DI: Inversify
- Logging: Pino
- Caching: node-cache / Redis (optional)
- Testing: Vitest
- Migrations: ts-migrate-mongoose

#### Security

- JWT authentication
- Rate limiting (@fastify/rate-limit)
- CORS (@fastify/cors)
- Helmet (@fastify/helmet)

---

### Frontend (Web)

```
web/
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── globals.css
│   │   ├── login/
│   │   │   └── page.tsx
│   │   ├── register/
│   │   │   └── page.tsx
│   │   └── features/
│   │       ├── page.tsx
│   │       ├── new/
│   │       │   └── page.tsx
│   │       └── [id]/
│   │           └── page.tsx
│   │
│   ├── components/
│   │   ├── ui/
│   │   │   ├── button.tsx
│   │   │   ├── input.tsx
│   │   │   ├── card.tsx
│   │   │   ├── badge.tsx
│   │   │   └── skeleton.tsx
│   │   ├── views/
│   │   │   ├── feature-list.tsx
│   │   │   ├── feature-detail.tsx
│   │   │   ├── login-form.tsx
│   │   │   └── register-form.tsx
│   │   ├── cached-avatar.tsx
│   │   ├── feature-card.tsx
│   │   ├── vote-buttons.tsx
│   │   ├── status-badge.tsx
│   │   ├── navbar.tsx
│   │   └── providers.tsx
│   │
│   ├── hooks/
│   │   ├── use-auth.ts
│   │   ├── use-features.ts
│   │   ├── use-vote.ts
│   │   └── use-debounce.ts
│   │
│   ├── store/
│   │   ├── auth.store.ts
│   │   ├── features.store.ts
│   │   └── ui.store.ts
│   │
│   ├── lib/
│   │   ├── api.ts
│   │   ├── config.ts
│   │   ├── jwt.ts
│   │   └── utils.ts
│   │
│   └── types/
│       ├── user.ts
│       ├── feature.ts
│       ├── vote.ts
│       └── api.ts
│
├── package.json
├── tsconfig.json
├── next.config.ts
├── tailwind.config.ts
├── postcss.config.js
└── biome.json
```

#### Stack

- Runtime: Node.js + TypeScript
- Framework: Next.js 15 (App Router, Turbopack)
- React: 19
- State Management: Zustand
- Styling: Tailwind CSS 4
- HTTP Client: Axios
- Linting: Biome
- UI Utils: clsx, tailwind-merge, class-variance-authority
- Icons: lucide-react

---

### Frontend (Mobile)

```
mobile/
├── src/
│   ├── app/
│   │   ├── _layout.tsx
│   │   ├── index.tsx
│   │   ├── (auth)/
│   │   │   ├── _layout.tsx
│   │   │   ├── login.tsx
│   │   │   └── register.tsx
│   │   └── (main)/
│   │       ├── _layout.tsx
│   │       ├── features/
│   │       │   ├── index.tsx
│   │       │   ├── new.tsx
│   │       │   └── [id].tsx
│   │       └── profile/
│   │           └── index.tsx
│   │
│   ├── components/
│   │   ├── ui/
│   │   │   ├── button.tsx
│   │   │   ├── input.tsx
│   │   │   ├── card.tsx
│   │   │   ├── badge.tsx
│   │   │   └── skeleton.tsx
│   │   ├── views/
│   │   │   ├── feature-list.tsx
│   │   │   ├── feature-detail.tsx
│   │   │   ├── login-form.tsx
│   │   │   └── register-form.tsx
│   │   ├── cached-avatar.tsx
│   │   ├── feature-card.tsx
│   │   ├── vote-buttons.tsx
│   │   ├── status-badge.tsx
│   │   └── providers.tsx
│   │
│   ├── hooks/
│   │   ├── use-auth.ts
│   │   ├── use-features.ts
│   │   ├── use-vote.ts
│   │   └── use-secure-store.ts
│   │
│   ├── store/
│   │   ├── auth.store.ts
│   │   ├── features.store.ts
│   │   └── ui.store.ts
│   │
│   ├── lib/
│   │   ├── api.ts
│   │   ├── config.ts
│   │   ├── jwt.ts
│   │   ├── secure-store.ts
│   │   └── utils.ts
│   │
│   └── types/
│       ├── user.ts
│       ├── feature.ts
│       ├── vote.ts
│       └── api.ts
│
├── assets/
├── app.json
├── package.json
├── tsconfig.json
├── tailwind.config.js
├── metro.config.js
├── babel.config.js
└── biome.json
```

#### Stack

- Runtime: Node.js + TypeScript
- Framework: React Native + Expo (Expo Router)
- React: 19
- State Management: Zustand
- Styling: NativeWind (Tailwind for RN)
- HTTP Client: Axios
- Linting: Biome
- UI Utils: clsx, tailwind-merge, class-variance-authority
- Icons: lucide-react-native

---

## DI Container Types

```typescript
// backend/src/types/di.types.ts
export const TYPES = {
  // Services
  AuthService: Symbol.for('AuthService'),
  UserService: Symbol.for('UserService'),
  FeatureService: Symbol.for('FeatureService'),
  VoteService: Symbol.for('VoteService'),

  // Repositories
  UserRepository: Symbol.for('UserRepository'),
  FeatureRepository: Symbol.for('FeatureRepository'),
  VoteRepository: Symbol.for('VoteRepository'),

  // Utils
  Logger: Symbol.for('Logger'),
  Cache: Symbol.for('Cache'),
};
```

---

## Zustand Stores

### Auth Store
```typescript
interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  setAuth: (user: User, token: string) => void;
  logout: () => void;
}
```

### Features Store
```typescript
interface FeaturesState {
  features: Feature[];
  loading: boolean;
  filter: 'all' | FeatureStatus;
  sortBy: 'votes' | 'newest' | 'oldest';
  setFeatures: (features: Feature[]) => void;
  addFeature: (feature: Feature) => void;
  updateFeature: (id: string, updates: Partial<Feature>) => void;
  removeFeature: (id: string) => void;
  setFilter: (filter: string) => void;
  setSortBy: (sort: string) => void;
}
```

---

## Error Responses

All API errors follow this format:

```json
{
  "statusCode": 400,
  "error": "Bad Request",
  "message": "Validation failed",
  "details": [
    { "field": "email", "message": "Invalid email format" }
  ]
}
```

### Error Codes

| Status | Error | Description |
|--------|-------|-------------|
| 400 | Bad Request | Validation error |
| 401 | Unauthorized | Missing or invalid token |
| 403 | Forbidden | Not allowed (e.g., not author) |
| 404 | Not Found | Resource doesn't exist |
| 409 | Conflict | Duplicate (e.g., email exists) |
| 429 | Too Many Requests | Rate limit exceeded |
| 500 | Internal Server Error | Server error |

---

## Environment Variables

### Backend (.env)

```env
# Server
PORT=3000
HOST=0.0.0.0
NODE_ENV=development

# Database
MONGODB_URI=mongodb+srv://...

# JWT
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=24h

# Redis (optional)
REDIS_URL=redis://localhost:6379

# Rate Limiting
RATE_LIMIT_MAX=100
RATE_LIMIT_WINDOW=60000
```

### Frontend (.env.local)

```env
NEXT_PUBLIC_API_URL=http://localhost:3000/api
```

### Mobile (.env)

```env
EXPO_PUBLIC_API_URL=http://localhost:3000/api
```
