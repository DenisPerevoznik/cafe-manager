const config = require('config');
const express = require('express');
const app = express();
const cors = require('cors');
//Database
const db = require('./config/database');

const port =
  process.env.NODE_ENV === 'production' ? process.env.PORT : config.get('port');

app.use(cors({ origin: 'http://localhost:4200' }));
app.use(express.json({ extended: true }));
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/companies', require('./routes/company.routes'));
app.use('/api/analytics', require('./routes/analytics/analytics.routes'));
app.use('/api/work-shifts', require('./routes/workShifts.routes'));
app.use('/api/accounts', require('./routes/accounts.routes'));
app.use('/api/expenses-outside', require('./routes/expensesOutside.routes'));
app.use('/api/categories', require('./routes/categories.routes'));
app.use('/api/ingredients', require('./routes/ingredients.routes'));

db.sync({ alter: false, force: false });

app.listen(port, () => {
  console.log('server started on port 5000!');
});
