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

export const baseUser = {
    "id": "",
    "aka": [],
    "zip": "",
    "city": "",
    "county": "",
    "gender": [],
    "archived": {
      "by": '',
      "reason": '',
      "dateTime": undefined,
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
        "service": undefined,
        "dateTime": new Date()
      }
    ],
    "lastUpdated": {
      "by": "",
      "dateTime": new Date()
    },
    "phoneNumbers": [''],
    "relevantInfo": "",
    "sexualOrientation": [''],
    "specificInstructions": "",
    "currentBehavioralTreatment": [
      {
        undergoing: undefined,
        location: '',
        notes: ''
      }
    ]
};

export const userFields = [
    {
        name: '',
        value: ''
    }
]

export const callerSchema = {
  "$schema": "http://json-schema.org/draft-04/schema#",
  "type": "object",
  "properties": {
    "id": {
      "type": "string"
    },
    "aka": {
      "type": "array",
      "items": {
        "type": "string"
      }
    },
    "zip": {
      "type": "string"
    },
    "city": {
      "type": "string"
    },
    "county": {
      "type": "string"
    },
    "gender": {
      "type": "array",
      "items": {
        "type": "string",
        "enum": ["male","female","non-binary","transgender","other","unknown"]
      }
    },
    "archived": {
      "type": "object",
      "properties": {
        "isArchived": {
          "type": "boolean"
        },
        "by": {
          "type": "string"
        },
        "dateTime": {
          "type": "string"
        },
        "reason": {
          "type": "string"
        }
      },
      "required": [
        "isArchived"
      ]
    },
    "birthday": {
      "type": "string"
    },
    "lastName": {
      "type": "string"
    },
    "ethnicity": {
      "type": "array",
      "items": [
        {
          "type": "string",
          "enum": [
            "americanIndian",
              "asianIndian",
              "africanAmerican",
              "cambodian",
              "chinese",
              "filipino",
              "guamanian",
              "japanese",
              "korean",
              "laotian",
              "middleEastern",
              "nativeHawaiian",
              "otherPacificIslander",
              "white",
              "unknown",
              "otherRace",
              "cuban",
              "hispanicSpecificOriginUnknown",
              "mexican",
              "hispanic",
              "puertoRican"
          ]
        }
      ]
    },
    "firstName": {
      "type": "string"
    },
    "insurance": {
      "type": "array",
      "items": [
        {
          "type": "string",
          "enum": [
            "unknown","medicaid","medicare","other","private","va","none"
          ]
        }
      ]
    },
    "callHistory": {
      "type": "array",
      "items": [
        {
          "type": "object",
          "properties": {
            "with": {
              "type": "string"
            },
            "notes": {
              "type": "string"
            },
            "service": {
              "type": "string",
              "enum": ["988KingCounty",
              "washingtonTeenLink",
              "washingtonRecoveryHelpLine",
              "washingtonWarmLine",
              "crisisServices",
              "211KingCounty",
              "washingtonSupportAfterSuicide"]
            },
            "dateTime": {
              "type": "string"
            }
          },
          "required": [
            "with",
            "notes",
            "service",
            "dateTime"
          ]
        },
        {
          "type": "object",
          "properties": {
            "with": {
              "type": "string"
            },
            "notes": {
              "type": "string"
            },
            "service": {
              "type": "string"
            },
            "dateTime": {
              "type": "string"
            }
          },
          "required": [
            "with",
            "notes",
            "service",
            "dateTime"
          ]
        },
        {
          "type": "object",
          "properties": {
            "with": {
              "type": "string"
            },
            "notes": {
              "type": "string"
            },
            "service": {
              "type": "string"
            },
            "dateTime": {
              "type": "string"
            }
          },
          "required": [
            "with",
            "notes",
            "service",
            "dateTime"
          ]
        },
        {
          "type": "object",
          "properties": {
            "with": {
              "type": "string"
            },
            "notes": {
              "type": "string"
            },
            "service": {
              "type": "string"
            },
            "dateTime": {
              "type": "string"
            }
          },
          "required": [
            "with",
            "notes",
            "service",
            "dateTime"
          ]
        }
      ]
    },
    "lastUpdated": {
      "type": "object",
      "properties": {
        "by": {
          "type": "string"
        },
        "dateTime": {
          "type": "string"
        }
      },
      "required": [
        "by",
        "dateTime"
      ]
    },
    "phoneNumbers": {
      "type": "array",
      "items": [
        {
          "type": "integer"
        }
      ]
    },
    "relevantInfo": {
      "type": "string"
    },
    "sexualOrientation": {
      "type": "array",
      "items": [
        {
          "type": "string",
          "enum": ["heterosexual","lgbtq","bisexual","unknown","undisclosed"]
        }
      ]
    },
    "specificInstructions": {
      "type": "string"
    },
    "currentBehavioralTreatment": {
      "type": "array",
      "items": [
        {
          "type": "object",
          "properties": {
            "notes": {
              "type": "string"
            },
            "location": {
              "type": "string"
            },
            "undergoing": {
              "type": "string",
              "enum": [
                "yes","no","unknown"
              ]
            }
          },
          "required": [
            "notes",
            "location",
            "undergoing"
          ]
        }
      ]
    }
  },
  "required": [
    "id",
    "archived",
    "callHistory",
    "lastUpdated",
    "phoneNumbers",
    "relevantInfo",
    "specificInstructions"
  ]
};