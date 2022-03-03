const mongoose = require('mongoose')
const userSchema = require('../models/users')
const tradeSchema = require('../models/trades')

const connection = mongoose.createConnection(
    'mongodb+srv://nicovallejo:weareborg@cluster0-p0vwz.azure.mongodb.net/pokebrowser-db?retryWrites=true&w=majority',
    {useNewUrlParser: true, useUnifiedTopology: true},
    (err) => {
        if(!err){console.log('conntected to database')} 
        else{console.log(err)}
    }
)

const Users = connection.model('Users', userSchema, 'users')
const Trades = connection.model('Trades', tradeSchema, 'trades')

module.exports = {Users, Trades}