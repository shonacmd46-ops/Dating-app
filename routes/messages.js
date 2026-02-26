const express = require('express');
const router = express.Router();

// Mock database for conversations and messages
let conversations = {};

// Send message
router.post('/send', (req, res) => {
    const { senderId, recipientId, content } = req.body;
    const conversationId = `${senderId}-${recipientId}`;
    if (!conversations[conversationId]) {
        conversations[conversationId] = [];
    }
    const message = { senderId, content, timestamp: new Date(), read: false };
    conversations[conversationId].push(message);
    res.status(201).send({ message: 'Message sent!', conversationId, message });
});

// Get conversation history
router.get('/history/:conversationId', (req, res) => {
    const { conversationId } = req.params;
    const history = conversations[conversationId] || [];
    res.send(history);
});

// Get all conversations
router.get('/conversations/:userId', (req, res) => {
    const userId = req.params.userId;
    const userConversations = Object.keys(conversations).filter(cid => cid.includes(userId));
    res.send(userConversations);
});

// Delete message
router.delete('/message/:conversationId/:timestamp', (req, res) => {
    const { conversationId, timestamp } = req.params;
    if (conversations[conversationId]) {
        conversations[conversationId] = conversations[conversationId].filter(message => message.timestamp !== new Date(timestamp));
        res.send({ message: 'Message deleted.' });
    } else {
        res.status(404).send({ message: 'Conversation not found.' });
    }
});

// Mark message as read
router.patch('/message/read/:conversationId/:timestamp', (req, res) => {
    const { conversationId, timestamp } = req.params;
    if (conversations[conversationId]) {
        const message = conversations[conversationId].find(msg => msg.timestamp === new Date(timestamp));
        if (message) {
            message.read = true;
            res.send({ message: 'Message marked as read.', message });
        } else {
            res.status(404).send({ message: 'Message not found.' });
        }
    } else {
        res.status(404).send({ message: 'Conversation not found.' });
    }
});

module.exports = router;
