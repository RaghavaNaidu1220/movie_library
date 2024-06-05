# 🎥 Movie Library Website 🎥

Welcome to the **Movie Library Website**! This is your go-to web application for searching and managing movie playlists. Whether you're a film enthusiast looking to discover new movies or simply want to organize your favorite films, our platform has got you covered.

## 📖 Table of Contents
1. [Features](#features)
2. [Installation](#installation)
3. [Usage](#usage)
4. [Endpoints](#endpoints)
5. [Technologies Used](#technologies-used)
6. [License](#license)

## ⭐ Features
- **User Authentication**: Securely register and login to access and manage your playlists.
- **Movie Search**: Easily search for movies using the OMDB API.
- **Playlist Management**: Add movies to your public or private playlists with a single click.
- **View Playlists**: Seamlessly switch between your public and private playlists to view your collection.

## 🛠️ Installation
To run this project locally, follow these steps:

1. **Clone the Repository**:
    ```bash
    git clone https://github.com/your-username/Movie-Library.git
    ```

2. **Navigate to the Project Directory**:
    ```bash
    cd bot
    ```

3. **Install Dependencies**:
    ```bash
    npm install
    ```

4. **Start the Server**:
    ```bash
    npm start
    ```

## 🚀 Usage
1. **Register**: Create an account by visiting the registration page (`/register.html`).
2. **Login**: Access your account using your credentials.
3. **Search Movies**: Use the search bar on the home page (`/home.html`) to find movies.
4. **Add to Playlists**: Click on a movie to view its details and add it to your playlists.
5. **View Playlists**: Navigate to your public and private playlists by clicking the corresponding buttons on the home page.

## 🔗 Endpoints
- **POST /register**: Register a new user.
- **POST /login**: Login an existing user.
- **POST /logout**: Logout the current user.
- **POST /privacyForm**: Add a movie to the user's playlist.
- **POST /playlist**: Retrieve the user's public and private playlists.

## 💻 Technologies Used
- **Frontend**: HTML, CSS, JavaScript
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **API**: OMDB API for movie data

## 📜 License
This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

Feel free to explore, discover, and organize your favorite movies with ease. Happy movie watching! 🎬🍿

---

