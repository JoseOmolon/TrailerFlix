const express = require('express');
const axios = require('axios');
const app = express();
const port = 5000;

// Make sure to load the API key from environment variables
const movieApiKey = process.env.MOVIE_API_KEY; 

app.use(express.json());

// Example endpoint to get trending movies
app.get('/api/trending-movies', async (req, res) => {
  try {
    // Fetch trending movies using the MovieDB API
    const response = await axios.get(`https://api.themoviedb.org/3/trending/movie/week?api_key=${movieApiKey}`);
    res.json(response.data);  // Send the movie data back to the frontend
  } catch (error) {
    console.error('Error fetching trending movies:', error);
    res.status(500).send('Something went wrong while fetching trending movies');
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
