const express = require("express")
const trades = express.Router()
const {deleteTradeWare, requestTradeWare, acceptTradeWare} = require('../middleware/tradeWare')
const {authWare} = require('../middleware/authWare')

trades.delete('/', authWare, deleteTradeWare)
trades.post('/', authWare, requestTradeWare)
trades.put('/', authWare, acceptTradeWare)

module.exports = trades