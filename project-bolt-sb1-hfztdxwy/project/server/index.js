import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import mongoose from 'mongoose';

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:5175",
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(cors());
app.use(express.json());

// Store active users and their locations in memory if MongoDB is not available
const activeUsers = new Map();

// MongoDB Connection
let isMongoConnected = false;

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/blood-donation')
  .then(() => {
    console.log('Connected to MongoDB');
    isMongoConnected = true;
  })
  .catch(err => {
    console.warn('MongoDB connection error:', err.message);
    console.warn('Running in memory-only mode');
  });

// Socket.IO Events
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // Handle donor location updates
  socket.on('donor:location', (data) => {
    activeUsers.set(data.userId, { ...data, socketId: socket.id });
    // Broadcast to all recipients
    socket.broadcast.emit('donor:locationUpdate', data);
  });

  // Handle recipient location updates
  socket.on('recipient:location', (data) => {
    activeUsers.set(data.userId, { ...data, socketId: socket.id });
    // Broadcast to all donors
    socket.broadcast.emit('recipient:locationUpdate', data);
  });

  // Handle emergency requests
  socket.on('emergency:request', (data) => {
    const { location, bloodType, urgency } = data;
    
    // Find nearby donors
    const nearbyDonors = Array.from(activeUsers.values())
      .filter(user => 
        user.userType === 'donor' && 
        calculateDistance(location, { lat: user.lat, lng: user.lng }) <= 10 // 10km radius
      );

    // Notify nearby donors
    nearbyDonors.forEach(donor => {
      io.to(donor.socketId).emit('emergency:new', {
        ...data,
        distance: calculateDistance(location, { lat: donor.lat, lng: donor.lng })
      });
    });

    // Store emergency request in MongoDB if available
    if (isMongoConnected) {
      // TODO: Implement MongoDB storage
    }
  });

  socket.on('disconnect', () => {
    // Remove user from active users
    for (const [userId, userData] of activeUsers.entries()) {
      if (userData.socketId === socket.id) {
        activeUsers.delete(userId);
        // Notify others that user is offline
        socket.broadcast.emit('user:offline', userId);
        break;
      }
    }
    console.log('User disconnected:', socket.id);
  });
});

// Calculate distance between two points using Haversine formula
function calculateDistance(point1, point2) {
  const R = 6371; // Earth's radius in km
  const dLat = toRad(point2.lat - point1.lat);
  const dLon = toRad(point2.lng - point1.lng);
  const lat1 = toRad(point1.lat);
  const lat2 = toRad(point2.lat);

  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

function toRad(value) {
  return value * Math.PI / 180;
}

// Health Check Route
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'healthy',
    mongodb: isMongoConnected ? 'connected' : 'disconnected'
  });
});

// Start Server
const PORT = process.env.PORT || 3000;
httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});