const mongoose=require('mongoose');

exports.connect=async()=>{
    mongoose.set('strictQuery', true);
    mongoose.connect(process.env.DatabaseUrl)
    .then((con)=>console.log(`database connected at ${con.connection.host}`))
    .catch((err)=>console.log(err));
    
}