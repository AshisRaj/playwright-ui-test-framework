import axios from 'axios';
import fs from 'fs';
import path from 'path';
import logger from '../logger';

// Define types for test scenarios
interface TestStep {
  StepDescription: string;
  Action: string;
  Selector: string;
}

interface TestScenario {
  TestName: string;
  Steps: TestStep[];
}

interface ModelService {
  callModel(prompt: string): Promise<string | null>;
}

class AzureOpenAIService implements ModelService {
  private endpoint: string;
  private apiKey: string;

  constructor(endpoint: string, apiKey: string) {
    this.endpoint = endpoint;
    this.apiKey = apiKey;
  }

  async callModel(prompt: string): Promise<string | null> {
    try {
      const response = await axios.post(
        this.endpoint,
        {
          model: 'gpt-4-turbo',
          messages: [{ role: 'user', content: prompt }],
          max_tokens: 1000,
          temperature: 0.9,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'api-key': this.apiKey,
          },
        },
      );

      return response.data.choices[0].message.content.trim();
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Error response:', error.response?.data);
      } else {
        console.error('Error calling model service:', error);
      }
      return null;
    }
  }
}

class TestGeneratorService {
  private modelService: ModelService;

  constructor(modelService: ModelService) {
    this.modelService = modelService;
  }

  private processGeneratedScript(rawScript: string): string {
    return rawScript
      .trim()
      .replace(/^```typescript/, '')
      .replace(/```$/, '');
  }

  private loadPromptTemplate(templateFilePath: fs.PathOrFileDescriptor): string {
    return fs.readFileSync(templateFilePath, 'utf8');
  }

  private replacePlaceholders(template: string, scenario: TestScenario): string {
    return template
      .replace('{{TestName}}', scenario.TestName)
      .replace(
        '{{Steps}}',
        scenario.Steps.map(
          (step, index) => `${index + 1}. ${step.StepDescription} (Action: ${step.Action}, Selector: ${step.Selector})`,
        ).join('\n'),
      );
  }

  async generateTestScript(
    inputFile: fs.PathOrFileDescriptor,
    promptTemplateFile: fs.PathOrFileDescriptor,
    testsFolder: string,
    pagesFolder: string,
  ): Promise<void> {
    const testScenarios: TestScenario[] = JSON.parse(fs.readFileSync(inputFile, 'utf8'));
    const promptTemplate = this.loadPromptTemplate(promptTemplateFile);

    // Ensure the output directories exist
    if (!fs.existsSync(testsFolder)) {
      fs.mkdirSync(testsFolder, { recursive: true });
    }
    if (!fs.existsSync(pagesFolder)) {
      fs.mkdirSync(pagesFolder, { recursive: true });
    }

    for (const scenario of testScenarios) {
      const prompt = this.replacePlaceholders(promptTemplate, scenario);

      logger.info(`Generating script and Page classes for test: ${scenario.TestName}`);
      const rawGeneratedScript = await this.modelService.callModel(prompt);

      if (rawGeneratedScript) {
        const processedScript = this.processGeneratedScript(rawGeneratedScript);
        const [testScript, pageClasses] = processedScript.split('---PAGE_CLASSES---');

        // Write the test script to a separate file
        const testFileName = path.join(testsFolder, `${scenario.TestName.replace(/\s+/g, '_')}.spec.ts`);
        fs.writeFileSync(testFileName, testScript.trim());
        logger.info(`Test script generated and saved to ${testFileName}`);

        // Write each Page class to a separate file
        if (pageClasses) {
          const pageClassFiles = pageClasses.trim().split('---PAGE_CLASS---');
          for (const pageClass of pageClassFiles) {
            const match = pageClass.match(/class (\w+)/);
            if (match) {
              const className = match[1];
              const pageFileName = path.join(pagesFolder, `${className}.ts`);
              fs.writeFileSync(pageFileName, pageClass.trim());
              logger.info(`Page class ${className} generated and saved to ${pageFileName}`);
            }
          }
        }
      } else {
        console.error(`Failed to generate script for test: ${scenario.TestName}`);
      }
    }
  }
}

// Main function
(async () => {
  const inputFile: fs.PathOrFileDescriptor = './test-scenarios.json'; // Input file path
  const promptTemplateFile: fs.PathOrFileDescriptor = './prompt-template.txt'; // Prompt template file path
  const testsFolder = './tests'; // Folder for test scripts
  const pagesFolder = './pages'; // Folder for Page classes

  // Replace with your model service (e.g., AzureOpenAIService, OllamaService, etc.)
  const azureService = new AzureOpenAIService('<add your api endpoint>', '<add your apiKey>');

  const testGenerator = new TestGeneratorService(azureService);
  await testGenerator.generateTestScript(inputFile, promptTemplateFile, testsFolder, pagesFolder);
})();
