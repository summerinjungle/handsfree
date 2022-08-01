const express = require('express');
const MuteTime = require('../../models/MuteTime');

exports.createMuteTime = async(roomId, start, end) => {
    try {
        const muteTime = await MuteTime.create({
            roomId: roomId, 
            start: start,
            end: end,
        });
        return muteTime;
    } catch (err) {
        console.log(err);
    }
}


exports.findMuteTimeByRoomId = async (roomId) => {
    return await MuteTime.find({ 'roomId': roomId }).lean();
}
