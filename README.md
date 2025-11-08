# ClearSkies

A medieval fantasy browser-based RPG game built with Node.js, Express, MongoDB, and Angular.

## Tech Stack

### Backend
- **Node.js** with Express 5.x
- **MongoDB** with Mongoose ODM
- **JWT** for authentication
- **bcryptjs** for password hashing
- **express-validator** for input validation

### Frontend
- **Angular 20** (standalone components)
- **TypeScript**
- **RxJS** for reactive programming
- **Angular Signals** for state management

## Project Structure

```
ClearSkies/
├── be/                         # Backend (Node.js + Express)
│   ├── config/                 # Configuration files
│   ├── controllers/            # Route controllers
│   ├── middleware/             # Express middleware
│   ├── models/                 # Mongoose models
│   ├── routes/                 # API routes
│   ├── utils/                  # Utility functions
│   └── index.js               # Main server file
├── ui/                         # Frontend (Angular)
│   └── src/
│       └── app/
│           ├── guards/         # Route guards
│           ├── interceptors/   # HTTP interceptors
│           ├── models/         # TypeScript interfaces
│           └── services/       # Angular services
├── project/                    # Project documentation
│   ├── ideas/                  # Ideas and concepts
│   ├── tasks/                  # Task tracking
│   └── journal.md             # Development journal
└── package.json               # Root package scripts
```

## Getting Started

### Prerequisites

- **Node.js** (v18 or higher)
- **MongoDB** (local installation or MongoDB Atlas account)
- **npm** or **yarn**

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ClearSkies
   ```

2. **Install all dependencies**
   ```bash
   npm run install:all
   ```

   Or install separately:
   ```bash
   # Backend dependencies
   cd be && npm install

   # Frontend dependencies
   cd ../ui && npm install
   ```

3. **Configure environment variables**

   Create a `.env` file in the `be/` directory:
   ```bash
   cd be
   cp .env.example .env
   ```

   Edit `.env` with your configuration:
   ```env
   PORT=3000
   NODE_ENV=development
   MONGODB_URI=mongodb://localhost:27017/clearskies
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   JWT_EXPIRE=7d
   ```

4. **Start MongoDB**

   If using local MongoDB:
   ```bash
   # On Windows (if installed as service):
   net start MongoDB

   # On macOS/Linux:
   mongod
   ```

   Or use MongoDB Atlas (cloud) by updating `MONGODB_URI` in `.env`

### Running the Application

#### Development Mode (Both Frontend & Backend)

From the project root:
```bash
npm run dev
```

This starts:
- Backend server on http://localhost:3000
- Frontend dev server on http://localhost:4200

#### Run Backend Only
```bash
npm run dev:be
```

#### Run Frontend Only
```bash
npm run dev:ui
```

### Building for Production

```bash
npm run build
```

This builds the Angular frontend for production.

### Testing

```bash
# Run all tests
npm test

# Backend tests only
npm run test:be

# Frontend tests only
npm run test:ui
```

## API Documentation

### Authentication Endpoints

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "username": "warrior123",
  "email": "user@example.com",
  "password": "securepassword",
  "characterName": "Sir Galahad"  // optional
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securepassword"
}
```

#### Get Current User Profile
```http
GET /api/auth/me
Authorization: Bearer <jwt-token>
```

#### Logout
```http
POST /api/auth/logout
Authorization: Bearer <jwt-token>
```

## Game Features

### Player System
- Character creation with unique names
- Level progression (1-100)
- Experience-based leveling system
- Character stats: health, mana, strength, dexterity, intelligence, vitality

### Inventory System
- Gold management
- Item tracking
- Equipment system (ready for items)

### Progression
- Quest tracking (ready for implementation)
- Achievement system (ready for implementation)
- Skills system (ready for implementation)

## Development

### Available Scripts (Root)

- `npm run dev` - Run both UI and backend
- `npm run dev:be` - Run backend only
- `npm run dev:ui` - Run frontend only
- `npm start` - Alias for dev
- `npm run build` - Build frontend
- `npm test` - Run all tests
- `npm run install:all` - Install all dependencies

### Backend Scripts

- `npm start` - Start server
- `npm run dev` - Start server in dev mode

### Frontend Scripts

- `npm start` - Start dev server
- `npm run build` - Build for production
- `npm test` - Run tests
- `npm run watch` - Build and watch for changes

## Security Features

- Password hashing with bcryptjs (10 salt rounds)
- JWT-based stateless authentication
- HTTP-only token storage (client-side localStorage)
- Input validation on all endpoints
- CORS protection
- MongoDB injection prevention

## Future Development

See [project/journal.md](project/journal.md) for planned features and development roadmap.

## License

ISC
