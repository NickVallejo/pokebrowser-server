const express = require("express")
const players = express.Router()
const {playerSrcWare} = require('../middleware/srcWare')
const {pokemonSaveWare, ballManageWare} = require('../middleware/inventoryWare')
const {authWare} = require('../middleware/authWare')

players.get('/', authWare, playerSrcWare)
players.post('/add-poke', authWare, pokemonSaveWare)
players.post('/manage-balls', authWare, ballManageWare)
module.exports = players
