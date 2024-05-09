const expect = require('chai').expect; // Must stay below version 5.0 to work
const _ = require('lodash');
const {gTestCaller} = require('./data.js');
const database = require('../database.js');
const util = require('../util.js');

const DATABASE_CONNECTION_ID = "test";


before(async function()
{
    let connectedSuccessfully = await database.ConnectToDatabase(DATABASE_CONNECTION_ID);
    expect(connectedSuccessfully).to.be.true;
});

after(async function()
{
    await ClearTestDatabase();
    await database.CloseDatabase(DATABASE_CONNECTION_ID);
});

async function ClearTestDatabase()
{
    await database.DeleteAllCallersFromDatabase();
}


describe("Test Database Callers", async () =>
{
    beforeEach(ClearTestDatabase);

    it(`active caller list should be empty initially`, async () =>
    {
        let activeCallers = await database.LoadActiveCallersFromDatabase();
        expect(activeCallers).to.be.an('array').that.is.empty;
    });

    it(`archived caller list should be empty initially`, async () =>
    {
        let archivedCallers = await database.LoadArchivedCallersFromDatabase();
        expect(archivedCallers).to.be.an('array').that.is.empty;
    });

    it(`should add a caller to the active list`, async () =>
    {
        let caller = _.cloneDeep(gTestCaller);
        await database.AddCallerToDatabase(caller);

        let activeCallers = await database.LoadActiveCallersFromDatabase();
        expect(activeCallers).to.be.an('array').that.is.not.empty;
        expect(activeCallers.length).to.equal(1);
        expect(activeCallers[0]).to.deep.equal(caller);

        let archivedCallers = await database.LoadArchivedCallersFromDatabase();
        expect(archivedCallers).to.be.an('array').that.is.empty;
    });
    
    it(`should add a caller to the archived list`, async () =>
    {
        let caller = _.cloneDeep(gTestCaller);
        caller.archived.isArchived = true;

        await database.AddCallerToDatabase(caller);

        let activeCallers = await database.LoadActiveCallersFromDatabase();
        expect(activeCallers).to.be.an('array').that.is.empty;

        let archivedCallers = await database.LoadArchivedCallersFromDatabase();
        expect(archivedCallers).to.be.an('array').that.is.not.empty;
        expect(archivedCallers.length).to.equal(1);
        expect(archivedCallers[0]).to.deep.equal(caller);
    });

    it(`should update a caller`, async () =>
    {
        let caller = _.cloneDeep(gTestCaller);
        await database.AddCallerToDatabase(caller);

        let activeCallers = await database.LoadActiveCallersFromDatabase();
        expect(activeCallers).to.be.an('array').that.is.not.empty;
        expect(activeCallers.length).to.equal(1);
        expect(activeCallers[0]).to.deep.equal(caller);

        caller.firstName = "Updated";
        await database.UpdateCallerInDatabase(caller);

        activeCallers = await database.LoadActiveCallersFromDatabase();
        expect(activeCallers).to.be.an('array').that.is.not.empty;
        expect(activeCallers.length).to.equal(1);
        expect(activeCallers[0]).to.deep.equal(caller);
    });

    it(`should update from an active caller to an archived caller`, async () =>
    {
        let caller = _.cloneDeep(gTestCaller);
        await database.AddCallerToDatabase(caller);

        let activeCallers = await database.LoadActiveCallersFromDatabase();
        expect(activeCallers).to.be.an('array').that.is.not.empty;
        expect(activeCallers.length).to.equal(1);
        expect(activeCallers[0]).to.deep.equal(caller);

        caller.archived.isArchived = true;
        await database.UpdateCallerInDatabase(caller);

        activeCallers = await database.LoadActiveCallersFromDatabase();
        expect(activeCallers).to.be.an('array').that.is.empty;

        let archivedCallers = await database.LoadArchivedCallersFromDatabase();
        expect(archivedCallers).to.be.an('array').that.is.not.empty;
        expect(archivedCallers.length).to.equal(1);
        expect(archivedCallers[0]).to.deep.equal(caller);
    });

    it(`should delete a caller`, async () =>
    {
        let testCaller1 = _.cloneDeep(gTestCaller);
        let testCaller2 = _.cloneDeep(gTestCaller);
        testCaller1.id = 1;
        testCaller2.id = 2;
        await database.AddCallerToDatabase(testCaller1);
        await database.AddCallerToDatabase(testCaller2);

        let activeCallers = await database.LoadActiveCallersFromDatabase();
        expect(activeCallers).to.be.an('array').that.is.not.empty;
        expect(activeCallers.length).to.equal(2);
        expect(activeCallers[0]).to.deep.equal(testCaller1);
        expect(activeCallers[1]).to.deep.equal(testCaller2);

        await database.DeleteCallerFromDatabase(testCaller1);

        activeCallers = await database.LoadActiveCallersFromDatabase();
        expect(activeCallers).to.be.an('array').that.is.not.empty;
        expect(activeCallers.length).to.equal(1);
        expect(activeCallers[0]).to.deep.equal(testCaller2);
    });
});

