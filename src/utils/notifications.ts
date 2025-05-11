import AdmZip from 'adm-zip';
import { ArgumentParser } from 'argparse';
import axios from 'axios';
import dotenv from 'dotenv';
import fs from 'fs';
import nodemailer from 'nodemailer';
import os from 'os';
import path from 'path';
import { chromium } from 'playwright';
import logger from './logger';

dotenv.config();

class Notification {
  private testResultsFolder: string;
  private env: string;
  private folderPath: string;
  private branch: string;
  private datetime: string;
  private zipFilePath: string;
  private firstScreenshotPath: string;
  private secondScreenshotPath: string;

  private static EMAIL_SENDER = process.env.EMAIL_SENDER || 'ashis.raj@gmail.com';
  private static APP_PASSWORD = process.env.APP_PASSWORD || '<add your app password from gmail';
  private static EMAIL_RECEIVER = ['ashis.raj@gmail.com'];
  private static EMAIL_CC_LIST = ['ashis.raj@gmail.com'];
  private static SMTP_SERVER = 'smtp.gmail.com';
  private static SMTP_PORT = 587;

  private static GOOGLE_CHAT_WEBHOOK = process.env.GOOGLE_CHAT_WEBHOOK || '';
  private static SLACK_WEBHOOK = process.env.SLACK_WEBHOOK || '';

  constructor(args: any) {
    const baseDir = path.resolve(__dirname, '../..');
    this.testResultsFolder = path.resolve(__dirname, '../../artifacts/reports/allure-report');
    this.env = args.env.toUpperCase();
    this.folderPath = args.folder_path || 'N/A';
    this.branch = args.branch || 'N/A';
    this.datetime = new Date().toISOString().replace(/[:.]/g, '_');

    this.zipFilePath = path.join(baseDir, 'artifacts', 'temp', `${this.env}-test-report-${this.datetime}.zip`);
    this.firstScreenshotPath = path.join(baseDir, 'artifacts', 'temp', `${this.env}-test-report-part1-${this.datetime}.png`);
    this.secondScreenshotPath = path.join(baseDir, 'artifacts', 'temp', `${this.env}-test-report-part2-${this.datetime}.png`);
  }

  private zipAllureReport(): void {
    const zip = new AdmZip();
    const files = fs.readdirSync(this.testResultsFolder);
    files.forEach((file) => {
      const filePath = path.join(this.testResultsFolder, file);
      zip.addLocalFile(filePath);
    });
    zip.writeZip(this.zipFilePath);
  }

  private generateReportSubject(): string {
    return `Natwest :: Env : ${this.env} - Test Report - ${this.datetime}`;
  }

  private generateReportBody(): string {
    const osName = os.type();
    const userName = os.userInfo().username;

    return `
      <html>
      <head>
        <style>
          table {
            width: 60%;
            border-collapse: collapse;
          }
          th, td {
            border: 1px solid black;
            padding: 8px;
            text-align: left;
          }
          th {
            background-color: #f2f2f2;
          }
        </style>
      </head>
      <body>
        <p>Automated Test Report for ${this.datetime}</p>
        <p>Please find the attached Test Report.</p>
        <table>
          <tr>
            <th>Environment</th>
            <td>${this.env}</td>
          </tr>
          <tr>
            <th>Branch</th>
            <td>${this.branch}</td>
          </tr>
          <tr>
            <th>Folder Path on Azure Blob Storage</th>
            <td>${this.folderPath}</td>
          </tr>
          <tr>
            <th>Operating System</th>
            <td>${osName}</td>
          </tr>
          <tr>
            <th>User Name</th>
            <td>${userName}</td>
          </tr>
        </table>
        <p><img src="cid:image1" alt="Screenshot 1"></p>
        <p><img src="cid:image2" alt="Screenshot 2"></p>
        <p>Regards,<br>GenAI Platform Team (${userName})</p>
      </body>
      </html>
    `;
  }

