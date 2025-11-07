# ClearSkies - Medieval Fantasy Browser Game

## Project Overview

ClearSkies is a medieval fantasy browser-based game built with a modern tech stack:
- **Backend**: Node.js + Express + MongoDB
- **Frontend**: Angular 20 (standalone components)
- **Authentication**: JWT-based with bcrypt password hashing

## Project Structure

```
ClearSkies/
├── be/                     # Backend (Node.js/Express)
│   ├── config/            # Database configuration
│   ├── controllers/       # Request handlers
│   ├── middleware/        # Auth and other middleware
│   ├── models/           # Mongoose schemas
│   ├── routes/           # API routes
│   └── utils/            # Utility functions (JWT, etc.)
├── ui/                    # Frontend (Angular 20)
│   └── src/
│       └── app/
│           ├── components/   # UI components
│           ├── services/     # Angular services
│           ├── guards/       # Route guards
│           ├── interceptors/ # HTTP interceptors
│           └── models/       # TypeScript interfaces
├── project/               # Project management
│   ├── ideas/            # Feature ideas and concepts
│   ├── tasks/
│   │   ├── todo/         # Pending tasks
│   │   └── complete/     # Completed tasks
│   └── journal.md        # Development journal
└── .claude/
    └── commands/         # Custom Claude commands
```

## Running the Project

- **Backend**: `npm run dev:be` (runs on http://localhost:3000)
- **Frontend**: `npm run dev:ui` (runs on http://localhost:4200)
- **Both**: `npm run dev` (runs both concurrently)

## Important Context

### Completed Features
- ✅ User authentication system (register/login/logout)
- ✅ JWT token-based session management
- ✅ Player profile with character stats
- ✅ Protected routes with auth guards
- ✅ MongoDB models (User, Player)
- ✅ Game interface with stats display

### Database Models

**User** (Authentication):
- username, email, password (hashed)
- isActive status, lastLogin timestamp

**Player** (Game Data):
- characterName, level, experience
- stats (health, mana, strength, dexterity, intelligence, vitality)
- gold, inventory, location, questProgress, achievements, skills

### API Endpoints
- `POST /api/auth/register` - Create account
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Get profile (protected)
- `POST /api/auth/logout` - Logout (protected)

## Development Guidelines

1. **Backend Changes**: Always update relevant models, controllers, routes
2. **Frontend Changes**: Use Angular signals for state management
3. **Authentication**: All protected endpoints use JWT middleware
4. **Styling**: Use medieval fantasy theme (dark blues, purples, gold accents)
5. **Documentation**: Update project/journal.md and relevant task files

## Custom Commands

- `/todo` - Save AI response as a new todo task
- `/todo-done <filename>` - Move todo to completed

## Environment Variables

Backend requires `.env` file with:
- `PORT` - Server port (default: 3000)
- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - Secret key for JWT tokens
- `JWT_EXPIRE` - Token expiration (default: 7d)

## Next Steps / Ideas

See `project/journal.md` for detailed development possibilities including:
- Combat system
- Quest system
- Inventory management
- World map
- Real-time multiplayer features
- NPC interactions
