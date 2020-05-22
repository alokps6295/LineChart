const express = require('express');
const rangeRoute = require('./range.route');


const router = express.Router();

router.use('/range', rangeRoute);

module.exports = router;