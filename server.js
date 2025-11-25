const express= require('express');
const PORT = 3000;

const app = express();

app.get('/',(req,res)=>{
    res.json({msg:"hello from backend"});

})
app.post("/salesiq/webhook", (req, res) => {
    const body = req.body;

    if(body.message == "Fever"){
        res.status(200).json({ text: "Don't worry, be hydrated. You will recover soon." });
    } else {    
        res.status(200).json({ text: "Hello from Express!" });
    }
});
app.listen(PORT,()=>{
    console.log("server is running");
})
