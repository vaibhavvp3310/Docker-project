const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
const bookmarkRoutes = require('./routes/bookmarks');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('combined'));

// Routes
app.use('/api/bookmarks', bookmarkRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  const dbState = mongoose.connection.readyState;
  const status = dbState === 1 ? 'healthy' : 'unhealthy';
  res.status(dbState === 1 ? 200 : 503).json({
    status,
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    database: dbState === 1 ? 'connected' : 'disconnected',
  });
});

// MongoDB connection
const MONGO_URI =
  process.env.MONGO_URI ||
  `mongodb://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@mongodb:27017/linkstash?authSource=admin`;

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => {
      console.log(`API server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err.message);
    process.exit(1);
  });
