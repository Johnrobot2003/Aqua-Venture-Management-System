const nodemailer = require('nodemailer')

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth:{
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

async function sendTempPassword(email,password) {
    await transporter.sendMail({
       from: `"Gym App" <${process.env.EMAIL_USER}>`,
       to: email,
       subject: "Your secret password",
       text: `Hello! Your current password is: ${password}. Please change it after login and DO NOT show this to anyone.`
    })
}
module.exports = {sendTempPassword}