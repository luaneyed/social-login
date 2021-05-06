const path = require('path');
const express = require('express');
const app = express();
const portNumber = 8080;
const sourceDir = 'dist';

app.use(express.static(sourceDir));
app.get('*', (req, res) => {  //  For BrowserRouter
  res.sendFile(path.resolve(__dirname, 'dist', 'index.html')); 
});

app.listen(portNumber, () => {
  console.log(`Express web server started: http://localhost:${portNumber}`);
  console.log(`Serving content from /${sourceDir}/`);
});
