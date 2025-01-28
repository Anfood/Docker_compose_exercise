const app = require('express')();
const PORT = 8197;

app.get('/api/state', (req, res) => {
    res.status(200).send('Service is running');
  });

app.listen(
    PORT,
    () => {console.log(`Server is running on port ${PORT}`)}
);