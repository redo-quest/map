const https = require('https');
const fs = require('fs');
const express = require('express');
const app = express();
const fetch = require('node-fetch');

const privateKey = fs.readFileSync('/etc/letsencrypt/live/proxy.cloudnest.wtf/privkey.pem', 'utf8');
const certificate = fs.readFileSync('/etc/letsencrypt/live/proxy.cloudnest.wtf/cert.pem', 'utf8');
const ca = fs.readFileSync('/etc/letsencrypt/live/proxy.cloudnest.wtf/chain.pem', 'utf8');

const credentials = {
    key: privateKey,
    cert: certificate,
    ca: ca
};


app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*'); 
    res.header('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS,POST,PUT'); 
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization'); 
    next();
});

app.get('/proxy', async (req, res) => {
    try {
        const url = req.query.url;

        const response = await fetch(url);
        
        res.send(await response.text());
    } catch (error) {
        console.error('Error proxying request:', error);
        res.status(500).send('Error proxying request');
    }
});


const httpsServer = https.createServer(credentials, app);

httpsServer.listen(8443, () => {
    console.log('HTTPS server running on port 443');
});
