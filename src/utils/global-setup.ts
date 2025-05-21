import { chromium, expect } from '@playwright/test';
import chalk from 'chalk';
import dotenv from 'dotenv';
import fs from 'fs';
import { resolve } from 'path';
import { rimraf } from 'rimraf';
import logger from './logger';

// Load environment variables from .env file
dotenv.config();

async function globalSetup() {
  logger.info(chalk.blue('Global Setup Started'));

  // Define paths for cleanup
  const allureResultPath = resolve(__dirname, '../../artifacts/reports/allure-results');
  const allureReportPath = resolve(__dirname, '../../artifacts/reports/allure-report');

  // Cleanup old artifacts
  rimraf(`${allureResultPath}`);
  logger.info(chalk.green(`Deleted: ${allureResultPath}`));

  rimraf(`${allureReportPath}`);
  logger.info(chalk.green(`Deleted: ${allureReportPath}`));

  rimraf(`${allureResultPath}`);

  // Setup cookies for users
  await setUpUsersCookies();
  logger.info(chalk.green('User cookies setup completed'));

  // Load secrets based on the environment
  // await loadSecrets();
  // logger.info('Secrets loaded successfully');
}

async function setUpUsersCookies() {
  const users = [
    {
      userName: 'standard_user',
      password: 'secret_sauce',
    },
  ];

  const browser = await chromium.launch({
    channel: 'chrome',
    headless: true,
  });

  for (const user of users) {
    const cookiesFileName = `${user.userName}_cookies.json`;
    const storageStateFilePath = resolve(__dirname, `../../artifacts/cookies/${cookiesFileName}`);

    if (fs.existsSync(storageStateFilePath)) {
      logger.info(`The storage state file already exists, hence no need to overwrite - ${storageStateFilePath}`);
    } else {
      const context = await browser.newContext();
      const page = await context.newPage();

      await page.goto('https://www.saucedemo.com/');

      await page.getByRole('textbox', { name: 'Username' }).fill('standard_user');
      await page.getByRole('textbox', { name: 'Password' }).fill('secret_sauce');

      await page.getByRole('button', { name: 'Login' }).click();

      await expect(page.getByText('Products')).toBeVisible();

      await page.context().storageState({ path: storageStateFilePath });
      logger.info(`The storage state file has been created - ${storageStateFilePath}`);
    }
  }
}

// async function loadSecrets() {
//   // Load secrets based on the environment
//   const env = process.env.CLOUD_ENV || 'GCP'; // Default to GCP if not specified
//   let secrets: Record<string, string> = {};

//   switch (env.toUpperCase()) {
//     case 'GCP':
//       logger.info(chalk.blue('Fetching secrets from GCP Secret Manager...'));
//       secrets = await fetchGCPSecrets();
//       break;
//     case 'AZURE':
//       logger.info(chalk.blue('Fetching secrets from Azure Key Vault...'));
//       secrets = await fetchAzureSecrets();
//       break;
//     case 'AMAZON':
//       logger.info(chalk.blue('Fetching secrets from AWS Secrets Manager...'));
//       secrets = await fetchAWSSecrets();
//       break;
//     default:
//       console.error(chalk.red(`Unknown CLOUD_ENV: ${env}`));
//       process.exit(1);
//   }

//   // Inject secrets into environment variables
//   for (const [key, value] of Object.entries(secrets)) {
//     process.env[key] = value;
//   }

//   logger.info(chalk.green('Secrets loaded successfully'));
//   logger.info(chalk.blue('Global Setup Completed'));
// }

// // Fetch secrets from GCP Secret Manager
// async function fetchGCPSecrets(): Promise<Record<string, string>> {
//   const client = new SecretManagerServiceClient();
//   const projectId = process.env.GCP_PROJECT_ID || 'your-gcp-project-id';
//   const secretName = process.env.GCP_SECRET_NAME || 'your-secret-name';
//   const version = 'latest';

//   const [accessResponse] = await client.accessSecretVersion({
//     name: `projects/${projectId}/secrets/${secretName}/versions/${version}`,
//   });

//   const payload = accessResponse.payload?.data?.toString();
//   return payload ? JSON.parse(payload) : {};
// }

// // Fetch secrets from Azure Key Vault
// async function fetchAzureSecrets(): Promise<Record<string, string>> {
//   const keyVaultName = process.env.AZURE_KEY_VAULT_NAME || 'your-key-vault-name';
//   const url = `https://${keyVaultName}.vault.azure.net`;
//   const credential = new DefaultAzureCredential();
//   const client = new SecretClient(url, credential);

//   const secretName = process.env.AZURE_SECRET_NAME || 'your-secret-name';
//   const secret = await client.getSecret(secretName);

//   return { [secretName]: secret.value || '' };
// }

// // Fetch secrets from AWS Secrets Manager
// async function fetchAWSSecrets(): Promise<Record<string, string>> {
//   const secretsManager = new AWS.SecretsManager({
//     region: process.env.AWS_REGION || 'your-region',
//   });

//   const secretId = process.env.AWS_SECRET_ID || 'your-secret-id';
//   const data = await secretsManager.getSecretValue({ SecretId: secretId }).promise();

//   return data.SecretString ? JSON.parse(data.SecretString) : {};
// }

export default globalSetup;
