# ClearSkies Development Journal

## Project Overview
Medieval fantasy browser game built with:
- **Backend**: Node.js + Express + MongoDB
- **Frontend**: Angular 20 (standalone components)

## Development Possibilities

### Game Mechanics
- Character creation system
- Combat system
- Inventory management
- Quest system
- Character progression/leveling
- Skills and abilities

### World Building
- Locations and map system
- NPCs (Non-Player Characters)
- Items database
- Lore and storytelling
- Factions and reputation

### User Authentication
- Player accounts
- Session management
- User profiles
- Password security
- Account recovery

### Real-time Features
- WebSocket integration for multiplayer
- Live chat system
- Real-time updates (combat, events)
- Player interactions
- Notifications

### UI/UX
- Game interface design
- Interactive map display
- Character sheets
- Inventory interface
- Quest log
- Combat visualization
- Responsive design for mobile/desktop

## Implementation Status

### ✅ Completed: User Authentication & Session Management

**Backend Implementation:**
- User model with secure password hashing (bcrypt)
- Player model with character stats, inventory, and progression
- JWT-based authentication system
- Auth middleware for route protection
- Auth controller with register, login, logout, and profile endpoints
- Input validation using express-validator
- CORS support for frontend integration

**Frontend Implementation:**
- TypeScript models for User and Player
- AuthService with Angular signals for reactive state management
- HTTP interceptor for automatic JWT token attachment
- Auth guard for protecting routes
- Guest guard for redirecting authenticated users
- Environment configuration for API URLs

**API Endpoints:**
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user profile
- `POST /api/auth/logout` - Logout user

**Features:**
- Secure password storage with bcrypt hashing
- JWT tokens with configurable expiration
- Automatic last login tracking
- Player profile creation on registration
- Character name uniqueness validation
- Experience and leveling system
- Gold management system
- Stats tracking (health, mana, strength, dexterity, intelligence, vitality)

## UI/UX Design Decisions

### Inventory Item Layout (2025-01-09)

**Implemented: Vertical Stack Layout**

Current implementation uses a vertical stack layout for inventory items to prevent text truncation when items have multiple qualities/traits:

```
┌─────────────────────────────────┐
│ [🪓] Oak Log x12                │
│      WG5 AG3 MC4 MST2           │
├─────────────────────────────────┤
│ [⚔️] Iron Sword                 │
│      PR4 BLS3                   │
└─────────────────────────────────┘
```

**Structure:**
- Icon on left (40x40px, fixed)
- Content area stacked vertically:
  - Top row: Item name + quantity (name can use full width)
  - Bottom row: Quality/trait badges (wrap if needed)

**Alternative Layout Options (for future consideration):**

1. **Wrap Badges to New Line**
   - Keep horizontal left/right split
   - Allow badges to wrap when space runs out
   - Maintains the original left/right concept

   ```
   ┌─────────────────────────────────┐
   │ [🪓] Oak Log x12    WG5 AG3     │
   │                     MC4 MST2    │
   └─────────────────────────────────┘
   ```

2. **Two-Row Layout**
   - First row: Icon + Name (full width)
   - Second row: Quantity + Badges
   - Very compact, clear hierarchy

   ```
   ┌─────────────────────────────────┐
   │ [🪓] Oak Log                    │
   │ x12          WG5 AG3 MC4 MST2   │
   └─────────────────────────────────┘
   ```

3. **Smaller Badge Font/Spacing**
   - Reduce badge size to fit more horizontally
   - Quick fix but doesn't scale well with 5+ badges
   - May reduce readability

**Why Vertical Stack?**
- No truncation of item names (critical for item identification)
- All badges always visible
- Clean, scannable layout
- Scales well with any number of qualities/traits
- Similar to successful inventory systems (Diablo, Path of Exile)
- Badges can wrap naturally if needed

## Notes
- Backend server runs on port 3000 by default
- MongoDB connection required (configure in .env file)
- JWT secret should be changed in production
- Frontend assumes backend API at http://localhost:3000/api
