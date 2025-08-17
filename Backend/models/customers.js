const mongoose = require('mongoose')
const {Schema} = mongoose


const customerSchema = new Schema({
    Name:{
        type: String,
        required: true
    },
    cutomerType: {
        type: String,
        enum: ['monthly', 'member']
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    expireAt: {
        type: Date,
        default: function() {
            const date = new Date();

            if (this.cutomerType === 'member') {
                date.setFullYear(date.getFullYear() + 1);
            }else{
                date.setMonth(date.getMonth() + 1);
            }
            return date;
        }
       
    },
    phone: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['expired', 'active'],
        default: 'active'
    },
    checkIns : [{
        checkInTime : {
            type: Date,
            default: Date.now
        },
        checkOutTime : Date,
        duration: Number
    }],
    lastCheckIn : Date,
    isCheckedIn: {
        type: Boolean,
        default: false
    }
})

module.exports = mongoose.model('Customer', customerSchema)