const Customer = require('../models/customers')


exports.getReports = async (req, res) => {

    try {
        const memberCount = await Customer.countDocuments({
            cutomerType: 'member'
        })
        const monthlyCount = await Customer.countDocuments({
            cutomerType: 'monthly'
        })
        res.json({
            success: true,
            data: {
                member: memberCount,
                monthly: monthlyCount
            }
        })
    } catch (error) {
        console.error("Error fetching report data:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
}