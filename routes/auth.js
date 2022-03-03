const express = require("express")
const auth = express.Router()
const {regWare, logWare} = require('../middleware/authWare')

auth.post('/login', logWare)
auth.post('/register', regWare)

module.exports = auth