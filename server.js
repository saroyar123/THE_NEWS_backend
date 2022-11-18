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

app.listen(4000,()=>{
    console.log("server is running");
})