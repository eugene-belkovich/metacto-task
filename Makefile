NODE_ENV ?= development
CACHE ?= 0
JWT_DISABLED ?= 0

.PHONY: start-backend
start-backend:
	cd backend && CACHE_ENABLED=$(CACHE) JWT_DISABLED=$(JWT_DISABLED) NODE_ENV=$(NODE_ENV) npm run dev

.PHONY: build-backend
build-backend:
	cd backend && npm run build

.PHONY: start-backend-prod
start-backend-prod:
	cd backend && CACHE_ENABLED=$(CACHE) JWT_DISABLED=$(JWT_DISABLED) NODE_ENV=production npm run start
