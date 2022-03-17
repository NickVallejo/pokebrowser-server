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

        const tradeUsers = await Users.find({_id: {$in: [myId, userId]}})

        if(tradeUsers.length === 2){
            const found = tradeUsers[0].active_trades.find(el => {
                if(tradeUsers[1].active_trades.includes(el))
                return el
            })

            if(!found){
                const newTrade = new Trades({
                    requestor: myId,
                    acceptor: userId,
                    init_status: 'pending',
                    room_id: uuidv4()
                })
            
                newTrade.save()
                .then(async trade => {
                    
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
            } else{
                res.send({success: false, data: 'There is already a trade initiated between you and this player. Trying refreshing the page.'})
            }
        } else{
            throw new Error("One or more user ID's not found")
        }
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

const processTradeWare = async(req, res, next) => {
    try{
        const {trader1, trader2} = req.body
        const trader1Found = await Users.findById(trader1.id)
        const trader2Found = await Users.findById(trader2.id)
    
        if(trader1Found && trader2Found){
            const poke1 = trader1Found.pokemon.find(poke => poke.id === trader1.pokeId)
            const poke2 = trader2Found.pokemon.find(poke => poke.id === trader2.pokeId)
    
            trader1Found.pokemon.push(poke2)
            trader2Found.pokemon.push(poke1)
    
            const index1 = trader1Found.pokemon.findIndex(poke => poke.id === trader1.pokeId)
            const index2 = trader2Found.pokemon.findIndex(poke => poke.id === trader2.pokeId)
    
            trader1Found.pokemon.splice(index1, 1)
            trader2Found.pokemon.splice(index2, 1)
    
            await trader1Found.save()
            await trader2Found.save()
        }
        res.send({success: true})
    } catch(err){
        console.log(err)
        res.status(500).send({success: false, data: err})
    }
}

module.exports = {deleteTradeWare, requestTradeWare, acceptTradeWare, processTradeWare}