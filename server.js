const express = require("express");
const app = express();
const PORT = 3000;
let change;
// Parse JSON body
app.use(express.json());
app.get('/bot',(req,res)=>{
    res.status(200).send("Hi there! 👋 Welcome to UrbPark . I’m here to help you book a parking slot quickly and easily. How can I assist you today?");
})

app.post('/explore',(req,res)=>{
    res.status(200).send("Great choice! 🌆 Here are the available parking locations you can explore. Each place includes details like total slots, nearby landmarks, and availability to help you choose the perfect spot. Just select a location to see more information or book a slot instantly!")
    //parking area cities will be suggested here
})

app.post('/explore/area',(req,res)=>{
    body = req.body;
    console.log(body);
    //city name varum, then we need to suggests parking areas of chennai here
    res.status(200).send(`${body.place} has 20 parking areas`);
})
app.post("/salesiq/webhook", (req, res) => {
    const body = req.body;


    if(!body || !body.message){
        return res.status(400).json({ text: "Invalid request" });
    }

    
    let msgObj;
    try {
        msgObj = JSON.parse(body.message);
    } catch(err) {
        return res.status(400).json({ text: "Invalid message format" });
    }

    const userText = msgObj.text;

    if(userText === "Fever"){
        return res.status(200).json({ text: "Don't worry, be hydrated. You will recover soon." });
    } else {
        return res.status(200).json({ text: "Hello from Express!" });
    }
});

app.post('/explore/area/tambaram', (req,res)=>{
    const body = req.body;
    // name of parking area will come and we will suggests the book a slot here
    console.log(body);
    if(body.area){
        change= "Tambaram";
        res.status(200).send("Can I book a slot here for you")
    }else{
        res.status(404).send("Please mention area");
    }
})

app.post('/explore/area/chrompet', (req,res)=>{
    const body = req.body;
    // name of parking area will come and we will suggests the book a slot here
    console.log(body);
    if(body.area){
        change= "Chrompet";
        res.status(200).send("Booked successfully")
    }else{
        res.status(404).send("Please mention area");
    }
});
app.post('/explore/area/book',(req,res)=>{
    if(change == "Chrompet"){
        res.status(200).send("Booked successfully");
    }else if (change == "Tambaram"){
         res.status(200).send("Booked Successfully");
    }else{
         res.status(404).send("Please mention area")
    }
})
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
