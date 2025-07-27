const express = require('express');
const cors = require('cors');
const { MongoClient } = require('mongodb');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config({ path: './config.prod.env' });

const app = express();
const PORT = process.env.PORT || 4001;

// Middleware
app.use(cors({
  origin: '*', // Allow all origins for mobile app
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// MongoDB Connection
let db;
const connectToDatabase = async () => {
  try {
    const client = new MongoClient(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    await client.connect();
    console.log('Connected to MongoDB!');
    
    const dbName = process.env.DB_NAME || "test";
    db = client.db(dbName);
    console.log(`Using database: ${dbName}`);
    
    return client;
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

// JWT Helper Functions
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ success: false, error: 'No token provided' });
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    return res.status(401).json({ success: false, error: 'Invalid token' });
  }
};

// Health Check
app.get('/api/health', (req, res) => {
  res.json({ 
    success: true, 
    message: 'TrendHive Backend is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV
  });
});

// Authentication Routes
app.post('/api/auth/signup', async (req, res) => {
  try {
    const { email, password, name } = req.body;
    
    if (!email || !password || !name) {
      return res.status(400).json({ success: false, error: 'Missing required fields' });
    }
    
    // Check if user already exists
    const existingUser = await db.collection('users').findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, error: 'User already exists' });
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Create user
    const result = await db.collection('users').insertOne({
      email,
      password: hashedPassword,
      name,
      admin: 0,
      createdAt: new Date()
    });
    
    // Generate token
    const token = generateToken(result.insertedId);
    
    res.json({
      success: true,
      token,
      user: {
        id: result.insertedId,
        email,
        name,
        admin: 0
      }
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ success: false, error: 'Signup failed' });
  }
});

app.post('/api/auth/signin', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ success: false, error: 'Missing email or password' });
    }
    
    // Find user
    const user = await db.collection('users').findOne({ email });
    if (!user) {
      return res.status(401).json({ success: false, error: 'Invalid credentials' });
    }
    
    // Check password
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ success: false, error: 'Invalid credentials' });
    }
    
    // Generate token
    const token = generateToken(user._id);
    
    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        admin: user.admin || 0
      }
    });
  } catch (error) {
    console.error('Signin error:', error);
    res.status(500).json({ success: false, error: 'Signin failed' });
  }
});

// Products Routes
app.get('/api/products', async (req, res) => {
  try {
    const { featured, category, search } = req.query;
    let query = {};
    
    if (featured === 'true') {
      query.featured = true;
    }
    
    if (category) {
      query.category = category;
    }
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }
    
    const products = await db.collection('products').find(query).toArray();
    res.json({ success: true, products });
  } catch (error) {
    console.error('Products error:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch products' });
  }
});

app.get('/api/products/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const product = await db.collection('products').findOne({ _id: id });
    
    if (!product) {
      return res.status(404).json({ success: false, error: 'Product not found' });
    }
    
    res.json({ success: true, product });
  } catch (error) {
    console.error('Product detail error:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch product' });
  }
});

// Orders Routes
app.post('/api/orders', verifyToken, async (req, res) => {
  try {
    const { items, total, shippingInfo, paymentMethod, subtotal, shipping, tax } = req.body;
    const userId = req.userId;
    
    if (!items || !total || !shippingInfo) {
      return res.status(400).json({ success: false, error: 'Missing required fields' });
    }
    
    const orderNumber = 'TH' + Date.now() + Math.random().toString(36).substr(2, 5).toUpperCase();
    
    const order = {
      userId,
      items,
      total,
      subtotal,
      shipping,
      tax,
      shippingInfo,
      paymentMethod,
      orderNumber,
      status: 'pending',
      createdAt: new Date()
    };
    
    const result = await db.collection('orders').insertOne(order);
    const createdOrder = await db.collection('orders').findOne({ _id: result.insertedId });
    
    res.json({
      success: true,
      orderId: result.insertedId,
      orderNumber,
      order: createdOrder
    });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({ success: false, error: 'Failed to create order' });
  }
});

