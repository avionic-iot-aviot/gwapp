const config = require('config');
import * as express from 'express';
const _ = require('lodash');
const router = express.Router();
import * as HttpStatus from 'http-status-codes';
import PingService from '../../services/pingService';
const pingService = new PingService();

router.post('/', async (req, res) => {
    const body = req.body;
    //API che sta in ascolto per ricevere i dati dal DHCP server ed elaborali
    try {

        const params = body && body.params ? body.params : null;
        console.log("PARAMS", params);
        if (params && params.ips) {
            await pingService.execute(params.ips);
        }
        res.status(HttpStatus.OK).send();
    } catch (error) {
        res.status(HttpStatus.OK).send(error);
    }
});

module.exports = router;