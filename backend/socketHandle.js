
const socketHandle = (socket)  => {
    console.log("hello!!");    
    console.log(socket.id, "Connected");
    socket.emit('msg', "hello im server!!");

    socket.on('msg', function(data){
        console.log(socket.id, data);
        socket.emit("msg", data);
    })
}

module.exports = socketHandle;
