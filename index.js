const http = require('http');
const https = require('https');
const stringDecoder = require('string_decoder').StringDecoder;
const fs = require('fs');

const config = require('./config');
const controller = require('./controllers');

// Instantiating http server
const httpServer = http.createServer((req, res) => requestHandler(req, res));

// Instantiating https server
const httpsServerOptions = {
  key : fs.readFileSync('./https/key.pem'),
  cert: fs.readFileSync('./https/cert.pem'),
};

const httpsServer = https.createServer(httpsServerOptions, (req, res) => requestHandler(req, res));

httpServer.listen(config.httpPort, () => {
  console.log(`${config.envName} on ${config.httpPort}`);
});

httpsServer.listen(config.httpsPort, () => {
  console.log(`${config.envName} on ${config.httpsPort}`);
});

// Logic of handling requests
const requestHandler = (req, res) => {
  // Base constants
  const baseURL = 'http://' + req.headers.host + '/';
  const parsedUrl = new URL(req.url, baseURL);
  const decoder = new stringDecoder('utf-8');
  let buffer = '';

  // Parsed request data
  const method = req.method.toUpperCase();
  const path = parsedUrl.pathname.replace(/^\/+|\/+$/g, '');
  const queryStringObject = { ...parsedUrl.query };
  const headers = req.headers;

  // On receiving data
  req.on('data', (data) => {
    buffer += decoder.write(data)
  });

  // On finished receiving data
  req.on('end', () => {
    buffer += decoder.end();
    const data = {
      path,
      queryStringObject,
      method,
      headers,
    };

    // Check if a body exists and try to parse it
    if (buffer) {
      try {
        const body = JSON.parse(buffer);
        data.body = body;
      } catch (e) {
        // Change this to a error handler function
        console.log(e);
        res.writeHead(422);
        return res.end(JSON.stringify({
          ok: false,
          message: 'Content is not a valid JSON!',
          payload: {},
        }));
      }
    }

    // Select the controller based on the path
    const usedController = typeof (controller[path]) !== 'undefined'
      ? controller[path]
      : controller.notFound;

    // Calls the controller passing the data object created and a function to return the response
    usedController(data, (status, payload) => {
      // These verifications should be already done on the controller/service
      status = typeof (status) == 'number' ? status : 200;
      payload = typeof (payload) == 'object' ? payload : {};
      const jsonResp = JSON.stringify(payload);

      console.log(`RESPONSE: ${jsonResp}`);

      res.setHeader('Content-Type', 'application/json');
      res.writeHead(status);
      return res.end(jsonResp + '\n');
    });
  });
};
