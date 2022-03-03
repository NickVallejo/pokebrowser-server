const mongoose = require("mongoose")

const tradeSchema = mongoose.Schema({
    requestor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users',
        // type: String,
        // required: true
    },
    acceptor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users',
        // type: String,
        // required: true
    },
    init_status: {
        type: String,
        required: true
    },
    room_url: {
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
