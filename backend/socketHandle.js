
const users = {};
const socketToRoom = {};

const socketHandle = (io, socket)  => {

    //https://github.com/awayfromkeyboard7/Application-Server/blob/main/socketRoutes/team/setPeerId/index.js
    socket.on("joinRoom", (userName, peerId, roomId) => {
        console.log(peerId, roomId);
        if (users[roomId]) { // 이미 생성된 방이라면 
            users[roomId].push(peerId);
        } else { // 생성되지 않은 방이라면 
            users[roomId] = [peerId];
        }
        socket.join(roomId);
        console.log(users[roomId]);
        socketToRoom[socket.id] = roomId;
        io.to(roomId).emit("userJoined", userName, users[roomId]);
        
        
        
        // if (users[roomID]) {
        //     const length = users[roomID].length;
        //     if (length === 4) {
        //         socket.emit("room full");
        //         return;
        //     }
        //     users[roomID].push(socket.id);
        // } else {
        //     users[roomID] = [socket.id];
        // }
        // socketToRoom[socket.id] = roomID;
        // const usersInThisRoom = users[roomID].filter(id => id !== socket.id);

        // socket.emit("all users", usersInThisRoom);
        socket.emit("all users", "hello im response");
    });
}

module.exports = socketHandle;
