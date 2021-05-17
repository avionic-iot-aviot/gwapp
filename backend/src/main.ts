import * as express from 'express';
const bodyParser = require('body-parser');
const app = express();
app.use(bodyParser.json());
const util = require('util');
const exec = util.promisify(require('child_process').exec);
const cfg = require('config');

const pubApiPingRoute = require('./routes/public/pingRoutes');
app.use('/ping', pubApiPingRoute);


require('./resolv');



app.listen(3800, () => {
  console.log('Application listening on port 3800!');
});

const seconds_to_wait = 2;
const ping_dhcp_server_ip_n2n = `ping ${cfg.gateway.dhcp_server_ip_on_n2n} -n -q -i ${seconds_to_wait} &`;
exec(ping_dhcp_server_ip_n2n);

module.exports = app;
