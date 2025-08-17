 const User = require('../models/users')
 const PasswordSchema = require('../middleware/passwordValidator')
const { ensureAuthenticated, ensureAdmin } = require('../middleware/auth')
const passport = require('passport')
 const session = require('express-session')

 exports.register = async(req, res)=>{
    const { email, role } = req.body;
    const defaultPassword = '1234'
        try {
            const newUser = new User({ email, role });
            await User.register(newUser, defaultPassword);
            res.status(201).json({ success: true, message: 'User registered successfully' });
        } catch (error) {
            console.error(error.message);
            res.status(500).json({ success: false, message: 'Error registering user' });
        }
 }
 exports.login = (req,res,next)=>{
    console.log(req.body); // Add this line to log the request body
        passport.authenticate('local', (err, user, info) => {
            if (err) {
                console.error('Passport error:', err);
                return res.status(500).json({ success: false, message: 'Internal server error' });
            }
            if (!user) {
                return res.status(401).json({ success: false, message: info.message || 'Invalid credentials' });
            }
    
            req.logIn(user, (err) => {
                if (err) {
                    console.error('Login error:', err);
                    return res.status(500).json({ success: false, message: 'Login failed' });
                }
                return res.status(200).json({ success: true, message: 'User logged in successfully', user });
            });
        })(req, res, next);
 }


 exports.logout = (req,res)=>{
     req.logout((err) => {
        if (err) {
            return res.status(500).json({ success: false, message: 'Error logging out' });
        }
        res.status(200).json({ success: true, message: 'User logged out successfully' });
    });
 }

  exports.getCurrentUser = (req,res)=>{
     if (req.isAuthenticated()) {
         res.status(200).json({ success: true, user: req.user });
     }else{
         res.status(401).json({ success: false, message: 'User not authenticated' });
     }
 }
 exports.changePassword = async(req,res)=>{
    const { oldPassword, newPassword } = req.body;
    if (!req.isAuthenticated()) {
        return res.status(401).json({ success: false, message: 'User not authenticated' });
    }

    const passwordError = PasswordSchema.validate(newPassword, {details: true})

    if (passwordError.length > 0) {
        return res.status(400).json({
            success: false,
            message: 'Password is either too common or does not meet requirements(must contain at least 1 capital letter and 1 digit)',
            error: passwordError.map(e => e.message)
        })
    }

    try {
      const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        user.changePassword(oldPassword, newPassword, (err)=>{
            if (err) {
            if (err.name === 'IncorrectPasswordError') {
                return res.status(400).json({ success: false, message: 'Incorrect old password' });
            }
            return res.status(500).json({ success: false, message: 'Error changing password' });
            }
            res.status(200).json({ success: true, message: 'Password changed successfully' });
        })
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ success: false, message: 'Error changing password' });
    }
}
