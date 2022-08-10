import { RequestHandler } from 'express';
import path from 'path';
import fs from 'fs';
import ReactDOMServer from 'react-dom/server';
import { StaticRouter } from "react-router-dom/server";
import { SSRProvider } from "@restart/ui/ssr";
import { HelmetProvider, FilledContext } from 'react-helmet-async';

import App from '../client/App';
import { SSRRouting, SSRRoutingProvider } from '../client/SSRRouting';

const ssrHandler: RequestHandler = (req, res) => {
  try {
    let indexHTML = fs.readFileSync(path.resolve('build/index.html'), {
      encoding: 'utf8',
    });

    const routingContext: SSRRouting = {};
    const helmetContext = {};

    let appHTML = ReactDOMServer.renderToString(
      <SSRProvider>
        <SSRRoutingProvider value={routingContext}>
          <HelmetProvider context={helmetContext} >
            <StaticRouter location={req.url}>
              <App />
            </StaticRouter>
          </HelmetProvider>
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

    if ('helmet' in helmetContext) {
      const helmet = (helmetContext as FilledContext).helmet;
      helmet.title.toString()
      indexHTML = indexHTML.replace(
        '<title>Twitch WildRP Only</title>',
        `${helmet.title.toString()}
        ${helmet.meta.toString()}
        ${helmet.link.toString()}`
      );
    }

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

export default ssrHandler;
