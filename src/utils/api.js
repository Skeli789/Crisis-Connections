import axios from 'axios';
import {config} from "./config";

const testEnv = process.env.REACT_APP_TEST === "true";

// jsonbin data base server using data made with https://app.json-generator.com/
const masterKey = '$2a$10$X1h67kj/PGN47YZUpSPlPeFAkbydKx1i7zbyw5pOMA3UlLicNOXm6';
const apiKey = '$2a$10$9hLKH8HrSgNSODecEABiXePTpvvtMUKBzGhkg3DuQBbwukwJ9/e1a';
const mockActiveCallers = `https://api.jsonbin.io/v3/b/66344daee41b4d34e4ee0418/latest`;
const mockArchivedCallers = `https://api.jsonbin.io/v3/b/66344dc7e41b4d34e4ee0421/latest`;
const activeCallers = `${config.devServer}/getcallers`;
const archivedCallers = `${config.devServer}/getarchivedcallers`;
const addNewCaller = `${config.devServer}/addsinglecaller`;
const updateExistingCaller = `${config.devServer}/updatesinglecaller`;
const apiHeader = {
    'X-Master-Key': masterKey,
    'X-Access-Key': apiKey
};


export const getActiveCallers = async () => {
    let response;
    if (testEnv) {
        response = await axios.get(mockActiveCallers, { headers: apiHeader });
    } else {
        response = await axios.get(activeCallers);
    }
    return response.data.record.activeCallers;
};

export const getArchivedCallers = async () => {
    let response;
    if (testEnv) {
        response = await axios.get(mockArchivedCallers, { headers: apiHeader });
    } else {
        response = await axios.get(archivedCallers);
    }
    return response.data.record.archivedCallers;
};

export const saveNewCaller = async (caller) => {
    let response;
    if (!testEnv) {
        response = await axios.post(addNewCaller, caller);
    }
    return response.data;

}

export const saveUpdatedCaller = async (caller) => {
    let response;
    if (!testEnv) {
        response = await axios.put(updateExistingCaller, caller);
    }
    return response.data;
}

export const baseUser = {
    "id": 0,
    "aka": [],
    "zip": "",
    "city": "",
    "county": "",
    "gender": [],
    "archived": {
      "by": "",
      "reason": "",
      "dateTime": 0,
      "isArchived": false
  },
    "birthday": undefined,
    "lastName": "",
    "ethnicity": [],
    "firstName": "",
    "insurance": [],
    "callHistory": [],
    "lastUpdated": {},
    "phoneNumbers": [],
    "relevantInfo": "",
    "sexualOrientation": [],
    "specificInstructions": "",
    "currentBehavioralTreatment": []
};

export const userFields = [
    {
        name: "",
        value: ""
    }
];
