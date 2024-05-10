/**
 * Configurations for running the application.
 */

const DEV_SERVER = (process.env.REACT_APP_DEV_SERVER) ? process.env.REACT_APP_DEV_SERVER : ""; // If it's an environment variable, then use it

export const config = {
    devServer : DEV_SERVER,
};
