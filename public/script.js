const movieSearchBox = document.getElementById('movie-search-box');
const searchButton = document.getElementById('search-button');
const searchList = document.getElementById('search-list');
const resultGrid = document.getElementById('result-grid');
const public = document.getElementById('public_list');
const private = document.getElementById('private_list');


// Load movies from API
async function loadMovies(searchTerm){
    const URL = `https://www.omdbapi.com/?s=${searchTerm}&page=1&apikey=a5163edc`;
    console.log(`Fetching data from URL: ${URL}`);  // Debugging line
    const res = await fetch(`${URL}`);
    const data = await res.json();
    console.log(`Response data:`, data);  // Debugging line
    if(data.Response == "True") {
        displayMovieList(data.Search);
    } else {
        console.log('No movies found.');  // Debugging line
    }
}

// Find movies
function findMovies(){
    let searchTerm = (movieSearchBox.value).trim();
    console.log(`Search term: ${searchTerm}`);  // Debugging line
    if(searchTerm.length > 0){
        searchList.classList.remove('hide-search-list');
        loadMovies(searchTerm);
    } else {
        searchList.classList.add('hide-search-list');
    }
}

function findPublic(){

}
// Display movie list
function displayMovieList(movies){
    searchList.innerHTML = "";
    for(let idx = 0; idx < movies.length; idx++){
        let movieListItem = document.createElement('div');
        movieListItem.dataset.id = movies[idx].imdbID; // Setting movie id in data-id
        movieListItem.classList.add('search-list-item');
        let moviePoster = movies[idx].Poster != "N/A" ? movies[idx].Poster : "image_not_found.png";

        movieListItem.innerHTML = `
        <div class="search-item-thumbnail">
            <img src="${moviePoster}">
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

// Load movie details
function loadMovieDetails(){
    const searchListMovies = searchList.querySelectorAll('.search-list-item');
    searchListMovies.forEach(movie => {
        movie.addEventListener('click', async () => {
            searchList.classList.add('hide-search-list');
            movieSearchBox.value = "";
            const result = await fetch(`https://www.omdbapi.com/?i=${movie.dataset.id}&apikey=a5163edc`);
            const movieDetails = await result.json();
            console.log('Movie Details:', movieDetails);  // Debugging line
            displayMovieDetails(movieDetails);
        });
    });
}

// Display movie details
function displayMovieDetails(details){
    console.log('Displaying details for:', details);  // Debugging line
    resultGrid.innerHTML = `
    <div class="movie-poster">
        <img src="${(details.Poster != "N/A") ? details.Poster : "image_not_found.png"}" alt="movie poster">
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
        <body>
   <br>
   <form id="privacyForm" action="/privacyForm" method="POST"">
    <div class="custom-select">
        
    </div>
    <input type="hidden" id="movieId" name="movieId" value="${details.Title}">
    
    <div class="custom-select">
  <select id="privacy" name="privacy">
    <option value="">Select privacy</option>
    <option value="public">Public</option>
    <option value="private">Private</option>
  </select>
</div>
    <button type="submit" id="addToPublist">Add to Playlist</button>
   
</form>


    `;
}

// Search button event listener
searchButton.addEventListener('click', findMovies);
public.addEventListener('click',findPublic);
// Hide search list when clicking outside
window.addEventListener('click', (event) => {
    if(event.target.className != "form-control" && event.target.id != "search-button"){
        searchList.classList.add('hide-search-list');
    }
});


