const mongoose = require("mongoose");

// const tokenSchema = new Schema({
//     userId: {
//         type: Schema.Types.ObjectId,
//         required: true,
//         ref: "user",
//         unique: true.valueOf,
//     },
//     token: { type: String, required: true },
//     createdAt: { type: Date, default: Date.now(), expires: 3600 }
// })

const tokenSchema = new mongoose.Schema({
    _userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" },
    token: { type: String, required: true },
    expireAt: { type: Date, default: Date.now, index: { expires: 3600 }}
});

module.exports = mongoose.model("token", tokenSchema);