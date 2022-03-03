const express = require("express")
const trades = express.Router()
const {deleteTradeWare, requestTradeWare} = require('../middleware/tradeWare')

trades.delete('/', deleteTradeWare)
trades.post('/', requestTradeWare)

module.exports = trades