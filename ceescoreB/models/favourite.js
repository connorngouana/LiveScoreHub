import mongoose from "mongoose";

const { Schema, models } = mongoose;

const favoriteSchema = new Schema({
    clubId: {
        type: String,
        required: true
      },
      clubName: {
        type: String,
        required: true
      },
      
      users: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'collectionusers',
    },
],
    });

const favoritedb = models.favoritedb || mongoose.model("favouritedb", favoriteSchema);
export default favoritedb;