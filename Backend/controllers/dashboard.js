const Customer = require('../models/customers');

exports.getStats = async(req, res)=>{
    try {
        const now = new Date();
        const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const weekFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

        const totalCustomers = await Customer.countDocuments()
        const activeCustomers = await Customer.countDocuments({
            status: 'currently active'
        })
         const checkedInToday = await Customer.countDocuments({
            lastCheckIn: { $gte: todayStart },
            isCheckedIn: true
        });
          const expiringThisWeek = await Customer.countDocuments({
            $or: [
                { expireAt: { $gte: now, $lte: weekFromNow } },
                { monthlyExpires: { $gte: now, $lte: weekFromNow } }
            ]
        });
         res.status(200).json({
            success: true,
            data: {
                totalCustomers,
                activeCustomers,
                checkedInToday,
                expiringThisWeek
            }
        });
    } catch (error) {
        console.error('Error fetching dashboard stats:', error.message);
        res.status(500).json({ 
            success: false, 
            message: 'Failed to fetch dashboard statistics' 
        });
    }
}
exports.getRecentActivity = async (req, res) => {
    try {
        const activities = [];
        
        // Get recent check-ins (customers with recent activity)
        const recentCheckIns = await Customer.find({
            checkIns: { $exists: true, $ne: [] }
        })
        .select('Name checkIns createdAt')
        .sort({ lastCheckIn: -1 })
        .limit(15);

        // Process check-ins into activities
        recentCheckIns.forEach(customer => {
            if (customer.checkIns && customer.checkIns.length > 0) {
                // Get the last few check-ins for each customer
                const recentCustomerCheckIns = customer.checkIns
                    .slice(-3) // Get last 3 check-ins
                    .reverse(); // Most recent first

                recentCustomerCheckIns.forEach(checkIn => {
                    // Check-in activity
                    if (checkIn.checkInTime) {
                        activities.push({
                            type: 'checkin',
                            description: `${customer.Name} checked in`,
                            time: formatTimeAgo(checkIn.checkInTime),
                            timestamp: checkIn.checkInTime
                        });
                    }

                    // Check-out activity (if exists)
                    if (checkIn.checkOutTime) {
                        activities.push({
                            type: 'checkout',
                            description: `${customer.Name} checked out (${checkIn.duration} min)`,
                            time: formatTimeAgo(checkIn.checkOutTime),
                            timestamp: checkIn.checkOutTime
                        });
                    }
                });
            }
        });

        // Get recently registered customers (last 7 days)
        const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
        const recentRegistrations = await Customer.find({
            createdAt: { $gte: sevenDaysAgo }
        })
        .select('Name createdAt')
        .sort({ createdAt: -1 })
        .limit(10);

        recentRegistrations.forEach(customer => {
            activities.push({
                type: 'registration',
                description: `${customer.Name} registered as new member`,
                time: formatTimeAgo(customer.createdAt),
                timestamp: customer.createdAt
            });
        });

        // Sort all activities by timestamp (most recent first)
        activities.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

        // Return top 10 most recent activities
        res.status(200).json({
            success: true,
            data: activities.slice(0, 10)
        });

    } catch (error) {
        console.error('Error fetching recent activity:', error.message);
        res.status(500).json({ 
            success: false, 
            message: 'Failed to fetch recent activity' 
        });
    }
};

// Helper function to format time ago
function formatTimeAgo(date) {
    const now = new Date();
    const diffMs = now - new Date(date);
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} minute${diffMins === 1 ? '' : 's'} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours === 1 ? '' : 's'} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays === 1 ? '' : 's'} ago`;
    return new Date(date).toLocaleDateString();
}