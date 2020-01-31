const config = require('config');
import * as express from 'express';
const _ = require('lodash');
const router = express.Router();
import * as HttpStatus from 'http-status-codes';
import PingService from '../../services/pingService';
const pingService = new PingService();

router.post('/', async (req, res) => {
    const params = req.body.params;
    try {
        console.log("PARAMS", params);
        res.status(HttpStatus.OK).send();
    } catch (error) {
        res.status(HttpStatus.OK).send(error);
    }
});

module.exports = router;