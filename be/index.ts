import 'dotenv/config';
import express from 'express';
import http from 'http';
import cors from 'cors';
import mongoose from 'mongoose';
import { Server } from 'socket.io';
import connectDB from './config/database';
import itemService from './services/itemService';
import locationService from './services/locationService';
import vendorService from './services/vendorService';
import recipeService from './services/recipeService';
import responseValidator from './middleware/responseValidator';
import chatHandler from './sockets/chatHandler';
import activityHandler from './sockets/activityHandler';
import craftingHandler from './sockets/craftingHandler';
import combatHandler from './sockets/combatHandler';

// Import routes
import authRoutes from './routes/auth';
import skillsRoutes from './routes/skills';
import attributesRoutes from './routes/attributes';
import inventoryRoutes from './routes/inventory';
import locationRoutes from './routes/locations';
import manualRoutes from './routes/manual';
import vendorRoutes from './routes/vendors';
import craftingRoutes from './routes/crafting';
import combatRoutes from './routes/combat';

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 3000;

// Connect to MongoDB
connectDB();

// Load item definitions
itemService
  .loadDefinitions()
  .then(() => console.log('✓ Item definitions loaded'))
  .catch(err => console.error('Failed to load item definitions:', err));

// Load location definitions
locationService
  .loadAll()
  .then(() => console.log('✓ Location definitions loaded'))
  .catch(err => console.error('Failed to load location definitions:', err));

// Vendor and recipe definitions are now loaded at compile-time via registries
console.log(`✓ Loaded ${require('./data/vendors/VendorRegistry').VendorRegistry.size} vendors from VendorRegistry (compile-time)`);
console.log(`✓ Loaded ${require('./data/recipes/RecipeRegistry').RecipeRegistry.size} recipes from RecipeRegistry (compile-time)`);

// Middleware
app.use(cors({
  origin: ['http://localhost:4200', 'http://clearskies-frontend-dev.s3-website-us-east-1.amazonaws.com'],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Response validation middleware (development only)
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
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});

// Test sockets page (development only)
app.get('/test-sockets.html', (req, res) => {
  res.sendFile(__dirname + '/test-sockets.html');
});

// API Routes
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
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Initialize Socket.io
const io = new Server(server, {
  cors: {
    origin: ['http://localhost:4200', 'http://clearskies-frontend-dev.s3-website-us-east-1.amazonaws.com'],
    credentials: true
  }
});

// Socket.io handlers
chatHandler(io);
activityHandler(io);
craftingHandler(io);
combatHandler(io);

// Start server - bind to 0.0.0.0 for IPv4 accessibility
const HOST = '0.0.0.0';
server.listen(Number(PORT), HOST, () => {
  console.log(`Server is running on http://${HOST}:${PORT}`);
  console.log(`Socket.io is ready for connections`);
});
