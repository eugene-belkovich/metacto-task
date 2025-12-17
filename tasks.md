# Feature Voting System - Implementation Tasks

## Phase 1: Backend Foundation

### 1.1 Project Initialization

- [x] 1. Create `backend/` directory structure
- [x] 2. Initialize Node.js project with `npm init`
- [x] 3. Install TypeScript and configure `tsconfig.json`
- [x] 4. Install Fastify 5 and core dependencies
- [x] 5. Install Fastify plugins: `@fastify/cors`, `@fastify/helmet`, `@fastify/rate-limit`
- [x] 6. Set up Pino logger configuration
- [x] 7. Install and configure Vitest with `vitest.config.ts`
- [x] 8. Create `src/config/env.ts` for environment variable parsing
- [x] 9. Create `src/config/index.ts` to aggregate config exports
- [x] 10. Create `.env.example` with all required variables
- [x] 11. Create `src/server.ts` entry point with Fastify instance

### 1.2 Dependency Injection Setup

- [x] 12. Install Inversify and `reflect-metadata`
- [x] 13. Create `src/types/di.types.ts` with DI symbols
- [x] 14. Create `src/interfaces/repository.interface.ts` base interface
- [x] 15. Create `src/interfaces/service.interface.ts` base interface
- [x] 16. Create `src/di-container.ts` IoC container setup
- [x] 17. Configure container bindings for services and repositories

### 1.3 Database Layer

- [x] 18. Install Mongoose 9
- [x] 19. Create `src/config/database.ts` with MongoDB connection logic
- [x] 20. Create `src/models/user.model.ts` with schema and indexes
- [x] 21. Create `src/models/feature.model.ts` with schema and indexes
- [x] 22. Create `src/models/vote.model.ts` with schema and compound unique index
- [x] 23. Create `src/interfaces/user.interface.ts`
- [x] 24. Create `src/interfaces/feature.interface.ts`
- [x] 25. Create `src/interfaces/vote.interface.ts`
- [x] 26. Create `src/repositories/user.repository.ts`
- [x] 27. Create `src/repositories/feature.repository.ts`
- [x] 28. Create `src/repositories/vote.repository.ts`
- [x] 29. Add index on `users.email` (unique)
- [x] 30. Add index on `features.author`
- [x] 31. Add index on `features.status`
- [x] 32. Add index on `features.voteCount`
- [x] 33. Add compound index on `votes.user + votes.feature` (unique)

### 1.4 Error Handling

- [x] 34. Create `src/errors/app.error.ts` base error class
- [x] 35. Create `src/errors/not-found.error.ts`
- [x] 36. Create `src/errors/unauthorized.error.ts`
- [x] 37. Create `src/errors/forbidden.error.ts`
- [x] 38. Create `src/errors/validation.error.ts`
- [x] 39. Create `src/errors/index.ts` to export all errors
- [x] 40. Implement global error handler in Fastify
- [x] 41. Define consistent error response format with statusCode, error, message, details

---

## Phase 2: Authentication System

### 2.1 Auth Service Implementation

- [x] 42. Install bcrypt for password hashing
- [x] 43. Install jsonwebtoken for JWT handling
- [x] 44. Create `src/utils/password.ts` with hash and compare functions
- [x] 45. Create `src/services/auth.service.ts`
- [x] 46. Implement `register()` method with password hashing
- [x] 47. Implement `login()` method with password verification
- [x] 48. Implement JWT token generation with 24h expiry
- [x] 49. Implement JWT token verification
- [x] 50. Add password validation rules (min length, complexity)
- [x] 51. Create `src/guards/jwt-auth.guard.ts` middleware

### 2.2 Auth Routes & Controllers

- [x] 52. Create `src/schemas/auth.schema.ts` with validation schemas
- [x] 53. Define register request/response schema
- [x] 54. Define login request/response schema
- [x] 55. Create `src/controllers/auth.controller.ts`
- [x] 56. Implement register controller method
- [x] 57. Implement login controller method
- [x] 58. Create `src/routes/auth.routes.ts`
- [x] 59. Register POST `/api/auth/register` endpoint
- [x] 60. Register POST `/api/auth/login` endpoint
- [x] 61. Register auth routes in main server

---

## Phase 3: Core Feature APIs

### 3.1 User Management

