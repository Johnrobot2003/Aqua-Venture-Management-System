const Customer = require('../models/customers')


exports.getReports = async (req, res) => {

    try {
        const memberCount = await Customer.countDocuments({
            cutomerType: 'member'
        })
        const monthlyCount = await Customer.countDocuments({
            cutomerType: 'monthly'
        })
        const goldMembers = await Customer.countDocuments({
            monthlyAccess: 'Gold'
        })
        const silvermembers = await Customer.countDocuments({
             monthlyAccess: 'Silver'
        })
         const basicMembers = await Customer.countDocuments({
             monthlyAccess: 'Basic'
        })
        res.json({
            success: true,
            data: {
                member: memberCount,
                monthly: monthlyCount,
                gold: goldMembers,
                silver: silvermembers,
                basic: basicMembers
            }
        })
    } catch (error) {
        console.error("Error fetching report data:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
}