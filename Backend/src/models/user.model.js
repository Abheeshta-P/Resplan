const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        unique:[true, "Username name already exists"],
        required: true
    },
    email: {
        type: String,
        unique: [true, "Account already exists with this email address"],
        required: true
    },
    password: {
        type: String,
        required: true
    }
})


// inside which collection
const userModel = mongoose.model("users", userSchema)

module.exports = userModel