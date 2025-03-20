const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const cors = require('cors');
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());
app.use(express.json());
app.use(cors({
    credentials: true,
    origin: true
}));

app.use('/uploads', express.static('uploads'));

const userRouter = require('./Routes/userRoute');
app.use('/api/v1/user',userRouter);

const employerRouter = require('./Routes/employerRoute');
app.use('/api/v1/employer',employerRouter);

const adminRouter = require('./Routes/adminRoute');
app.use('/api/v1/admin',adminRouter);

app.use((err,req,res,next) =>{
    res.status(err.status || 500).json({
        success: false,
        message: err.message || "Internal Server Error"
    });
});

module.exports = app;