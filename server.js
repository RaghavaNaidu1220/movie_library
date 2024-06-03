const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const session = require("express-session");
const fetch = require("node-fetch");

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

// Set up session middleware
app.use(session({
  secret: '1234',
  resave: false,
  saveUninitialized: false
}));

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
const Note = mongoose.model("Note", userSchema);

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/register.html");
});

app.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    let newUser = new User({
      username: name,
      email: email,
      password: hashedPassword
    });

    await newUser.save();
    res.redirect("/login.html");
  } catch (error) {
   
      // Duplicate email error
      return res.redirect("/register.html");
    
    
  }
});
app.post("/logout", (req, res) => {
  req.session.destroy(err => {
      if (err) {
          console.error("Error destroying session:", err);
          return res.status(500).send("Internal server error");
      }
      res.redirect("/login.html"); // Redirect to login page after logout
  });
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await Note.findOne({ email: email });

    if (!user) {
      
      return res.redirect("/login.html");
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
     

      
    return res.redirect("/login.html");
    
    }

    req.session.email = email; // Save user email in session
    res.redirect("/home.html");
  } catch (error) {
    console.error("Error during authentication:", error.message);
    res.status(500).send("Internal server error");
  }
});

app.post("/privacyForm", async (req, res) => {
  const { movieId, privacy } = req.body;
  const email = req.session.email; // Get the email from session

  try {
    if (!email) {
      return res.status(400).send("Email not found in session");
    }

    const user = await Note.findOne({ email: email.trim() });

    if (!user) {
      return res.status(404).send("User not found");
    }

    if (privacy === "public") {
      user.publicPlaylist.push(movieId);
      await user.save();
    } else if (privacy === "private") {
      user.privatePlaylist.push(movieId);
    } else {
      return res.status(400).send("Invalid privacy option");
    }


    await user.save();
    res.redirect("/home.html");

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
  const userEmail = req.session.email;

  try {
    const user = await Note.findOne({ email: userEmail });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const publicTitles = user.publicPlaylist;
    const privateTitles = user.privatePlaylist;

    // Fetch movie details from OMDB API
    const fetchMovieDetails = async (title) => {
      const response = await fetch(`https://www.omdbapi.com/?s=${title}&apikey=a5163edc`);
      const data = await response.json();
      return data;
    };

    const publicMovies = await Promise.all(publicTitles.map(fetchMovieDetails));
    const privateMovies = await Promise.all(privateTitles.map(fetchMovieDetails));

    // Generate the HTML content
    const htmlContent = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Playlists</title>
        <style>
          .grid-container {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
            gap: 10px;
          }
          .grid-item {
            padding: 10px;
            border: 1px solid #ccc;
            text-align: center;
            background-color: #f9f9f9;
          }
          .movie-poster {
            width: 100%;
            height: auto;
          }
        </style>
      </head>
      <body>
        <h2>Public Playlist</h2>
        <div class="grid-container">
          ${publicMovies.map(movie => `
            <div class="grid-item">
              <img src="${movie.Poster}" alt="${movie.Title}" class="movie-poster" />
              <h3>${movie.Title}</h3>
              <p>${movie.Year}</p>
              <p>${movie.Genre}</p>
            </div>
          `).join('')}
        </div>
        <h2>Private Playlist</h2>
        <div class="grid-container">
          ${privateMovies.map(movie => `
            <div class="grid-item">
              <img src="${movie.Poster}" alt="${movie.Title}" class="movie-poster" />
              <h3>${movie.Title}</h3>
              <p>${movie.Year}</p>
              <p>${movie.Genre}</p>
            </div>
          `).join('')}
        </div>
      </body>
      </html>
    `;

    // Send the HTML content
    res.send(htmlContent);
  } catch (error) {
    console.error("Error retrieving playlist:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
