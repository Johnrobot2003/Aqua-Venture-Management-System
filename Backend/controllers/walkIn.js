const WalkIns = require('../models/walkIns');

exports.checkIn = async (req, res) => {
    try {
        const { name } = req.body;
        if (!name) {
            return res.status(400).json({ message: 'Name is required for check-in' });
        }
        const today = new Date().toISOString().split('T')[0]; // Get current date in YYYY-MM-DD format
        const newWalkIn = new WalkIns({
            name,
            date: today
        });
        await newWalkIn.save();
        res.status(201).json({message: `${name} checked in successfully`, data: {
            _id: newWalkIn._id,
            name: newWalkIn.name,
            checkInTime: newWalkIn.checkInTime,
            date: newWalkIn.date
        }});
    } catch (error) {
        console.error('Check-in error:', error);
        res.status(500).json({ message: 'Server error during check-in' });
    }
}
exports.checkOut = async (req, res) => {
    try {
        const { id } = req.params; // Changed from req.body to req.params
        
        const now = new Date();

        const checkIn = await WalkIns.findOne({
            _id: id,
            date: now.toISOString().split('T')[0],
            isCheckedOut: false
        });

        if (!checkIn) {
            return res.status(400).json({ message: 'No active check-in found for today with the provided ID' });
        }

        const checkOutTime = new Date();
        const duration = Math.round((checkOutTime - checkIn.checkInTime) / (1000 * 60));

        checkIn.checkOutTime = checkOutTime;
        checkIn.isCheckedOut = true;
        checkIn.duration = duration;

        await checkIn.save();

        res.status(200).json({ 
            message: `${checkIn.name} checked out successfully`, 
            data: {
                id: checkIn._id,
                name: checkIn.name,
                checkInTime: checkIn.checkInTime,
                checkOutTime: checkIn.checkOutTime,
                duration: `${checkIn.duration} minutes`,
            }
        });
    } catch (error) {
        console.error('Check-out error:', error);
        res.status(500).json({ message: 'Server error during check-out' });
    }
}

exports.getTodayWalkIns = async (req, res) => {
    try{
        const today = new Date().toISOString().split('T')[0]; // Get current date in YYYY-MM-DD format
        const walkIns = await WalkIns.find({ date: today }).sort({ checkInTime: -1 });

        const stats = {
            totalWalkIns: walkIns.length,
            currentlyCheckedIn: walkIns.filter(walkIn => !walkIn.isCheckedOut).length,
            checkedOut: walkIns.filter(walkIn => walkIn.isCheckedOut).length
        }

        res.json({
            message: 'Today\'s walk-ins fetched successfully',
            data: {
                walkIns: walkIns.map(walkIn => ({
                    id: walkIn._id,
                    name: walkIn.name, 
                    checkInTime: walkIn.checkInTime,
                    checkOutTime: walkIn.checkOutTime,
                    isCheckedOut: walkIn.isCheckedOut,
                    duration: `${walkIn.duration} minutes` ,
                    date: walkIn.date
                })),
                stats
            }
        })
    }catch{
        res.status(500).json({ message: 'Server error fetching today\'s walk-ins' });
    }
}