const {Users, Trades} = require("../config/db")
const {openIo} = require('../routes/sockets/traderoom-socket')

const accessRoomWare = async(req, res, next) => {    

    const user = await Users.findById(req.userId)

    if(user){
        const queriedTradeId = req.query._id !== 'null' ? req.query._id : false
        const queriedTradeRoom = req.params.id !== 'null' ? req.params.id : false

        if(queriedTradeId && queriedTradeRoom){
            console.log('SOMEOHWO MADE IT IN HEREy')
            const trade = await Trades.findOne({room_id: queriedTradeRoom, _id: req.query._id})

            if(!trade){
                //! FIX THIS QUERY HERE
                console.log(user.active_trades)
                console.log(queriedTradeId)
    
                const tradeFound = user.active_trades.find(tradeId => 
                    tradeId.equals(queriedTradeId)
                )
    
                console.log(tradeFound)
    
                if(tradeFound){
                    console.log('TRADE FOUND')
                    await Users.updateMany(
                        {active_trades: {$in: tradeFound._id}},
                        {$pull: {active_trades: tradeFound._id}}
                    )
                }
    
                res.send({success: false, data: user})
            }
            else if(!trade.requestor.equals(req.userId) && !trade.acceptor.equals(req.userId)){
                res.send({success: false, data: user})
            } else{
                res.send({success: true, data: {user, host: trade.acceptor.equals(req.userId)}})
            }
        } else res.send({success: false, data: user})
    }
}

module.exports = {accessRoomWare}