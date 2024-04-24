const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const {StatusCode} = require('status-code-enum');
// require('dotenv').config({path: __dirname + '/.env'});

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const port = process.env.PORT || 3001;
const gServer = app.listen(port, () =>
{
    console.log(`server running on ${port}`);
});


// GET Endpoints

/**
 * Endpoint: /getlist
 * Returns as the response: The repeat caller data from the database.
 */
app.get('/getlist', async (req, res) =>
{
    return res.status(StatusCode.SuccessOK).send({});
});


// POST Endpoints

/**
 * Endpoint: /updatelist
 * Update all the repeat caller data in the database.
 */
app.post('/updatelist', async (req, res) =>
{
    return res.status(StatusCode.SuccessOK).send({});
});

/**
 * Endpoint: /updatesinglemember
 * Update a single member of the repeat caller data in the database.
 */
app.post('/updatesinglemember', async (req, res) =>
{
    return res.status(StatusCode.SuccessOK).send({});   
});

module.exports = app;
module.exports.server = gServer;
