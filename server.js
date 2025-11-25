const express = require("express");
const app = express();
const PORT = 3000;

// Parse JSON body
app.use(express.json());
app.get('/bot',(req,res)=>{
    res.status(200).send("Hi there! 👋 Welcome to UrbPark . I’m here to help you book a parking slot quickly and easily. How can I assist you today?");
})

app.post('/explore',(req,res)=>{
    res.status(200).send("Great choice! 🌆 Here are the available parking locations you can explore. Each place includes details like total slots, nearby landmarks, and availability to help you choose the perfect spot. Just select a location to see more information or book a slot instantly!")
})

app.post('/explore/area',(req,res)=>{
    body = req.body;
    console.log(body);
    res.status(200).send(`${body.message} has 20 parking areas`);
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

app.post('/explore/area/book', (req,res)=>{
    const body = req.body;
    console.log(body);
    if(body.place && body.book_a_slot_here){
        res.status(200).send("Booked successfully")
    }else{
        res.status(404).send("Please mention area");
    }
})

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
