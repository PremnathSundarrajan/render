require("dotenv").config();
const express = require("express");
const app = express();
app.set("trust proxy", 1);
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");


const { isAuthenticated } = require("./middleware/auth");
const sessionMiddleware = require("./config/sessionStore");
const PORT = 3000;
const bot_Router = require("./router/bot_Router");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const path = require('path');

app.use(express.json());
app.use(express.static('public'));
app.use(sessionMiddleware); 
console.log(process.env.DATABASE_URL);
app.get("/",(req,res)=>{

  res.sendFile(path.join(__dirname, 'public', 'index.html'));
})
app.post("/signup", async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;
    console.log(name);
    const existing = await prisma.user.findUnique({
      where: { email }
    });

    if (existing) {
      return res.status(400).json({
        message: "Email already registered"
      });
    }

    const hashed = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        phone,
        password: hashed,
        isGuest: false,
        feedback: false
      }
    });

    return res.status(200).json({
      message: "User registered successfully",
      data: user
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Signup failed" });
  }
});

app.post('/login',async(req,res)=>{
  const {email, password} = req.body;

   console.log(email);
   //console.log(zoho_visitor_id);
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await prisma.user.findUnique({
      where: { email:email }
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!user.password) {
      return res.status(400).json({
        message: "This account does not have a password. Guest login is not supported."
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid password" });
    }
    const botToken = jwt.sign({ id: user.id, email: user.email, name: user.name }, process.env.SESSION_SECRET, { expiresIn: "1h" });
     const updData = await prisma.user.update({where:{email:email},
        data:{
          botToken:botToken,
          //zoho_visitor_id:zoho_visitor_id
        }
    })
    res.json({botToken:botToken,message:" login successful"});


})

app.get("/token",async(req,res)=>{
  const {visitor_id}= req.query;
  if (!visitor_id) {
        return res.status(400).json({ message: 'Visitor ID is required' });
    }

    const user = await prisma.user.findUnique({where:{zoho_visitor_id:visitor_id}});
    if (!user || !user.botToken) {
        return res.status(404).json({ message: 'Bot key not found or user not linked.' });
    }

    res.json({
      success: true,
      token:user.botToken
    });
})

// app.post("/login", async (req, res) => {
//   try {
//     const { email, password } = req.body; // ✔ FIXED
//     console.log(email);
//     if (!email || !password) {
//       return res.status(400).json({ message: "Email and password are required" });
//     }

//     const user = await prisma.user.findUnique({
//       where: { email }
//     });

//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     if (!user.password) {
//       return res.status(400).json({
//         message: "This account does not have a password. Guest login is not supported."
//       });
//     }

//     const isMatch = await bcrypt.compare(password, user.password);

//     if (!isMatch) {
//       return res.status(401).json({ message: "Invalid password" });
//     }

//      const botToken = jwt.sign({ id: user.id, email: user.email, name: user.name }, process.env.SESSION_SECRET, { expiresIn: "1h" });
//     // req.session.user = {
//     //   id: user.id,
//     //   name: user.name,
//     //   email: user.email,
//     //   phone: user.phone
//     // };
//     const updData = await prisma.user.update({where:{email:email},
//         data:{
//           botToken:botToken
//         }
//     })


//     return res.status(200).json({
//       message: "Logged in successfully",
//       botToken, 
//       email:user.email,
//       name:user.name
//     });

//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Login failed" });
//   }
// });

// app.get('/botToken',async(req,res)=>{
//   const data = await prisma.user.fin
// })
app.get('/guest',(req,res)=>{
  const name = "Guest";

  res.status(200).json({name:name});
})
app.use(isAuthenticated);
app.use("/api", bot_Router);

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});


// const express = require("express");
// const app = express();
// const PORT = 3000;
// const bot_Router = require('./router/bot_Router');

// app.use(express.json());
// app.get('/bot',(req,res)=>{
//     res.status(200).send("Hi there! 👋 Welcome to UrbPark . I’m here to help you book a parking slot quickly and easily. How can I assist you today?");
// })

// app.post('/explore',(req,res)=>{
//     res.status(200).send("Great choice! 🌆 Here are the available parking locations you can explore. Each place includes details like total slots, nearby landmarks, and availability to help you choose the perfect spot. Just select a location to see more information or book a slot instantly!")
//     //parking area cities will be suggested here
// })

// app.post('/explore/area',(req,res)=>{
//     body = req.body;
//     console.log(body);
//     //city name varum, then we need to suggests parking areas of chennai here
//     res.status(200).send(`${body.place} has 20 parking areas`);
// })
// app.post("/salesiq/webhook", (req, res) => {
//     const body = req.body;


//     if(!body || !body.message){
//         return res.status(400).json({ text: "Invalid request" });
//     }

    
//     let msgObj;
//     try {
//         msgObj = JSON.parse(body.message);
//     } catch(err) {
//         return res.status(400).json({ text: "Invalid message format" });
//     }

//     const userText = msgObj.text;

//     if(userText === "Fever"){
//         return res.status(200).json({ text: "Don't worry, be hydrated. You will recover soon." });
//     } else {
//         return res.status(200).json({ text: "Hello from Express!" });
//     }
// });

// app.post('/explore/area/tambaram', (req,res)=>{
//     const body = req.body;
//     // name of parking area will come and we will suggests the book a slot here
//     console.log(body);
//     if(body.area){
        
//         res.status(200).send("Can I book a slot here for you")
//     }else{
//         res.status(404).send("Please mention area");
//     }
// })

// app.post('/explore/area/chrompet', (req,res)=>{
//     const body = req.body;
//     // name of parking area will come and we will suggests the book a slot here
//     console.log(body);
//     if(body.area){
       
//         res.status(200).send("Booked successfully")
//     }else{
//         res.status(404).send("Please mention area");
//     }
// });
// app.post('/explore/area/book',(req,res)=>{
//     const body = req.body;
//     console.log(body);
//     if(body.book_a_slot_here && body.book_a_slot_here == "Tambaram"){
//         res.status(200).send("Booked Tambaram slot successfully");
//     }else if (body.book_a_slot_here && body.book_a_slot_here =="Chrompet"){
//          res.status(200).send("Booked Chrompet slot Successfully");
//     }else{
//          res.status(404).send("Please mention area")
//     }
// })
// app.listen(PORT, () => {
//   console.log(`Server running at http://localhost:${PORT}`);
// });

