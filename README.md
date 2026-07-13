# Vertex

A full-stack authentication and app platform built with a React/TypeScript frontend and an ASP.NET Core backend, featuring secure JWT-based auth, Google OAuth, and a to-do list app to demonstrate authenticated CRUD functionality.

## Live Demo

- **Frontend:** (add your Vercel URL here)
- **Backend API:** (add your Render URL here)

> Note: the backend runs on Render's free tier and may take 30–60 seconds to respond on the first request after a period of inactivity (cold start).

## Tech Stack

**Frontend**
- React + TypeScript + Vite
- Skeleton loading screens and offline detection

**Backend**
- ASP.NET Core Web API
- Entity Framework Core
- PostgreSQL (hosted via Neon)
- JWT authentication with refresh tokens
- Google OAuth 2.0
- DNS-based email validation on registration

**Hosting**
- Frontend: Vercel
- Backend: Render
- Database: Neon (serverless PostgreSQL)

## Features

- User registration and login with JWT access + refresh tokens
- Google OAuth sign-in
- Forgot password / reset password email flow
- DNS-based email validation (rejects invalid/non-existent domains at signup)
- Profile page with account management
- To-do list with full CRUD, scoped per authenticated user
- Offline detection with graceful UI fallback
- Skeleton loading states across the app
- Mobile-responsive layout with hamburger navigation

## Project Structure

```
/
├── Frontend/          # React + TypeScript + Vite client
│   ├── src/
│   └── package.json
├── Backend/           # ASP.NET Core Web API
│   ├── Controllers/
│   ├── Models/
│   ├── Data/           # EF Core DbContext, migrations
│   └── Vertex.csproj   # adjust to your actual project name
└── README.md
```

## API Endpoints

| Method | Endpoint                      | Description                          |
|--------|--------------------------------|----------------------------------------|
| POST   | `/api/auth/register`          | Register a new user                    |
| POST   | `/api/auth/login`             | Log in and receive JWT + refresh token |
| POST   | `/api/auth/refresh`           | Exchange refresh token for new JWT     |
| POST   | `/api/auth/google`            | Google OAuth login                     |
| POST   | `/api/auth/forgot-password`   | Send password reset email              |
| POST   | `/api/auth/reset-password`    | Reset password with token              |
| GET    | `/api/todos`                  | Get current user's to-do items         |
| POST   | `/api/todos`                  | Create a to-do item                    |
| PATCH  | `/api/todos/{id}`             | Update a to-do item                    |
| DELETE | `/api/todos/{id}`             | Delete a to-do item                    |
| GET    | `/api/profile`                | Get current user's profile             |

*(Adjust routes above to match your actual controller definitions.)*

## Running Locally

### Backend

```bash
cd Backend
dotnet ef database update
dotnet run
```

Configuration needed (via `appsettings.Development.json` or user secrets):

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "your-neon-postgres-connection-string"
  },
  "Jwt": {
    "Secret": "your-jwt-secret",
    "Issuer": "vertex",
    "Audience": "vertex-users"
  },
  "GoogleOAuth": {
    "ClientId": "your-google-client-id",
    "ClientSecret": "your-google-client-secret"
  },
  "Email": {
    "SmtpHost": "your-smtp-host",
    "SmtpUser": "your-smtp-user",
    "SmtpPassword": "your-smtp-password"
  }
}
```

### Frontend

```bash
cd Frontend
npm install
npm run dev
```

Create a `.env` file in `Frontend/` with:

```
VITE_API_URL=http://localhost:5000/api
VITE_GOOGLE_CLIENT_ID=your-google-client-id
```

## Deployment Notes

- **Backend** is deployed on Render. Nested configuration keys use `__` (double underscore) instead of `:` in Render's environment variables (e.g. `Jwt__Secret`).
- **Frontend** is deployed on Vercel as a static build.
- **Database** connection string points to a Neon PostgreSQL instance.
- CORS on the backend must explicitly allow the deployed Vercel origin.

## Known Issues / In Progress

- Investigating slow login page load times, likely caused by Render free-tier cold starts, password hashing cost factor, or EF Core query efficiency.

## License

This project is for personal/portfolio use.
