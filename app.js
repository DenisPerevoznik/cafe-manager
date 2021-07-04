const config = require('config');
const express = require('express');
const app = express();
const cors = require('cors');
//Database
const db = require('./config/database');

const port = process.env.NODE_ENV === 'production' ? process.env.PORT : config.get('port');

// CORS Settings

const whitelist = ['http://localhost:4200', 'http://localhost:8100']
const corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      // callback(new Error('Not allowed by CORS'))
    }
  }
}

app.use(cors({origin: '*'}));
////////

app.use(express.json({ extended: true }));
// app.use(express.static(process.cwd()+"/client/dist/client-a/"));
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/companies', require('./routes/company.routes'));
app.use('/api/analytics', require('./routes/analytics/analytics.routes'));
app.use('/api/work-shifts', require('./routes/workShifts.routes'));
app.use('/api/accounts', require('./routes/accounts.routes'));
app.use('/api/expenses-outside', require('./routes/expensesOutside.routes'));
app.use('/api/categories', require('./routes/categories.routes'));
app.use('/api/products', require('./routes/products.routes'));
app.use('/api/ingredients', require('./routes/ingredients.routes'));
app.use('/api/employees', require('./routes/employees.routes'));
app.use('/api/deliveries', require('./routes/deliveries.routes'));
app.use('/api/suppliers', require('./routes/suppliers.routes'));

// mobile app routes
app.use('/api/app', require('./routes/mobile.routes'));

app.get('*', (req, res) => {
  res.status(301).redirect('/');
});

// app.get('/', (req,res) => {
//   res.sendFile(process.cwd()+"/client/dist/client-a/index.html")
// });

db.sync({ alter: false, force: false });

app.listen(port, () => {
  console.log(`Server started on port ${port}!`);
});
