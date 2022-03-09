const {Users, Trades} = require("../config/db")

const accessRoomWare = async(req, res, next) => {
    const trade = await Trades.findOne({room_id: req.params.id})
    const user = await Users.findById(req.userId)

    console.log(trade)
    console.log(req.userId)

    if(!trade || (!trade.requestor.equals(req.userId) && !trade.acceptor.equals(req.userId))){
        res.send({success: false, data: user})
    } else{
        res.send({success: true, data: user})
    }
}

module.exports = {accessRoomWare}