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
    isEnd: {    //회의 종료 여부 
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
    chatList: [
        new Schema({
            id : {
                type: Number,
            },
            nickname : {
                type: String,
            },
            message: {
                type: String,
            },
            startTime: {
                type: String
            },
            marker: {
                type: Boolean
            },
            time: {
                type: String
            },
        })
    ],

    starList: [
        new Schema({
            startTime : {
                type: String,
            }
        })
    ],
    recordMuteList: [
        new Schema({
            left : {
                type: String,
            },
            right : {
                type: String,
            }
        })
    ]
});

module.exports = model('Room', roomSchema);
