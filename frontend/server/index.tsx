import express from 'express';
import path from 'path';
import fs from 'fs';

const app = express();

app.use(express.static(path.resolve('build')));

app.use('*', (_req, res) => {
  try {
    let indexHTML = fs.readFileSync(path.resolve('build/index.html'), {
      encoding: 'utf8',
    });

    return res
      .status(200)
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
});

app.listen( '9000', () => {
  console.log( 'Express server started at http://localhost:9000' );
});
