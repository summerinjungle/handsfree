const { createRoom } = require('../database/room');
// const { user } = require('../routes');
const { to } = require('await-to-js');


exports.createRoom = async ({roomId, publisher, timeString}) => {
    const [err, room] = await to(createRoom({roomId, publisher, timeString}));
    if (err) {
        throw new Error('Wrong RoomdId');
    }
    return room;
};

