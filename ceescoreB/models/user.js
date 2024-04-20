import mongoose from "mongoose";

const { Schema, models } = mongoose;

const userSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    picture: {
        type: "String",
        default:
          "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg",
    },

   
},
    { timestamps: true }
);

const CollectionUser = models.CollectionUser || mongoose.model("collectionusers", userSchema);
export default CollectionUser;