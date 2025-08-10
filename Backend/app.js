require('dotenv').config()
console.log(process.env.SESSION_SECRET)
const express = require('express')
const mongoose = require('mongoose')
const cron = require('node-cron')
const app = express()
const Customer = require('./models/customers')
const cors = require('cors')
const User = require('./models/users')
const PasswordSchema = require('./middleware/passwordValidator')
const { ensureAuthenticated, ensureAdmin } = require('./middleware/auth')
const passport = require('passport')
const session = require('express-session')

const LocalStrategy = require('passport-local').Strategy
app.use(cors({
    origin: 'http://localhost:5173', // your frontend URL and port
    credentials: true
}));
// app.use(cors())
const db = mongoose.connection;
mongoose.connect('mongodb://localhost:27017/gym-management-system').catch(err => {
    console.error("MongoDB connection error:", err);
    process.exit(1); // Exit if can't connect to DB
});
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

app.use(express.json())

cron.schedule('0 0 * * *', async () => {
    try {
        const now = new Date();

        // Update all active customers whose expireAt is in the past
        const result = await Customer.updateMany(
            { expireAt: { $lte: now }, status: 'active' },
            { $set: { status: 'expired' } }
        );
        console.log(`Updated ${result.modifiedCount} customers to expired.`);
    } catch (error) {
        console.error('Error updating customer statuses:', error);
    }
});


app.use(session({
    name: 'session-user',
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    secure: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}))

app.use(passport.initialize())
app.use(passport.session())

//add for passport-local-mongoose so logging in will work
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

passport.use(new LocalStrategy({
    usernameField: 'email',
}, User.authenticate()))




app.get('/api/customers', async (req, res) => {
    try {
        const customers = await Customer.find()
        res.status(200).json({ success: true, data: customers })
    } catch (error) {
        console.error(error.message)
        res.status(500).json({ success: false, message: 'Error fetching customers' })
    }
})
app.get('/api/customers/:id', async (req, res) => {
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
});

app.post('/api/customers', async (req, res) => {
    const customer = req.body

    const newCustomer = new Customer(customer)

    try {
        await newCustomer.save()

        res.status(201).json({ succes: true, data: newCustomer })
    } catch (error) {
        console.error(error.message)
        res.status(500)
    }
})

app.delete('/api/customers/:id', async (req, res) => {
    const { id } = req.params

    try {
        await Customer.findByIdAndDelete(id)
        res.status(201).json({ succes: true, message: 'deleted' })
    } catch (error) {
        res.status(500)
    }
})


app.patch('/api/customers/:id', async (req, res) => {
    const { id } = req.params;
    await Customer.findByIdAndUpdate(id, req.body, { new: true })
        .then((customer) => {
            res.status(200).json({ success: true, data: customer });
        })
        .catch((error) => {
            console.error(error.message);
            res.status(500).json({ success: false, message: 'Error updating customer' });
        });
});

app.post('/register', async (req, res) => {
    const { email, password, role } = req.body;
    try {
        const newUser = new User({ email, role });
        await User.register(newUser, password);
        res.status(201).json({ success: true, message: 'User registered successfully' });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ success: false, message: 'Error registering user' });
    }
});

app.post('/login', (req, res, next) => {
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
});

app.post('/logout', (req, res) => {
    req.logout((err) => {
        if (err) {
            return res.status(500).json({ success: false, message: 'Error logging out' });
        }
        res.status(200).json({ success: true, message: 'User logged out successfully' });
    });
});

app.get('/api/users',async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json({ success: true, data: users });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ success: false, message: 'Error fetching users' });
    }
});


app.get('/api/users', async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json({ success: true, data: users });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ success: false, message: 'Error fetching users' });
    }

});
app.get('/api/users/:id', async (req, res) => {
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
});
app.get('/current-user', (req, res) => {
    if (req.isAuthenticated()) {
        res.status(200).json({ success: true, user: req.user });
    } else {
        res.status(401).json({ success: false, message: 'User not authenticated' });
    }
});

app.delete('/api/users/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await User.findByIdAndDelete(id);
        res.status(200).json({ success: true, message: 'User deleted successfully' });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ success: false, message: 'Error deleting user' });
    }
});

app.patch('/api/users/:id', async (req, res) => {
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
});

app.post('/change-password', async (req, res) => {
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
});

app.listen(3000, () => {
    console.log('Now listening on PORT 3000')
})