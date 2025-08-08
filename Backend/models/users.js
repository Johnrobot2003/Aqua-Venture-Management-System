const mongoose = require('mongoose')
const { Schema } = mongoose
const passportLocalMongoose = require('passport-local-mongoose')
const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    role: {
        type: String,
        enum: ['staff', 'admin'],
        default: 'user'
    }
})




userSchema.plugin(passportLocalMongoose, {
    usernameField: 'email',
})




module.exports = mongoose.model('User', userSchema)