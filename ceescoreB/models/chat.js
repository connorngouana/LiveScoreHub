import mongoose from "mongoose";

const { Schema, models } = mongoose;

const chatSchema = new Schema({
    chatName: {
        type: String,
        trim: true,
        required: true,
    },
    isGroupChat: {
        type: Boolean,
        default: false,
    },
    users: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'collectionusers',
    },
],
latestMessage: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'messagedb',
},

groupAdmin: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'collectionusers',
},

},
    { timestamps: true }
);

const Chatdb = models.Chatdb || mongoose.model("chatdb", chatSchema);
export default Chatdb;