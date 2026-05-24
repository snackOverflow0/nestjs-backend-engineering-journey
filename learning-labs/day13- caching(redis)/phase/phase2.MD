Excellent.
FlashSale API foundation is now ready.

You now officially have:

# a multi-database backend architecture

---

# YOUR CURRENT SYSTEM

```txt id="n7x4pq"
NestJS
├── PostgreSQL
├── Prisma
├── JWT auth foundation
└── Redis infrastructure
```

---

# HUGE ENGINEERING CONCEPT

You are now working with:

# polyglot persistence

Meaning:
different databases for different purposes.

---

# DATABASE RESPONSIBILITIES

## PostgreSQL

Stores:

```txt id="v4m8ky"
users
products
persistent data
```

Reliable long-term storage.

---

## Redis

Stores:

```txt id="g1q5rw"
cache
sessions
fast counters
temporary data
```

Ultra-fast in-memory storage.

---

# THIS IS:

# real production architecture

---

# NEXT

# PHASE 2 — DATABASE DESIGN

Now we build:

# the relational foundation

---

# WHAT YOU WILL BUILD

## User Model

Supports:

* authentication
* refresh tokens
* future ownership

---

## Product Model

Supports:

* e-commerce products
* cached product feeds
* trending systems

---

# WHAT YOU WILL LEARN

## Relational E-commerce Design

```txt id="j8n2mp"
User
↓
Products
```

---

## Refresh Token Architecture

```txt id="u6x4zr"
hashedRefreshToken
```

stored securely.

---

# FINAL DATABASE STRUCTURE

```txt id="q1v9kw"
User
├── id
├── email
├── password
└── hashedRefreshToken

Product
├── id
├── name
├── description
├── price
├── stock
├── createdAt
└── userId
```

---

# HUGE CONCEPT

Products belong to:

# authenticated users

This prepares you for:

* ownership
* admin systems
* seller systems

---

# STEP 1 — OPEN SCHEMA

Open:

```txt id="r5m3qn"
prisma/schema.prisma
```

---

# STEP 2 — CREATE USER MODEL

Add:

```prisma id="f8x1vk"
model User {
  id Int @id
  @default(autoincrement())

  email String @unique

  password String

  hashedRefreshToken String?

  products Product[]

  createdAt DateTime
  @default(now())
}
```

---

# HUGE CONCEPT

```prisma id="n4q7py"
hashedRefreshToken String?
```

Optional because:

```txt id="x2m8wc"
user may not be logged in
```

---

# STEP 3 — CREATE PRODUCT MODEL

Add:

```prisma id="u9r4kb"
model Product {
  id Int @id
  @default(autoincrement())

  name String

  description String

  price Float

  stock Int

  createdAt DateTime
  @default(now())

  userId Int

  user User @relation(
    fields: [userId],
    references: [id]
  )
}
```

---

# HUGE CONCEPT

This creates:

# one-to-many relation

```txt id="m6v1qp"
One User
↓
Many Products
```

---

# STEP 4 — RUN MIGRATION

```bash id="y3q8mf"
npx prisma migrate dev --name init
```

---

# STEP 5 — GENERATE PRISMA CLIENT

Usually automatic, but run:

```bash id="k7m2zx"
npx prisma generate
```

---

# STEP 6 — CREATE PRISMA SERVICE

Open:

```txt id="q9w4tn"
src/prisma/prisma.service.ts
```

Replace with:

```ts id="c2x6pv"
import {
  Injectable,

  OnModuleInit,
} from '@nestjs/common';

import { PrismaClient }
from '@prisma/client';

@Injectable()

export class PrismaService
  extends PrismaClient
  implements OnModuleInit
{
  async onModuleInit() {
    await this.$connect();
  }
}
```

---

# STEP 7 — EXPORT PRISMA SERVICE

Open:

```txt id="g4n8ry"
src/prisma/prisma.module.ts
```

Replace with:

```ts id="v1m5kw"
import { Module }
from '@nestjs/common';

import { PrismaService }
from './prisma.service';

@Module({
  providers: [
    PrismaService,
  ],

  exports: [
    PrismaService,
  ],
})

export class PrismaModule {}
```

---

# HUGE CONCEPT

Now:

```txt id="j2x7qc"
PrismaService
```

can be injected anywhere.

---

# FINAL DATABASE ARCHITECTURE

```txt id="b8m4vr"
User
↓
Products
```

with:

```txt id="n5q1xp"
secure auth persistence
```

---

# PHASE 2 COMPLETE WHEN:

✔ User model created
✔ Product model created
✔ relations working
✔ migration successful
✔ PrismaService configured
✔ PrismaModule exported

Then send:

# “PHASE 2 COMPLETE”
