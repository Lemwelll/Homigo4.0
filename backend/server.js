/**
 * Homigo Backend Server
 * Main entry point for the Express application
 */

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';
import propertyRoutes from './routes/propertyRoutes.js';
import favoriteRoutes from './routes/favoriteRoutes.js';
import reservationRoutes from './routes/reservationRoutes.js';
import bookingRoutes from './routes/bookingRoutes.js';
import escrowRoutes from './routes/escrowRoutes.js';
import activityRoutes from './routes/activityRoutes.js';
import messageRoutes from './routes/messageRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';
import { testConnection } from './config/database.js';

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 5000;
const HOST = '0.0.0.0'; // Bind to all network interfaces for Render

// ============================================
// MIDDLEWARE
// ============================================

// CORS Configuration
// app.use(cors({
//     origin: process.env.FRONTEND_URL || 'http://localhost:5173',
//     credentials: true
// }));

app.use(cors({
    origin: process.env.FRONTEND_URL || 'https://homigov5.vercel.app',
    credentials: true
}));

// Body Parser (increased limit for base64 images)
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request Logger (Development only)
if (process.env.NODE_ENV === 'development') {
    app.use((req, res, next) => {
        console.log(`${req.method} ${req.path}`);
        next();
    });
}

// ============================================
// ROUTES
// ============================================

// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Homigo API is running',
        timestamp: new Date().toISOString()
    });
});

// Authentication routes
app.use('/auth', authRoutes);

// Upload routes
app.use('/upload', uploadRoutes);

// Property routes
app.use('/properties', propertyRoutes);

// Favorite routes
app.use('/favorites', favoriteRoutes);

// Reservation routes
app.use('/reservations', reservationRoutes);

// Booking routes
app.use('/bookings', bookingRoutes);

// Escrow routes
app.use('/escrow', escrowRoutes);

// Activity routes
app.use('/activities', activityRoutes);

// Message routes
app.use('/messages', messageRoutes);

// Notification routes
app.use('/notifications', notificationRoutes);

// Admin routes
app.use('/admin', adminRoutes);

// ============================================
// ERROR HANDLING
// ============================================

// 404 Handler
app.use(notFoundHandler);

// Global Error Handler
app.use(errorHandler);

// ============================================
// START SERVER
// ============================================

const startServer = async () => {
    try {
        // Start listening on 0.0.0.0 for Render compatibility FIRST
        // This ensures Render detects the port binding
        const server = app.listen(PORT, HOST, () => {
            console.log('');
            console.log('╔════════════════════════════════════════╗');
            console.log('║     HOMIGO BACKEND API SERVER         ║');
            console.log('╚════════════════════════════════════════╝');
            console.log('');
            console.log(`🚀 Server running on ${HOST}:${PORT}`);
            console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
            console.log(`🌐 API URL: http://${HOST}:${PORT}`);
            console.log(`🔗 Frontend URL: ${process.env.FRONTEND_URL}`);
            console.log(`✅ Server successfully bound to ${HOST}:${PORT}`);
            console.log('');
            console.log('Available endpoints:');
            console.log(`  GET  /health                       - Health check`);
            console.log(`  POST /auth/signup                  - User registration`);
            console.log(`  POST /auth/login                   - User login`);
            console.log(`  POST /upload/student-id            - Upload student ID`);
            console.log(`  POST /upload/government-id         - Upload government ID`);
            console.log(`  POST /properties                   - Create property (Landlord)`);
            console.log(`  GET  /properties/my-properties     - Get my properties (Landlord)`);
            console.log(`  GET  /properties/:id               - Get property by ID`);
            console.log(`  PUT  /properties/:id               - Update property (Landlord)`);
            console.log(`  DELETE /properties/:id             - Delete property (Landlord)`);
            console.log(`  GET  /properties/admin/all         - Get all properties (Admin)`);
            console.log(`  POST /properties/admin/verify/:id  - Verify property (Admin)`);
            console.log('');
            
            // Test database connection AFTER server starts
            testConnection().then(isConnected => {
                if (!isConnected) {
                    console.warn('⚠️  Database connection failed, but server is running');
                }
            });
        });

    } catch (error) {
        console.error('❌ Failed to start server:', error.message);
        process.exit(1);
    }
};

// Start the server
startServer();

// Handle server errors
process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception:', err);
});

process.on('SIGTERM', () => {
    console.log('SIGTERM signal received: closing HTTP server');
    process.exit(0);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
    console.error('Unhandled Promise Rejection:', err);
    process.exit(1);
});
