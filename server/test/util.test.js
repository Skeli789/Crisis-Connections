const expect = require('chai').expect; // Must stay below version 5.0 to work
const _ = require('lodash');
const {gTestCaller} = require('./data.js');
const util = require('../util.js');


describe("Test ValidateCallerJSONSchema", async () => {
    it("should throw no error for a valid caller object", async () => {
        let caller = gTestCaller;
        expect(() => util.ValidateCallerJSONSchema(caller)).to.not.throw();
    });

    it("should throw error for an invalid caller object", async () => {
        let caller = _.cloneDeep(gTestCaller);
        delete caller.phoneNumbers;
        expect(() => util.ValidateCallerJSONSchema(caller)).to.throw();
    });
});

describe("Test GetArchivalTimestamp", async () => {
    it("should return the timestamp 6 months ago", async () => {
        const now = new Date();
        const expectedTimestamp = new Date(now.setMonth(now.getMonth() - 6)).getTime();
        const actualTimestamp = util.GetArchivalTimestamp();
        expect(actualTimestamp).to.be.closeTo(expectedTimestamp, 1000); // Expect time to be within 1 second
    });
});

describe("Test GetCallerLastCallTimestamp", async () =>
{
    it(`should return the last call timestamp`, async () =>
    {
        let lastCallTimestamp = util.GetCallerLastCallTimestamp(gTestCaller);
        expect(lastCallTimestamp).to.equal(1715147553000);
    });

    it(`should return 0 for no call history`, async () =>
    {
        let caller = _.cloneDeep(gTestCaller);
        caller.callHistory = [];
        let lastCallTimestamp = util.GetCallerLastCallTimestamp(caller);
        expect(lastCallTimestamp).to.equal(0);
    });
});

describe("Test SetCallerToArchived", async () =>
{
    it(`should set the caller to archived`, async () =>
    {
        let caller = _.cloneDeep(gTestCaller);
        expect(caller.archived.isArchived).to.be.false;

        util.SetCallerToArchived(caller);
        expect(caller.archived.isArchived).to.be.true;
        expect(caller.archived.by).to.equal("System");
        expect(caller.archived.reason).to.equal("No contact in 6 months");
        expect(caller.archived.dateTime).to.be.closeTo(new Date().getTime(), 5000); // Expect time to be within last 5 seconds
    });
});

describe("Test RemoveArchivedCallers", async () => {
    it("should remove archived callers from the array", async () => {
        const callers = [
            { archived: { isArchived: true } },
            { archived: { isArchived: false } },
            { archived: { isArchived: true } },
            { archived: { isArchived: false } }
        ];

        util.RemoveArchivedCallers(callers);
        expect(callers.length).to.equal(2);
        expect(callers[0].archived.isArchived).to.be.false;
        expect(callers[1].archived.isArchived).to.be.false;
    });

    it("should not remove any callers if there are no archived callers", async () => {
        const callers = [
            { archived: { isArchived: false } },
            { archived: { isArchived: false } },
            { archived: { isArchived: false } }
        ];

        util.RemoveArchivedCallers(callers);
        expect(callers.length).to.equal(3);
    });

    it("should remove all callers if all are archived", async () => {
        const callers = [
            { archived: { isArchived: true } },
            { archived: { isArchived: true } },
            { archived: { isArchived: true } }
        ];

        util.RemoveArchivedCallers(callers);
        expect(callers.length).to.equal(0);
    });
});

describe("Test RemoveMongoIdFieldFromCallers", async () => {
    it("should remove the '_id' field from each caller object", async () => {
        const callers = [
            { _id: "1", name: "John" },
            { _id: "2", name: "Jane" },
            { _id: "3", name: "Bob" }
        ];

        util.RemoveMongoIdFieldFromCallers(callers);
        expect(callers[0]).to.not.have.property("_id");
        expect(callers[1]).to.not.have.property("_id");
        expect(callers[2]).to.not.have.property("_id");
    });

    it("should not modify the caller objects if '_id' field is not present", async () => {
        const callers = [
            { name: "John" },
            { name: "Jane" },
            { name: "Bob" }
        ];

        util.RemoveMongoIdFieldFromCallers(callers);
        expect(callers[0]).to.not.have.property("_id");
        expect(callers[1]).to.not.have.property("_id");
        expect(callers[2]).to.not.have.property("_id");
    });

    it("should not modify an empty array of callers", async () => {
        const callers = [];

        util.RemoveMongoIdFieldFromCallers(callers);
        expect(callers).to.be.an("array").that.is.empty;
    });
});
