const express = require("express");
const app = express();
const PORT = 3000;

// Parse JSON body
app.use(express.json());

app.post("/salesiq/webhook", (req, res) => {
    const body = req.body;
    console.log(body);
    if(!body || !body.message){
        return res.status(400).json({ text: "Invalid request" });
    }

    if(body === "{message=Fever}"
){
        res.status(200).json({ text: "Don't worry, be hydrated. You will recover soon." });
    } else {
        res.status(200).json({ text: "Hello from Express!" });
    }
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
