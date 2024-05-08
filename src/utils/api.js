import axios from 'axios';

// jsonbin data base server using data made with https://app.json-generator.com/
const masterKey = '$2a$10$X1h67kj/PGN47YZUpSPlPeFAkbydKx1i7zbyw5pOMA3UlLicNOXm6';
const apiKey = '$2a$10$9hLKH8HrSgNSODecEABiXePTpvvtMUKBzGhkg3DuQBbwukwJ9/e1a';
const mockActiveCallers = `https://api.jsonbin.io/v3/b/66344daee41b4d34e4ee0418/latest`;
const mockArchivedCallers = `https://api.jsonbin.io/v3/b/66344dc7e41b4d34e4ee0421/latest`;
const apiHeader = {
    'X-Master-Key': masterKey,
    'X-Access-Key': apiKey
};

export const getActiveCallers = async () => {
    const response = await axios.get(mockActiveCallers, { headers: apiHeader });
    return response.data.record.activeCallers;
};

export const getArchivedCallers = async () => {
    const response = await axios.get(mockArchivedCallers, { headers: apiHeader });
    return response.data.record.archivedCallers;
};

export const pushNewCaller = async (data) => {
  // TODO: push new data.. I may have set up the jsbin.io incorrectly, putting the whole lists where single obj should have been.

  // req.open("PUT", "https://api.jsonbin.io/v3/b/<BIN_ID>", true);

  // axios.post('https://api.jsonbin.io/v3/b/66344daee41b4d34e4ee0418', data, { headers: apiHeader}).then(function (response) {
  //   console.log(response);
  // }).catch(function (error) {
  //   console.log(error);
  // });

}

// TODO: add required * on fields
export const baseUser = {
    "id": "",
    "aka": [],
    "zip": "",
    "city": "",
    "county": "",
    "gender": [],
    "archived": {
      "by": null,
      "reason": null,
      "dateTime": null,
      "isArchived": false
    },
    "birthday": "",
    "lastName": "",
    "ethnicity": [],
    "firstName": "",
    "insurance": [],
    "callHistory": [
      {
        "with": "",
        "notes": "",
        "service": "",
        "dateTime": new Date()
      }
    ],
    "lastUpdated": {
      "by": "",
      "dateTime": new Date()
    },
    "phoneNumbers": [],
    "relevantInfo": "",
    "sexualOrientation": [],
    "specificInstructions": "",
    "currentBehavioralTreatment": []
};

export const userFields = [
    {
        name: '',
        value: ''
    }
]