- [x] 62. Create `src/services/user.service.ts`
- [x] 63. Implement `findById()` method
- [x] 64. Implement `findByEmail()` method
- [x] 65. Add user response serialization (exclude password)
- [x] 66. Create `src/schemas/user.schema.ts`
- [x] 67. Create `src/controllers/user.controller.ts`
- [x] 68. Implement `getMe()` controller method
- [x] 69. Implement `getById()` controller method
- [x] 70. Create `src/routes/user.routes.ts`
- [x] 71. Register GET `/api/users/me` endpoint (protected)
- [x] 72. Register GET `/api/users/:id` endpoint (protected)
- [x] 73. Register user routes in main server

### 3.2 Feature Management

- [x] 74. Create `src/services/feature.service.ts`
- [x] 75. Implement `create()` method
- [x] 76. Implement `findAll()` method with pagination
- [x] 77. Implement `findById()` method
- [x] 78. Implement `updateStatus()` method with author check
- [x] 79. Implement `delete()` method with author check
- [x] 80. Add sorting support (votes, newest, oldest)
- [x] 81. Add status filtering support
- [x] 82. Create `src/schemas/feature.schema.ts`
- [x] 83. Define create feature request schema
- [x] 84. Define list features query schema (sort, status, page, limit)
- [x] 85. Define update status request schema
- [x] 86. Create `src/controllers/feature.controller.ts`
- [x] 87. Implement `create()` controller method
- [x] 88. Implement `list()` controller method
- [x] 89. Implement `getById()` controller method
- [x] 90. Implement `updateStatus()` controller method
- [x] 91. Implement `delete()` controller method
- [x] 92. Create `src/routes/feature.routes.ts`
- [x] 93. Register POST `/api/features` endpoint (protected)
- [x] 94. Register GET `/api/features` endpoint (public)
- [x] 95. Register GET `/api/features/:id` endpoint (public)
- [x] 96. Register PATCH `/api/features/:id/status` endpoint (protected)
- [x] 97. Register DELETE `/api/features/:id` endpoint (protected)
- [x] 98. Register feature routes in main server

### 3.3 Voting System

- [x] 99. Create `src/services/vote.service.ts`
- [x] 100. Implement `vote()` method (create or update)
- [x] 101. Implement `removeVote()` method
- [x] 102. Implement `getVoteStats()` method
- [x] 103. Implement `getUserVote()` method for checking existing vote
- [x] 104. Implement denormalized voteCount update on Feature
- [x] 105. Enforce one vote per user per feature constraint
- [x] 106. Create `src/schemas/vote.schema.ts`
- [x] 107. Define vote request schema (type: UP/DOWN)
- [x] 108. Define vote stats response schema
- [x] 109. Create `src/controllers/vote.controller.ts`
- [x] 110. Implement `vote()` controller method
- [x] 111. Implement `removeVote()` controller method
- [x] 112. Implement `getStats()` controller method
- [x] 113. Create `src/routes/vote.routes.ts`
- [x] 114. Register POST `/api/features/:id/vote` endpoint (protected)
- [x] 115. Register DELETE `/api/features/:id/vote` endpoint (protected)
- [x] 116. Register GET `/api/features/:id/votes` endpoint (public)
- [x] 117. Register vote routes in main server
- [x] 118. Create `src/routes/index.ts` to aggregate all routes

---

## Phase 4: Caching Layer

### 4.1 Cache Infrastructure

- [ ] 119. Install node-cache package
- [ ] 120. Create `src/interfaces/cache.interface.ts` abstraction
- [ ] 121. Define `get()`, `set()`, `del()`, `flush()` methods in interface
- [ ] 122. Create `src/utils/node-cache.adapter.ts` implementing interface
- [ ] 123. Create `src/utils/redis.adapter.ts` implementing interface (optional)
- [ ] 124. Create `src/utils/cache.ts` factory to select adapter
- [ ] 125. Add Cache to DI container bindings
- [ ] 126. Configure cache TTL values from environment

### 4.2 Cache Integration

- [ ] 127. Add caching to `feature.service.findAll()` (60s TTL)
- [ ] 128. Add caching to `feature.service.findById()` (30s TTL)
- [ ] 129. Add caching to vote counts (10s TTL)
- [ ] 130. Implement cache invalidation on feature create
- [ ] 131. Implement cache invalidation on feature update
- [ ] 132. Implement cache invalidation on feature delete
- [ ] 133. Implement cache invalidation on vote
- [ ] 134. Add Cache-Control headers to responses

