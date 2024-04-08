//server mongoose
const mongoose = require('mongoose');

const ChatRoomModal = mongoose.model('ChatRoom', new mongoose.Schema({
    // Define your data schema here
    room: {type: String, required: true},
    chat:{ 
        username: {type: String, required: true},
        message: {type: String, required: true}
    }
    // user: { type: String, required: true},
    // message: { type: String, required: true }
}));

module.exports = ChatRoomModal;