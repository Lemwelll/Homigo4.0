/**
 * Homigo Backend Server - Render Optimized
 * Simplified version for reliable Render deployment
 */

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Load environment variables FIRST
dotenv.config();

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 5000;
const HOST = '0.0.0.0';

console.log('🔧 Starting Homigo Backend Server...');
console.log(`📍 PORT: ${PORT}`);
console.log(`📍 HOST: ${HOST}`);
console.log(`📍 NODE_ENV: ${process.env.NODE_ENV || 'development'}`);

// ============================================
// MIDDLEWARE - Keep it simple
// ============================================

app.use(cors({
    origin: process.env.FRONTEND_URL || '*',
    credentials: true
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ============================================
// HEALTH CHECK - Must work first
// ============================================

app.get('/health', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Homigo API is running',
        timestamp: new Date().toISOString(),
        env: process.env.NODE_ENV || 'development'
    });
});

app.get('/', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Homigo Backend API',
        version: '1.0.0',
        endpoints: {
            health: '/health',
            auth: '/auth/*',
            properties: '/properties/*'
        }
    });
});

// ============================================
// IMPORT ROUTES - After basic setup
// ============================================

let routesLoaded = false;

try {
    const authRoutes = await import('./routes/authRoutes.js');
    const uploadRoutes = await import('./routes/uploadRoutes.js');
    const propertyRoutes = await import('./routes/propertyRoutes.js');
    const favoriteRoutes = await import('./routes/favoriteRoutes.js');
    const reservationRoutes = await import('./routes/reservationRoutes.js');
    const bookingRoutes = await import('./routes/bookingRoutes.js');
    const escrowRoutes = await import('./routes/escrowRoutes.js');
    const activityRoutes = await import('./routes/activityRoutes.js');
    const messageRoutes = await import('./routes/messageRoutes.js');
    const notificationRoutes = await import('./routes/notificationRoutes.js');
    const adminRoutes = await import('./routes/adminRoutes.js');
    const { errorHandler, notFoundHandler } = await import('./middleware/errorHandler.js');

    // Mount routes
    app.use('/auth', authRoutes.default);
    app.use('/upload', uploadRoutes.default);
    app.use('/properties', propertyRoutes.default);
    app.use('/favorites', favoriteRoutes.default);
    app.use('/reservations', reservationRoutes.default);
    app.use('/bookings', bookingRoutes.default);
    app.use('/escrow', escrowRoutes.default);
    app.use('/activities', activityRoutes.default);
    app.use('/messages', messageRoutes.default);
    app.use('/notifications', notificationRoutes.default);
    app.use('/admin', adminRoutes.default);

    // Error handlers
    app.use(notFoundHandler);
    app.use(errorHandler);

    routesLoaded = true;
    console.log('✅ All routes loaded successfully');
} catch (error) {
    console.error('⚠️  Error loading routes:', error.message);
    console.error('⚠️  Server will start but some routes may not work');
}

// ============================================
// START SERVER - This MUST happen
// ============================================

const server = app.listen(PORT, HOST, () => {
    console.log('');
    console.log('╔════════════════════════════════════════╗');
    console.log('║     HOMIGO BACKEND API SERVER         ║');
    console.log('╚════════════════════════════════════════╝');
    console.log('');
    console.log(`🚀 Server running on ${HOST}:${PORT}`);
    console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`🌐 API URL: http://${HOST}:${PORT}`);
    console.log(`🔗 Frontend URL: ${process.env.FRONTEND_URL || 'Not set'}`);
    console.log(`✅ Server successfully bound to ${HOST}:${PORT}`);
    console.log(`📦 Routes loaded: ${routesLoaded ? 'Yes' : 'Partial'}`);
    console.log('');
    console.log('Available endpoints:');
    console.log(`  GET  /health                       - Health check`);
    console.log(`  GET  /                             - API info`);
    if (routesLoaded) {
        console.log(`  POST /auth/signup                  - User registration`);
        console.log(`  POST /auth/login                   - User login`);
        console.log(`  GET  /properties                   - Get properties`);
    }
    console.log('');

    // Test database connection AFTER server starts
    testDatabaseConnection();
});

// Handle server errors
server.on('error', (error) => {
    console.error('❌ Server error:', error);
    if (error.code === 'EADDRINUSE') {
        console.error(`❌ Port ${PORT} is already in use`);
        process.exit(1);
    }
});

// ============================================
// DATABASE CONNECTION TEST
// ============================================

async function testDatabaseConnection() {
    try {
        const { testConnection } = await import('./config/database.js');
        const isConnected = await testConnection();
        if (!isConnected) {
            console.warn('⚠️  Database connection failed, but server is running');
            console.warn('⚠️  Check SUPABASE_URL and SUPABASE_ANON_KEY environment variables');
        }
    } catch (error) {
        console.error('⚠️  Could not test database connection:', error.message);
    }
}

// ============================================
// GRACEFUL SHUTDOWN
// ============================================

process.on('SIGTERM', () => {
    console.log('SIGTERM signal received: closing HTTP server');
    server.close(() => {
        console.log('HTTP server closed');
        process.exit(0);
    });
});

process.on('SIGINT', () => {
    console.log('SIGINT signal received: closing HTTP server');
    server.close(() => {
        console.log('HTTP server closed');
        process.exit(0);
    });
});

process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception:', err);
    console.error('Server will continue running...');
});

process.on('unhandledRejection', (err) => {
    console.error('Unhandled Promise Rejection:', err);
    console.error('Server will continue running...');
});

console.log('✅ Server initialization complete');
