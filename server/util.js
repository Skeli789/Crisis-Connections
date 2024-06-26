const Ajv = require('ajv');
const {gCallerSchema} = require('./schemas.js');


/**
 * Validates the caller against a JSON schema.
 * @param {object} caller - The caller object to validate.
 * @throws {Error} - Throws an error if the caller is invalid according to the schema.
 */
function ValidateCallerJSONSchema(caller)
{
    const schema = gCallerSchema;
    const ajv = new Ajv();
    const validate = ajv.compile(schema);
    const valid = validate(caller);
    if (!valid)
        throw new Error(`Invalid caller JSON schema: ${JSON.stringify(validate.errors)}`);
}
module.exports.ValidateCallerJSONSchema = ValidateCallerJSONSchema;

/**
 * Returns the oldest timestamp allowed for a caller before they are archived automatically.
 * @returns {number} The  timestamp.
 */
function GetArchivalTimestamp()
{
    const now = new Date();
    return new Date(now.setMonth(now.getMonth() - 6)).getTime(); // 6 months ago
}
module.exports.GetArchivalTimestamp = GetArchivalTimestamp;

/**
 * Retrieves the timestamp of the last call made by the specified caller.
 * @param {Object} caller - The caller object.
 * @returns {Date} The timestamp of the last call made by the caller.
 */
function GetCallerLastCallTimestamp(caller)
{
    let lastCall = 0;

    caller.callHistory.forEach(call =>
    {
        if (call.dateTime > lastCall)
            lastCall = call.dateTime;
    });

    return lastCall;
}
module.exports.GetCallerLastCallTimestamp = GetCallerLastCallTimestamp;

/**
 * Tries to set the caller to archived based on the last call timestamp and archival timestamp.
 * @param {string} caller - The caller to be set to archived.
 * @returns {boolean} - Returns true if the caller was successfully set to archived, false otherwise.
 */
function TrySetCallerToArchived(caller)
{
    const lastCallTimestamp = GetCallerLastCallTimestamp(caller);
    const archivalTimestamp = GetArchivalTimestamp();

    if (lastCallTimestamp !== 0 && lastCallTimestamp < archivalTimestamp) // Has to have called at least once
    {
        SetCallerToArchived(caller);
        return true;
    }

    return false;
}
module.exports.TrySetCallerToArchived = TrySetCallerToArchived;

/**
 * Sets the caller to archived status.
 * @param {Object} caller - The caller object to be archived.
 */
function SetCallerToArchived(caller)
{
    caller.archived.isArchived = true;
    caller.archived.dateTime = new Date().getTime();
    caller.archived.by = "System";
    caller.archived.reason = "No contact in 6 months";
}
module.exports.SetCallerToArchived = SetCallerToArchived;

/**
 * Removes archived callers from the given array.
 * @param {Array} callers - The array of callers.
 */
function RemoveArchivedCallers(callers)
{
    for (let i = callers.length - 1; i >= 0; --i)
    {
        if (callers[i].archived.isArchived)
            callers.splice(i, 1);
    }
}
module.exports.RemoveArchivedCallers = RemoveArchivedCallers;

/**
 * Removes the "_id" field from each caller object in the given array.
 * @param {Array} callers - The array of caller objects.
 */
function RemoveMongoIdFieldFromCallers(callers)
{
    for (let caller of callers)
        delete caller._id;
}
module.exports.RemoveMongoIdFieldFromCallers = RemoveMongoIdFieldFromCallers;
