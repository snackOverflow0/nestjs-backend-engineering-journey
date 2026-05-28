# FULL SYSTEM FEATURES

```
POST   /auth/register
POST   /auth/login
POST   /auth/refresh
POST   /auth/logout

POST   /workspaces
GET    /workspaces

POST   /tasks
GET    /tasks
PATCH  /tasks/:id

PATCH  /users/avatar

GET    /tasks/search
GET    /tasks/paginated
```

---

# DATABASE DESIGN

```txt id="x0u3ij"
User
 ├── Workspaces
 ├── Tasks
 └── Avatar

Workspace
 └── Tasks

Task
 ├── Assigned User
 └── Workspace
```
# MOST IMPORTANT FLOWS YOU WILL LEARN

# AUTH FLOW

```
Request
↓
Controller
↓
AuthService
↓
Prisma
↓
JWT generation
↓
Response
```

---

# PROTECTED ROUTE FLOW

```
Request
↓
JWT Guard
↓
Controller
↓
Service
↓
Database
```

---

# CACHE FLOW

```
Request
↓
Redis cache check
↓
Cache hit?
 ├── YES → return cached data
 └── NO → query database
            ↓
         store in Redis
            ↓
         return response
```

---

# FILE UPLOAD FLOW

```
Client
↓
Multer
↓
UploadService
↓
Cloudinary
↓
Save URL in PostgreSQL
```

---

# SECURITY FLOW

```
Request
↓
Helmet
↓
Rate Limiter
↓
ValidationPipe
↓
JWT Guard
↓
Controller
↓
Service
```

