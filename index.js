// Load environment variables from .env file
require('dotenv').config();

const API_KEY = process.env.API_KEY; // API key now fetched from environment variable

// Function to fetch trending movies
async function fetchTrendingMovies() {
    try {
        const response = await fetch(`https://api.themoviedb.org/3/trending/movie/week?api_key=${API_KEY}`);
        const data = await response.json();
        const movies = data.results;

        // Ensure we do not exceed the number of cards we have in the template
        const numberOfCards = Math.min(movies.length, 6);

        for (let i = 0; i < numberOfCards; i++) {
            const movie = movies[i];

            // Select the existing card using its index
            const card = document.querySelectorAll('.col-sm-4 .card')[i];

            // Update the card with movie data
            const img = card.querySelector('.card-img-top');
            const title = card.querySelector('.card-title');
            const overview = card.querySelector('.card-text');
            let rating = card.querySelector('.card-rating'); // This will be a new <p> element for rating

            // Set the movie data in the card
            img.src = `https://image.tmdb.org/t/p/w500/${movie.poster_path}`;
            title.textContent = movie.title;
            overview.textContent = movie.overview;

            // Create a new element for release date and append it to the card body
            const releaseDate = document.createElement('p');
            releaseDate.classList.add('card-release-date');
            releaseDate.textContent = `Release Date: ${movie.release_date}`; // Add release date
            card.querySelector('.card-body').appendChild(releaseDate);

            // Check if the rating <p> already exists, if not, create it
            if (!rating) {
                rating = document.createElement('p');
                rating.classList.add('card-rating');
                card.querySelector('.card-body').appendChild(rating);
            }

            rating.textContent = generateStarRating(movie.vote_average);

            // Add click event to open modal with movie details
            card.addEventListener('click', () => {
                showMovieDetails(movie);
            });
        }

        return movies; // Return the movie list after updating cards

    } catch (error) {
        console.error('Error fetching the data:', error);
        return [];
    }
}

// Function to generate star rating
function generateStarRating(voteAverage) {
    const stars = Math.round(voteAverage / 2);
    let starHtml = '';

    for (let i = 0; i < 5; i++) {
        starHtml += i < stars ? '⭐' : '☆';
    }

    return `Rating: ${starHtml} (${voteAverage} / 10)`;
}

// Function to fetch the trailer using TMDB API
async function fetchMovieTrailer(movieId) {
    const trailerUrl = `https://api.themoviedb.org/3/movie/${movieId}/videos?api_key=${API_KEY}`;
    const response = await fetch(trailerUrl);
    const data = await response.json();
    const trailers = data.results.filter(video => video.type === 'Trailer' && video.site === 'YouTube');

    if (trailers.length > 0) {
        return `https://www.youtube.com/embed/${trailers[0].key}`;
    }

    return null;
}

// Show movie details in modal
function showMovieDetails(movie) {
    document.getElementById('modalPoster').src = `https://image.tmdb.org/t/p/w500/${movie.poster_path}`;
    document.getElementById('modalTitle').textContent = movie.title;
    document.getElementById('modalOverview').textContent = movie.overview;
    document.getElementById('modalRating').innerHTML = generateStarRating(movie.vote_average);

    // Fetch the trailer and embed it into the modal
    fetchMovieTrailer(movie.id).then((trailerUrl) => {
        const trailerContainer = document.getElementById('trailerContainer');
        const trailerVideo = document.getElementById('trailerVideo');
        
        if (trailerUrl) {
            trailerContainer.style.display = 'block';
            trailerVideo.src = trailerUrl;
        } else {
            trailerContainer.style.display = 'none';
            trailerVideo.src = ''; // Clear src if no trailer
        }
    });

    const movieModal = new bootstrap.Modal(document.getElementById('movieModal'));
    movieModal.show();

    // Clear trailer when modal is hidden
    document.getElementById('movieModal').addEventListener('hidden.bs.modal', () => {
        document.getElementById('trailerVideo').src = '';
    });
}


// Fetch movies based on search query
async function fetchSearchResults(query) {
    try {
        const response = await fetch(`https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${query}`);
        const data = await response.json();
        return data.results; // Return the search results
    } catch (error) {
        console.error('Error fetching search results:', error);
        return [];
    }
}

// Display search results in dropdown
function displaySearchResults(movies) {
    const dropdown = document.getElementById('searchResults');
    dropdown.innerHTML = ''; // Clear previous results
    dropdown.style.display = 'none'; // Hide initially

    if (movies.length > 0) {
        movies.forEach(movie => {
            const item = document.createElement('div');
            item.classList.add('dropdown-item');
            item.innerHTML = `
                <div class="d-flex">
                    <img src="https://image.tmdb.org/t/p/w500/${movie.poster_path}" class="img-thumbnail" alt="${movie.title}" style="width: 50px; margin-right: 10px;">
                    <div>
                        <h6>${movie.title}</h6>
                        <p class="mb-0">${generateStarRating(movie.vote_average)}</p>
                        <p class="mb-0 card-release-date">Release Date: ${movie.release_date}</p> <!-- Add release date -->
                    </div>
                </div>
            `;
            item.addEventListener('click', () => {
                showMovieDetails(movie); // Show details in modal
                dropdown.style.display = 'none'; // Hide dropdown after selection
            });
            dropdown.appendChild(item);
        });
        dropdown.style.display = 'block'; // Show dropdown
    } else {
        dropdown.style.display = 'none'; // Hide dropdown if no results
    }
}

// Search input event listener
document.querySelector('input[placeholder="🔎 Search Movie e.g. Marvel"]').addEventListener('input', async (event) => {
    const query = event.target.value;
    const dropdown = document.getElementById('searchResults');

    if (query) {
        const searchResults = await fetchSearchResults(query);
        displaySearchResults(searchResults);
    } else {
        // Hide dropdown if the input is empty
        dropdown.style.display = 'none';
    }
});

// Function to close the dropdown
function closeDropdown(event) {
    const dropdown = document.getElementById('searchResults');
    if (!dropdown.contains(event.target)) {
        dropdown.style.display = 'none';
    }
}

document.addEventListener('click', closeDropdown);
