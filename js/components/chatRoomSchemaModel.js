//server mongoose
const mongoose = require('mongoose');

const ChatRoomModal = mongoose.model('ChatRoom', new mongoose.Schema({
    // Define your data schema here
    room: { type: Object, required: true },
    chat: [{
        sender: { type: String, required: true },
        messages: { type: Array, required: true },
        timestamp: { type: Date, default: Date.now }
    }]
}));

module.exports = ChatRoomModal;