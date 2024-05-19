import dayjs from "dayjs";

/**
 * A helper function that takes a date string and returns date display formatted string
 *
 * @param {string} date - the date to convert
 * @returns {string} XX/XX/XXXX YY:YY AM/PM
 * 
**/
export const formatDate = (date) => {
    date = new Date(date);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    const time = date.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
    
    return `${month}/${day}/${year} ${time}`;
}

/**
 * A helper function that takes a number string and returns phone display string
 *
 * @param {string} label - the phone number to convert.
 * @returns {string} (XXX) XXX - XXXX
 * 
**/
export const formatPhoneNumber = (number) => {
    // Filter only numbers from the input
    const numsOnly = ('' + number).replace(/\D/g, '');
    
    // Check if the input is of correct length
    const match = numsOnly.match(/^(\d{3})(\d{3})(\d{4})$/);

    return match ? `(${match[1]}) ${match[2]} - ${match[3]}` : number;
};

/**
 * A helper function that takes the data's keyName and returns the user friendly label name to display.
 *
 * @param {string} label - the keyname to convert.
 * @returns {string} The user friendly label name.
 * 
**/
const labelMap = {
    aka: 'Also Known As (AKA)',
    lgbtq: 'LGBTQ'
}

const toSentenceCase = (string) => {
    const result = string.replace(/([A-Z])/g, " $1");
    return result.charAt(0).toUpperCase() + result.slice(1);
}

export const getLabelName = (label, fromMap = labelMap[label]) => {
    return fromMap ? labelMap[label] : toSentenceCase(label);
}

/**
 * A helper function that takes the caller list and returns sorted version based on call history, latest first.
 *
 * @param {first, last} string - the first and last name
 * @returns {string} The combined name or "Anonymous" if empty value for both.
 * 
**/
export function getName(first, last) {
    const name = `${first} ${last}`.trim();
    return name ? name: 'Anonymous';
}

/**
 * A helper function that takes the caller list and returns sorted version based on call history, latest first.
 *
 * @param {array} list - the caller list to convert.
 * @returns {array} The sorted caller list
 * 
**/
export function sortByCallHistory(list = []) {
    return list.sort((a,b) => new Date(b.dateTime) - new Date(a.dateTime))
}

export function sortCallers(list = []) {
    return list.map(caller => {
        return ({
            callHistory: caller.callHistory.sort((a,b) => new Date(b.dateTime) - new Date(a.dateTime)),
            ...caller
        })
    }).sort((a,b) => {
        if (a.callHistory.length > 0 && b.callHistory.length > 0) {
            return new Date(b.callHistory[0].dateTime) - new Date(a.callHistory[0].dateTime);
        } else if (a.callHistory.length > 0) {
            return -1;
        } else {
            return 1;
        }
    });
}

/**
 * A helper function that takes date and returns if older than 6 months ago
 *
 * @param {string} date - the date to check.
 * @returns {boolean} if older than 6 months
 * 
**/

export function isOld(date) {
    const sixMonthsAgo = dayjs().subtract(6, 'month');
    return dayjs(date).isBefore(sixMonthsAgo, 'day');
}

/**
 * A helper function that gets the name of the user from local storage.
 * 
 * @returns {string} The user's name or empty string.
 */

export function getUser() {
    return localStorage.getItem('user') || '';
}

/**
 * Sets the user in the local storage.
 * 
 * @param {string} name - The name of the user.
 */
export function setUser(name) {
    localStorage.setItem('user', name);
}

/**
 * Removes the user from the local storage.
 */
export function removeUser() {
    localStorage.removeItem('user');
}

/***********************************************************/

const helperFunctions = { formatDate, formatPhoneNumber, getLabelName, getName, isOld, getUser, setUser, removeUser, sortByCallHistory, sortCallers };

export default helperFunctions;