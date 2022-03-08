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

module.exports = {pokemonSaveWare}