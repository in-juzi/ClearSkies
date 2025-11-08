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
│   │   ├── authController.js
│   │   └── skillsController.js
│   ├── middleware/        # Auth and other middleware
│   ├── migrations/        # Database migrations
│   ├── models/           # Mongoose schemas
│   │   ├── User.js
│   │   └── Player.js
│   ├── routes/           # API routes
│   │   ├── auth.js
│   │   └── skills.js
│   └── utils/            # Utility functions (JWT, migrations, etc.)
├── ui/                    # Frontend (Angular 20)
│   └── src/
│       ├── assets/       # Static assets (icons, images)
│       └── app/
│           ├── components/      # UI components
│           │   ├── game/       # Game-related components
│           │   │   ├── game.component.*
│           │   │   └── skills/ # Skills component
│           │   ├── login/
│           │   └── register/
│           ├── services/        # Angular services
│           │   ├── auth.service.ts
│           │   └── skills.service.ts
│           ├── guards/          # Route guards
│           │   └── auth.guard.ts (authGuard, guestGuard)
│           ├── interceptors/    # HTTP interceptors
│           │   └── auth.interceptor.ts
│           └── models/          # TypeScript interfaces
│               └── user.model.ts
├── project/               # Project management
│   ├── ideas/            # Feature ideas and concepts
│   ├── tasks/
│   │   ├── todo/         # Pending tasks
│   │   └── complete/     # Completed tasks
│   └── journal.md        # Development journal
└── .claude/
    └── commands/         # Custom Claude commands
        ├── todo.md
        ├── todo-done.md
        └── context-update.md
```

## Running the Project

- **Backend**: `npm run dev:be` (runs on http://localhost:3000)
- **Frontend**: `npm run dev:ui` (runs on http://localhost:4200)
- **Both**: `npm run dev` (runs both concurrently)

## Important Context

### Completed Features
- ✅ User authentication system (register/login/logout)
- ✅ JWT token-based session management with localStorage persistence
- ✅ Session persistence across page refreshes
- ✅ Protected routes with async auth guards (authGuard, guestGuard)
- ✅ HTTP interceptor for automatic JWT token attachment
- ✅ Player profile with character stats
- ✅ MongoDB models (User, Player)
- ✅ Game interface with stats display
- ✅ Skills system with 5 skills (woodcutting, mining, fishing, smithing, cooking)
- ✅ Skills UI with PNG icons and progress tracking
- ✅ XP gain and automatic skill leveling (1000 XP per level)
- ✅ Database migration system with up/down functions
- ✅ Skills API endpoints (GET all skills, GET single skill, POST add XP)

### Database Models

**User** (Authentication):
- username, email, password (hashed)
- isActive status, lastLogin timestamp

**Player** (Game Data):
- characterName, level, experience
- stats (health, mana, strength, dexterity, intelligence, vitality)
- skills (woodcutting, mining, fishing, smithing, cooking) - each with level & experience (1000 XP per level)
- gold, inventory, location, questProgress, achievements, skills
- Methods: `addSkillExperience(skillName, xp)`, `getSkillProgress(skillName)`

### API Endpoints

**Authentication:**
- `POST /api/auth/register` - Create account
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Get profile (protected)
- `POST /api/auth/logout` - Logout (protected)

**Skills:**
- `GET /api/skills` - Get all player skills (protected)
- `GET /api/skills/:skillName` - Get single skill details (protected)
- `POST /api/skills/:skillName/experience` - Add XP to skill (protected)

## Development Guidelines

1. **Backend Changes**: Always update relevant models, controllers, routes
2. **Database Schema Changes**: Create migrations for model updates (see Database Migrations below)
3. **Frontend Changes**:
   - Use Angular signals for state management
   - All game-related components should be organized under `ui/src/app/components/game/`
   - Use standalone components with Angular 20
4. **Authentication**:
   - All protected endpoints use JWT middleware
   - Token stored in localStorage with key `clearskies_token`
   - Auth interceptor directly accesses localStorage to avoid circular dependencies
   - Guards use async initialization pattern with `initialized$` observable
5. **Assets**: Store icons and images in `ui/src/assets/` (configured in angular.json)
6. **Styling**: Use medieval fantasy theme (dark blues, purples, gold accents)
7. **Documentation**: Update project/journal.md and relevant task files

## Database Migrations

When modifying database schemas (Player, User models), create a migration to update existing records:

**Running Migrations:**
```bash
cd be
npm run migrate          # Run all pending migrations
npm run migrate:status   # Check migration status
npm run migrate:down     # Rollback last migration
```

**Creating a New Migration:**
1. Create a file in `be/migrations/` with format: `NNN-description.js`
2. Export `up()` and `down()` functions
3. Include name and description
4. Example: `be/migrations/001-add-skills-to-players.js`

**Migration Template:**
```javascript
async function up() {
  const Model = mongoose.model('ModelName');
  // Update logic here
  return { modified: count, message: 'Success message' };
}

async function down() {
  const Model = mongoose.model('ModelName');
  // Rollback logic here
  return { modified: count, message: 'Rollback message' };
}

module.exports = {
  up,
  down,
  name: '001-migration-name',
  description: 'What this migration does'
};
```

## Custom Commands

- `/todo` - Save AI response as a new todo task
- `/todo-done <filename>` - Move todo to completed
- `/context-update` - Update CLAUDE.md with latest project context and changes

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
