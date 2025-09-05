const mongoose = require('mongoose');

const walkInSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    checkInTime: {
        type: Date,
        default: Date.now()
    },
    checkOutTime: {
        type: Date,
        default: null
    },
    isCheckedOut: {
        type: Boolean,
        default: false
    },
    duration: {
        type: Number,
        default: null
    },
    date: {
        type: String,
        required: true
    }
}, {
    timestamps: true,
    expires: 604800 // Document expires after 7 days (7*24*60*60 = 604800 seconds)
})

walkInSchema.index({ createdAt: 1 }, { expireAfterSeconds: 604800 });

module.exports = mongoose.model('WalkIns', walkInSchema)