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
        unique: 1
    },
    createdAt: {       //방 생성시간
        type: String,
        trim: true,
        unique: 1
    },
    chatingList: {    //채팅 리스트
        type: Array,
        trim: true,
        unique: 1
    },
    emailList: {     //이메일 리스트 or 사용자 리스트?
        type: Array,
        trim: true,
        unique: 1
    },
    chatList: {
        type: Object
    },
    highlightList: {
        type: Object
    },
    recordStopList: {
        type: Object
    }
});

module.exports = model('Room', roomSchema);
// module.exports = model('User', timeInfoSchema);
