const express = require('express');
const axios = require('axios');

const app = express();
const port = 3000;

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*'); 
    res.header('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS,POST,PUT'); 
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization'); 
    next();
});

app.get('/proxy', async (req, res) => {
    try {
        const response = await axios.get(req.query.url, { responseType: 'arraybuffer' });
        res.setHeader('Content-Type', response.headers['content-type']);
        res.send(response.data);
    } catch (error) {
        res.status(500).send('Error fetching resource');
    }
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
