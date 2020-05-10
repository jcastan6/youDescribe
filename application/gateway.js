const express = require('express');
const httpProxy = require('http-proxy');
const app = express();
const port = process.env.PORT || 80;

const apiProxy = httpProxy.createProxyServer();

apiProxy.on('error', (err, req, res) => {
  console.log(err)
  res.status(500).send('Proxy Error');
});

app.all("*", (req, res) => {
  // service1
  console.log(req.path)
  console.log("I'm here in gateway")
  apiProxy.web(req, res, {
    target: 'http://localhost:3000',
  });
});

app.all("*", (req, res) => {
  // front end server / react
  apiProxy.web(req, res, {
    target: 'http://localhost:4000',
  });
});

app.listen(port, () => console.log(`Gateway is on port ${port}!`))