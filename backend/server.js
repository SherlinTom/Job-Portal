const app = require('./app');
const dotenv = require('dotenv');
const dbConnection = require('./config/dbConnection');
dotenv.config({path:'./config/config.env'});
dbConnection();
app.listen(process.env.PORT,()=>{
    console.log(`Server is on PORT ${process.env.PORT}`);
});