const { model, Schema } = require('mongoose');

const roomInfoSchema = new Schema({
    roomid: {         //방 id
        type: String,
        required: true,
        maxlength: 50
    },
    publisher: {         //방 id
        type: String,
        required: true,
        maxlength: 50
    },
    isrecording: {    //기록 중지 여부
        type: Boolean,
        equired: true
        
    },
    // recordingURL: {       //방 생성시간
    //     type: String,
    //     unique: 1
    // },
    // createAt: {       //방 생성시간
    //     type: String,
    //     trim: true,
    //     unique: 1
    // },
    // chatinglist: {    //채팅 리스트
    //     type: Array,
    //     trim: true,
    //     unique: 1
    // },
    // email_list: {     //이메일 리스트
    //     type: Array,
    //     trim: true,
    //     unique: 1
    // },
 
});



module.exports = model('RoomInfo', roomInfoSchema);
// module.exports = model('User', timeInfoSchema);