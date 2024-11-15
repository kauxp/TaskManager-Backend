# Task Management API

A RESTful API to manage users and tasks with user authentication and admin capabilities.

## Features
- **Authentication**: User registration and login with JWT.
- **Task Management**: CRUD operations on tasks.
- **Admin Features**: Manage all users and tasks.
- **Sorting and Pagination**: Fetch tasks with filters for `status`, `priority`, `dueDate`.
- **Secure Endpoints**: JWT-based authentication.

---

## Setup Instructions

### Prerequisites
1. Install [Node.js](https://nodejs.org/) and [npm](https://www.npmjs.com/).
2. Use a cloud-based MongoDB service (e.g., [MongoDB Atlas](https://www.mongodb.com/atlas)).

### Steps
1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-username/task-management-api.git
   cd task-management-api
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Clone .env.example and create a .env file**:
    ```bash
    PORT=3000
    DB_URI=your-mongodb-uri
    JWT_SECRET=your-secret-key
    ```

4. **Start the server**:
    ```bash
    npm start
    ```

    The server will run on http://localhost:5000.

5. **Test the API**:
     
    Test the end-points on Postman. 


# 


# API Documentation

## Swagger Documentation
Access the interactive API documentation at: `/api-docs`

The Swagger UI provides:
- Interactive endpoint testing
- Request/response examples
- Schema definitions
- Authentication details

## Authentication

| Method | Endpoint | Description | Body (JSON) |
|--------|----------|-------------|-------------|
| POST | `/auth/register` | Register a new user | `{ "name": "John Doe", "email": "john@example.com", "password": "password123" }` |
| POST | `/auth/login` | Login and get a token | `{ "email": "john@example.com", "password": "password123" }` |

## Tasks

| Method | Endpoint | Description | Body (JSON) / Query Params |
|--------|----------|-------------|---------------------------|
| POST | `/tasks` | Add a new task | `{ "title": "Task 1", "description": "Details", "priority": "high", "dueDate": "2024-11-20" }` |
| GET | `/tasks` | Get tasks (with filters) | `?status=pending&priority=high&sortBy=dueDate&page=1&limit=10` |
| GET | `/tasks/:id` | Get task details by ID | None |
| PUT | `/tasks/:id` | Update a task by ID | `{ "title": "Updated Task", "status": "completed" }` |
| DELETE | `/tasks/:id` | Delete a task by ID | None |

## Admin

| Method | Endpoint | Description | Body (JSON) |
|--------|----------|-------------|-------------|
| GET | `/admin/users` | Get a list of all users | None |
| DELETE | `/admin/tasks/:id` | Delete any task (admin only) | None |

## Sorting and Pagination

* **Filters**: Use query parameters (`status`, `priority`, `dueDate`) to filter tasks.
* **Sorting**: Add `sortBy=dueDate` or `sortBy=priority`.
* **Pagination**: Add `page` and `limit` parameters.

Example:
```http
GET /tasks?status=pending&priority=high&sortBy=dueDate&page=1&limit=10
```

## Testing Steps

1. Visit /api-docs in your browser to access the Swagger documentation
2. Authorize yourself using the lock icon (if required)
3. Test endpoints directly from the Swagger UI:

    - Expand the endpoint you want to test
    - Fill in the required parameters
    - Click "Try it out"
    - View the response



## Local Testing Summary

- Use Swagger UI at /api-docs for testing all endpoints locally
- Ensure the .env file is properly set up for database and JWT secrets
- All responses are in JSON format
- Authentication uses Bearer token scheme
