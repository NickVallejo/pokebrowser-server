const {Users} = require("../config/db")

const regWare = async(req, res, next) => {
    console.log('REGWARE PINGU')
    let errs = []
    const {username, password, confirm} = req.body

    try{
        const user = await Users.findOne({username})
        if(user){errs.push('Username taken.')}
        if(username.length > 14){errs.push('Username too long.')}
        if(password != confirm){errs.push('Password do not match.')}
        if(errs.length > 0){
            res.send({success: false, data: errs})
        } else{
            const newUser = new Users({
                username,
                password
            })
            newUser.save()
            .then(user => {
                console.log(user)
                res.send({success: true, data: user})
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
            res.send({success: true})
        } else{
            res.send({success: false, data: 'Invalid Login Credentials'})
        }
    } catch(err){
        console.log('er caught the problem')
        res.status(500).send({success: false, data: err})
    }
}

module.exports = {regWare, logWare}