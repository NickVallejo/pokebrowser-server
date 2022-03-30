const mongoose = require("mongoose")

const pokeballSchema = mongoose.Schema({
  pokeballs: {
    type: Number,
    default: 10
  },
  greatBalls: {
    type: Number,
    default: 0
  },
  ultraBalls: {
    type: Number,
    default: 0
  },
})

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
  },
  pokeballs: {
    type: Number,
    default: 10
  }
})

module.exports = userSchema