---

## Phase 5: Health & Monitoring

### 5.1 Health Endpoints

- [ ] 135. Create `src/controllers/health.controller.ts`
- [ ] 136. Implement basic health check returning `{ status: 'ok' }`
- [ ] 137. Implement readiness check verifying database connection
- [ ] 138. Implement readiness check verifying cache availability
- [ ] 139. Create `src/routes/health.routes.ts`
- [ ] 140. Register GET `/api/health` endpoint
- [ ] 141. Register GET `/api/health/ready` endpoint
- [ ] 142. Register health routes in main server

### 5.2 Request Logging

- [ ] 143. Configure Pino request logging in Fastify
- [ ] 144. Add request ID generation and tracking
- [ ] 145. Log request method, URL, status code, response time
- [ ] 146. Configure log levels per environment (debug for dev, info for prod)
- [ ] 147. Implement sensitive data masking (passwords, tokens)
- [ ] 148. Add error logging with stack traces

---

## Phase 6: Web Frontend

### 6.1 Project Setup

- [ ] 149. Create `web/` directory structure
- [ ] 150. Initialize Next.js 15 project with App Router
- [ ] 151. Configure TypeScript in `tsconfig.json`
- [ ] 152. Install and configure Tailwind CSS 4
- [ ] 153. Create `tailwind.config.ts`
- [ ] 154. Create `postcss.config.js`
- [ ] 155. Install and configure Biome
- [ ] 156. Create `biome.json` linting configuration
- [ ] 157. Create `src/app/layout.tsx` root layout
- [ ] 158. Create `src/app/page.tsx` home page
- [ ] 159. Create `src/app/globals.css` with Tailwind imports
- [ ] 160. Create `src/lib/config.ts` with API URL config
- [ ] 161. Create `src/lib/utils.ts` with `cn()` helper

### 6.2 API Client & State Management

- [ ] 162. Install Axios
- [ ] 163. Create `src/lib/api.ts` with Axios instance
- [ ] 164. Add request interceptor for auth token injection
- [ ] 165. Add response interceptor for error handling
- [ ] 166. Create `src/lib/jwt.ts` with token storage helpers
- [ ] 167. Install Zustand
- [ ] 168. Create `src/store/auth.store.ts`
- [ ] 169. Implement `user`, `token`, `isAuthenticated` state
- [ ] 170. Implement `setAuth()`, `logout()` actions
- [ ] 171. Create `src/store/features.store.ts`
- [ ] 172. Implement `features`, `loading`, `filter`, `sortBy` state
- [ ] 173. Implement `setFeatures()`, `addFeature()`, `updateFeature()`, `removeFeature()` actions
- [ ] 174. Create `src/store/ui.store.ts` for UI state
- [ ] 175. Create `src/types/user.ts`
- [ ] 176. Create `src/types/feature.ts`
- [ ] 177. Create `src/types/vote.ts`
- [ ] 178. Create `src/types/api.ts` for API response types

### 6.3 UI Components

- [ ] 179. Install clsx, tailwind-merge, class-variance-authority
- [ ] 180. Install lucide-react for icons
- [ ] 181. Create `src/components/ui/button.tsx`
- [ ] 182. Create `src/components/ui/input.tsx`
- [ ] 183. Create `src/components/ui/card.tsx`
- [ ] 184. Create `src/components/ui/badge.tsx`
- [ ] 185. Create `src/components/ui/skeleton.tsx`
- [ ] 186. Create `src/components/feature-card.tsx`
- [ ] 187. Create `src/components/vote-buttons.tsx` with optimistic updates
- [ ] 188. Create `src/components/status-badge.tsx`
- [ ] 189. Create `src/components/navbar.tsx`
- [ ] 190. Create `src/components/providers.tsx` for context providers

### 6.4 Pages & Views

