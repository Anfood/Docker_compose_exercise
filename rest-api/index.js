const express= require('express');
const app = express();
const PORT = 8197;

app.get('/api/state', (req, res) => {
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.write('Service is running!');
    res.end();
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});