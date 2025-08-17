 const User = require('../models/users')




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
