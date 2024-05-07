import { getLabelName } from "./utils";

export const hotlines = [
    "988KingCounty",
    "washingtonTeenLink",
    "washingtonRecoveryHelpLine",
    "washingtonWarmLine",
    "crisisServices",
    "211KingCounty",
    "washingtonSupportAfterSuicide"
];

const genders = ["heterosexual","lgbtq","bisexual","unknown","undisclosed"];

const sexualOrientations = ['male','female','non-binary','transgender','other','unknown'];

const insurances = ["unknown","medicaid","medicare","other","private","va","none"];

const ethnicities = [
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
];

const treatmentUndergoing = ["yes", "no", "unknown"];

function mapOptions(list, sort = true, formatString = true) {
    list = sort ? list.sort() : list;

    list = list.map(item => {
        return ({
            label: formatString ? getLabelName(item) : item,
            id: item
        });
    });

    return list;
};

export function mapSelection(item, formatString = true) {
    return ({ id: item, label: formatString ? getLabelName(item) : item}
)};

export const fields = {
    gender: mapOptions(genders),
    sexualOrientation: mapOptions(sexualOrientations),
    insurance: mapOptions(insurances),
    ethnicity: mapOptions(ethnicities),
    services: mapOptions(hotlines),
    treatmentUndergoing: mapOptions(treatmentUndergoing, false)
};