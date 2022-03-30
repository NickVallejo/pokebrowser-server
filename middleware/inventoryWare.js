const {Users} = require("../config/db")

const pokemonSaveWare = async(req, res, next) => {
    try{
        const {poke} = req.body
        const user = await Users.findByIdAndUpdate(req.userId, {$push: {pokemon: poke}})
        res.send({success: true})
    } catch(err){
        res.status(err.response.status).send({success: false})
    }
}

const ballManageWare = async(req, res, next) => {
    try{
        const {add} = req.body
        console.log(add)
        if(add){
            console.log('ADDING')
            await Users.findByIdAndUpdate(req.userId, {$inc: {'pokeballs': 1}})
        } else{
            console.log('DECREASING')
            await Users.findByIdAndUpdate(req.userId, {$inc: {'pokeballs': -1}})
        }
        res.send({success: true})
    } catch(err){
        res.status(err).send({success: false})
    }
}

module.exports = {pokemonSaveWare, ballManageWare}