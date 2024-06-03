document.addEventListener("DOMContentLoaded", () => {
    const movieSearchBox = document.getElementById("movie-search-box");
    const searchButton = document.getElementById("search-button");
    const searchList = document.getElementById("search-list");
    const resultGrid = document.getElementById("result-grid");
    const publicPlaylistButton = document.getElementById("public-playlist");
    const privatePlaylistButton = document.getElementById("private-playlist");

    // Function to fetch movies from OMDB API
    async function loadMovies(searchTerm) {
        const URL = `https://www.omdbapi.com/?s=${searchTerm}&apikey=a5163edc`;
        const res = await fetch(URL);
        const data = await res.json();
        if (data.Response === "True") {
            displayMovieList(data.Search);
        }
    }
    document.addEventListener("DOMContentLoaded", () => {
        // Existing code...
    
        // Adding event listener to privacy form submission
        const privacyForm = document.getElementById('privacyForm');
        privacyForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = new FormData(privacyForm);
            const data = Object.fromEntries(formData.entries());
            
            const response = await fetch('/privacyForm', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });
    
            if (response.ok) {
                alert('Movie added successfully!');
            } else {
                alert('Failed to add movie. Please try again.');
            }
        });
    });
    
    function findMovies() {
        const searchTerm = movieSearchBox.value.trim();
        if (searchTerm.length > 0) {
            searchList.classList.remove('hide-search-list');
            loadMovies(searchTerm);
        } else {
            searchList.classList.add('hide-search-list');
        }
    }

    function displayMovieList(movies) {
        searchList.innerHTML = "";
        for (let idx = 0; idx < movies.length; idx++) {
            let movieListItem = document.createElement('div');
            movieListItem.dataset.id = movies[idx].imdbID;
            movieListItem.classList.add('search-list-item');
            let moviePoster = movies[idx].Poster !== "N/A" ? movies[idx].Poster : "image_not_found.png";

            movieListItem.innerHTML = `
                <div class="search-item-thumbnail">
                    <img src="${moviePoster}" alt="movie">
                </div>
                <div class="search-item-info">
                    <h3>${movies[idx].Title}</h3>
                    <p>${movies[idx].Year}</p>
                </div>
            `;
            searchList.appendChild(movieListItem);
        }
        loadMovieDetails();
    }

    function loadMovieDetails() {
        const searchListMovies = searchList.querySelectorAll('.search-list-item');
        searchListMovies.forEach(movie => {
            movie.addEventListener('click', async () => {
                searchList.classList.add('hide-search-list');
                movieSearchBox.value = "";
                const result = await fetch(`https://www.omdbapi.com/?i=${movie.dataset.id}&apikey=a5163edc`);
                const movieDetails = await result.json();
                displayMovieDetails(movieDetails);
            });
        });
    }

    function displayMovieDetails(details) {
        resultGrid.innerHTML = `
            <div class="movie-poster">
                <img src="${details.Poster !== "N/A" ? details.Poster : "image_not_found.png"}" alt="movie poster">
            </div>
            <div class="movie-info">
                <h3 class="movie-title">${details.Title}</h3>
                <ul class="movie-misc-info">
                    <li class="year">Year: ${details.Year}</li>
                    <li class="rated">Ratings: ${details.Rated}</li>
                    <li class="released">Released: ${details.Released}</li>
                </ul>
                <p class="genre"><b>Genre:</b> ${details.Genre}</p>
                <p class="writer"><b>Writer:</b> ${details.Writer}</p>
                <p class="actors"><b>Actors: </b>${details.Actors}</p>
                <p class="plot"><b>Plot:</b> ${details.Plot}</p>
                <p class="language"><b>Language:</b> ${details.Language}</p>
                <p class="awards"><b><i class="fas fa-award"></i></b> ${details.Awards}</p>
                <form id="privacyForm" action="/privacyForm" method="POST">
    <select name="privacy" id="privacy-select" style="width: 200px; padding: 10px; margin-top: 10px;">
        <option value="Add-to-list">Add to list</option>
        <option value="public">Public</option>
        <option value="private">Private</option>
    </select>
    <input type="hidden" name="movieId" id="movieId" value="${details.Title}">
    <button type="submit" id="privacy">ADD</button>
</form>

            </div>
        `;
    }

    async function fetchPlaylist(privacyType) {
        console.log(`Fetching ${privacyType} playlist`);
        const response = await fetch(`/playlist`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        });
        const data = await response.json();
        console.log(data);
        const movies = data[privacyType];
        displayPlaylist(movies);
    }

    function displayPlaylist(playlist) {
        console.log("Displaying playlist:", playlist);
        resultGrid.innerHTML = "";
        playlist.forEach(movie => {
            resultGrid.innerHTML += `
                <div class="movie">
                    <div class="movie-poster">
                        <img src="${movie.Poster !== "N/A" ? movie.Poster : "image_not_found.png"}" alt="movie poster">
                    </div>
                    <div class="movie-info">
                        <h3 class="movie-title">${movie.Title}</h3>
                        <ul class="movie-misc-info">
                            <li class="year">Year: ${movie.Year}</li>
                            <li class="rated">Ratings: ${movie.Rated}</li>
                            <li class="released">Released: ${movie.Released}</li>
                        </ul>
                        <p class="genre"><b>Genre:</b> ${movie.Genre}</p>
                        <p class="writer"><b>Writer:</b> ${movie.Writer}</p>
                        <p class="actors"><b>Actors: </b>${movie.Actors}</p>
                        <p class="plot"><b>Plot:</b> ${movie.Plot}</p>
                        <p class="language"><b>Language:</b> ${movie.Language}</p>
                        <p class="awards"><b><i class="fas fa-award"></i></b> ${movie.Awards}</p>
                    </div>
                </div>
            `;
        });
    }

    publicPlaylistButton.addEventListener("click", () => fetchPlaylist("publicPlaylist"));
    privatePlaylistButton.addEventListener("click", () => fetchPlaylist("privatePlaylist"));
    searchButton.addEventListener("click", findMovies);
});
