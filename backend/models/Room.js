const { model, Schema } = require('mongoose');

const roomSchema = new Schema({
    roomId: {         //방 id
        type: String,
        required: true,
        maxlength: 50
    },
    publisher: {         //퍼블리셔 아이디
        type: String,
        required: true,
        maxlength: 50
    },
    isRecording: {    //기록 중지 여부
        type: Boolean,
        required: true
    },
    recordingUrl: {       //레코딩 URL
        type: String,
    },
    createdAt: {       //방 생성시간
        type: String,
        trim: true,
    },
    emailList: {     //이메일 리스트 or 사용자 리스트?
        type: Array,
        trim: true,
    },
    chatList: {
        type: Array,
    },
    starList: {
<<<<<<< HEAD
        type: String,
    },
    recordMuteList: {
        type: String
=======
        type: Array,
    },
    recordMuteList: {
        type: Array
>>>>>>> 90aea7e810de9dfaae728de49c885aa88e10256a
    }
});

module.exports = model('Room', roomSchema);
