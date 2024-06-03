const express = require("express");
const bcrypt = require("bcrypt");
const fetch = require("node-fetch");
const {User} = require("./userModel");
const router = express.Router();

router.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/register.html");
});

router.post("/register", async (req, res) => {
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
      if (error.code === 11000) { // Duplicate email error
        console.log("Email already registered");
        return res.redirect("/register.html?error=email");
      }
      console.error("Error saving user:", error.message);
      res.status(500).send("Internal server error");
    }
  });
  

router.post("/logout", (req, res) => {
  req.session.destroy(err => {
    if (err) {
      console.error("Error destroying session:", err);
      return res.status(500).send("Internal server error");
    }
    res.redirect("/"); // Redirect to login page after logout
  });
});

router.post("/login", async (req, res) => {
    const { email, password } = req.body;
  
    try {
      const user = await User.findOne({ email: email });
  
      if (!user) {
        return res.redirect("/login.html?error=1");
      }
  
      const isMatch = await bcrypt.compare(password, user.password);
  
      if (!isMatch) {
        return res.redirect("/login.html?error=1");
      }
  
      req.session.email = email; // Save user email in session
      res.redirect("/home.html");
    } catch (error) {
      console.error("Error during authentication:", error.message);
      res.status(500).send("Internal server error");
    }
  });
  
  router.post("/privacyForm", async (req, res) => {
    const { movieId, privacy } = req.body;
    const email = req.session.email;

    console.log("Email:", email);
    console.log("Movie ID:", movieId);
    console.log("Privacy:", privacy);

    try {
        if (!email) {
            console.log("Email not found in session");
            return res.status(400).send("Email not found in session");
        }

        const user = await User.findOne({ email: email.trim() });

        if (!user) {
            console.log("User not found");
            return res.status(404).send("User not found");
        }

        let playlist = '';
        if (privacy === "public") {
            if (!user.publicPlaylist.includes(movieId)) {
                user.publicPlaylist.push(movieId);
                await user.save();
                playlist = 'public';
            }
        } else if (privacy === "private") {
            if (!user.privatePlaylist.includes(movieId)) {
                user.privatePlaylist.push(movieId);
                await user.save();
                playlist = 'private';
            }
        } else {
            console.log("Invalid privacy option");
            return res.status(400).send("Invalid privacy option");
        }

        console.log("Movie added successfully");
        res.redirect(`/home.html?status=success&playlist=${playlist}`);
    } catch (error) {
        console.error("Error adding movie to playlist:", error);
        res.status(500).send("Internal server error");
    }
});

  

router.post("/playlist", async (req, res) => {
    const userEmail = req.session.email;

    try {
        const user = await User.findOne({ email: userEmail });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const publicTitles = user.publicPlaylist;
        const privateTitles = user.privatePlaylist;

        const fetchMovieDetails = async (title) => {
            const response = await fetch(`https://www.omdbapi.com/?t=${encodeURIComponent(title)}&apikey=a5163edc`);
            const data = await response.json();
            if (data.Response === "True") {
                return data;
            } else {
                console.error(`Error fetching details for movie: ${title}`);
                return null;
            }
        };

        const publicMovies = await Promise.all(publicTitles.map(fetchMovieDetails));
        const privateMovies = await Promise.all(privateTitles.map(fetchMovieDetails));

        res.json({
            publicPlaylist: publicMovies.filter(movie => movie !== null),
            privatePlaylist: privateMovies.filter(movie => movie !== null)
        });
    } catch (error) {
        console.error("Error retrieving playlist:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

module.exports = router;
