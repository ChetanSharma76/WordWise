const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static('public'));

// Function to count word frequencies
function countWordFrequencies(text, n = 20) {

    // Clean and normalize the text
    const wordCounts = {};
    const words = text
        .toLowerCase()                     // Convert to lowercase
        .replace(/[^a-z\s]/g, '')          // Remove punctuation
        .split(/\s+/)                      // Split by whitespace


    // Count word frequencies
    words.forEach(word => {
        wordCounts[word] = (wordCounts[word] || 0) + 1;
    });

    // Sort and return the top `n` words
    return Object.entries(wordCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, n)
        .map(([word, count]) => ({ word, count }));
}

// API route to analyze word frequencies on a webpage
app.post('/api/frequency', async (req, res) => {
    const { url, n } = req.body;
    if (!url || isNaN(n) || n < 1) {
        return res.status(400).json({ error: 'Valid URL and a positive number for n are required' });
    }

    try {
        const response = await axios.get(url);
        const $ = cheerio.load(response.data);

        $('script, style, noscript, iframe').remove();
        const text = $('body').text();
        
        const wordFrequencies = countWordFrequencies(text, n);
        
        if (wordFrequencies.length === 0) {
            return res.status(200).json({ error: 'No valid words found on the page' });
        }

        res.json(wordFrequencies);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch the page content' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});


