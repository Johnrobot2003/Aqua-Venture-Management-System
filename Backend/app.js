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
const userController = require('./controllers/users')
const dashboardRouter = require('./Routes/Dashboard')
const helmet = require('helmet')
const rateLimit = require('express-rate-limit')
// const mongoSanitize = require('express-mongo-sanitize')
const MongoStore = require('connect-mongo')
const reportsRouter = require('./Routes/Reports')
const WalkCustomers = require('./Routes/WalkIns')

const LocalStrategy = require('passport-local').Strategy
app.use(cors({
    origin: [
        'http://localhost:5173',
        'http://localhost:3000',
        'https://aquaventure-beige.vercel.app',
        // 'https://hoppscotch.io',          // Hoppscotch production
        // 'https://hoppscotch.com',  
    ],
    credentials: true
}));

// app.use(cors())
const db = mongoose.connection;
const db_url = process.env.MONGO_URL || 'mongodb://localhost:27017/gym-management-system'
mongoose.connect(db_url).catch(err => {
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

        // Update main status (expireAt)
        const result = await Customer.updateMany(
            { expireAt: { $lte: now }, status: 'currently active' },
            { $set: { status: 'expired' } }
        );
        console.log(`Updated ${result.modifiedCount} customers main status to expired.`);

        // Update monthly status (FIXED: use monthlyExpires, not monthlyStatus)
        const monthlyResult = await Customer.updateMany(
            {
                monthlyExpires: { $lte: now },  // Fixed: use monthlyExpires (DATE field)
                monthlyStatus: 'up to date'     // Fixed: this is the condition, not comparison
            },
            { $set: { monthlyStatus: 'expired' } }
        );
        console.log(`Updated ${monthlyResult.modifiedCount} customers monthly status to expired.`);




    } catch (error) {
        console.error('Error updating customer statuses:', error);
    }
});

const store = MongoStore.create({
    mongoUrl: db_url,
    touchAfter: 24 * 60 * 60

})

// Trust the first proxy (required on Render/Heroku for secure cookies)
app.set('trust proxy', 1)

app.use(session({
    store,
    name: 'session-user',
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', // only true on Render
        sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax',
        maxAge: 1000 * 60 * 60 * 24 * 7 // 7 days
    }
}));

app.use(helmet())
// app.use(mongoSanitize())
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter)

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
app.use('/api/dashboard', dashboardRouter)
app.use('/api/reports', reportsRouter)
app.use('/api/daily-walkin', WalkCustomers)  
app.post('/forgot-password', userController.forgotPassword)
app.post('/reset-password', userController.resetPassword)



const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
    console.log(`Now listening on ${PORT}`)
})