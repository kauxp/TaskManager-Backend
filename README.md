# Task Management API

A RESTful API to manage users and tasks with JWT authentication, admin capabilities, and full CI/CD pipeline.

## Features
- **Authentication**: User registration and login with JWT
- **Task Management**: CRUD operations on tasks
- **Admin Features**: Manage all users and tasks
- **Sorting and Pagination**: Filter by `status`, `priority`, `dueDate`
- **Containerized**: Docker + Kubernetes ready
- **CI/CD**: Automated testing, building, and deployment

---

## How to Run Locally

### Option 1: Node.js (Development)

```bash
# 1. Install dependencies
npm install

# 2. Create .env file
cp .env.example .env
# Edit .env with your values

# 3. Start the server
npm run dev
```

### Option 2: Docker

```bash
# Build and run
docker build -t task-backend:latest .
docker run -p 3000:3000 \
  -e MONGO_DB_URL="mongodb://host.docker.internal:27017/taskdb" \
  -e JWT_SECRET="your-secret" \
  -e PORT="3000" \
  task-backend:latest
```

### Option 3: Kubernetes (Docker Desktop)

```bash
# 1. Create secrets
kubectl create secret generic task-backend-secrets \
  --from-literal=MONGO_DB_URL="mongodb://mongo:27017/taskdb" \
  --from-literal=JWT_SECRET="your-secret" \
  --from-literal=PORT="3000"

# 2. Deploy MongoDB + App
kubectl apply -f k8s/mongo.yml
kubectl apply -f k8s/deployment.yml
kubectl apply -f k8s/service.yml

# 3. Verify
kubectl get pods
curl http://localhost:30007/health
```

---

## Secrets Configuration

### Local Development (.env)
```env
PORT=3000
MONGO_DB_URL=mongodb://localhost:27017/taskdb
JWT_SECRET=your-jwt-secret
```

### GitHub Actions Secrets
Set these in **Settings → Secrets and variables → Actions**:

| Secret | Description |
|--------|-------------|
| `MONGO_DB_URL` | MongoDB connection string |
| `JWT_SECRET` | JWT signing secret |
| `DOCKER_USERNAME` | Docker Hub username |
| `DOCKER_PASSWORD` | Docker Hub password/token |
| `KUBE_CONFIG` | Base64-encoded kubeconfig for CD |

### Kubernetes Secrets
```bash
kubectl create secret generic task-backend-secrets \
  --from-literal=MONGO_DB_URL="..." \
  --from-literal=JWT_SECRET="..." \
  --from-literal=PORT="3000"
```

---

## CI/CD Pipeline

### CI Pipeline (`.github/workflows/ci.yml`)

Triggered on push to `main` or manual dispatch.

```
┌─────────────────────────────────────────────────────────┐
│                    CI Pipeline                          │
├─────────────────────────────────────────────────────────┤
│ 1. Checkout Code                                        │
│ 2. Setup Node.js 20 (with npm cache)                    │
│ 3. Install Dependencies (npm ci)                        │
│ 4. Lint Code (npm run lint)                             │
│ 5. Run Unit Tests (npm test)                            │
│ 6. Build Docker Image                                   │
│ 7. Run Container & Health Check (/health)               │
│ 8. Push to Docker Hub                                   │
└─────────────────────────────────────────────────────────┘
```

| Stage | Purpose |
|-------|---------|
| **Lint** | Enforce code quality with ESLint |
| **Test** | Run Mocha + Supertest unit tests |
| **Build** | Create Docker image |
| **Validate** | Run container, check `/health` endpoint |
| **Push** | Publish verified image to Docker Hub |

### CD Pipeline (`.github/workflows/cd.yml`)

Triggered after successful CI or manual dispatch.

```
┌─────────────────────────────────────────────────────────┐
│                    CD Pipeline                          │
├─────────────────────────────────────────────────────────┤
│ 1. Configure kubectl with KUBE_CONFIG secret            │
│ 2. Create/Update K8s secrets                            │
│ 3. Apply deployment.yml & service.yml                   │
│ 4. Wait for rollout completion                          │
│ 5. Run smoke test (curl /health inside pod)             │
└─────────────────────────────────────────────────────────┘
```

---

## API Documentation

Access Swagger UI at: `http://localhost:3000/api-docs`

### Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/register` | Register user |
| POST | `/auth/login` | Login, get JWT |
| GET | `/tasks` | List tasks (with filters) |
| POST | `/tasks` | Create task |
| GET | `/tasks/:id` | Get task by ID |
| PUT | `/tasks/:id` | Update task |
| DELETE | `/tasks/:id` | Delete task |
| GET | `/health` | Health check |

---

## Switching Kubernetes Providers

The manifests are designed for portability. To switch providers:

| Provider | Service Type | Notes |
|----------|--------------|-------|
| **Local (Docker Desktop/Minikube)** | `NodePort` | Access via `localhost:30007` |
| **Cloud (GKE/EKS/AKS)** | `LoadBalancer` | Gets external IP automatically |

Edit `k8s/service.yml`:
```yaml
spec:
  type: LoadBalancer  # Change from NodePort
```
