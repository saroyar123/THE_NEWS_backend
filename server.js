const express=require('express');
const cors=require('cors')

const app=express();
app.use(cors());

app.get('/',(req,res)=>{
  res.status(200).json({
    success:true,
    message:"hello"
  })
})

app.get('/home',(req,res)=>{
    res.status(200).json({
      success:true,
      message:"you are in home"
    })
})

app.listen(process.env.PORT,()=>{
    console.log("server is running");
})