  private async sendGoogleChatNotification(): Promise<void> {
    if (!Notification.GOOGLE_CHAT_WEBHOOK) {
      logger.warn('Google Chat webhook URL is not configured.');
      return;
    }

    const message = {
      text: `Test Report Notification:\nEnvironment: ${this.env}\nBranch: ${this.branch}\nDate: ${this.datetime}\nFolder Path: ${this.folderPath}`,
    };

    try {
      await axios.post(Notification.GOOGLE_CHAT_WEBHOOK, message);
      logger.info('Google Chat notification sent successfully.');
    } catch (error) {
      logger.error(`Failed to send Google Chat notification:', ${error}`);
    }
  }

  private async sendSlackNotification(): Promise<void> {
    if (!Notification.SLACK_WEBHOOK) {
      logger.warn('Slack webhook URL is not configured.');
      return;
    }

    const message = {
      text: `*Test Report Notification:*\n*Environment:* ${this.env}\n*Branch:* ${this.branch}\n*Date:* ${this.datetime}\n*Folder Path:* ${this.folderPath}`,
    };

    try {
      await axios.post(Notification.SLACK_WEBHOOK, message);
      logger.info('Slack notification sent successfully.');
    } catch (error) {
      logger.error(`Failed to send Slack notification: ${error}`);
    }
  }

  private async takeScreenshot(): Promise<void> {
    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext();
    const page = await context.newPage();
    const reportPath = path.join(this.testResultsFolder, 'index.html');
    await page.goto(`file://${reportPath}`);
    await page.waitForTimeout(2000);
    await page.screenshot({ path: this.firstScreenshotPath });
    await page.getByRole('link', { name: ' Suites' }).click();
    await page.waitForTimeout(2000);
    await page.screenshot({ path: this.secondScreenshotPath });

    await browser.close();
  }

  public async sendEmail(): Promise<void> {
    this.zipAllureReport();
    await this.takeScreenshot();

    const transporter = nodemailer.createTransport({
      host: Notification.SMTP_SERVER,
      port: Notification.SMTP_PORT,
      secure: false,
      auth: {
        user: Notification.EMAIL_SENDER,
        pass: Notification.APP_PASSWORD,
      },
    });

    const mailOptions = {
      from: Notification.EMAIL_SENDER,
      to: Notification.EMAIL_RECEIVER.join(', '),
      cc: Notification.EMAIL_CC_LIST.join(', '),
      subject: this.generateReportSubject(),
      html: this.generateReportBody(),
      attachments: [
        {
          filename: path.basename(this.zipFilePath),
          path: this.zipFilePath,
        },
        {
          filename: path.basename(this.firstScreenshotPath),
          path: this.firstScreenshotPath,
          cid: 'image1',
        },
        {
          filename: path.basename(this.secondScreenshotPath),
          path: this.secondScreenshotPath,
          cid: 'image2',
        },
      ],
    };

    try {
      await transporter.sendMail(mailOptions);
      logger.info('Email sent successfully with Allure reports.');
    } catch (error) {
      logger.error(`Failed to send email: ${error}`);
    }

    // Send notifications to Google Chat and Slack
    await this.sendGoogleChatNotification();
    await this.sendSlackNotification();
  }
}

function parseArguments(): any {
  const parser = new ArgumentParser({
    description: 'Email Utility for sending test reports',
  });

  parser.add_argument('--env', { required: true, help: 'Provide environment details', choices: ['qa', 'dev', 'staging'] });
  parser.add_argument('--email', {
    required: false,
    default: 'False',
    choices: ['True', 'False'],
    help: 'Send email notification',
  });
  parser.add_argument('--branch', { required: false, help: 'Provide branch name' });
  parser.add_argument('--folder_path', { required: false, help: 'Provide folder path' });

  return parser.parse_args();
}

(async () => {
  const args = parseArguments();
  if (args.email.toLowerCase() === 'false') {
    logger.info('Email notification is disabled');
  } else {
    const notification = new Notification(args);
    await notification.sendEmail();
  }
})();
