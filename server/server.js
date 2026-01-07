const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const http = require('http');
const { Server } = require('socket.io');

// Load environment variables
dotenv.config();

const app = express();
const server = http.createServer(app);

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Database Connection
const { connectDB } = require('./config/db');
connectDB();

// Initialize Associations
require('./models/associations');

// Routes
const authRoutes = require('./routes/authRoutes');
const courseRoutes = require('./routes/courseRoutes');
const orderRoutes = require('./routes/orderRoutes');
const sourcingRoutes = require('./routes/sourcingRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const userRoutes = require('./routes/userRoutes');
const chatRoutes = require('./routes/chatRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/sourcing', sourcingRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/users', userRoutes);
app.use('/api/chat', chatRoutes);

app.get('/', (req, res) => {
    res.send('MLDA API is running');
});

// Socket.io Setup
const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173", // Allow frontend dev server
        methods: ["GET", "POST"]
    }
});

// Socket.io Middleware for Authentication
const jwt = require('jsonwebtoken');
const Message = require('./models/Message');

io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    if (!token) {
        return next(new Error('Authentication error'));
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        socket.user = decoded; // Attach user info to socket
        next();
    } catch (err) {
        next(new Error('Authentication error'));
    }
});

io.on('connection', (socket) => {
    console.log(`User connected: ${socket.user.id} (${socket.id})`);

    // Join a specific room (e.g., "room_order_123" or "user_5")
    socket.on('join_room', (room) => {
        socket.join(room);
        console.log(`User ${socket.user.id} joined room: ${room}`);
    });

    // Send Message Event
    socket.on('send_message', async (data) => {
        // data: { receiverId, content, roomId (optional), type }
        console.log('Message received:', data);

        try {
            const { receiverId, content, roomId, type } = data;

            // 1. Save to Database
            const newMessage = await Message.create({
                senderId: socket.user.id,
                receiverId: receiverId || null, // Null if it's a room message without specific receiver
                content,
                roomId,
                type: type || 'text',
                read: false
            });

            // 2. Fetch full message with sender info to return to frontend
            const fullMessage = await Message.findOne({
                where: { id: newMessage.id },
                include: [
                    // Requires associations to be loaded
                    // We can rely on 'associations.js' being required at top of file
                    { association: 'sender', attributes: ['id', 'name', 'email'] }
                ]
            });

            // 3. Emit to Receiver

            // If it's a room message (like an order chat)
            if (roomId) {
                io.to(roomId).emit('receive_message', fullMessage);
            }
            // If it's a private message
            else if (receiverId) {
                // We emit to the specific room for that user (assuming format "user_ID")
                // And also back to sender so they see it confirmed/in multiple tabs
                io.to(`user_${receiverId}`).emit('receive_message', fullMessage);
                io.to(`user_${socket.user.id}`).emit('receive_message', fullMessage);
            }

        } catch (error) {
            console.error('Error sending message:', error);
            socket.emit('error', { message: 'Failed to send message' });
        }
    });

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
});

// Start Server
const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