- [ ] 191. Create `src/components/views/login-form.tsx`
- [ ] 192. Create `src/components/views/register-form.tsx`
- [ ] 193. Create `src/components/views/feature-list.tsx`
- [ ] 194. Create `src/components/views/feature-detail.tsx`
- [ ] 195. Create `src/app/login/page.tsx`
- [ ] 196. Create `src/app/register/page.tsx`
- [ ] 197. Create `src/app/features/page.tsx` with filters and sorting
- [ ] 198. Create `src/app/features/new/page.tsx`
- [ ] 199. Create `src/app/features/[id]/page.tsx`
- [ ] 200. Implement protected route wrapper component
- [ ] 201. Add redirect to login for unauthenticated users

### 6.5 Custom Hooks

- [ ] 202. Create `src/hooks/use-auth.ts`
- [ ] 203. Implement login, register, logout functions
- [ ] 204. Create `src/hooks/use-features.ts`
- [ ] 205. Implement fetch, create, update, delete functions
- [ ] 206. Create `src/hooks/use-vote.ts`
- [ ] 207. Implement vote and remove vote functions
- [ ] 208. Create `src/hooks/use-debounce.ts`
- [ ] 209. Add loading and error states to all hooks

---

## Phase 7: Mobile Frontend

### 7.1 Project Setup

- [ ] 210. Create `mobile/` directory structure
- [ ] 211. Initialize Expo project with Expo Router
- [ ] 212. Configure TypeScript in `tsconfig.json`
- [ ] 213. Install and configure NativeWind
- [ ] 214. Create `tailwind.config.js`
- [ ] 215. Configure `metro.config.js` for NativeWind
- [ ] 216. Configure `babel.config.js`
- [ ] 217. Install and configure Biome
- [ ] 218. Create `biome.json`
- [ ] 219. Create `app.json` Expo configuration
- [ ] 220. Create `src/app/_layout.tsx` root layout
- [ ] 221. Create `src/app/index.tsx` entry screen

### 7.2 Secure Storage & API Client

- [ ] 222. Install expo-secure-store
- [ ] 223. Create `src/lib/secure-store.ts` with token storage
- [ ] 224. Install Axios
- [ ] 225. Create `src/lib/api.ts` with mobile-adapted Axios instance
- [ ] 226. Create `src/lib/config.ts` with API URL config
- [ ] 227. Create `src/lib/jwt.ts` with decode helpers
- [ ] 228. Create `src/lib/utils.ts` with `cn()` helper
- [ ] 229. Adapt auth store to use SecureStore for persistence
- [ ] 230. Create `src/store/auth.store.ts`
- [ ] 231. Create `src/store/features.store.ts`
- [ ] 232. Create `src/store/ui.store.ts`

### 7.3 Mobile Components

- [ ] 233. Install lucide-react-native
- [ ] 234. Create `src/components/ui/button.tsx` (React Native)
- [ ] 235. Create `src/components/ui/input.tsx` (React Native)
- [ ] 236. Create `src/components/ui/card.tsx` (React Native)
- [ ] 237. Create `src/components/ui/badge.tsx` (React Native)
- [ ] 238. Create `src/components/ui/skeleton.tsx` (React Native)
- [ ] 239. Create `src/components/feature-card.tsx`
- [ ] 240. Create `src/components/vote-buttons.tsx`
- [ ] 241. Create `src/components/status-badge.tsx`
- [ ] 242. Create `src/components/providers.tsx`

### 7.4 Mobile Screens

- [ ] 243. Create `src/app/(auth)/_layout.tsx` auth stack layout
- [ ] 244. Create `src/app/(auth)/login.tsx`
- [ ] 245. Create `src/app/(auth)/register.tsx`
- [ ] 246. Create `src/app/(main)/_layout.tsx` tab navigation layout
- [ ] 247. Create `src/app/(main)/features/index.tsx` feature list
- [ ] 248. Create `src/app/(main)/features/new.tsx` create feature
- [ ] 249. Create `src/app/(main)/features/[id].tsx` feature detail
- [ ] 250. Create `src/app/(main)/profile/index.tsx` user profile
- [ ] 251. Implement auth navigation guard
- [ ] 252. Create `src/hooks/use-auth.ts`
- [ ] 253. Create `src/hooks/use-features.ts`
- [ ] 254. Create `src/hooks/use-vote.ts`
- [ ] 255. Create `src/hooks/use-secure-store.ts`
- [ ] 256. Create `src/types/` directory with shared types

---

## Phase 8: Testing

### 8.1 Backend Unit Tests

