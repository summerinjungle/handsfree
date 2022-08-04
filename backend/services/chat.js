const { 
    createChat, 
    findChatByRoomId, 
    findChatByRoomIdAndChatId,
    findChatAndMark 
} = require("../database/chat/chat");
const { createMuteTime, findMuteTimeByRoomId,} = require("../database/chat/muteTime");
  
exports.createChat = async (roomId, id, nickname, message, startTime, time) => {
    return await createChat(roomId, id, nickname, message, startTime, time);
};

exports.mark = async(roomId, chatId) => {
    const foundChat = await findChatByRoomIdAndChatId(roomId, chatId);
    if(foundChat[0]) {
        const updatedChat = await findChatAndMark(foundChat[0]._id);
        return true;
    } else {
        return false;
    }
}

exports.createMuteTime = async(roomId, start, end) => {
    return await createMuteTime(roomId, start, end);
};   

exports.toEditingRoom = async(roomId) => {
    let chatList = [];
    try {
      chatList = await findChatByRoomId(roomId);
    } catch (err) {
      chatList = [];
    }

    let starList = [];
    if(chatList) {
        starList = (await chatList).filter(chat => chat.marker);
    }

    let recordMuteList = [];
    try {
      recordMuteList = await findMuteTimeByRoomId(roomId);
    } catch (err) {
      recordMuteList = [];
    }
    return { chatList, starList, recordMuteList };
}
