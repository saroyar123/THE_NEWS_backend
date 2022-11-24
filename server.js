const express=require('express');
const cors=require('cors');
const dotenv=require('dotenv');
const cookieparser=require('cookie-parser');
const {connect}=require('./database/connect');
const router = require('./routes/userRoute');

dotenv.config();
connect();

const app=express();

app.use(cors());
app.use(express.json());
app.use(cookieparser());


app.get('/',(req,res)=>{
  res.status(200).json({
    success:true,
    message:"hello"
  })
})


app.use('/api',router);



app.listen(process.env.PORT,()=>{
    console.log("server is running");
})