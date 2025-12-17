# Non-Functional Requirements

## Target Scenario: MVP

### User Metrics

| Metric | Value |
|--------|-------|
| Total Users | 5,000 |
| DAU (Daily Active Users) | 500 (10%) |
| Features (total) | 2,500 |
| Votes (total) | 25,000 |

---

## Traffic Calculations

### Assumptions

- Active session: 10 min/day average
- Actions per session: 15 (views, votes, creates)
- Peak multiplier: 3x average
- Read:Write ratio: 80:20

### Requests Per Second (RPS)

| Metric | Value |
|--------|-------|
| Daily requests | 7,500 |
| Avg RPS | 1 |
| Peak RPS | 3 |
| Peak Read RPS | 2.4 |
| Peak Write RPS | 0.6 |

### Breakdown by Endpoint (Peak)

| Endpoint | RPS |
|----------|-----|
| `GET /features` | 1.8 |
| `GET /features/:id` | 0.3 |
| `POST /features/:id/vote` | 0.3 |
| `POST /features` | 0.1 |
| `POST /auth/*` | 0.2 |
| Other | 0.3 |

---

## Database Sizing

### Document Sizes (Average)

- User: ~500 bytes
- Feature: ~1 KB
- Vote: ~200 bytes

### Storage Estimates

| Collection | Size |
|------------|------|
| Users | 2.5 MB |
| Features | 2.5 MB |
| Votes | 5 MB |
| Indexes | ~5 MB |
| **Total** | **~15 MB** |

### MongoDB Operations/sec (Peak)

| Operation | Ops/sec |
|-----------|---------|
| Find | 2.4 |
| Insert | 0.3 |
| Update | 0.3 |
| **Total** | **3** |

---

## Infrastructure Requirements

### Backend (Node.js/Fastify)

| Resource | Specification |
|----------|---------------|
| Instances | 1 |
| CPU | 1 vCPU |
| RAM | 512 MB - 1 GB |
| Node cluster | No (single process) |

### MongoDB

| Resource | Specification |
|----------|---------------|
| Deployment | MongoDB Atlas M0 (free) or M2 |
| RAM | 512 MB |
| Storage | 512 MB - 1 GB |
| IOPS | 100 |
| Connections | 20 |

### Caching (Options)

#### Option A: node-cache (In-Memory)

| Resource | Specification |
|----------|---------------|
| Type | In-process memory |
| RAM | 50-100 MB |
| Pros | Zero latency, no external dependency |
| Cons | Lost on restart, not shared across instances |

#### Option B: Cloud Managed Redis (Recommended for scaling)

| Resource | Specification |
|----------|---------------|
| Provider | AWS ElastiCache / Redis Cloud / Upstash |
| Plan | Free tier or minimal ($0-10/mo) |
| RAM | 25-100 MB |
| Connections | 30 |
| Pros | Persistent, shared across instances, ready for scale |
| Cons | Network latency (~1-5ms), additional cost |

**Recommendation:** Start with node-cache for simplicity. Switch to Redis when:
- Adding second backend instance
- Needing cache persistence across deploys
- Implementing distributed rate limiting

---

## Caching Strategy

### Cache Keys

```
features:list:{sort}:{status}:{page}
features:detail:{id}
features:votes:{id}
user:profile:{id}
```

### TTL Configuration

| Data | TTL | Invalidation |
|------|-----|--------------|
| Feature list | 60s | On create/delete |
| Feature detail | 30s | On update |
| Vote counts | 10s | On vote |
| User profile | 300s | On update |

### Target Cache Hit Ratio

- Features list: 70%+
- Feature detail: 60%+
- Overall: 65%+

---

## Performance SLAs

| Metric | Target |
|--------|--------|
| Availability | 95% |
| Downtime/month | 36 hours |
| P50 latency | < 200ms |
| P95 latency | < 500ms |
| P99 latency | < 1s |
| Error rate | < 5% |

---

## Rate Limiting

### Global Configuration

```typescript
{
  max: 100,
  timeWindow: '1 minute'
}
```

### Per-Endpoint Limits

| Endpoint | Limit |
|----------|-------|
| `POST /auth/login` | 10/min |
| `POST /auth/register` | 5/min |
| `POST /features` | 20/min |
| `POST /*/vote` | 60/min |
| `GET /*` | 100/min |

### Store

- MVP: In-memory (default Fastify)
- With Redis: `@fastify/rate-limit` with Redis store

---

## Security Requirements

| Requirement | Implementation |
|-------------|----------------|
| Authentication | JWT (HS256) |
| Token expiry | 24 hours |
| Password hashing | bcrypt (12 rounds) |
| HTTPS | Required in production |
| CORS | Configured whitelist |
| Headers | Helmet defaults |
| Input validation | Fastify JSON Schema |

---

## Monitoring & Observability

### Logging (Pino)

| Level | Usage |
|-------|-------|
| error | Exceptions, failed requests |
| warn | Rate limits, validation failures |
| info | Request/response, auth events |
| debug | Development only |

### Key Metrics to Track

- Request count by endpoint
- Response time (P50, P95, P99)
- Error rate by type
- Active users (DAU/WAU/MAU)
- Cache hit ratio
- Database connection pool usage

### Health Checks

| Endpoint | Checks |
|----------|--------|
| `GET /health` | App running |
| `GET /health/ready` | DB connected, cache available |

---

## Scaling Triggers (Future Growth)

| Metric | Trigger | Action |
|--------|---------|--------|
| DAU > 1,000 | Scale warning | Monitor closely |
| RPS avg > 3 | Scale needed | Add instance |
| P99 > 1s | Performance issue | Add Redis cache |
| DB connections > 80% | DB saturation | Upgrade Atlas tier |
| Error rate > 5% | Stability issue | Investigate + scale |

---

## Architecture Diagram (MVP)

```
┌──────────────┐     ┌──────────────────────────────────────┐
│   Clients    │     │           Backend Server             │
│  (Web/Mobile)│     │                                      │
└──────┬───────┘     │  ┌─────────┐    ┌───────────────┐   │
       │             │  │ Fastify │───▶│  node-cache   │   │
       │ HTTPS       │  │         │    │  (in-memory)  │   │
       ▼             │  └────┬────┘    └───────────────┘   │
┌──────────────┐     │       │                             │
│     CDN      │────▶│       │ OR (optional)               │
│  (optional)  │     │       │    ┌───────────────┐        │
└──────────────┘     │       │───▶│ Cloud Redis   │        │
                     │       │    │ (ElastiCache) │        │
                     │       │    └───────────────┘        │
                     │       ▼                             │
                     │  ┌─────────────────┐                │
                     │  │  MongoDB Atlas  │                │
                     │  │   (M0 / M2)     │                │
                     │  └─────────────────┘                │
                     └──────────────────────────────────────┘
```

---

## Cost Estimate (Monthly)

| Service | Provider | Cost |
|---------|----------|------|
| Compute | Railway / Render / Fly.io | $5-10 |
| Database | MongoDB Atlas M0/M2 | $0-10 |
| Cache (Redis) | Upstash / Redis Cloud | $0-10 |
| Domain + SSL | Cloudflare | $0 |
| **Total** | | **$5-30** |
