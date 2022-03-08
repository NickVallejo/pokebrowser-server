const mongoose = require("mongoose")

const userSchema = mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  active_trades: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Trades',
    }
  ],
  pokemon: {
    type: Array,
    default: []
  }
})

module.exports = userSchema
