import mongoose from "mongoose";

const { Schema, models } = mongoose;

const messageSchema = new Schema({
    
sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'collectionusers',
},

   
content: {
    type: String,
    trim: true,
},

chat: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'chatdb',
},

   
},
    { timestamps: true }
);

const Messagedb = models.Messagedb || mongoose.model("messagedb", messageSchema);
export default Messagedb;