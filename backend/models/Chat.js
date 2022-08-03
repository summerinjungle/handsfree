const { model, Schema } = require("mongoose");

const chatSchema = new Schema({
    id: {
    type: Number,
    },
    roomId: {
    type: String,
    },
    nickname: {
    type: String,
    },
    message: {
    type: String,
    },
    startTime: {
    type: String,
    },
    marker: {
    type: Boolean,
    },
    time: {
    type: String,
    },
    play: {
    type: Boolean,
    },
});

// chatSchema.index({ roomId: 1, id: 1 });

module.exports = model("Chat", chatSchema);
