const express = require("express")
const auth = express.Router()
const {regWare, logWare, authWare, logoutWare} = require('../middleware/authWare')
const {Users} = require('../config/db')

auth.post('/login', logWare)
auth.post('/register', regWare)
auth.get('/access', authWare, async(req, res) => {
    const user = await Users.findById(req.userId)
    res.send({success: true, data: {user}})
})

module.exports = auth