const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const MessageQueue = require('./MessageQueue'); // Assume this is a custom module for message queuing
const FriendManager = require('./FriendManager'); // Custom module for friend management
const PresenceTracker = require('./PresenceTracker'); // Custom module for user presence tracking

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const PORT = process.env.PORT || 3000;

let users = {};

// Middleware for parsing JSON bodies
app.use(express.json());

// REST API endpoint to send messages
app.post('/api/message', (req, res) => {
    const { senderId, recipientId, message } = req.body;

    if (!senderId || !recipientId || !message) {
        return res.status(400).send('Missing fields');
    }
    
    MessageQueue.addMessage({ senderId, recipientId, message }); // Add message to the queue
    res.status(200).send('Message sent');
});

// WebSocket connection
io.on('connection', (socket) => {
    console.log('New client connected');

    socket.on('register', (userId) => {
        users[userId] = socket.id;
        PresenceTracker.updatePresence(userId, true);
        console.log(`User ${userId} registered`);
    });

    socket.on('sendMessage', (data) => {
        const { recipientId, message } = data;
        const senderId = Object.keys(users).find(key => users[key] === socket.id);

        if (recipientId in users) {
            io.to(users[recipientId]).emit('newMessage', { senderId, message });

            // Track user presence
            PresenceTracker.updatePresence(senderId, true);
        }
    });

    socket.on('disconnect', () => {
        const userId = Object.keys(users).find(key => users[key] === socket.id);
        if (userId) {
            delete users[userId];
            PresenceTracker.updatePresence(userId, false);
            console.log(`User ${userId} disconnected`);
        }
    });
});

// Start the server
server.listen(PORT, () => {
    console.log(`DM Relay Server running on port ${PORT}`);
});