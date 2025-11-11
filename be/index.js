require('dotenv').config();
const express = require('express');
const http = require('http');
const cors = require('cors');
const connectDB = require('./config/database');
const itemService = require('./services/itemService');
const locationService = require('./services/locationService');
const vendorService = require('./services/vendorService');
const recipeService = require('./services/recipeService');
const combatService = require('./services/combatService');

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 3000;

// Connect to MongoDB
connectDB();

// Load item definitions
itemService.loadDefinitions()
  .then(() => console.log('✓ Item definitions loaded'))
  .catch(err => console.error('Failed to load item definitions:', err));

// Load location definitions
locationService.loadAll()
  .then(() => console.log('✓ Location definitions loaded'))
  .catch(err => console.error('Failed to load location definitions:', err));

// Load vendor definitions
vendorService.loadVendorDefinitions();

// Load recipe definitions
recipeService.loadRecipes();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Response validation middleware (development only)
const responseValidator = require('./middleware/responseValidator');
app.use(responseValidator);

// Basic route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to ClearSkies API' });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    database: require('mongoose').connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});

// API Routes
const authRoutes = require('./routes/auth');
const skillsRoutes = require('./routes/skills');
const attributesRoutes = require('./routes/attributes');
const inventoryRoutes = require('./routes/inventory');
const locationRoutes = require('./routes/locations');
const manualRoutes = require('./routes/manual');
const vendorRoutes = require('./routes/vendors');
const craftingRoutes = require('./routes/crafting');
const combatRoutes = require('./routes/combat');

app.use('/api/auth', authRoutes);
app.use('/api/skills', skillsRoutes);
app.use('/api/attributes', attributesRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/locations', locationRoutes);
app.use('/api/manual', manualRoutes); // Public routes (no auth required)
app.use('/api/vendors', vendorRoutes);
app.use('/api/crafting', craftingRoutes);
app.use('/api/combat', combatRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Initialize Socket.io
const { Server } = require('socket.io');
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:4200',
    credentials: true
  }
});

// Socket.io chat handlers
const chatHandler = require('./sockets/chatHandler');
chatHandler(io);

// Start server
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log(`Socket.io is ready for connections`);
});
