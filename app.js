const config = require('config');
const express = require('express');
const app = express();

const port = process.env.NODE_ENV === 'production' ? process.env.PORT : config.get('port');

// app.get('/', (req, res) => {
//     res.send('HIdedfe');
// });

app.listen(5000, () => {
    console.log('server started on port 5000!');
});