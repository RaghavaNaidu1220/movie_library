const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const session = require("express-session");

const routes = require("./routes");

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

app.use(routes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
