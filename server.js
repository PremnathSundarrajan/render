const express= require('express');
const PORT = 3000;

const app = express();

app.get('/',(req,res)=>{
    res.json({msg:"hello from backend"});

})

app.listen(PORT,()=>{
    console.log("server is running");
})