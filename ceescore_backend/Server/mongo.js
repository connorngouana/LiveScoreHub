const mongoose = require("mongoose")
mongoose.connect("mongodb://localhost:27017/CeeScoreDatabase")



.then(() => {
    console.log("mongodb connected");
  })
  .catch(() => {
    console.log("failed to connected");
  });

  
const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  
});

const collectionusers  = mongoose.model("collectionusers", userSchema);
module.exports= collectionusers