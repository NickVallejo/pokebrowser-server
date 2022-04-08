const {Users} = require("../config/db")
const jwt = require('jsonwebtoken')

const regWare = async(req, res, next) => {
    let errs = []
    const {username, password, confirm} = req.body
    console.log(username, password, confirm)
    try{
        const user = await Users.findOne({username})
        if(user){errs.push('Username taken.')}
        if(username.length > 14){errs.push('Username too long.')}
        if(password != confirm){errs.push('Passwords do not match.')}
        if(errs.length > 0){
            res.send({success: false, data: errs[0]})
        } else{
            const newUser = new Users({
                username,
                password
            })
            newUser.save()
            .then(user => {
                const token = jwt.sign({id: user._id}, "secret", {
                    expiresIn: "1440m",
                })
                req.userId = token.id
                res.cookie("token", token)
                res.send({success: true})
            })
            .catch(err => {throw err})
        }
    } catch(err){
        console.log(err)
        res.send({success: false, data: err})
    }
}

const logWare = async(req, res, next) => {
    const {username, password} = req.body
    
    try{
        const user = await Users.findOne({username})

        if(user && user.password === password){
            const token = jwt.sign({id: user._id}, "secret", {
                expiresIn: "1440m",
            })
            req.userId = token.id
            res.cookie("token", token)
            res.send({success: true})
        } else{
            res.send({success: false, data: 'Invalid Login Credentials.'})
        }
    } catch(err){
        console.log(err.message)
        res.status(500).send({success: false, data: err})
    }
}

const authWare = async(req, res, next) => {
    const reqToken = req.cookies.token

    if(!reqToken){
        res.send({success: false})
    } else{
        try{
            const resToken = await jwt.verify(reqToken, "secret")
            req.userId = resToken.id
            next()
        } catch(err){
            if(err.name === 'TokenExpiredError'){
                res.status(200).send({success: false, data: err})
            } else{
                res.status(500).send({success: false, data: err})
            }
        }
    }
}

module.exports = {regWare, logWare, authWare}