const {Users, Trades} = require("../config/db")

const playerSrcWare = async(req, res, next) => {
    try{
        const {src} = req.query
        const query = new RegExp("^"+src, "i")
        
        //this line below pretends I'm authenticated
        const user = await Users.findById('62214be563cb341df7259372')
        const users = await Users.find({
            $and: [
                {username: query},
                {username: {$ne: 'john'}}
            ]
        }).limit(10)
        if(user && users){
            const usersRes = await Promise.all(users.map(async userInQ => {
                const {username, _id} = userInQ
                let status
                const found = userInQ.active_trades.find(el => {
                    if(user.active_trades.includes(el))
                    return el
                })

                if(!found) status = {status: 'inactive', iSent: undefined}
                else{
                    const trade = await Trades.findById(found).populate('requestor').populate('acceptor')
                    //! We are checking for requestor/acceptors by username rn. We need to change back to objectId
                    status = trade ? 
                    {
                        tradeId: trade._id, 
                        status: trade.init_status, 
                        iSent: trade.requestor._id === user._id
                    } : {tradeId: false, status: 'inactive', iSent: undefined}
                }
                return {_id, username, active_trade: status}
            }))
            res.send(usersRes)
        } else{
            res.send([])
        }
    } catch(err){
        console.log(err)
        res.status(500).send(err)
    }
}

module.exports = {playerSrcWare}