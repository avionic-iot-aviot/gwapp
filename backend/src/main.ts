import * as express from 'express';
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());


const pubApiPingRoute = require('./routes/public/pingRoutes');

app.use('/ping', pubApiPingRoute);

app.listen(3800, () => {
  console.log('Application listening on port 3800!');
});


// import test from './services/pingService';
// const t = new test();
// t.pingIP();
// t.test();
module.exports = app;
