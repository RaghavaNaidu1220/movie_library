const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files from the public directory
app.use(express.static("public"));

mongoose.connect("mongodb+srv://admin:1234@cluster0.dsdkxea.mongodb.net/testing", {
  useUnifiedTopology: true,
  useNewUrlParser: true
}).then(() => {
  console.log("Connected to MongoDB");
}).catch((error) => {
  console.error("Error connecting to MongoDB:", error.message);
});

// Create schema and model
const userSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
  publicPlaylist: [String],
  privatePlaylist: [String]
});
const User = mongoose.model("User", userSchema);


const Note = mongoose.model("Note", userSchema);

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/register.html");
});

app.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

 

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    let newNote = new Note({
      username: name,
      email: email,
      password: hashedPassword
    });

    await newNote.save();
    res.redirect("/login.html");
  } catch (error) {
    console.error("Error saving user:", error.message);
    res.status(500).send("Internal server error raghava");
  }
});

app.post("/login", async (req, res) => {
    const { email, password } = req.body;
  
    try {
      const user = await Note.findOne({ email: email });
  
      console.log("User from database:", user);
  
      if (!user) {
        console.log("User not found");
        return res.status(400).send("Invalid email or password");
      }
  
      console.log("Stored hashed password:", user.password);
  
      const isMatch = await bcrypt.compare(password, user.password);
  
      console.log("Password comparison result:", isMatch);
      res.redirect("/home.html");
      if (!isMatch) {
        return res.status(400).send("Invalid email or password");
      }
  
     
    } catch (error) {
      console.error("Error during authentication:", error.message);
      res.status(500).send("Internal server error");
    }
  });
  
// app.post("/playlist",async (req,res)=>{
//   const 
// })


app.post("/addToPlaylist", async (req, res) => {
  const { email, movieId, privacy } = req.body;

  try {
    const user = await User.findOne({ email: email });

    if (!user) {
      return res.status(404).send("User not found");
    }

    if (privacy === "public") {
      user.publicPlaylist.push(movieId);
    } else if (privacy === "private") {
      user.privatePlaylist.push(movieId);
    } else {
      return res.status(400).send("Invalid privacy option");
    }

    await user.save();
    res.sendStatus(200);
  } catch (error) {
    console.error("Error adding movie to playlist:", error);
    res.status(500).send("Internal server error");
  }
});




app.listen(3000, () => {
  console.log("Server connected on port 3000");
});

