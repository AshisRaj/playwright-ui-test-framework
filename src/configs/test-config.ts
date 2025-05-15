import * as dotenv from 'dotenv';
import * as path from 'path';

// // Load the appropriate .env file based on the ENV variable
const ENV = (process.env.ENV || 'dev').toLowerCase();
dotenv.config({ path: path.resolve(__dirname, `../environments/${ENV}.env`) });

// load environment specific test data from JSON

let testData: any;

export const envTestData = () => {
  try {
    const testDataPath = path.resolve(__dirname, `../data/${ENV}.testdata.ts`);
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    testData = require(testDataPath);
    return testData;
  } catch {
    throw new Error(`Failed to load test data for ENV: ${ENV}. Ensure the file '../data/${ENV}.testdata.ts' exists.`);
  }
};

// Export all environment variables as a configuration object
export const envConfig = {
  ...process.env, // Spread all environment variables loaded by dotenv
  env: ENV, // Add the current environment as a key
  ...envTestData(), // Spread the environment-specific test data
};
