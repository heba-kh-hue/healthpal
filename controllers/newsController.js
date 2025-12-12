// controllers/newsController.js
const axios = require('axios');

// @desc    Fetch global health news
// @route   GET /api/news/health
// @access  Private (Any authenticated user)
exports.getHealthNews = async (req, res) => {
    try {
        const apiKey = process.env.NEWS_API_KEY;
        if (!apiKey) {
            // Don't crash the server if the key is missing, just inform the developer.
            return res.status(500).json({ msg: 'News API key is not configured.' });
        }

        // Construct the URL for the NewsAPI
        // We'll search for "health" news, focusing on English language sources
        const newsApiUrl = `https://newsapi.org/v2/top-headlines?category=health&language=en&apiKey=${apiKey}`;

        console.log("Fetching news from:", newsApiUrl);

        // Use axios to make a GET request to the external API
        const response = await axios.get(newsApiUrl);

        // Send the 'articles' part of the response back to our client
        res.json(response.data.articles);

    } catch (error) {
        console.error("Error fetching health news:", error.response ? error.response.data : error.message);
        res.status(500).json({ msg: 'Failed to fetch health news.' });
    }
};