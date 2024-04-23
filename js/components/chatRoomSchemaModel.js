//server mongoose
const mongoose = require('mongoose');

const ChatRoomModal = mongoose.model('ChatRoom', new mongoose.Schema({
    // Define your data schema here
    room: { type: String, required: true },
    messages: [{
        sender: { type: String, required: true },
        message: { type: String, required: true },
        timestamp: { type: Date, default: Date.now }
    }]
}));

module.exports = ChatRoomModal;