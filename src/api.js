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

export default { getActiveCallers, getArchivedCallers };