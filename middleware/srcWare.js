const {Users, Trades} = require("../config/db")

const playerSrcWare = async(req, res, next) => {
    try{
        const {src} = req.query
        const query = new RegExp("^"+src, "i")
        
        //this line below pretends I'm authenticated
        const user = await Users.findById(req.userId)

        if(user){
            const users = await Users.find({
                $and: [
                    {username: query},
                    {username: {$ne: user.username}}
                ]
            }).limit(10)

            if(users){
                const usersRes = await Promise.all(users.map(async userInQ => {
                    const {username, _id} = userInQ
                    let status
                    const found = userInQ.active_trades.find(el => {
                        if(user.active_trades.includes(el))
                        return el
                    })
    
                    if(!found) status = {status: 'inactive'}
                    else{
                        const trade = await Trades.findById(found)
                        status = trade ? 
                        {
                            tradeId: trade._id, 
                            roomId: trade.room_id,
                            status: trade.init_status, 
                            iSent: trade.requestor.equals(user._id)
                        } : {status: 'inactive'}
                    }
                    return {_id, username, active_trade: status}
                }))
                res.send({success: true, data: usersRes})
            } else {
                res.send({success: true, data: []})
            }
        } else{
            throw new Error('User Auth Failure.')
        }
    } catch(err){
        console.log(err)
        res.status(500).send(err)
    }
}

module.exports = {playerSrcWare}