const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const {StatusCode} = require('status-code-enum');
const database = require('./database.js');
const util = require('./util.js');
require('dotenv').config({path: __dirname + '/.env'});

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

const port = process.env.PORT || 3001;
const gServer = app.listen(port, () =>
{
    console.log(`server running on ${port}`);
});


// GET Endpoints

/**
 * Endpoint: /getcallers
 * Returns as the response: The repeat caller data from the database.
 */
app.get('/getcallers', async (_, res) =>
{
    var statusCode, retObj;
    const connectionId = await database.ConnectToDatabaseNewId();

    try
    {
        console.log("----------------------------------------------");
        console.log("Getting all active callers from the database.");
        statusCode = StatusCode.SuccessOK;
        let activeCallerList = await database.LoadActiveCallersFromDatabase();
        retObj = {record: {activeCallers: activeCallerList}};
    }
    catch (error)
    {
        console.log("An error occurred loading the active callers from the database:");
        console.log(error);
        statusCode = StatusCode.ServerErrorInternal;
        retObj = {record: {activeCallers: []}};
    }

    await database.CloseDatabase(connectionId);
    return res.status(statusCode).send(retObj);
});

/**
 * Endpoint: /getarchivedcallers
 * Returns as the response: The archived repeat caller data from the database.
 */
app.get('/getarchivedcallers', async (_, res) =>
{
    console.log("----------------------------------------------");
    console.log("Getting all archived callers from the database.");
    var statusCode, retObj;
    const connectionId = await database.ConnectToDatabaseNewId();

    try
    {
        statusCode = StatusCode.SuccessOK;
        let archivedCallerList = await database.LoadArchivedCallersFromDatabase();
        retObj = {record: {archivedCallers: archivedCallerList}};
    }
    catch (error)
    {
        console.log("An error occurred loading the archived callers from the database:");
        console.log(error);
        statusCode = StatusCode.ServerErrorInternal;
        retObj = {record: {archivedCallers: []}};
    }

    await database.CloseDatabase(connectionId);
    return res.status(statusCode).send(retObj);
});


// PUT Endpoints

/**
 * Endpoint: /addsinglecaller
 * Adds a new repeat caller to the database.
 */
app.put('/addsinglecaller', async (req, res) =>
{
    console.log("----------------------------------------------");
    console.log("Adding a single caller to the database.");
    var statusCode, retObj;
    const connectionId = await database.ConnectToDatabaseNewId();

    try
    {
        let newCaller = req.body;
        util.ValidateCallerJSONSchema(newCaller)
        await database.AddCallerToDatabase(newCaller);
        console.log(`Added caller with id ${newCaller.id} to the database.`);
        statusCode = StatusCode.SuccessOK;
        retObj = newCaller;
    }
    catch (error)
    {
        console.log("An error occurred adding a single caller to the database:");
        console.log(error);
        statusCode = StatusCode.ServerErrorInternal;
        retObj = {};
    }

    await database.CloseDatabase(connectionId);
    return res.status(statusCode).send(retObj);
});
/*
 * Endpoint: /updatesinglecaller
 * Updates a single repeat caller's data in the database.
 */
app.put('/updatesinglecaller', async (req, res) =>
{
    console.log("----------------------------------------------");
    console.log("Updating a single caller in the database.");
    var statusCode, retObj;
    const connectionId = await database.ConnectToDatabaseNewId();

    try
    {
        let updatedCaller = req.body;
        util.ValidateCallerJSONSchema(updatedCaller);
        await database.UpdateCallerInDatabase(updatedCaller);
        console.log(`Updated caller with id ${updatedCaller.id} in the database.`);
        statusCode = StatusCode.SuccessOK;
        retObj = updatedCaller;
    }
    catch (error)
    {
        console.log("An error occurred updating a single caller in the database:");
        console.log(error);
        statusCode = StatusCode.ServerErrorInternal;
        retObj = {};
    }

    await database.CloseDatabase(connectionId);
    return res.status(statusCode).send(retObj);
});

module.exports = app;
module.exports.server = gServer;
