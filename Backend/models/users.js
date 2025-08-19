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
        default: 'staff' // Fixed: was 'user' but enum doesn't include 'user'
    },
    resetPasswordToken: {
        type: String,
        required: false
    },
    resetPasswordExpires: {
        type: Date,
        required: false
    }
}, {
    timestamps: true // This will add createdAt and updatedAt fields for debugging
})

userSchema.plugin(passportLocalMongoose, {
    usernameField: 'email',
})

module.exports = mongoose.model('User', userSchema)