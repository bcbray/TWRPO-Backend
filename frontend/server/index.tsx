import express, { RequestHandler } from 'express';
import path from 'path';
import fs from 'fs';
import ReactDOMServer from 'react-dom/server';
import { StaticRouter } from "react-router-dom/server";
import { SSRProvider } from "@restart/ui/ssr";

import App from '../client/App';
import { SSRRouting, SSRRoutingProvider } from '../client/SSRRouting';

const app = express();

const ssrHandler: RequestHandler = (req, res) => {
  try {
    let indexHTML = fs.readFileSync(path.resolve('build/index.html'), {
      encoding: 'utf8',
    });

    const routingContext: SSRRouting = {};

    let appHTML = ReactDOMServer.renderToString(
      <SSRProvider>
        <SSRRoutingProvider value={routingContext}>
          <StaticRouter location={req.url}>
            <App />
          </StaticRouter>
        </SSRRoutingProvider>
      </SSRProvider>
    );

    if (routingContext.redirect) {
      return res.redirect(routingContext.redirect);
    }

    indexHTML = indexHTML.replace(
      '<div id="root"></div>',
      `<div id="root">${appHTML}</div>`
    );

    return res
      .status(routingContext.notFound ? 404 : 200)
      .contentType('text/html')
      .send(indexHTML);
  } catch (err) {
    console.error(err);

    // Send a real basic 500 screen
    return res
      .status(500)
      .contentType('text/html')
      .send(`
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>Error</title>
</head>
<body>
<h1>Internal server error</h1>
<p>Something went wrong</p>
</body>
</html>`);
  }
};

// Index is SSR
app.get('/', ssrHandler);

// Then static files
app.use(express.static(path.resolve('build')));

// Then back to SSR for catch-all to handle routing
app.get('*', ssrHandler);

app.listen( '9000', () => {
  console.log( 'Express server started at http://localhost:9000' );
});
