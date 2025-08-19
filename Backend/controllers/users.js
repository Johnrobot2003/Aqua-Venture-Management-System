 const User = require('../models/users')
const crypto = require('crypto')
const bcrypt = require('bcryptjs') 
const {resetPassword} = require('../Services/EmailService')


 exports.getUsers = async (req, res) => {
     try {
         const users = await User.find();
         res.status(200).json({ success: true, data: users });
     } catch (error) {
         console.error(error.message);
         res.status(500).json({ success: false, message: 'Error fetching users' });
     }
 }
 exports.getUserById = async (req, res) => {
     const { id } = req.params;
     try {
         const user = await User.findById(id);
         if (!user) {
             return res.status(404).json({ success: false, message: 'User not found' });
         }
         res.status(200).json({ success: true, data: user });
     } catch (error) {
         console.error(error.message);
         res.status(500).json({ success: false, message: 'Error fetching user' });
     }
 }
 exports.currentUser = async(req,res)=>{
     if (req.isAuthenticated()) {
        res.status(200).json({ success: true, user: req.user });
    } else {
        res.status(401).json({ success: false, message: 'User not authenticated' });
    }
 }
exports.deleteUser = async (req, res) => {
    const { id } = req.params;
    try {
        await User.findByIdAndDelete(id);
        res.status(200).json({ success: true, message: 'User deleted successfully' });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ success: false, message: 'Error deleting user' });
    }
}
exports.updateUser = async (req, res) => {
    const { id } = req.params;
    try {
        const updatedUser = await User.findByIdAndUpdate(id, req.body, { new: true });
        if (!updatedUser) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        res.status(200).json({ success: true, data: updatedUser });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ success: false, message: 'Error updating user' });
    }
}
exports.forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found!" });
        }

      
        const token = crypto.randomBytes(20).toString("hex");
        const expiryTime = new Date(Date.now() + 3600000); // 1 hour from now

        // Save token + expiry in user document using direct assignment
        user.resetPasswordToken = token;
        user.resetPasswordExpires = expiryTime;
        
        // Save and verify
        const savedUser = await user.save();
       

        // Verify the save worked by fetching the user again
        const verifyUser = await User.findById(user._id);
      

        // Send email with reset link
        const resetLink = `http://localhost:5173/reset-password/${token}`;
        await resetPassword(user.email, resetLink);

        return res.status(200).json({ success: true, message: "Password reset link sent to email." });
    } catch (err) {
        console.error('Forgot password error:', err);
        return res.status(500).json({ success: false, message: "Error resetting password" });
    }
};

exports.resetPassword = async (req, res) => {
    try {
        const { token, newPassword } = req.body;
        
    

        if (!token || !newPassword) {
            return res.status(400).json({ 
                success: false, 
                message: "Token and new password are required" 
            });
        }

        // First, find the user with this token regardless of expiry
        const userWithToken = await User.findOne({ resetPasswordToken: token });
        
      

        // Now check for valid (non-expired) token
        const user = await User.findOne({
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: Date.now() }
        });

        if (!user) {
            if (userWithToken) {
                return res.status(400).json({ 
                    success: false, 
                    message: "Reset token has expired. Please request a new password reset." 
                });
            } else {
                return res.status(400).json({ 
                    success: false, 
                    message: "Invalid reset token" 
                });
            }
        }

        console.log('Token is valid, proceeding with password reset');

        // Use passport-local-mongoose's setPassword method
        await new Promise((resolve, reject) => {
            user.setPassword(newPassword, (err) => {
                if (err) {
                    console.error('setPassword error:', err);
                    return reject(err);
                }
                resolve();
            });
        });

        // Clear reset token fields
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        
        await user.save();

        return res.status(200).json({ 
            success: true, 
            message: "Password reset successful. You can now login with your new password." 
        });
        
    } catch (err) {
        console.error('Reset password error:', err);
        return res.status(500).json({ 
            success: false, 
            message: "Error resetting password" 
        });
    }
};