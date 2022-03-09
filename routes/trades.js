const express = require("express")
const trades = express.Router()
const {deleteTradeWare, requestTradeWare, acceptTradeWare} = require('../middleware/tradeWare')
const {accessRoomWare} = require('../middleware/tradeRoomWare.js')
const {authWare} = require('../middleware/authWare')

trades.delete('/', authWare, deleteTradeWare)
trades.post('/', authWare, requestTradeWare)
trades.put('/', authWare, acceptTradeWare)
trades.get('/room/:id', authWare, accessRoomWare)

module.exports = trades