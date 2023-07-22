// index.js

const express = require('express');
const axios = require('axios');

const app = express();
const PORT = 8008;

app.get('/numbers', async (req, res) => {
  try {
    // Extract the URLs from the query parameters
    const { url } = req.query;

    if (!Array.isArray(url)) {
      // If only one URL is provided, convert it to an array for easier processing
      url = ["http://20.244.56.144/numbers/primes","http://20.244.56.144/numbers/fibo","http://20.244.56.144/numbers/odd","http://20.244.56.144/numbers/rand"];
    }

    // Create an array to store the retrieved numbers
    const numbers = [];

    // Make GET requests for each URL and collect the numbers
    const requests = url.map(async (url) => {
      try {
        const response = await axios.get(url);

        // Extract the numbers from the response
        const { numbers: urlNumbers } = response.data;

        // Push the numbers to the main numbers array
        numbers.push(...urlNumbers);
      } catch (error) {
        console.error(`Error retrieving numbers from ${url}: ${error.message}`);
      }
    });

    // Wait for all requests to complete
    await Promise.all(requests);

    // Merge and sort the numbers array
    const mergedNumbers = Array.from(new Set(numbers)).sort((a, b) => a - b);

    // Return the merged numbers as a JSON response
    res.json({ numbers: mergedNumbers });
  } catch (error) {
    console.error(`Error processing request: ${error.message}`);
    res.status(500).json({ error: 'Server error' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
