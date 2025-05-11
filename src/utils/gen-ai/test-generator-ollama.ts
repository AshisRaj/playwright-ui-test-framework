import axios from 'axios';
import fs from 'fs';
import logger from '../logger';

// Function to call Ollama and process streamed responses
async function callOllama(prompt: string): Promise<string | null> {
  try {
    const response = await axios.post(
      'http://localhost:11434/api/generate',
      {
        model: 'phi3.5:latest', // Replace with the model you have installed in Ollama
        prompt: prompt,
      },
      {
        responseType: 'stream', // Stream the response
      },
    );

    let fullResponse = '';

    // Process the streamed response
    response.data.on('data', (chunk: Buffer) => {
      const lines = chunk.toString().split('\n');
      for (const line of lines) {
        if (line.trim()) {
          try {
            const parsed = JSON.parse(line); // Parse each JSON line
            if (parsed.response) {
              fullResponse += parsed.response; // Concatenate the response field
            }
          } catch (err) {
            console.error('Error parsing response chunk:', err);
          }
        }
      }
    });

    // Wait for the stream to finish
    return new Promise((resolve, reject) => {
      response.data.on('end', () => resolve(fullResponse.trim()));
      response.data.on('error', (err: Error) => reject(err));
    });
  } catch (error) {
    console.error('Error calling Ollama:', error);
    return null;
  }
}

// Function to clean and process the response data
function processGeneratedScript(rawScript: string): string {
  // Remove any unnecessary text or metadata from the response
  const cleanedScript = rawScript
    .trim() // Remove leading/trailing whitespace
    .replace(/^```typescript/, '') // Remove code block markers if present
    .replace(/```$/, ''); // Remove closing code block marker

  return cleanedScript;
}

// Function to generate Playwright test script
async function generateTestScript(inputFile: fs.PathOrFileDescriptor, outputFile: fs.PathOrFileDescriptor) {
  const testScenarios = JSON.parse(fs.readFileSync(inputFile, 'utf8'));

  let script = `import { expect, test } from '@playwright/test';\n\n`;

  for (const scenario of testScenarios) {
    const prompt = `
Generate a Playwright test script for the following scenario:
Test Name: ${scenario.TestName}
Steps:
${scenario.Steps.map(
  (step: { StepDescription: string; Action: string; Selector: string }, index: number) =>
    `${index + 1}. ${step.StepDescription} (Action: ${step.Action}, Selector: ${step.Selector})`,
).join('\n')}
The script should use TypeScript and include structured test.step blocks.
`;

    logger.info(`Generating script for test: ${scenario.TestName}`);
    const rawGeneratedScript = await callOllama(prompt);

    if (rawGeneratedScript) {
      const processedScript = processGeneratedScript(rawGeneratedScript);
      script += processedScript + '\n\n';
    } else {
      console.error(`Failed to generate script for test: ${scenario.TestName}`);
    }
  }

  fs.writeFileSync(outputFile, script);
  logger.info(`Test script generated and saved to ${outputFile}`);
}

// Main function
(async () => {
  const inputFile = './test-scenarios.json'; // Input file path
  const outputFile = './generated-tests.spec.ts'; // Output file path

  await generateTestScript(inputFile, outputFile);
})();
