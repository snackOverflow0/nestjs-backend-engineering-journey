# FLASHSALE API — DAY 13

# PHASE 1 — PROJECT SETUP

Now we begin:

# backend performance engineering

This project will teach you:

* Redis
* caching
* scalable API performance
* cache invalidation
* trending systems

BUT:
we will still reuse:

# professional auth architecture

---

# FINAL PROJECT

# FlashSale API

A high-performance e-commerce backend with:

✔ JWT auth
✔ Refresh tokens
✔ Product system
✔ Redis caching
✔ Trending counters
✔ Rate limiting
✔ Cache invalidation

---

# PHASE 1 GOAL

Build:

# scalable backend foundation

---

# WHAT YOU WILL SETUP

✔ NestJS project
✔ Prisma
✔ PostgreSQL
✔ Redis
✔ Auth modules
✔ Product modules
✔ Cache modules

---

# STEP 1 — CREATE PROJECT

```bash id="n7x2qm"
nest new flashsale-api
```

Choose:

```txt id="g5r1pk"
npm
```

---

# STEP 2 — ENTER PROJECT

```bash id="u9m4vw"
cd flashsale-api
```

---

# STEP 3 — INSTALL PRISMA

```bash id="k8q3yf"
npm install prisma @prisma/client
```

---

# STEP 4 — INSTALL AUTH DEPENDENCIES

```bash id="p2x7mc"
npm install \
@nestjs/jwt \
@nestjs/passport \
passport \
passport-jwt \
bcrypt
```

---

# STEP 5 — INSTALL VALIDATION

```bash id="t4m1zb"
npm install \
class-validator \
class-transformer
```

---

# STEP 6 — INSTALL REDIS

Install Redis packages:

```bash id="w7q5nd"
npm install redis
```

---

# HUGE CONCEPT

Redis is:

# an in-memory database

VERY fast compared to PostgreSQL.

---

# STEP 7 — INSTALL TYPES

```bash id="m1k9xr"
npm install -D \
@types/bcrypt
```

---

# STEP 8 — INITIALIZE PRISMA

```bash id="f6v2qp"
npx prisma init
```

---

# STEP 9 — CREATE MODULES

Generate:

```bash id="z3n8tw"
nest g module prisma
nest g service prisma

nest g module auth
nest g controller auth
nest g service auth

nest g module users
nest g controller users
nest g service users

nest g module products
nest g controller products
nest g service products

nest g module cache
nest g service cache
```

---

# HUGE CONCEPT

We separate:

* business logic
* infrastructure
* features

into:

# modules

---

# STEP 10 — SETUP ENV VARIABLES

Replace with:

DATABASE_URL="postgresql://postgres:password@localhost:5432/flashsaledb"

JWT_SECRET="supersecret"

REDIS_URL="redis://localhost:6379"


# STEP 11 — CREATE DATABASE

Inside PostgreSQL create:

```txt id="s1w6nm"
flashsaledb
```

---

# STEP 12 — ENABLE VALIDATION

Open:

```txt id="x7m3pf"
src/main.ts
```

Add:

```ts id="q2r8ky"
import {
  ValidationPipe,
} from '@nestjs/common';
```

---

# ENABLE GLOBAL PIPE

```ts id="j9x1mc"
app.useGlobalPipes(
  new ValidationPipe(),
);
```

---

# FINAL VERSION

```ts id="d5m4qw"
async function bootstrap() {
  const app =
    await NestFactory
      .create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe(),
  );

  await app.listen(
    process.env.PORT ?? 3000,
  );
}
```

---

# STEP 13 — INSTALL REDIS SERVER

IMPORTANT:
the package is NOT enough.

You need:

# Redis server running locally

---

# WINDOWS OPTIONS

Best option:

# Docker

OR:

# Redis for Windows

---

# SIMPLE OPTION (Recommended)

Install Docker Desktop:

# [Docker Desktop](https://www.docker.com/products/docker-desktop/?utm_source=chatgpt.com)

Then run:

```bash id="p8k5vn"
docker run --name redis \
-p 6379:6379 \
-d redis
```

---

# HUGE CONCEPT

```txt id="n6q2wr"
redis package
```

=
Node.js client

---

```txt id="f3m8xp"
redis server
```

=
actual Redis database

---

# STEP 14 — RUN SERVER

```bash id="y1v7md"
npm run start:dev
```

---

# PHASE 1 COMPLETE WHEN:

✔ project runs
✔ Prisma initialized
✔ PostgreSQL connected
✔ Redis server running
✔ modules generated
✔ validation enabled

Then send:

# “PHASE 1 COMPLETE”
