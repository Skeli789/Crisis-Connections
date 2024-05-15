const Mutex = require('async-mutex').Mutex;
const {MongoClient, ServerApiVersion} = require("mongodb");
const randomstring = require("randomstring");
const util = require('./util.js');
require('dotenv').config({path: __dirname + '/.env'});

var gDatabaseClient = null;
var gDatabaseUsers = {};
var gDatabaseMutex = new Mutex();

const COLLECTION = process.env["CC_DATABASE"];
const DB_CONNECTION_STRING = process.env["MONGO_CONNECTION_STRING"];
const CALLERS = "Callers";


/**
 * Connects to the database and returns a boolean indicating the success of the connection.
 * @param {string} connectionId - The ID for the user of the connection.
 * @returns {Promise<boolean>} A promise that resolves indicating the success of the connection.
 */
async function ConnectToDatabase(connectionId)
{
    await gDatabaseMutex.acquire();

    if (gDatabaseClient == null)
    {
        for (let attempt = 0; attempt < 10; ++attempt) //Try up to 10 times to connect to the database
        {
            var error = {};
            gDatabaseClient = new MongoClient(DB_CONNECTION_STRING, {serverApi: ServerApiVersion.v1});

            try
            {
                await gDatabaseClient.db(COLLECTION).command({ping: 1}); //Establish and verify connection
                console.log("Connected successfully to database.");
                error.name = "";
            }
            catch (error)
            {
                //Close the client in case the error didn't close it automatically
                try {await gDatabaseClient.close()}
                catch (error2) {}
            }

            if (error.name === "")
                break;

            //Sleep for a second before trying again
            gDatabaseClient = null;
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
    }
    else
    {
        try
        {
            //Check if the connection is still valid
            await gDatabaseClient.db(COLLECTION).command({ping: 1});
        }
        catch (error)
        {
            //Close the client in case the error didn't close it automatically
            try {await gDatabaseClient.close()}
            catch (error) {}
            gDatabaseClient = null;
            return ConnectToDatabase(connectionId);
        }
    }

    gDatabaseUsers[connectionId] = true;
    let ret = gDatabaseClient != null;
    gDatabaseMutex.release();
    return ret;
}
module.exports.ConnectToDatabase = ConnectToDatabase;

/**
 * Generates a new connection ID and connects to the database.
 * @returns {string|null} The generated connection ID if the connection is successful, otherwise null.
 */
async function ConnectToDatabaseNewId()
{
    var connectionId;

    do
    {
        //Generate a random connection ID
        connectionId = randomstring.generate({length: 10, charset: "alphanumeric", capitalization: "lowercase"});
    } while (connectionId in gDatabaseUsers);

    if (await ConnectToDatabase(connectionId))
        return connectionId;
    return null;
}
module.exports.ConnectToDatabaseNewId = ConnectToDatabaseNewId;

/**
 * Closes the database connection for the specified connection ID.
 * @param {string} connectionId - The ID of the connection to close.
 * @returns {Promise<boolean>} - A promise that resolves to true if the database client was closed successfully, false otherwise.
 */
async function CloseDatabase(connectionId)
{
    await gDatabaseMutex.acquire();

    if (connectionId in gDatabaseUsers)
        delete gDatabaseUsers[connectionId];

    if (gDatabaseClient != null && Object.keys(gDatabaseUsers).length == 0)
    {
        try {await gDatabaseClient.close()}
        catch (error) {}
        gDatabaseClient = null;
        console.log("Database connection closed.")
    }

    gDatabaseMutex.release();
    return gDatabaseClient == null;
}
module.exports.CloseDatabase = CloseDatabase;

/**
 * Retrieves the database instance.
 * @returns {Promise<Database>} The database instance.
 * @throws {Error} If the database is not connected.
 */
async function GetDatabase()
{
    await gDatabaseMutex.acquire();
    if (gDatabaseClient == null)
        throw new Error("Database is not connected.");

    database = gDatabaseClient.db(COLLECTION);
    gDatabaseMutex.release();
    return database;
}

/**
 * Loads active callers from the database.
 * It will also archive callers that have not been contacted in 6 months.
 * @returns {Promise<Array>} A promise that resolves to an array of callers.
 * @throws {Error} If an error occurs while loading callers from the database.
 */
async function LoadActiveCallersFromDatabase()
{
    var callers = [];

    try
    {
        const database = await GetDatabase();
        const collection = database.collection(CALLERS);
        let query = {"archived.isArchived": false};
        callers = await collection.find(query).toArray();
        util.RemoveMongoIdFieldFromCallers(callers); // Prevents issues with saving them back to the database
        await TryArchiveOldCallers(callers); // In case there are some that need to be archived
        util.RemoveArchivedCallers(callers); // In case they were archive in the command above
    }
    catch (error)
    {
        console.log("An error occurred loading the active callers from the database:");
        console.log(error);
        throw(error);
    }

    return callers;
}
module.exports.LoadActiveCallersFromDatabase = LoadActiveCallersFromDatabase;

/**
 * Loads archived callers from the database.
 * @returns {Promise<Array>} A promise that resolves to an array of archived callers.
 * @throws {Error} If an error occurs while loading the callers from the database.
 */
async function LoadArchivedCallersFromDatabase()
{
    var callers = [];

    try
    {
        const database = await GetDatabase();
        const collection = database.collection(CALLERS);
        let query = {"archived.isArchived": true};
        callers = await collection.find(query).toArray();
        util.RemoveMongoIdFieldFromCallers(callers); // Prevents issues with saving them back to the database
    }
    catch (error)
    {
        console.log("An error occurred loading the archived from the database:");
        console.log(error);
        throw(error);
    }

    return callers;
}
module.exports.LoadArchivedCallersFromDatabase = LoadArchivedCallersFromDatabase;

/**
 * Adds a caller to the database.
 * @param {Object} caller - The caller object to be added to the database.
 * @returns {Promise<void>} - A promise that resolves when the caller is successfully added to the database.
 * @throws {Error} - If an error occurs while adding the caller to the database.
 */
async function AddCallerToDatabase(caller)
{
    try
    {
        const database = await GetDatabase();
        const collection = database.collection(CALLERS);
        
        // Assign an ID to the caller
        const maxId = await collection.find().sort({"id": -1}).limit(1).toArray();
        caller.id = maxId.length > 0 ? maxId[0].id + 1 : 1;

        // Try to archive the caller if they haven't been contacted in 6 months
        util.TrySetCallerToArchived(caller);

        // Add the caller to the database
        await collection.insertOne(caller);
        util.RemoveMongoIdFieldFromCallers([caller]); // Prevents issues with saving them back to the database
    }
    catch (error)
    {
        console.log("An error occurred adding the caller to the database:");
        console.log(error);
        throw(error);
    }
}
module.exports.AddCallerToDatabase = AddCallerToDatabase;

/**
 * Adds callers to the database.
 * @param {Array} callers - An array of callers to be added to the database.
 */
async function AddCallersToDatabase(callers)
{
    for (let caller of callers)
        await AddCallerToDatabase(caller);
};
module.exports.AddCallersToDatabase = AddCallersToDatabase; // Specifically for testing

/**
 * Updates a caller in the database.
 * @param {Object} caller - The caller object to be updated.
 * @throws {Error} If an error occurs while updating the caller in the database.
 */
async function UpdateCallerInDatabase(caller)
{
    try
    {        
        // Try to archive the caller if they haven't been contacted in 6 months
        util.TrySetCallerToArchived(caller);

        // Update the caller in the database
        const database = await GetDatabase();
        const collection = database.collection(CALLERS);
        let query = {"id": caller.id};
        let update = {$set: caller};
        await collection.updateOne(query, update);
        util.RemoveMongoIdFieldFromCallers([caller]); // Prevents issues with saving them back to the database
    }
    catch (error)
    {
        console.log("An error occurred updating the caller in the database:");
        console.log(error);
        throw(error);
    }
}
module.exports.UpdateCallerInDatabase = UpdateCallerInDatabase;

/**
 * Deletes a caller from the database.
 * @param {Object} caller - The caller object to be deleted.
 * @throws {Error} If an error occurs while deleting the caller from the database.
 */
async function DeleteCallerFromDatabase(caller)
{
    try
    {
        const database = await GetDatabase();
        const collection = database.collection(CALLERS);
        let query = {"id": caller.id};
        await collection.deleteOne(query);
    }
    catch (error)
    {
        console.log("An error occurred deleting the caller from the database:");
        console.log(error);
        throw(error);
    }
}
module.exports.DeleteCallerFromDatabase = DeleteCallerFromDatabase;

/**
 * Deletes all callers from the database.
 * @returns {Promise<void>} A promise that resolves when all callers are deleted.
 * @throws {Error} If an error occurs while deleting callers from the database.
 */
async function DeleteAllCallersFromDatabase()
{
    try
    {
        const database = await GetDatabase();
        const collection = database.collection(CALLERS);
        await collection.deleteMany({});
    }
    catch (error)
    {
        console.log("An error occurred deleting all callers from the database:");
        console.log(error);
        throw(error);
    }
}
module.exports.DeleteAllCallersFromDatabase = DeleteAllCallersFromDatabase; // Specifically for testing

/**
 * Archives callers who haven't had any contact in the last 6 months.
 * @param {Array} callers - The array of callers to be checked for archiving.
 */
async function TryArchiveOldCallers(callers)
{
    // Go through every caller and set the ones older than 6 months to archived
    for (let caller of callers)
    {
        if (util.TrySetCallerToArchived(caller))
            await UpdateCallerInDatabase(caller);
    }
}
module.exports.TryArchiveOldCallers = TryArchiveOldCallers;
