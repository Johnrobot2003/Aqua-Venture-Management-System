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
    monthlyAccess:{
        type: String,
        enum: ['Basic','Silver','Gold']
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    monthlyExpires:{
        type: Date,
        default: function() {
            const date = new Date();
            if (this.monthlyAccess === 'Basic') {
                date.setMonth(date.getMonth() + 1)
            }else if(this.monthlyAccess === 'Silver'){
                date.setMonth(date.getMonth() + 2)
            }else if(this.monthlyAccess === 'Gold'){
                date.setMonth(date.getMonth()+4)
            }
            return date
        }
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
        required: true,
        unique: true
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