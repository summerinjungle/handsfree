
const users = {};
const usersPeerId = {};
const userToPeerId= {};

const socketHandle = (io, socket)  => {

    socket.on("joinRoom", (userName, peerId, roomId) => {
        // console.log("새로운 유저가 들어왔습니다 : ", userName, " : ", roomId);

        if (users[roomId]) { // 이미 생성된 방이라면 
            // console.log("이미 생성된 방입니다 ", users[roomId]);
            if (users[roomId].includes(userName)) {
                // console.log("아까 들어왔던 유저인데 새로고침 했나봄");

                //기존 유저 정보 제거 
                let prevPeerId = userToPeerId[userName]; 
                let peersRoom = usersPeerId[roomId];
                peersRoom =peersRoom.filter(id => id !== prevPeerId);
                usersPeerId[roomId] = peersRoom;
                usersPeerId[roomId].push(peerId);
                userToPeerId[userName] = peerId;
            } else {
                users[roomId].push(userName);
                usersPeerId[roomId].push(peerId);
                userToPeerId[userName] = peerId;
            }
            
        } else { // 생성되지 않은 방이라면 
            users[roomId]= [userName];
            usersPeerId[roomId] = [peerId];
            userToPeerId[userName] = peerId;
        }

        socket.join(roomId);
        console.log("users : ", users[roomId], " emit : ", usersPeerId[roomId]);
        io.to(roomId).emit("userJoined", userName, users[roomId], usersPeerId[roomId]);
        
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
    });
}

module.exports = socketHandle;
