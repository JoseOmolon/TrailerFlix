require('dotenv').config();
const express = require('express');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 5000;

app.get('/api/trending', async (req, res) => {
  try {
    const response = await axios.get(`https://api.themoviedb.org/3/trending/movie/week?api_key=${process.env.MOVIE_API_KEY}`);
    res.json(response.data);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error fetching trending movies');
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
