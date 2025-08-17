    require('dotenv').config()
    console.log(process.env.SESSION_SECRET)
    const express = require('express')
    const mongoose = require('mongoose')
    const cron = require('node-cron')
    const app = express()
    const Customer = require('./models/customers')
    const cors = require('cors')
    const User = require('./models/users')
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

    const authRoute = require('./Routes/Auth')
    const userRoutes = require('./Routes/Users')
    const customerRoutes = require('./Routes/Customers')
    app.use(express.json())

    cron.schedule('* * * * *', async () => {
        try {
            const now = new Date();

            const result = await Customer.updateMany(
                { expireAt: { $lte: now }, status: 'active' },
                { $set: { status: 'expired' } }
            );
            console.log(`Updated ${result.modifiedCount} customers to expired.`);

            const deleteMonthly = await  Customer.deleteMany({
                expireAt: {$lte: now},
                cutomerType: 'monthly'
            })
            console.log(`Deleted ${deleteMonthly.deletedCount}.`);
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


app.use('/', authRoute)
app.use('/api/users', userRoutes)
app.use('/api/customers', customerRoutes)



app.listen(3000, () => {
    console.log('Now listening on PORT 3000')
})