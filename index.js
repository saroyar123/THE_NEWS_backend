const express=require('express');
const cors=require('cors');
const dotenv=require('dotenv');
const cookieparser=require('cookie-parser');
const {connect}=require('./database/connect');
const userRouter = require('./routes/userRoute');
const postRouter=require('./routes/postRoute');
const cloudinary=require('cloudinary');


dotenv.config();
cloudinary.config({
  cloud_name:process.env.cloudinar_CloudNamne,
  api_key:process.env.cloudinar_ApiKey,
  api_secret:process.env.cloudinar_ApiSecret,
})
connect();

const app=express();

app.use(cors());
app.use(cookieparser());
app.use(express.json({limit:'50mb'}));
app.use(express.urlencoded({limit:'50mb',extended:true}));



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