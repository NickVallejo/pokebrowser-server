const express = require("express")
const players = express.Router()
const {playerSrcWare} = require('../middleware/srcWare')

players.get('/', playerSrcWare)

module.exports = players