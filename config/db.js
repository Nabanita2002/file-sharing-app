const mongoose= require("mongoose");
require("dotenv").config();

function connectDB(){
    //database connection

    //4Iw4E6pTtMY5SoIn

    mongoose.connect(process.env.MONGO_CONNECTION_URL);

    const connection=mongoose.connection; 

    connection.once('open',()=>{
        console.log("database connected");
    }).on("error",(err)=>{
        console.log(err);
    })
}

module.exports=connectDB; 