"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.emailService = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const logger_1 = require("../utils/logger");
class EmailService {
    constructor() {
        this.transporter = null;
        this.initializeTransporter();
    }
    initializeTransporter() {
        if (process.env.EMAIL_USER && process.env.EMAIL_PASSWORD) {
            this.transporter = nodemailer_1.default.createTransport({
                service: process.env.EMAIL_SERVICE || 'gmail',
                host: process.env.EMAIL_HOST,
                port: parseInt(process.env.EMAIL_PORT || '587'),
                secure: process.env.EMAIL_SECURE === 'true',
                auth: {
                    user: process.env.EMAIL_USER,
                    pass: process.env.EMAIL_PASSWORD,
                },
            });
        }
        else {
            this.transporter = nodemailer_1.default.createTransport({
                host: 'smtp.ethereal.email',
                port: 587,
                secure: false,
                auth: {
                    user: 'demo@ethereal.email',
                    pass: 'demo-password',
                },
            });
        }
        logger_1.logger.info('Email service initialized');
    }
    async sendEmail(notification) {
        try {
            if (!this.transporter) {
                logger_1.logger.error('Email transporter not initialized');
                return false;
            }
            const mailOptions = {
                from: process.env.EMAIL_FROM || 'CI/CD Dashboard <noreply@cicd-dashboard.com>',
                to: notification.to,
                subject: notification.subject,
                html: notification.html,
                text: notification.text,
            };
            if (process.env.NODE_ENV === 'development') {
                logger_1.logger.info('Demo Email Notification:', {
                    to: notification.to,
                    subject: notification.subject,
                    content: notification.text || 'HTML email content',
                });
                return true;
            }
            const result = await this.transporter.sendMail(mailOptions);
            logger_1.logger.info('Email sent successfully', { messageId: result.messageId, to: notification.to });
            return true;
        }
        catch (error) {
            logger_1.logger.error('Failed to send email:', error);
            return false;
        }
    }
    async sendAlertEmail(to, alertData) {
        const subject = `🚨 CI/CD Alert: ${alertData.pipelineName} - ${alertData.alertType}`;
        const html = this.generateAlertEmailHtml(alertData);
        const text = this.generateAlertEmailText(alertData);
        return this.sendEmail({ to, subject, html, text });
    }
    generateAlertEmailHtml(alertData) {
        const severityColor = this.getSeverityColor(alertData.severity);
        return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          .container { font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; }
          .header { background-color: ${severityColor}; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; }
          .details { background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 15px 0; }
          .footer { background-color: #333; color: white; padding: 15px; text-align: center; font-size: 12px; }
          .severity { display: inline-block; padding: 5px 15px; border-radius: 3px; color: white; background-color: ${severityColor}; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🚨 CI/CD Pipeline Alert</h1>
            <h2>${alertData.pipelineName}</h2>
          </div>
          
          <div class="content">
            <p><strong>Alert Type:</strong> ${alertData.alertType.replace('_', ' ').toUpperCase()}</p>
            <p><strong>Severity:</strong> <span class="severity">${alertData.severity.toUpperCase()}</span></p>
            <p><strong>Time:</strong> ${alertData.timestamp.toLocaleString()}</p>
            
            <div class="details">
              <h3>Details</h3>
              <p>${alertData.message}</p>
              ${alertData.runId ? `<p><strong>Run ID:</strong> ${alertData.runId}</p>` : ''}
              ${alertData.branch ? `<p><strong>Branch:</strong> ${alertData.branch}</p>` : ''}
              ${alertData.commitSha ? `<p><strong>Commit:</strong> ${alertData.commitSha.substring(0, 8)}</p>` : ''}
            </div>
            
            <p>Please check the CI/CD Dashboard for more details:</p>
            <p><a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}" style="background-color: #1976d2; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">View Dashboard</a></p>
          </div>
          
          <div class="footer">
            <p>This is an automated message from CI/CD Pipeline Health Dashboard</p>
            <p>Generated at ${new Date().toLocaleString()}</p>
          </div>
        </div>
      </body>
      </html>
    `;
    }
    generateAlertEmailText(alertData) {
        return `
CI/CD Pipeline Alert: ${alertData.pipelineName}

Alert Type: ${alertData.alertType.replace('_', ' ').toUpperCase()}
Severity: ${alertData.severity.toUpperCase()}
Time: ${alertData.timestamp.toLocaleString()}

Details:
${alertData.message}
${alertData.runId ? `Run ID: ${alertData.runId}` : ''}
${alertData.branch ? `Branch: ${alertData.branch}` : ''}
${alertData.commitSha ? `Commit: ${alertData.commitSha.substring(0, 8)}` : ''}

Please check the CI/CD Dashboard for more details:
${process.env.FRONTEND_URL || 'http://localhost:3000'}

---
This is an automated message from CI/CD Pipeline Health Dashboard
Generated at ${new Date().toLocaleString()}
    `.trim();
    }
    getSeverityColor(severity) {
        switch (severity.toLowerCase()) {
            case 'critical': return '#d32f2f';
            case 'high': return '#f57c00';
            case 'medium': return '#fbc02d';
            case 'low': return '#388e3c';
            default: return '#757575';
        }
    }
    async testEmailConnection() {
        try {
            if (!this.transporter) {
                return false;
            }
            await this.transporter.verify();
            return true;
        }
        catch (error) {
            logger_1.logger.error('Email connection test failed:', error);
            return false;
        }
    }
}
exports.emailService = new EmailService();
//# sourceMappingURL=emailService.js.map