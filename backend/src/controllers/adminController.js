// File: ./backend/src/controllers/adminController.js  (NEW)

const Order = require('../models/Order');
const User = require('../models/User');
const Cart = require('../models/Cart');
const Product = require('../models/Product');

// ─── ORDER MANAGEMENT ────────────────────────────────────────────────────────

// GET /api/admin/orders
exports.getAllOrders = async (req, res) => {
  try {
    const { status, page = 1, limit = 20, search, from, to } = req.query;
    const query = {};

    if (status && status !== 'all') query.status = status;
    if (search) {
      query.$or = [
        { orderNumber: { $regex: search, $options: 'i' } },
        { customerName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }
    if (from || to) {
      query.createdAt = {};
      if (from) query.createdAt.$gte = new Date(from);
      if (to) query.createdAt.$lte = new Date(new Date(to).setHours(23, 59, 59));
    }

    const total = await Order.countDocuments(query);
    const orders = await Order.find(query)
      .populate('user', 'name email')
      .populate('items.product', 'name images')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.status(200).json({
      success: true,
      total,
      page: Number(page),
      totalPages: Math.ceil(total / limit),
      data: orders
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching orders.', error: error.message });
  }
};

// PATCH /api/admin/orders/:id/status
exports.updateOrderStatus = async (req, res) => {
  try {
    const { status, courierName, awbNumber, note } = req.body;

    const validStatuses = ['processing', 'shipped', 'delivered', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status.' });
    }

    if (status === 'shipped' && (!courierName?.trim() || !awbNumber?.trim())) {
      return res.status(400).json({ success: false, message: 'Courier name and AWB number are required for shipped status.' });
    }

    const order = await Order.findById(req.params.id).populate('items.product', 'name images');
    if (!order) return res.status(404).json({ success: false, message: 'Order not found.' });

    order.status = status;

    if (status === 'cancelled' && req.body.adminCancelReason) {
      order.cancellation = {
        ...order.cancellation,
        adminCancelReason: req.body.adminCancelReason,
        requestedAt: new Date()
      };
    }

    if (status === 'shipped') {
      order.shipping = {
        courierName: courierName.trim(),
        awbNumber: awbNumber.trim(),
        shippedAt: new Date()
      };
    }

    order.statusLogs = order.statusLogs || [];
    order.statusLogs.push({
      status,
      changedAt: new Date(),
      changedBy: req.user?.email || req.user?.name || 'admin',
      note: note?.trim() || ''
    });

    await order.save({ validateBeforeSave: false });

    console.log('✅ shipping saved:', JSON.stringify(order.shipping, null, 2));
    console.log('✅ statusLogs:', JSON.stringify(order.statusLogs, null, 2));

    try {
      const emailService = require('../services/emailService');
      await emailService.sendOrderStatusUpdate(order);
    } catch (e) {
      console.error('Status email failed (order still updated):', e.message);
    }

    res.status(200).json({ success: true, message: 'Order status updated.', data: order });
  } catch (error) {
    res.status(400).json({ success: false, message: 'Error updating order status.', error: error.message });
  }
};

// PATCH /api/admin/orders/:id/refund-status  — mark refund as processed
exports.updateRefundStatus = async (req, res) => {
  try {
    const { refundStatus } = req.body;
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ success: false, message: 'Order not found.' });
    if (!order.cancellation?.requestedAt) {
      return res.status(400).json({ success: false, message: 'No cancellation request on this order.' });
    }

    order.cancellation.refundStatus = refundStatus;
    if (refundStatus === 'processed') order.cancellation.processedAt = new Date();
    await order.save();

    res.status(200).json({ success: true, message: 'Refund status updated.', data: order });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error updating refund status.', error: error.message });
  }
};

// ─── REVENUE ANALYTICS ───────────────────────────────────────────────────────

// GET /api/admin/analytics/revenue
exports.getRevenueAnalytics = async (req, res) => {
  try {
    const { period = '30d' } = req.query;
    const days = period === '7d' ? 7 : period === '90d' ? 90 : period === '1y' ? 365 : 30;
    const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

    // Total revenue (delivered orders only)
    const revenueAgg = await Order.aggregate([
      { $match: { status: { $in: ['delivered', 'shipped', 'confirmed', 'processing'] }, createdAt: { $gte: since } } },
      { $group: { _id: null, total: { $sum: '$totalAmount' }, count: { $sum: 1 } } }
    ]);

    // Revenue by day
    const dailyRevenue = await Order.aggregate([
      { $match: { status: { $nin: ['cancelled'] }, createdAt: { $gte: since } } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          revenue: { $sum: '$totalAmount' },
          orders: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // Revenue by product
    const productRevenue = await Order.aggregate([
      { $match: { status: { $nin: ['cancelled'] }, createdAt: { $gte: since } } },
      { $unwind: '$items' },
      {
        $group: {
          _id: '$items.productName',
          revenue: { $sum: { $multiply: ['$items.price', '$items.quantity'] } },
          units: { $sum: '$items.quantity' }
        }
      },
      { $sort: { revenue: -1 } },
      { $limit: 10 }
    ]);

    // UTM / campaign revenue
    const utmRevenue = await Order.aggregate([
      { $match: { 'utm.source': { $exists: true, $ne: null }, createdAt: { $gte: since } } },
      {
        $group: {
          _id: { source: '$utm.source', medium: '$utm.medium', campaign: '$utm.campaign' },
          revenue: { $sum: '$totalAmount' },
          orders: { $sum: 1 }
        }
      },
      { $sort: { revenue: -1 } },
      { $limit: 20 }
    ]);

    // Order status breakdown
    const statusBreakdown = await Order.aggregate([
      { $match: { createdAt: { $gte: since } } },
      { $group: { _id: '$status', count: { $sum: 1 }, revenue: { $sum: '$totalAmount' } } }
    ]);

    // Cancellation stats
    const cancellationStats = await Order.aggregate([
      { $match: { status: 'cancelled', createdAt: { $gte: since } } },
      {
        $group: {
          _id: null,
          totalCancelled: { $sum: 1 },
          totalRefunded: { $sum: '$cancellation.refundAmount' },
          totalFees: { $sum: '$cancellation.processingFee' }
        }
      }
    ]);

    res.status(200).json({
      success: true,
      data: {
        summary: revenueAgg[0] || { total: 0, count: 0 },
        daily: dailyRevenue,
        byProduct: productRevenue,
        byUTM: utmRevenue,
        statusBreakdown,
        cancellations: cancellationStats[0] || { totalCancelled: 0, totalRefunded: 0, totalFees: 0 }
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching revenue analytics.', error: error.message });
  }
};

// ─── CUSTOMER ANALYTICS ──────────────────────────────────────────────────────

// GET /api/admin/analytics/customers
exports.getCustomerAnalytics = async (req, res) => {
  try {
    const { period = '30d' } = req.query;
    const days = period === '7d' ? 7 : period === '90d' ? 90 : period === '1y' ? 365 : 30;
    const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

    // Total customers
    const totalCustomers = await User.countDocuments({ role: 'customer' });
    const newCustomers = await User.countDocuments({ role: 'customer', createdAt: { $gte: since } });

    // Customers with orders (converters)
    const customersWithOrders = await Order.distinct('user', {
      user: { $ne: null },
      createdAt: { $gte: since }
    });
    const conversionRate = totalCustomers > 0
      ? ((customersWithOrders.length / totalCustomers) * 100).toFixed(1)
      : 0;

    // Returning customers (more than 1 order)
    const returningAgg = await Order.aggregate([
      { $match: { user: { $ne: null } } },
      { $group: { _id: '$user', orderCount: { $sum: 1 } } },
      { $match: { orderCount: { $gt: 1 } } },
      { $count: 'returning' }
    ]);
    const returningCustomers = returningAgg[0]?.returning || 0;

    // New registrations by day
    const registrationsByDay = await User.aggregate([
      { $match: { role: 'customer', createdAt: { $gte: since } } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // Top customers by spend
    const topCustomers = await Order.aggregate([
      { $match: { user: { $ne: null }, status: { $nin: ['cancelled'] } } },
      {
        $group: {
          _id: '$user',
          totalSpend: { $sum: '$totalAmount' },
          orderCount: { $sum: 1 },
          lastOrder: { $max: '$createdAt' }
        }
      },
      { $sort: { totalSpend: -1 } },
      { $limit: 20 },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'user'
        }
      },
      { $unwind: '$user' },
      {
        $project: {
          name: '$user.name',
          email: '$user.email',
          phone: '$user.phone',
          totalSpend: 1,
          orderCount: 1,
          lastOrder: 1
        }
      }
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalCustomers,
        newCustomers,
        conversionRate: Number(conversionRate),
        returningCustomers,
        newVsReturning: {
          new: totalCustomers - returningCustomers,
          returning: returningCustomers
        },
        registrationsByDay,
        topCustomers
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching customer analytics.', error: error.message });
  }
};

// ─── CUSTOMER LIST ────────────────────────────────────────────────────────────

// GET /api/admin/customers
exports.getCustomers = async (req, res) => {
  try {
    const { page = 1, limit = 20, search } = req.query;
    const query = { role: 'customer' };
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } }
      ];
    }

    const total = await User.countDocuments(query);
    const users = await User.find(query)
      .select('-password -refreshToken -passwordResetToken -passwordResetExpires')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    // Enrich with order counts
    const userIds = users.map(u => u._id);
    const orderStats = await Order.aggregate([
      { $match: { user: { $in: userIds } } },
      { $group: { _id: '$user', orderCount: { $sum: 1 }, totalSpend: { $sum: '$totalAmount' } } }
    ]);
    const statsMap = {};
    orderStats.forEach(s => { statsMap[s._id.toString()] = s; });

    const enriched = users.map(u => ({
      ...u.toObject(),
      orderCount: statsMap[u._id.toString()]?.orderCount || 0,
      totalSpend: statsMap[u._id.toString()]?.totalSpend || 0
    }));

    res.status(200).json({ success: true, total, page: Number(page), totalPages: Math.ceil(total / limit), data: enriched });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching customers.', error: error.message });
  }
};

// GET /api/admin/customers/:id  — single customer with full order history
exports.getCustomerDetail = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select('-password -refreshToken -passwordResetToken -passwordResetExpires');
    if (!user) return res.status(404).json({ success: false, message: 'Customer not found.' });

    const orders = await Order.find({ user: user._id })
      .populate('items.product', 'name images')
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, data: { user, orders } });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching customer.', error: error.message });
  }
};

// ─── ABANDONED CARTS ─────────────────────────────────────────────────────────

// GET /api/admin/abandoned-carts
// "Abandoned" = cart has items AND user has no order.
exports.getAbandonedCarts = async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;

    const customerIds = await User.distinct('_id', { role: 'customer' });
    const cartsWithItems = await Cart.find({
      'items.0': { $exists: true },
      user: { $in: customerIds }
    })
      .populate('user', 'name email phone createdAt')
      .populate('items.product', 'name images price')
      .sort({ updatedAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const totalAbandoned = await Cart.countDocuments({
      'items.0': { $exists: true },
      user: { $in: customerIds }
    });

    res.status(200).json({
      success: true,
      total: totalAbandoned,
      totalCarts: totalAbandoned,
      data: cartsWithItems.map(c => ({
        _id: c._id,
        user: c.user,
        items: c.items,
        itemCount: c.itemCount,
        subtotal: c.subtotal,
        updatedAt: c.updatedAt
      }))
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching abandoned carts.', error: error.message });
  }
};

// ─── DASHBOARD SUMMARY ────────────────────────────────────────────────────────

// GET /api/admin/dashboard
exports.getDashboardSummary = async (req, res) => {
  try {
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59);

    const [
      todayOrders, monthOrders, lastMonthOrders,
      totalRevenue, monthRevenue, lastMonthRevenue,
      totalCustomers, newCustomersToday,
      deliveredOrders, abandonedCartsCount
    ] = await Promise.all([
      Order.countDocuments({ createdAt: { $gte: startOfToday } }),
      Order.countDocuments({ createdAt: { $gte: startOfMonth } }),
      Order.countDocuments({ createdAt: { $gte: startOfLastMonth, $lte: endOfLastMonth } }),
      Order.aggregate([{ $match: { status: { $nin: ['cancelled'] } } }, { $group: { _id: null, total: { $sum: '$totalAmount' } } }]),
      Order.aggregate([{ $match: { status: { $nin: ['cancelled'] }, createdAt: { $gte: startOfMonth } } }, { $group: { _id: null, total: { $sum: '$totalAmount' } } }]),
      Order.aggregate([{ $match: { status: { $nin: ['cancelled'] }, createdAt: { $gte: startOfLastMonth, $lte: endOfLastMonth } } }, { $group: { _id: null, total: { $sum: '$totalAmount' } } }]),
      User.countDocuments({ role: 'customer' }),
      User.countDocuments({ role: 'customer', createdAt: { $gte: startOfToday } }),
      Order.countDocuments({ status: 'delivered' }),
      Cart.countDocuments({
        'items.0': { $exists: true },
        user: { $in: await User.distinct('_id', { role: 'customer' }) }
      })
    ]);

    const currentMonthRev = monthRevenue[0]?.total || 0;
    const lastMonthRev = lastMonthRevenue[0]?.total || 0;
    const revenueGrowth = lastMonthRev > 0
      ? (((currentMonthRev - lastMonthRev) / lastMonthRev) * 100).toFixed(1)
      : null;

    res.status(200).json({
      success: true,
      data: {
        orders: { today: todayOrders, thisMonth: monthOrders, lastMonth: lastMonthOrders, delivered: deliveredOrders },
        revenue: {
          total: totalRevenue[0]?.total || 0,
          thisMonth: currentMonthRev,
          lastMonth: lastMonthRev,
          growth: revenueGrowth
        },
        customers: { total: totalCustomers, newToday: newCustomersToday },
        carts: { abandoned: abandonedCartsCount }
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching dashboard.', error: error.message });
  }
};

// ─── GA4 ANALYTICS ───────────────────────────────────────────────────────────

// GET /api/admin/analytics/ga4
exports.getGA4Analytics = async (req, res) => {
  try {
    console.log('GA4 email:', process.env.GA4_CLIENT_EMAIL);
    console.log('GA4 property:', process.env.GA4_PROPERTY_ID);
    console.log('Private key exists:', !!process.env.GA4_PRIVATE_KEY);

    const { BetaAnalyticsDataClient } = require('@google-analytics/data');

    const analyticsDataClient = new BetaAnalyticsDataClient({
      credentials: {
        client_email: process.env.GA4_CLIENT_EMAIL,
        private_key: process.env.GA4_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      }
    });

    const propertyId = process.env.GA4_PROPERTY_ID; // e.g. "properties/123456789"
    const { period = '30d' } = req.query;
    const days = period === '7d' ? 7 : period === '90d' ? 90 : 30;
    const startDate = `${days}daysAgo`;

    // Run all reports in parallel
    const [
      overviewResponse,
      deviceResponse,
      cityResponse,
      pageResponse,
      dailyResponse
    ] = await Promise.all([

      // Overview: sessions, users, bounce rate, avg session duration
      analyticsDataClient.runReport({
        property: propertyId,
        dateRanges: [{ startDate, endDate: 'today' }],
        metrics: [
          { name: 'sessions' },
          { name: 'totalUsers' },
          { name: 'newUsers' },
          { name: 'bounceRate' },
          { name: 'averageSessionDuration' },
          { name: 'screenPageViews' }
        ]
      }),

      // Device breakdown
      analyticsDataClient.runReport({
        property: propertyId,
        dateRanges: [{ startDate, endDate: 'today' }],
        dimensions: [{ name: 'deviceCategory' }],
        metrics: [{ name: 'sessions' }, { name: 'totalUsers' }]
      }),

      // Traffic by city
      analyticsDataClient.runReport({
        property: propertyId,
        dateRanges: [{ startDate, endDate: 'today' }],
        dimensions: [{ name: 'city' }],
        metrics: [{ name: 'sessions' }, { name: 'totalUsers' }],
        limit: 10,
        orderBys: [{ metric: { metricName: 'sessions' }, desc: true }]
      }),

      // Top pages
      analyticsDataClient.runReport({
        property: propertyId,
        dateRanges: [{ startDate, endDate: 'today' }],
        dimensions: [{ name: 'pagePath' }],
        metrics: [{ name: 'screenPageViews' }, { name: 'totalUsers' }],
        limit: 10,
        orderBys: [{ metric: { metricName: 'screenPageViews' }, desc: true }]
      }),

      // Daily sessions
      analyticsDataClient.runReport({
        property: propertyId,
        dateRanges: [{ startDate, endDate: 'today' }],
        dimensions: [{ name: 'date' }],
        metrics: [{ name: 'sessions' }, { name: 'newUsers' }],
        orderBys: [{ dimension: { dimensionName: 'date' } }]
      })
    ]);

    // Parse overview
    const overviewRow = overviewResponse[0]?.rows?.[0]?.metricValues || [];
    const overview = {
      sessions: parseInt(overviewRow[0]?.value || 0),
      totalUsers: parseInt(overviewRow[1]?.value || 0),
      newUsers: parseInt(overviewRow[2]?.value || 0),
      bounceRate: parseFloat(overviewRow[3]?.value || 0).toFixed(1),
      avgSessionDuration: parseFloat(overviewRow[4]?.value || 0).toFixed(0),
      pageViews: parseInt(overviewRow[5]?.value || 0)
    };

    // Parse devices
    const devices = (deviceResponse[0]?.rows || []).map(row => ({
      device: row.dimensionValues[0]?.value,
      sessions: parseInt(row.metricValues[0]?.value || 0),
      users: parseInt(row.metricValues[1]?.value || 0)
    }));

    // Parse cities
    const cities = (cityResponse[0]?.rows || []).map(row => ({
      city: row.dimensionValues[0]?.value,
      sessions: parseInt(row.metricValues[0]?.value || 0),
      users: parseInt(row.metricValues[1]?.value || 0)
    }));

    // Parse top pages
    const pages = (pageResponse[0]?.rows || []).map(row => ({
      path: row.dimensionValues[0]?.value,
      views: parseInt(row.metricValues[0]?.value || 0),
      users: parseInt(row.metricValues[1]?.value || 0)
    }));

    // Parse daily
    const daily = (dailyResponse[0]?.rows || []).map(row => {
      const raw = row.dimensionValues[0]?.value; // "20250531"
      const date = `${raw.slice(0, 4)}-${raw.slice(4, 6)}-${raw.slice(6, 8)}`;
      return {
        date,
        sessions: parseInt(row.metricValues[0]?.value || 0),
        newUsers: parseInt(row.metricValues[1]?.value || 0)
      };
    });

    res.status(200).json({
      success: true,
      data: { overview, devices, cities, pages, daily }
    });
  } catch (error) {
    console.error('GA4 FULL ERROR:', error);
    console.error('GA4 MESSAGE:', error.message);
    console.error('GA4 STACK:', error.stack);
    res.status(500).json({
      success: false,
      message: error.message,
      details: error
    });
  }
};