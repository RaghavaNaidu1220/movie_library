const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");

// const express = require("express");
const session = require("express-session"); // Add this line

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));

// Set up session middleware
app.use(session({
  secret: '1234',
  resave: false,
  saveUninitialized: false
}));
app.use(express.urlencoded({ extended: true }));


// Serve static files from the public directory
app.use(express.static("public"));

mongoose.connect("mongodb+srv://admin:1234@cluster0.dsdkxea.mongodb.net/testing?retryWrites=true&w=majority&appName=Cluster0", {
  
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
    
    if (!isMatch) {
      console.log("Password doesn't match");
      // return res.status(400).send("Invalid email or password");
      return res.redirect("/login.html");
    }
    
    // If password matches, redirect to home
    return res.redirect("/home.html");
   
  } catch (error) {
    console.error("Error during authentication:", error.message);
    return res.status(500).send("Internal server error");
  }
});



  
// app.post("/playlist",async (req,res)=>{
//   const 
// })


app.post("/privacyForm", async (req, res) => {
  const {  movieId, privacy } = req.body;
  const email = req.session.email;
  try {
    // Check if the email is valid
    if (!email) {
      return res.status(400).send(email);
    }

    // Find the user by email address
    const user = await Note.findOne({ email: email.trim() });

    if (!user) {
      console.log("User not found for email:", email);
      return res.status(404).send("User not foupppnd");
    }

    // Update the user's playlist based on privacy
    if (privacy === "public") {
      user.publicPlaylist.push(movieId);
      await user.save();
    } else if (privacy === "private") {
      user.privatePlaylist.push(movieId);
    } else {
      return res.status(400).send("Invalid privacy option");
    }

    // Save the updated user document
    
    return res.redirect("/home.html");
    console.log("User playlist updated successfully:", user);
    res.sendStatus(200);
    
  } catch (error) {
    console.error("Error adding movie to playlist:", error);
    res.status(500).send("Internal server error");
  }
});
app.post("/playlist", async (req, res) => {
  // Assuming you have authenticated the user and obtained their email
  const userEmail = req.session.email; // Assuming you have a form input with name="email"

  try {
      // Find the user in the database
      const user = await User.findOne({ email: userEmail });

      if (!user) {
          return res.status(404).json({ message: "User not found" });
      }

      // Extract movie titles from public and private playlists
      const publicTitles = user.publicPlaylist;
      const privateTitles = user.privatePlaylist;
      console.log(privateTitles);
      // Render the titles in a grid format
      res.send(`
          <h2>Public Playlist</h2>
          <div class="grid-container">
              ${publicTitles.map(title => `<div class="grid-item">${title}</div>`).join("")}
          </div>
          <h2>Private Playlist</h2>
          <div class="grid-container">
              ${privateTitles.map(title => `<div class="grid-item">${title}</div>`).join("")}
          </div>
      `);
  } catch (error) {
      console.error("Error retrieving playlist:", error);
      res.status(500).json({ message: "Internal server error" });
  }
});


// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});


// app.listen(3000, () => {
//   console.log("Server connected on port 3000");
// });



