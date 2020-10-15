const config = require('config');
const express = require('express');
const app = express();
//Database
const db = require('./config/database');

const port = process.env.NODE_ENV === 'production' ? process.env.PORT : config.get('port');

app.use(express.json({extended: true}));
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/companies', require('./routes/company.routes'));
app.use('/api/analytics', require('./routes/analytics/analytics.routes'));
app.use('/api/work-shifts', require('./routes/workShifts.routes'));

db.sync({alter: true});

app.listen(port, () => {
    console.log('server started on port 5000!');
});