- [ ] 257. Create `backend/tests/` directory structure
- [ ] 258. Create test setup file with mocks
- [ ] 259. Create `tests/unit/services/auth.service.test.ts`
- [ ] 260. Test register with valid data
- [ ] 261. Test register with duplicate email
- [ ] 262. Test login with valid credentials
- [ ] 263. Test login with invalid credentials
- [ ] 264. Create `tests/unit/services/feature.service.test.ts`
- [ ] 265. Test create feature
- [ ] 266. Test list features with pagination
- [ ] 267. Test update status by author
- [ ] 268. Test update status by non-author (should fail)
- [ ] 269. Create `tests/unit/services/vote.service.test.ts`
- [ ] 270. Test create vote
- [ ] 271. Test update vote type
- [ ] 272. Test remove vote
- [ ] 273. Test vote count update
- [ ] 274. Create `tests/unit/guards/jwt-auth.guard.test.ts`
- [ ] 275. Test valid token
- [ ] 276. Test expired token
- [ ] 277. Test missing token

### 8.2 Backend Integration Tests

- [ ] 278. Configure test database connection
- [ ] 279. Create test utilities for database cleanup
- [ ] 280. Create `tests/integration/auth.test.ts`
- [ ] 281. Test full registration flow
- [ ] 282. Test full login flow
- [ ] 283. Create `tests/integration/features.test.ts`
- [ ] 284. Test CRUD operations end-to-end
- [ ] 285. Test pagination and filtering
- [ ] 286. Create `tests/integration/votes.test.ts`
- [ ] 287. Test voting flow end-to-end
- [ ] 288. Test one-vote-per-user constraint

### 8.3 Frontend Tests

- [ ] 289. Install Testing Library for React
- [ ] 290. Create `web/tests/` directory structure
- [ ] 291. Test Button component renders correctly
- [ ] 292. Test FeatureCard component displays data
- [ ] 293. Test VoteButtons click handlers
- [ ] 294. Test auth store state management
- [ ] 295. Test features store state management
- [ ] 296. Test useAuth hook
- [ ] 297. Test useFeatures hook
- [ ] 298. Test useVote hook

---

## Phase 9: Deployment

### 9.1 Backend Deployment

- [ ] 299. Create `backend/Dockerfile`
- [ ] 300. Create `backend/.dockerignore`
- [ ] 301. Configure multi-stage build for smaller image
- [ ] 302. Create `backend/fly.toml` or `railway.json`
- [ ] 303. Set up MongoDB Atlas cluster
- [ ] 304. Configure database user and network access
- [ ] 305. Set production environment variables
- [ ] 306. Configure health check endpoint in deployment config
- [ ] 307. Deploy backend to Railway/Render/Fly.io
- [ ] 308. Verify health endpoints work in production
- [ ] 309. Test API endpoints in production

### 9.2 Frontend Deployment

- [ ] 310. Create `web/vercel.json` configuration (if needed)
- [ ] 311. Connect repository to Vercel
- [ ] 312. Configure environment variables in Vercel
- [ ] 313. Set `NEXT_PUBLIC_API_URL` to production backend
- [ ] 314. Deploy to Vercel
- [ ] 315. Configure preview deployments for PRs
- [ ] 316. Verify web app works in production

### 9.3 Mobile Deployment

- [ ] 317. Install EAS CLI
- [ ] 318. Configure `eas.json` for builds
- [ ] 319. Set up iOS signing certificates
- [ ] 320. Set up Android keystore
- [ ] 321. Configure environment variables for production
- [ ] 322. Build iOS app with EAS
- [ ] 323. Build Android app with EAS
- [ ] 324. Prepare App Store assets (screenshots, description)
- [ ] 325. Prepare Play Store assets (screenshots, description)
- [ ] 326. Submit iOS app for review
- [ ] 327. Submit Android app for review
- [ ] 328. Configure OTA updates with EAS Update

---

## Final Checklist

- [ ] 329. Run full test suite and verify all tests pass
- [ ] 330. Verify API response times meet P95 < 500ms target
- [ ] 331. Check Lighthouse score for web app (target: 80+)
- [ ] 332. Document API endpoints in README
- [ ] 333. Create `.env.example` files for all projects
- [ ] 334. Review and update all README files
- [ ] 335. Set up basic monitoring/alerting
