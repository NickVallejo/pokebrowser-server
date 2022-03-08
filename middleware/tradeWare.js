const {Users, Trades} = require("../config/db")
const {v4: uuidv4} = require('uuid')

const deleteTradeWare = async(req, res, next) => {
    try{
        const {tradeId} = req.body
        const trade = await Trades.findByIdAndDelete({_id: tradeId})
        const users = await Users.updateMany(
            {active_trades: {$in: trade._id}},
            {$pull: {active_trades: trade._id}}
        )

        res.send({
            success: true, 
            data: {
                modified_trade: {status: 'inactive'}
            }
        })
    } catch(err){
        res.send({success: false, data: err})
    }
}

const requestTradeWare = async(req, res, next) => {
    try{
        const {userId} = req.body // other player's id
        const myId = req.userId // my id
        const newTrade = new Trades({
            requestor: myId,
            acceptor: userId,
            init_status: 'pending',
            room_id: uuidv4()
        })
    
        newTrade.save()
        .then(async trade => {
            const tradeUsers = await Users.find({_id: {$in: [myId, userId]}})
            
            const savedUsers = await Promise.all(tradeUsers.map(async user => {
                user.active_trades.push(trade._id)
                const savedUser = await user.save()
                return savedUser
            }))

            console.log(`Trade Users: ${tradeUsers}`)
    
            res.send({
                success: true, 
                data: {
                    modified_trade: {
                        tradeId: trade._id,
                        roomId: trade.room_id, 
                        status: 'pending', 
                        iSent: true
                    }
                }
            })
        })
    } catch(err){
        console.log(err)
        res.send({success: false, data: err})
    }
}

const acceptTradeWare = async(req, res, next) => {
    try{
        const {tradeId} = req.body // other player's id
        const myId = req.userId // my id
        const trade = await Trades.findByIdAndUpdate(tradeId, {$set: {init_status: 'active'}})

        res.send({
            success: true, 
            data: {
                modified_trade: {
                    tradeId: trade._id,
                    roomId: trade.room_id, 
                    status: 'active', 
                    iSent:  trade.requestor.equals(myId)
                }
            }
        })
            
    } catch(err){
        console.log(err)
        res.send({success: false, data: err})
    }
}

module.exports = {deleteTradeWare, requestTradeWare, acceptTradeWare}