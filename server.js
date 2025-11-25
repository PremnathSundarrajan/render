const express = require("express");
const app = express();
const PORT = 3000;

// Parse JSON body
app.use(express.json());
app.get('/bot',(req,res)=>{
    res.status(200).send("prem");
})
app.post("/salesiq/webhook", (req, res) => {
    const body = req.body;

    if(!body || !body.message){
        return res.status(400).json({ text: "Invalid request" });
    }

    // Parse the inner JSON string
    let msgObj;
    try {
        msgObj = JSON.parse(body.message);
    } catch(err) {
        return res.status(400).json({ text: "Invalid message format" });
    }

    // Now you can access the text
    const userText = msgObj.text;

    if(userText === "Fever"){
        return res.status(200).json({ text: "Don't worry, be hydrated. You will recover soon." });
    } else {
        return res.status(200).json({ text: "Hello from Express!" });
    }
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
