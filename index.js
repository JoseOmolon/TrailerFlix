async function fetchTrendingMovies() {
    try {
      const response = await fetch('/api/trending');
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
        releaseDate.textContent = `Release Date: ${movie.release_date}`;
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
  
    } catch (error) {
      console.error('Error fetching the data:', error);
    }
  }
  