app.get('/api/orders', verifyToken, async (req, res) => {
  try {
    const userId = req.userId;
    const orders = await db.collection('orders').find({ userId }).sort({ createdAt: -1 }).toArray();
    res.json({ success: true, orders });
  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch orders' });
  }
});

// Profile Routes
app.put('/api/profile', verifyToken, async (req, res) => {
  try {
    const userId = req.userId;
    const { name, email } = req.body;
    
    const result = await db.collection('users').updateOne(
      { _id: userId },
      { $set: { name, email } }
    );
    
    if (result.matchedCount === 0) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }
    
    const updatedUser = await db.collection('users').findOne({ _id: userId });
    
    res.json({
      success: true,
      user: {
        id: updatedUser._id,
        email: updatedUser.email,
        name: updatedUser.name,
        admin: updatedUser.admin || 0
      }
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ success: false, error: 'Failed to update profile' });
  }
});

// Change Password
app.post('/api/auth/change-password', verifyToken, async (req, res) => {
  try {
    const userId = req.userId;
    const { oldPassword, newPassword } = req.body;
    
    const user = await db.collection('users').findOne({ _id: userId });
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }
    
    const passwordMatch = await bcrypt.compare(oldPassword, user.password);
    if (!passwordMatch) {
      return res.status(400).json({ success: false, error: 'Current password is incorrect' });
    }
    
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    await db.collection('users').updateOne(
      { _id: userId },
      { $set: { password: hashedNewPassword } }
    );
    
    res.json({ success: true, message: 'Password updated successfully' });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({ success: false, error: 'Failed to change password' });
  }
});

// Addresses Routes
app.get('/api/addresses', verifyToken, async (req, res) => {
  try {
    const userId = req.userId;
    const addresses = await db.collection('addresses').find({ userId }).toArray();
    res.json({ success: true, addresses });
  } catch (error) {
    console.error('Get addresses error:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch addresses' });
  }
});

app.post('/api/addresses', verifyToken, async (req, res) => {
  try {
    const userId = req.userId;
    const addressData = { ...req.body, userId, createdAt: new Date() };
    
    const result = await db.collection('addresses').insertOne(addressData);
    const newAddress = await db.collection('addresses').findOne({ _id: result.insertedId });
    
    res.json({ success: true, address: newAddress });
  } catch (error) {
    console.error('Add address error:', error);
    res.status(500).json({ success: false, error: 'Failed to add address' });
  }
});

// Google Sign-In endpoint
app.post('/api/auth/google', async (req, res) => {
  try {
    const { accessToken } = req.body;
    
    if (!accessToken) {
      return res.status(400).json({ success: false, error: 'Access token is required' });
    }

    // For now, we'll create a mock user for Google sign-in
    // In production, you would verify the token with Google and get user info
    const googleUser = {
      id: `google_${Date.now()}`,
      email: `google_user_${Date.now()}@example.com`,
      name: 'Google User',
      admin: 0,
      createdAt: new Date()
    };

    // Check if user already exists
    const existingUser = await db.collection('users').findOne({ email: googleUser.email });
    
    if (existingUser) {
      // User exists, return existing user
      const token = generateToken(existingUser._id);
      return res.json({
        success: true,
        token,
        user: {
          id: existingUser._id,
          email: existingUser.email,
          name: existingUser.name,
          admin: existingUser.admin || 0
        }
      });
    } else {
      // Create new user
      const result = await db.collection('users').insertOne(googleUser);
      const token = generateToken(result.insertedId);
      return res.json({
        success: true,
        token,
        user: {
          id: result.insertedId,
          email: googleUser.email,
          name: googleUser.name,
          admin: googleUser.admin
        }
      });
    }
  } catch (error) {
    console.error('Google sign-in error:', error);
    res.status(500).json({ success: false, error: 'Google sign-in failed' });
  }
});

// Start server
const startServer = async () => {
  try {
    await connectToDatabase();
    
    app.listen(PORT, () => {
      console.log(`🚀 Production server running on port ${PORT}`);
      console.log(`📊 Environment: ${process.env.NODE_ENV}`);
      console.log(`🔗 Health check: http://localhost:${PORT}/api/health`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully');
  process.exit(0);
}); 