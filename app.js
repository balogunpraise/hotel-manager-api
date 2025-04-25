const express = require('express')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
dotenv.config({path:'./config.env'})
const cors = require('cors')
const morgan = require('morgan')
const authRouter = require('./Routes/authRouter')
const cookieParser = require('cookie-parser')
const {authMiddleware, restrictTo} = require('./Middlewares/authMiddleware')

const app = express()

//Middleware
app.use(express.json())
app.use(cookieParser())
app.use(cors())
app.use(morgan('dev'))

//Routes
app.use('/api/auth', authRouter)
app.use('/api/users',  authRouter)

//DB connection
const mongoUri = process.env.MONGO_URI
mongoose.connect(mongoUri).then(()=>{
    console.log('mongoDB is connected successfully')
}).catch(err => console.error('mongoDB connection error:', err))

const port = process.env.PORT || 3500
app.listen(port, () =>{
    console.log(`App is listening on port ${port}`)
})