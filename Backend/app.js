require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const cron = require('node-cron')
const cors = require('cors')
const helmet = require('helmet')
const rateLimit = require('express-rate-limit')
const mongoSanitize = require('express-mongo-sanitize')
const passport = require('passport')
const session = require('express-session')
const MongoStore = require('connect-mongo')
const LocalStrategy = require('passport-local').Strategy

const Customer = require('./models/customers')
const User = require('./models/users')
const userController = require('./controllers/users')
const dashboardRouter = require('./Routes/Dashboard')
const authRoute = require('./Routes/Auth')
const userRoutes = require('./Routes/Users')
const customerRoutes = require('./Routes/Customers')

const app = express()

// ---------------- MIDDLEWARE ORDER ----------------

// Security headers FIRST
app.use(helmet({
  crossOriginResourcePolicy: false, // allow cross-origin cookies
}))

// CORS second
app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:3000',
    'https://aquaventure.vercel.app',
  ],
  credentials: true
}))

// Body parser
app.use(express.json())

// ---------------- DATABASE ----------------
const db_url = process.env.MONGO_URL || 'mongodb://localhost:27017/gym-management-system'
mongoose.connect(db_url).catch(err => {
  console.error("MongoDB connection error:", err);
  process.exit(1)
})
const db = mongoose.connection
db.on("error", console.error.bind(console, "connection error:"))
db.once("open", () => {
  console.log("Database connected")
})

// ---------------- SESSION ----------------
app.set('trust proxy', 1) // Needed on Render/Heroku

const store = MongoStore.create({
  mongoUrl: db_url,
  // comment out touchAfter for now to avoid delayed session writes
  // touchAfter: 24 * 60 * 60
})

app.use(session({
  store,sdds
  name: 'session-user',
  secret: process.env.SESSION_SECRET || 'fallback-secret',
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production', // true on Render
    sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax',
    maxAge: 1000 * 60 * 60 * 24 * 7 // 7 days
  }
})) 

// ---------------- PASSPORT ----------------
app.use(passport.initialize())
app.use(passport.session())

passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

passport.use(new LocalStrategy({ usernameField: 'email' }, User.authenticate()))

// ---------------- SECURITY + LIMITING ----------------
app.use(mongoSanitize())
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
})
app.use(limiter)

// ---------------- ROUTES ----------------
app.use('/', authRoute)
app.use('/api/users', userRoutes)
app.use('/api/customers', customerRoutes)
app.use('/api/dashboard', dashboardRouter)

app.post('/forgot-password', userController.forgotPassword)
app.post('/reset-password', userController.resetPassword)

// ---------------- CRON JOB ----------------
cron.schedule('* * * * *', async () => {
  try {
    const now = new Date()

    // Update main status
    const result = await Customer.updateMany(
      { expireAt: { $lte: now }, status: 'currently active' },
      { $set: { status: 'expired' } }
    )
    console.log(`Updated ${result.modifiedCount} customers main status to expired.`)

    // Update monthly status
    const monthlyResult = await Customer.updateMany(
      { monthlyExpires: { $lte: now }, monthlyStatus: 'up to date' },
      { $set: { monthlyStatus: 'expired' } }
    )
    console.log(`Updated ${monthlyResult.modifiedCount} customers monthly status to expired.`)
  } catch (error) {
    console.error('Error updating customer statuses:', error)
  }
})

// ---------------- START SERVER ----------------
const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`Now listening on ${PORT}`)
})
