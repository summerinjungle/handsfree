const { model, Schema } = require("mongoose");

const muteTimeSchema = new Schema({
    roomId: {
        type:String,
    },
    start: {
        type: String,
    },
    end: {
        type: String,
    },
});

module.exports = model("MuteTime", muteTimeSchema);