describe("Test TryArchiveOldCallers", async () =>
{
    beforeEach(ClearTestDatabase);
    const sixMonthsAgoTimestamp = util.GetArchivalTimestamp(); // 6 months ago

    it("should not archive any callers if all have been contacted within the last 6 months", async () => {
        // Create the caller objects and add them to the database
        let callers = [
            _.cloneDeep(gTestCaller),
            _.cloneDeep(gTestCaller),
            _.cloneDeep(gTestCaller),
        ];
        callers[0].callHistory = [{"dateTime": new Date().getTime() - 1000}]; // 1 Second ago    
        callers[1].callHistory = [{"dateTime": new Date().getTime() - 60000}]; // 1 Minute ago
        callers[2].callHistory = [{"dateTime": new Date().getTime() - 13133442000}]; // 5 Months ago
        await database.AddCallersToDatabase(callers);

        // Load the callers from the database and confirm that none of them have been archived
        callers = await database.LoadActiveCallersFromDatabase();
        expect(callers).to.be.an('array').that.is.not.empty;
        expect(callers.length).to.equal(3);
        expect(callers[0].archived.isArchived).to.be.false;
        expect(callers[1].archived.isArchived).to.be.false;
        expect(callers[2].archived.isArchived).to.be.false;

        callers = await database.LoadArchivedCallersFromDatabase();
        expect(callers).to.be.an('array').that.is.empty;
    });

    it("should archive callers who haven't been contacted in the last 6 months", async () => {

        // Create the caller objects and add them to the database
        let callers = [
            _.cloneDeep(gTestCaller),
            _.cloneDeep(gTestCaller),
            _.cloneDeep(gTestCaller),
        ]
        callers[0].id = 1;
        callers[1].id = 2;
        callers[2].id = 3;
        callers[0].callHistory = [{"dateTime": sixMonthsAgoTimestamp - 1000}]; // 1 second before 6 months ago
        callers[1].callHistory = [{"dateTime": sixMonthsAgoTimestamp - 10000}]; // 10 seconds before 6 months ago
        callers[2].callHistory = [{"dateTime": sixMonthsAgoTimestamp - 60000}]; // 1 minute before 6 months ago
        await database.AddCallersToDatabase(callers);

        // Load the callers from the database and confirm that all of them have been archived
        callers = await database.LoadActiveCallersFromDatabase();
        expect(callers).to.be.an('array').that.is.empty;

        callers = await database.LoadArchivedCallersFromDatabase();
        expect(callers).to.be.an('array').that.is.not.empty;
        expect(callers.length).to.equal(3);
        expect(callers[0].archived.isArchived).to.be.true;
        expect(callers[1].archived.isArchived).to.be.true;
        expect(callers[2].archived.isArchived).to.be.true;
    });

    it("should only archive some callers", async () => {
        const oneSecondAgoTimestamp = new Date().getTime() - 1000; // 1 second ago

        // Create the caller objects and add them to the database
        let callers = [
            _.cloneDeep(gTestCaller),
            _.cloneDeep(gTestCaller),
            _.cloneDeep(gTestCaller),
        ]
        callers[0].id = 1;
        callers[1].id = 2;
        callers[2].id = 3;
        callers[0].callHistory = [{"dateTime": sixMonthsAgoTimestamp - 1000}]; // 1 second before 6 months ago
        callers[1].callHistory = [{"dateTime": sixMonthsAgoTimestamp - 10000}]; // 10 seconds before 6 months ago
        callers[2].callHistory = [{"dateTime": oneSecondAgoTimestamp}]; // 1 second ago
        await database.AddCallersToDatabase(callers);

        // Load the callers from the database and confirm that only the first two have been archived
        callers = await database.LoadActiveCallersFromDatabase();
        expect(callers).to.be.an('array').that.is.not.empty;
        expect(callers.length).to.equal(1);
        expect(callers[0].archived.isArchived).to.be.false;
        expect(callers[0].callHistory[0].dateTime).to.equal(oneSecondAgoTimestamp);

        callers = await database.LoadArchivedCallersFromDatabase();
        expect(callers).to.be.an('array').that.is.not.empty;
        expect(callers.length).to.equal(2);
        expect(callers[0].archived.isArchived).to.be.true;
        expect(callers[1].archived.isArchived).to.be.true;
    });
});
