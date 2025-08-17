  const Customer = require('../models/customers')



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

        res.status(201).json({ succes: true, data: newCustomer })
    } catch (error) {
        console.error(error.message)
        res.status(500)
    }
}

exports.deleteCustomer = async (req, res) => {
    const { id } = req.params

    try {
        await Customer.findByIdAndDelete(id)
        res.status(201).json({ succes: true, message: 'deleted' })
    } catch (error) {
        res.status(500)
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
exports.checkInCustomer = async(req,res)=>{
    const {id} = req.params;
   
    try {
         const customer = await Customer.findById(id)

        if (!customer) {
            return res.status(404).json({ success: false, message: 'Customer not found' });
        }

        if (customer.isCheckedIn) {
             return res.status(400).json({ success: false, message: 'Customer is already checked in' });
        }

        customer.isCheckedIn = true,
        customer.lastCheckIn = new Date(),
        customer.checkIns.push({checkInTime: new Date()})

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
exports.checkOutCustomer = async(req,res)=>{
    const {id} = req.params;

    try{
        const customer = await Customer.findById(id)
        if (!customer) {
            return res.status(404).json({succes: false, message: 'customer not found'})
        }
        const latestCheckIn = customer.checkIns
                          .filter(c => c.checkInTime && !c.checkOutTime)
                          .sort((a,b) => new Date(b.checkInTime) - new Date(a.checkInTime))[0]

        if (!latestCheckIn) {
             return res.status(400).json({ success: false, message: 'No active check-in found' });
        }

        const checkOutTime = new Date()
        latestCheckIn.checkOutTime = checkOutTime
        latestCheckIn.duration = Math.floor((checkOutTime - latestCheckIn.checkInTime)/(1000 * 60))

        customer.isCheckedIn = false
         await customer.save()

          res.status(200).json({ 
            success: true, 
            message: 'Customer checked out successfully',
            data: customer,
            duration: latestCheckIn.duration
        });
    }catch(e){
         console.error(error.message);
        res.status(500).json({ success: false, message: 'Error checking out customer' });
    }
}
exports.getCheckIns = async(req, res) => {
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

