// api/fetchMovies.js
module.exports = async (req, res) => {
    const API_KEY = process.env.API_KEY; // Access the environment variable
    
    try {
        const response = await fetch(`https://api.themoviedb.org/3/trending/movie/week?api_key=${API_KEY}`);
        const data = await response.json();
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching movies' });
    }
};
