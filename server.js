const express= require("express");

const connectdb= require("./config/db")

connectdb();

const app=express();

const path= require('path')



//template engine

app.set('views',path.join(__dirname,'/views'));

app.set('view engine', 'ejs');

//routes

app.use(express.json());

app.use('/api/files',require('./routes/files'))

app.use("/files", require('./routes/show'));



app.use(express.static('public'));

app.use("/files/download",require("./routes/download"));



const PORT= process.env.PORT|| 4000;
app.listen(PORT, ()=>{
    console.log(`listening on port ${PORT}`)
})