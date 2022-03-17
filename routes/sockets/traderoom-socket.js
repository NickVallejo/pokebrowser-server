const { use } = require("../trades");
const {Users} = require('../../config/db')

const openIo = (io) => {
    io.on('connection', (socket) => { 
        socket.emit('connection')

        socket.on('join-room', (tradeData) => {
            const {roomId, user} = tradeData

            if(!io[roomId]) io[roomId] = {users: [], started: false}
            let roomUsers = io[roomId].users
            
            if(!roomUsers.find(roomUser => roomUser.id === user._id)){
                roomUsers.push({
                    id: user._id, 
                    user: user.username, 
                    pokemon: user.pokemon,
                    offer: false,
                    response: undefined,
                })
                
                socket.data.room = roomId
                socket.data.id = user._id
            }

            socket.join(roomId)

            io.to(roomId).emit('player-joined', roomUsers)
        })

        socket.on('disconnect', (reason) => {
            if(socket.data.room){
                const roomUsers = io[socket.data.room].users
                
                roomUsers.forEach(user => {
                    user.response = undefined
                    user.offer = false
                })

                io.to(socket.data.room).emit('disconnected', roomUsers)
            }
        })

        socket.on('disconnecting', reason => {
            if(io[socket.data.room]){
                const index = io[socket.data.room].users.findIndex(user => user.id === socket.data.id)
                console.log(`index of disconnector ${index}`)
                io[socket.data.room].users.splice(index, 1)
                console.log(io[socket.data.room].users)
            }
        })

        socket.on('offer', poke => {
            const {id, room} = socket.data
            const index = io[room].users.findIndex(user => user.id == id)
            io[room].users[index].offer = poke
            io.to(room).emit('offer', {id, poke})
            socket.to(room).emit('new-offer')
            console.log('OFFER PINGED', io[room].users[index].offer)
        })

        socket.on('response', response => {
            const {id, room} = socket.data
            const index = io[room].users.findIndex(user => user.id == id)
            io[room].users[index].response = response
            io.to(room).emit('response', {id, response})
        })

        socket.on('confirm-trade', () => {
            const {id, room} = socket.data
            io.to(room).emit('confirm-trade', id)
        })

        socket.on('abort-trade', () => {
            const {id, room} = socket.data
            io[room].users.forEach(user => user.response = undefined)
            io.to(room).emit('abort-trade')
        })

        socket.on('trade-processed', async(cb) => {

            const roomUsers = io[socket.data.room].users
            const roomUserIds = roomUsers.map(user => user.id)

            try{
                const users = await Users.find({_id: {$in: roomUserIds}})

                if(users.length == 2){
                    users.forEach(user => {
                        const foundUser = roomUsers.find(roomUser => user._id.equals(roomUser.id))
                        if(foundUser) foundUser.pokemon = user.pokemon
                        foundUser.response = undefined
                        foundUser.offer = false
                    })
                }
                io.to(socket.data.room).emit('trade-processed', roomUsers)
                cb({success: true})
            } catch(err){
                cb({success: false, err})
            }
        })

    });
}

module.exports = {openIo}