const express = require('express');
const cors = require('cors');
const router = require('./router');

const app = express();

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const port = 3000;

app.use('/reviews', router);

app.get('/', (req, res) => {
  res.send('Hello world!');
});

app.listen(port, () => {
  console.log(`server is listening to http://localhost:${port}`);
});

module.exports = app;
