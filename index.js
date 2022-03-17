require('dotenv').config()
const express = require('express')
const app = express()
const cors = require('cors')
const cookieParser = require('cookie-parser')
const jwt = require('jsonwebtoken')
require('./config/db')
const {openIo} = require('./routes/sockets/traderoom-socket')

//Middleware 
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(cookieParser())
app.use(cors({origin: 'http://localhost:3000', optionsSuccessStatus: 200, credentials: true}))

//Requiring Routes
const auth_route = require("./routes/auth")
const player_route = require('./routes/players')
const trade_route = require('./routes/trades')

//Routes
app.use('/api/auth', auth_route)
app.use('/api/players', player_route)
app.use('/api/trades', trade_route)

const server = app.listen(process.env.PORT, err => {
    if(!err){console.log(`connected to port ${process.env.PORT}`)}
    else{console.log(err)}
})

const io = require('socket.io')(server, {
    cors: {
        origin: "http://localhost:3000"
    }
})

openIo(io)