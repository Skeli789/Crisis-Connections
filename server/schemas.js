exports =
{
    gCallerSchema: {
        "$schema": "http://json-schema.org/draft-07/schema#",
        "type": "object",
        "properties": {
            "id": {
                "type": "integer"
            },
            "firstName": {
                "type": "string"
            },
            "lastName": {
                "type": "string"
            },
            "aka": {
                "type": "array",
                "items": {
                    "type": "string"
                }
            },
            "city": {
                "type": "string"
            },
            "county": {
                "type": "string"
            },
            "zip": {
                "type": "string"
            },
            "phoneNumbers": {
                "type": "array",
                "items": {
                    "type": "string"
                }
            },
            "birthday": {
                "type": "integer"
            },
            "gender": {
                "type": "array",
                "items": {
                    "type": "string",
                    "enum": [
                        "male",
                        "female",
                        "non-binary",
                        "transgender",
                        "other",
                        "unknown"
                    ]
                },
            },
            "sexualOrientation": {
                "type": "array",
                "items": {
                    "type": "string",
                    "enum": [
                        "heterosexual",
                        "lgbtq",
                        "bisexual",
                        "unknown",
                        "undisclosed"
                    ]
                }
            },
            "ethnicity": {
                "type": "array",
                "items": {
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
                        "otherRace"
                    ]
                }
            },
            "hispanicOrigin": {
                "type": "array",
                "items": {
                    "type": "string",
                    "enum": [
                        "cuban",
                        "hispanicSpecificOriginUnknown",
                        "mexican",
                        "otherSpecificHispanic",
                        "puertoRican",
                        "unknown"
                    ]
                },
            },
            "insurance": {
                "type": "array",
                "items": {
                    "type": "string",
                    "enum": [
                        "unknown",
                        "medicaid",
                        "medicaidAndOther",
                        "medicare",
                        "other",
                        "private",
                        "va",
                        "none"
                    ]
                },
            },
            "currentBehavioralTreatment": {
                "type": "array",
                "items": {
                    "type": "object"
                },
                "properties": {
                    "undergoing": {
                        "type": "string",
                        "enum": [
                            "yes",
                            "no",
                            "unknown"
                        ]
                    },
                    "location": {
                        "type": "string"
                    },
                    "notes": {
                        "type": "string"
                    }
                },
                "required": [
                    "undergoing",
                    "location"
                ]
            },
            "relevantInfo": {
                "type": "string"
            },
            "specificInstructions": {
                "type": "string"
            },
            "callHistory": {
                "type": "array",
                "items": {
                    "type": "object"
                },
                "properties": {
                    "dateTime": {
                        "type": "integer"
                    },
                    "service": {
                        "type": "string",
                        "enum": [
                            "988KingCounty", 
                            "washingtonTeenLink", 
                            "washingtonRecoveryHelpLine", 
                            "washingtonWarmLine", 
                            "crisisServices", 
                            "211KingCounty", 
                            "washingtonSupportAfterSuicide"
                        ]
                    },
                    "with": {
                        "type": "string"
                    },
                    "notes": {
                        "type": "string"
                    }
                },
                "required": [
                    "date",
                    "service"
                ]
            },
            "lastUpdated": {
                "type": "object",
                "properties": {
                    "dateTime": {
                        "type": "integer"
                    },
                    "by": {
                        "type": "string"
                    }
                },
                "required": [
                    "dateTime",
                    "by"
                ]
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
                        "type": "integer"
                    },
                    "reason": {
                        "type": "string"
                    }
                }
            }
        },
        "required": [
            "firstName",
            "lastName",
            "phoneNumbers",
            "relevantInfo",
            "specificInstructions",
            "callHistory",
            "lastUpdated"
        ]
    }
};

module.exports = exports;
