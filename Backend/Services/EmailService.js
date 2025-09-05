const nodemailer = require('nodemailer')
const QrCode = require('qrcode')
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

async function sendTempPassword(email, password) {
    await transporter.sendMail({
        from: `"Gym App" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: "Your secret password",
        text: `Hello! Your current password is: ${password}. Please change it after login and DO NOT show this to anyone.`
    })
}

async function resetPassword(email, newPassword) {
    await transporter.sendMail({
        from: `"Gym App" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: "Reset Password",
        text: `Hello! This is your reset Link: ${newPassword}. If you did not request a password change kindly ingonre this.`
    })
}

async function sendQrCode(customer) {
    const qrData = `https://aqua-venture-backend.onrender.com/api/customers/${customer._id}`;
    const qrCodeImageBuffer = await QrCode.toBuffer(qrData);
    await transporter.sendMail({
        from: `"Gym App" <${process.env.EMAIL_USER}>`,
        to: customer.email,
        subject: "Welcome to the Gym!",
        html: `
    <h1>Welcome to Aquaventure Fitness Gym , ${customer.Name}!</h1> 
    <p>Thank you for registering with us. We're excited to have you as a member of our fitness community.</p>
     <p>Your unique QR code is attached below. Please present this code at the front desk during your visits for quick check-ins.</p>
      <img src="cid:qrcode" alt="QR Code" style="width:300px; height:300px;" />
        <p>If you have any questions or need assistance, feel free to reach out to our support team.</p> 
        <p>Stay active and healthy!</p> <p>Best regards,
        <br/>AFG Team</p>
    `,
        attachments: [
            {
                filename: 'qrcode.png',
                content: qrCodeImageBuffer,
                cid: 'qrcode' // Same as above in img src
            }
        ]
    });
}


    module.exports = { sendTempPassword, resetPassword, sendQrCode }