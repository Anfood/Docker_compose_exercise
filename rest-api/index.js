const express= require('express');
const app = express();
const PORT = 8000;

app.get('/state', async (req, res) => {
    try {
        // Fetch the state from the node-frontend
        const response = await fetch("http://service1:8199/state");
        const state = await response.text();
        // The response from the fetch is in JSON format
        // We need to set the response of this get request to text/plain
        res.setHeader("Content-Type", "text/plain");
        // Convert the JSON response to a string containing the status code
        res.status(response.status).send(state);
    } catch (error) {
        res.status(503).send("Service is unavailable");
        console.error(error);
    }

});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});