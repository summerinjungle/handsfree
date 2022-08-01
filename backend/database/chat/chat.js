const express = require('express');
const Chat = require('../../models/Chat');

exports.createChat = async(roomId, id, nickname, message, startTime, time) => {
    try {
        const chat = await Chat.create({
            id: id,
            roomId: roomId, 
            nickname: nickname,
            message: message, 
            startTime: startTime,
            marker: false,
            time: time,
            play: false,
        });
        return chat;
    } catch (err) {
        console.log(err);
    }
}

exports.findChatByRoomId = async (roomId) => {
    return await Chat.find({ 'roomId': roomId }).lean();
}

exports.findChatByRoomIdAndChatId = async (roomId, chatId) => {
    var query = {$and:[{roomId:roomId}, {id:chatId}]}
    return Chat.find(query);
}

exports.findChatByRoomIdAndChatId = async (roomId, chatId) => {
    var query = {$and:[{roomId:roomId}, {id:chatId}]}
    return Chat.find(query);
}

exports.findChatAndMark = async (_id) => {
    return await Chat.findOneAndUpdate({_id : _id}, {marker: true}).lean();
};
