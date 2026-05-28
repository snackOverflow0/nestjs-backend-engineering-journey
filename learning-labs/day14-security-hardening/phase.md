# SyncSpace API

---

# WHAT SYNCSPACE API IS

A collaborative workspace/task management backend.

Think:

```
teams
↓
workspaces
↓
tasks
↓
members
↓
real collaboration
```

---

# CORE IDEA

Users can:

* register/login
* create workspaces
* invite members
* create tasks
* assign tasks
* upload avatars
* search tasks
* paginate tasks
* cache workspace data
* use refresh authentication

---

# TECHNOLOGIES USED

| Feature  | Tech                 |
| -------- | -------------------- |
| Backend  | NestJS               |
| Database | PostgreSQL           |
| ORM      | Prisma               |
| Cache    | Redis                |
| Auth     | JWT + Refresh Tokens |
| Uploads  | Cloudinary           |
| Security | Helmet + Throttler   |

---

# FINAL PROJECT STRUCTURE

```
src/
│
├── auth/
├── users/
├── workspaces/
├── tasks/
├── upload/
├── cache/
├── prisma/
├── common/
│
├── guards/
├── decorators/
├── dto/
│
└── main.ts

---

# PROJECT PHASES

# PHASE 1 — Project Setup

* create Nest app
* install dependencies
* setup Prisma
* PostgreSQL connection

---

# PHASE 2 — Prisma Schema Design

* User model
* Workspace model
* Task model
* relations

---

# PHASE 3 — Authentication System

* register
* login
* hashing
* JWT

---

# PHASE 4 — Refresh Tokens

* refresh flow
* logout
* token rotation

---

# PHASE 5 — Workspaces Module

* create workspace
* ownership

---

# PHASE 6 — Tasks Module

* CRUD
* assign users
* filtering
* pagination

---

# PHASE 7 — Authorization

* guards
* roles
* ownership checks

---

# PHASE 8 — File Uploads

* avatar upload
* Cloudinary integration

---

# PHASE 9 — Redis Caching

* cache workspaces
* invalidate cache

---

# PHASE 10 — Security Hardening

* Helmet
* rate limiting
* CORS

---

# PHASE 11 — Final Refactor

* clean architecture
* reusable utilities
* response formatting

---

# PHASE 12 — Production Readiness

* env validation
* logging basics
* final cleanup

---
