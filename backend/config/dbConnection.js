const mongoose = require('mongoose');

const dbConnection = () =>{
    mongoose.connect(process.env.DB_URI).then((res)=>{
        console.log(`Database is connected with ${res.connection.host}`);
        
    }).catch((err)=>{
        console.log(err);
        
    })
}
module.exports = dbConnection;