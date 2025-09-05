const Customer = require('../models/customers')
const mongoose = require('mongoose') // Add this import
const nodemailer = require('nodemailer');
const QrCode = require('qrcode');
exports.getCustomers = async (req, res) => {
    try {
        const customers = await Customer.find()
        res.status(200).json({ success: true, data: customers })
    } catch (error) {
        console.error(error.message)
        res.status(500).json({ success: false, message: 'Error fetching customers' })
    }
}

exports.getCustomerById = async (req, res) => {
    const { id } = req.params;
    try {
        const customer = await Customer.findById(id);
        if (!customer) {
            return res.status(404).json({ success: false, message: 'Customer not found' });
        }
        res.status(200).json({ success: true, data: customer });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ success: false, message: 'Error fetching customer' });
    }
}

exports.registerCustomer = async (req, res) => {
    const customer = req.body

    const newCustomer = new Customer(customer)

    try {
        await newCustomer.save()

        const qrData = `https://aqua-venture-backend.onrender.com/customer/api/customers/${newCustomer._id}`;
        // Generate QR code
        const qrCodeImageBuffer = await QrCode.toBuffer(qrData);
        let transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        })
        const mailOptions = {
            from: `"Gym App" <${process.env.EMAIL_USER}>`,
            to: newCustomer.email,
            subject: "Welcome to the Gym!",
            html: `
    <h1>Welcome to Aquaventure Fitness Gym , ${newCustomer.Name}!</h1> 
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
        };
        await transporter.sendMail(mailOptions);
        res.status(201).json({ success: true, data: newCustomer }) 
    } catch (error) {
        console.error(error.message)
        if (error.code === 11000) {
            return res.status(400).json({ success: false, message: 'Email already exists' })
        }
        res.status(500).json({ success: false, message: 'Error registering customer' }) // Added message
    }
}

exports.deleteCustomer = async (req, res) => {
    const { id } = req.params

    try {
        await Customer.findByIdAndDelete(id)
        res.status(200).json({ success: true, message: 'deleted' }) // Fixed typo and status code
    } catch (error) {
        console.error(error.message)
        res.status(500).json({ success: false, message: 'Error deleting customer' }) // Added proper error response
    }
}

exports.updateCustomer = async (req, res) => {
    const { id } = req.params;
    await Customer.findByIdAndUpdate(id, req.body, { new: true })
        .then((customer) => {
            res.status(200).json({ success: true, data: customer });
        })
        .catch((error) => {
            console.error(error.message);
            res.status(500).json({ success: false, message: 'Error updating customer' });
        });
}

exports.checkInCustomer = async (req, res) => {
    const { id } = req.params;

    try {
        const customer = await Customer.findById(id)

        if (!customer) {
            return res.status(404).json({ success: false, message: 'Customer not found' });
        }

        if (customer.isCheckedIn) {
            return res.status(400).json({ success: false, message: 'Customer is already checked in' });
        }

        customer.isCheckedIn = true;
        customer.lastCheckIn = new Date();
        customer.checkIns.push({ checkInTime: new Date() })

        await customer.save()

        res.status(200).json({
            success: true,
            message: 'Customer checked in successfully',
            data: customer
        });

    } catch (error) {
        console.error(error.message);
        res.status(500).json({ success: false, message: 'Error checking in customer' });
    }
}

exports.checkOutCustomer = async (req, res) => {
    const { id } = req.params;

    try {
        const customer = await Customer.findById(id)
        if (!customer) {
            return res.status(404).json({ success: false, message: 'customer not found' }) // Fixed typo
        }
        const latestCheckIn = customer.checkIns
            .filter(c => c.checkInTime && !c.checkOutTime)
            .sort((a, b) => new Date(b.checkInTime) - new Date(a.checkInTime))[0]

        if (!latestCheckIn) {
            return res.status(400).json({ success: false, message: 'No active check-in found' });
        }

        const checkOutTime = new Date()
        latestCheckIn.checkOutTime = checkOutTime
        latestCheckIn.duration = Math.floor((checkOutTime - latestCheckIn.checkInTime) / (1000 * 60))

        customer.isCheckedIn = false
        await customer.save()

        res.status(200).json({
            success: true,
            message: 'Customer checked out successfully',
            data: customer,
            duration: latestCheckIn.duration
        });
    } catch (error) { // Fixed variable name
        console.error(error.message);
        res.status(500).json({ success: false, message: 'Error checking out customer' });
    }
}

exports.getCheckIns = async (req, res) => {
    const { id } = req.params;
    console.log('Fetching check-ins for customer:', id); // Debug log

    try {
        // Validate the ObjectId format
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid customer ID format'
            });
        }

        const customer = await Customer.findById(id);
        if (!customer) {
            console.log('Customer not found:', id); // Debug log
            return res.status(404).json({
                success: false,
                message: 'Customer not found'
            });
        }

        console.log('Customer found:', customer.Name); // Debug log
        console.log('Check-ins count:', customer.checkIns?.length || 0); // Debug log

        res.status(200).json({
            success: true,
            data: customer.checkIns || [], // Ensure we always return an array
            isCheckedIn: customer.isCheckedIn || false,
            customerName: customer.Name
        });
    } catch (error) {
        console.error('Error fetching check-in history:', error.message);
        res.status(500).json({
            success: false,
            message: 'Error fetching check-in history'
        });
    }
}