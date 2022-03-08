const mongoose = require("mongoose")

const tradeSchema = mongoose.Schema({
    requestor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users',
    },
    acceptor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users',
    },
    init_status: {
        type: String,
        required: true
    },
    room_id: {
        type: String,
        default: undefined
    },
    createdAt: { 
        type: Date, 
        expires: '1440m', 
        default: Date.now 
    }
})

module.exports = tradeSchema
