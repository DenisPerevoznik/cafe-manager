const config = require('config');
const express = require('express');
const app = express();

//Database
const db = require('./config/database');

const port = process.env.NODE_ENV === 'production' ? process.env.PORT : config.get('port');

app.use(express.json({extended: true}));
app.use('/api/auth', require('./routes/auth.routes'));

db.sync({alter: true})
.then(() => {
    app.listen(5000, () => {
        console.log('server started on port 5000!');
    });
});
