const {Users, Trades} = require("../config/db")

const deleteTradeWare = async(req, res, next) => {
    try{
        const {tradeId} = req.body
        const trade = await Trades.findByIdAndDelete({_id: tradeId})
        console.log(trade)
        res.send({success: true, data: trade})
    } catch(err){
        res.send({success: false, data: err})
    }
}

const requestTradeWare = async(req, res, next) => {
    const {userId} = req.body
    const myId = '62214be563cb341df7259372' //! FIND BY USER ID WHEN USER AUTHENTICATION IS CODED
    const newTrade = new Trades({
        requestor: myId,
        acceptor: userId,
        init_status: 'pending',
    })

    //! Trying to loop through both req and accept user and add trade objectid
    //! cant iterate in foreach loop with async. unsure.
    newTrade.save()
    .then(async trade => {
        const tradeUsers = await Users.find({_id: {$in: [myId, userId]}})
        
        const savedUsers = await Promise.all(tradeUsers.map(async user => {
            user.active_trades.push(trade._id)
            const savedUser = await user.save()
            return savedUser
        }))

        console.log('saved users', savedUsers)

        res.end()
    })
}

module.exports = {deleteTradeWare, requestTradeWare}