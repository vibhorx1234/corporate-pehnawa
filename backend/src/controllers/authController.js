// File: ./backend/src/controllers/authController.js
const crypto = require('crypto');
const User = require('../models/User');
const Cart = require('../models/Cart');
const tokenService = require('../services/tokenService');

// POST /api/auth/register
exports.register = async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'An account with this email already exists.'
      });
    }

    const user = await User.create({ name, email, phone, password });

    // Create an empty cart for the new user
    await Cart.create({ user: user._id, items: [] });

    const accessToken = tokenService.generateAccessToken(user._id, user.role);
    const refreshToken = tokenService.generateRefreshToken(user._id);

    // Persist refresh token in DB
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    res.cookie('refreshToken', refreshToken, tokenService.getRefreshCookieOptions());

    res.status(201).json({
      success: true,
      message: 'Account created successfully.',
      accessToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role
      }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Registration failed.',
      error: error.message
    });
  }
};

// POST /api/auth/login
exports.login = async (req, res) => {
  try {
    const { email, phone, password } = req.body;

    if ((!email && !phone) || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email or phone number, and password.'
      });
    }

    const user = await User.findOne(
      email ? { email } : { phone }
    ).select('+password');
    if (!user || !user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.'
      });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.'
      });
    }

    const accessToken = tokenService.generateAccessToken(user._id, user.role);
    const refreshToken = tokenService.generateRefreshToken(user._id);

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    res.cookie('refreshToken', refreshToken, tokenService.getRefreshCookieOptions());

    res.status(200).json({
      success: true,
      message: 'Logged in successfully.',
      accessToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Login failed.',
      error: error.message
    });
  }
};

// POST /api/auth/refresh
exports.refreshToken = async (req, res) => {
  try {
    const token = req.cookies?.refreshToken;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'No refresh token provided.'
      });
    }

    const decoded = tokenService.verifyRefreshToken(token);
    const user = await User.findById(decoded.id).select('+refreshToken');

    if (!user || user.refreshToken !== token || !user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired refresh token. Please log in again.'
      });
    }

    const newAccessToken = tokenService.generateAccessToken(user._id, user.role);
    const newRefreshToken = tokenService.generateRefreshToken(user._id);

    user.refreshToken = newRefreshToken;
    await user.save({ validateBeforeSave: false });

    res.cookie('refreshToken', newRefreshToken, tokenService.getRefreshCookieOptions());

    res.status(200).json({
      success: true,
      accessToken: newAccessToken
    });
  } catch (error) {
    res.status(401).json({
      success: false,
      message: 'Token refresh failed. Please log in again.'
    });
  }
};

// POST /api/auth/logout
exports.logout = async (req, res) => {
  try {
    const token = req.cookies?.refreshToken;

    if (token) {
      // Clear refresh token from DB
      await User.findOneAndUpdate(
        { refreshToken: token },
        { refreshToken: null },
        { validateBeforeSave: false }
      );
    }

    res.clearCookie('refreshToken', tokenService.getRefreshCookieOptions());

    res.status(200).json({
      success: true,
      message: 'Logged out successfully.'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Logout failed.',
      error: error.message
    });
  }
};

// GET /api/auth/me  (protected)
exports.getMe = async (req, res) => {
  res.status(200).json({
    success: true,
    user: {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      phone: req.user.phone,
      role: req.user.role
    }
  });
};

// POST /api/auth/forgot-password
exports.forgotPassword = async (req, res) => {
  console.log('forgot-password hit:', req.body);
  try {
    const { email, phone } = req.body;
    console.log('email:', email, '| phone:', phone);

    if (!email && !phone) {
      return res.status(400).json({
        success: false,
        message: 'Email or phone number is required.'
      });
    }

    const maskEmail = (emailAddr) => {
      const [local, domain] = emailAddr.split('@');
      const visible = local.slice(0, 2);
      return `${visible}${'*'.repeat(Math.max(local.length - 2, 3))}@${domain}`;
    };

    const user = await User.findOne(
      email ? { email: email.toLowerCase() } : { phone }
    );
    console.log('user found:', user ? user.email : 'NOT FOUND');

    if (!user) {
      return res.status(200).json({
        success: false,
        found: false,
        message: 'No account is registered with those details.'
      });
    }

    // Generate a secure random token
    const rawToken = crypto.randomBytes(32).toString('hex');
    // Store hashed version in DB (never store raw tokens)
    const hashedToken = crypto.createHash('sha256').update(rawToken).digest('hex');

    user.passwordResetToken = hashedToken;
    user.passwordResetExpires = Date.now() + 60 * 60 * 1000; // 1 hour
    await user.save({ validateBeforeSave: false });

    // Build reset URL — raw token goes in the link, hashed one stays in DB
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${rawToken}`;

    const emailService = require('../services/emailService');

    // try {
    //   if (user.email) {
    //     await emailService.sendPasswordResetEmail(user.email, resetUrl, user.name);
    //   }
    // } catch (emailErr) {
    //   user.passwordResetToken = undefined;
    //   user.passwordResetExpires = undefined;
    //   await user.save({ validateBeforeSave: false });
    //   console.error('Password reset message failed:', emailErr.message);
    //   return res.status(500).json({
    //     success: false,
    //     message: 'Failed to send reset link. Please try again.'
    //   });
    // }

    try {
      if (user.email) {
        await emailService.sendPasswordResetEmail(user.email, resetUrl, user.name);
      }
    } catch (emailErr) {
      // Email failed — log it but still return success for now (testing mode)
      console.error('Password reset email failed (ignored for now):', emailErr.message);
      console.log('DEBUG — reset URL for', user.email, ':', resetUrl);
    }

    res.status(200).json({
      success: true,
      found: true,
      maskedEmail: maskEmail(user.email),
      message: 'Reset link sent successfully.'
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Something went wrong.',
      error: error.message
    });
  }
};

// POST /api/auth/reset-password
exports.resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Token and new password are required.'
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters.'
      });
    }

    // Hash the incoming raw token to compare with DB
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Reset link is invalid or has expired. Please request a new one.'
      });
    }

    // Set new password — pre-save hook will hash it
    user.password = newPassword;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    user.refreshToken = undefined; // invalidate all existing sessions
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Password reset successfully. Please log in.'
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Something went wrong.',
      error: error.message
    });
  }
};

// GET /api/auth/google/callback  — called by passport after Google verifies the user
exports.googleCallback = async (req, res) => {
  try {
    const user = req.user; // set by passport strategy

    const accessToken = tokenService.generateAccessToken(user._id, user.role);
    const refreshToken = tokenService.generateRefreshToken(user._id);

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    res.cookie('refreshToken', refreshToken, tokenService.getRefreshCookieOptions());

    // Redirect to frontend with accessToken in query param
    // Frontend reads it once, stores in memory, then removes from URL
    res.redirect(
      `${process.env.FRONTEND_URL}/auth/google/success?token=${accessToken}`
    );
  } catch (error) {
    res.redirect(`${process.env.FRONTEND_URL}/login?error=google_failed`);
  }
};