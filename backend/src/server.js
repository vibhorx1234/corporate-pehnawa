require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');
const path = require('path');
const passport = require('passport');
const connectDB = require('./config/database');
const errorHandler = require('./middleware/errorHandler');

dotenv.config();

// ── Passport Google Strategy ──────────────────────────────────────────────
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('./models/User');
const Cart = require('./models/Cart');

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: process.env.GOOGLE_CALLBACK_URL
}, async (accessToken, refreshToken, profile, done) => {
  try {
    const email = profile.emails?.[0]?.value;
    if (!email) return done(null, false);

    // Check if user already exists by googleId or email
    let user = await User.findOne({ googleId: profile.id });

    if (!user) {
      // Maybe they registered with email before — link accounts
      user = await User.findOne({ email });
      if (user) {
        user.googleId = profile.id;
        await user.save({ validateBeforeSave: false });
      } else {
        // Brand new user via Google
        user = await User.create({
          name: profile.displayName,
          email,
          googleId: profile.id,
          isActive: true
        });
        await Cart.create({ user: user._id, items: [] });
      }
    }

    return done(null, user);
  } catch (err) {
    return done(err, null);
  }
}));

// ── Route imports ─────────────────────────────────────────────────────────
const collectionRoutes = require('./routes/collectionRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const blogRoutes = require('./routes/blogRoutes');
const contactRoutes = require('./routes/contactRoutes');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const cartRoutes = require('./routes/cartRoutes');
const addressRoutes = require('./routes/addressRoutes');
const adminRoutes = require('./routes/adminRoutes');
const paymentRoutes = require('./routes/paymentRoutes');

const app = express();
connectDB();

app.get('/debug-env', (req, res) => {
  res.json({
    KEY_ID: process.env.RAZORPAY_KEY_ID,
    SECRET_LENGTH: process.env.RAZORPAY_KEY_SECRET?.length,
    SECRET_FIRST4: process.env.RAZORPAY_KEY_SECRET?.slice(0, 4),
  });
});

// ── Middleware ────────────────────────────────────────────────────────────
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.options('*', cors()); // handle preflight requests

app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(passport.initialize()); // No sessions — JWT only
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// ── API Routes ────────────────────────────────────────────────────────────
app.use('/api/admin', adminRoutes);
app.use('/api/collections', collectionRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/blogs', blogRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/addresses', addressRoutes);
app.use('/api/payments', paymentRoutes);

app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Corporate Pehnawa API is running',
    timestamp: new Date().toISOString()
  });
});

app.use('/api/*', errorHandler);

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../../frontend/build')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../../frontend/build', 'index.html'));
  });
} else {
  app.use((req, res) => {
    res.status(404).json({ success: false, message: 'Route not found' });
  });
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🌐 Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:3000'}`);
});