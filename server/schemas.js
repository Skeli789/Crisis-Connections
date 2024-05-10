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
                        "otherRace",
                        "cuban",
                        "hispanicSpecificOriginUnknown",
                        "mexican",
                        "hispanic",
                        "puertoRican"
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
                                    "yes",
                                    "no",
                                    "unknown"
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
            },
            "relevantInfo": {
                "type": "string"
            },
            "specificInstructions": {
                "type": "string"
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
                            "dateTime": {
                                "type": "integer"
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
                                "type": "integer"
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
                                "type": "integer"
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
                                "type": "integer"
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
                },
                "required": [
                    "isArchived"
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
    }
};

module.exports = exports;
