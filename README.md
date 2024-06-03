Movie Library Website
This is a web application for searching and managing movie playlists. Users can register, search for movies, add them to their playlists, and view their public and private playlists.

Table of Contents
Features
Installation
Usage
Endpoints
Technologies Used
License
Features
User authentication: Users can register and login to access their playlists.
Movie search: Users can search for movies using the OMDB API.
Playlist management: Users can add movies to their public or private playlists.
View playlists: Users can view their public and private playlists separately.
Installation
To run this project locally, follow these steps:

Clone the repository:

bash
 
git clone https://github.com/your-username/your-project.git
Navigate to the project directory:

bash
 
cd your-project
Install dependencies:

bash
 
npm install
Start the server:

bash
 
npm start
Usage
Register an account by visiting the registration page (/register.html).
Login with your credentials.
Search for movies using the search bar on the home page (/home.html).
Click on a movie to view its details and add it to your playlists.
View your public and private playlists by clicking the corresponding buttons on the home page.
Endpoints
POST /register: Register a new user.
POST /login: Login an existing user.
POST /logout: Logout the current user.
POST /privacyForm: Add a movie to the user's playlist.
POST /playlist: Retrieve the user's public and private playlists.
Technologies Used
Node.js
Express.js
MongoDB
Mongoose
bcrypt
Fetch API
HTML
CSS
JavaScript
License
This project is licensed under the ISC License.
