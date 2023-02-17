const express=require('express');
const cors=require('cors');
const dotenv=require('dotenv');
const cookieparser=require('cookie-parser');
const {connect}=require('./database/connect');
const userRouter = require('./routes/userRoute');
const postRouter=require('./routes/postRoute');
// var util= require('util');
// var encoder = new util.TextEncoder('utf-8');


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


app.use('/api',userRouter);
app.use('/api',postRouter);



app.listen(process.env.PORT,()=>{
    console.log(`server is running ${process.env.PORT}`);
})