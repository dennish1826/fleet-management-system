import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';

import { connectDB } from './config/db.js';
import vehicleRoutes from './routes/vehicleRoutes.js';
import tripRoutes from './routes/tripRoutes.js';
import driverRoutes from './routes/driverRoutes.js';
import maintenanceRoutes from './routes/maintenanceRoutes.js';
import alertRoutes from './routes/alertRoutes.js';
import analyticsRoutes from './routes/analyticsRoutes.js';

import { startTelematicsSimulation } from './services/telematicsSimulator.js';
import { seedData } from './seed/seed.js';
import Vehicle from './models/Vehicle.js';
import Alert from './models/Alert.js';

dotenv.config();

const app = express();
const server = http.createServer(app);

// Configure Socket.io with permissive CORS for dashboard integration
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
  },
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Make io accessible in request context if needed
app.use((req, res, next) => {
  req.io = io;
  next();
});

// REST API Routes
app.use('/api/vehicles', vehicleRoutes);
app.use('/api/trips', tripRoutes);
app.use('/api/drivers', driverRoutes);
app.use('/api/maintenance', maintenanceRoutes);
app.use('/api/alerts', alertRoutes);
app.use('/api/analytics', analyticsRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    timestamp: new Date().toISOString(),
    service: 'Predictive Fleet Optimization & Telematics Engine',
    version: '1.0.0',
  });
});

// Real-time WebSocket connection handling
io.on('connection', async (socket) => {
  console.log(`🔌 New client connected to telematics stream: [${socket.id}]`);

  // Send initial snapshot of vehicles and recent alerts upon connection
  try {
    const initialVehicles = await Vehicle.find().populate('assignedDriver');
    const recentAlerts = await Alert.find({ resolved_status: false })
      .populate('vehicleId')
      .sort({ timestamp: -1 })
      .limit(10);

    socket.emit('initial_state', {
      vehicles: initialVehicles,
      alerts: recentAlerts,
    });
  } catch (err) {
    console.error('Error fetching initial socket state:', err.message);
  }

  // Client can request immediate refresh
  socket.on('request_refresh', async () => {
    const vehicles = await Vehicle.find().populate('assignedDriver');
    socket.emit('telematics_update', {
      timestamp: new Date().toISOString(),
      vehicles,
    });
  });

  socket.on('disconnect', () => {
    console.log(`🔌 Client disconnected from telematics stream: [${socket.id}]`);
  });
});

const PORT = process.env.PORT || 5000;

// Initialize Server, DB, and Telematics Background Stream
const startServer = async () => {
  try {
    await connectDB();

    // Check if seeding is needed
    const vehicleCount = await Vehicle.countDocuments();
    if (vehicleCount === 0) {
      console.log('⚡ Initializing database with seed dataset...');
      await seedData();
    }

    // Start background telematics simulator
    startTelematicsSimulation(io);

    server.listen(PORT, () => {
      console.log(`=======================================================`);
      console.log(`🚀 Fleet Telematics & Optimization Engine Running`);
      console.log(`🌐 Server Port: http://localhost:${PORT}`);
      console.log(`📡 WebSocket Gateway: ws://localhost:${PORT}`);
      console.log(`🏥 Health Check: http://localhost:${PORT}/api/health`);
      console.log(`=======================================================`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
