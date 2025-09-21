"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.teamsService = void 0;
const axios_1 = __importDefault(require("axios"));
const logger_1 = require("../utils/logger");
class TeamsService {
    constructor() {
        this.webhookUrl = process.env.TEAMS_WEBHOOK_URL || '';
        this.isEnabled = !!this.webhookUrl;
        if (!this.isEnabled) {
            logger_1.logger.warn('Teams webhook URL not provided. Teams notifications disabled.');
        }
    }
    getThemeColor(severity) {
        switch (severity) {
            case 'success': return '00FF00';
            case 'warning': return 'FFA500';
            case 'error': return 'FF0000';
            case 'info':
            default: return '0078D4';
        }
    }
    getSeverityEmoji(severity) {
        switch (severity) {
            case 'success': return '✅';
            case 'warning': return '⚠️';
            case 'error': return '❌';
            case 'info':
            default: return 'ℹ️';
        }
    }
    async sendAlert(alert) {
        if (!this.isEnabled) {
            logger_1.logger.warn('Teams service not configured');
            return false;
        }
        try {
            const emoji = this.getSeverityEmoji(alert.severity);
            const card = {
                title: `${emoji} ${alert.title}`,
                text: alert.message,
                themeColor: this.getThemeColor(alert.severity)
            };
            if (alert.facts && alert.facts.length > 0) {
                card.sections = [{
                        facts: alert.facts
                    }];
            }
            if (alert.actionUrl && alert.actionText) {
                card.potentialAction = [{
                        "@type": "OpenUri",
                        name: alert.actionText,
                        targets: [{
                                os: "default",
                                uri: alert.actionUrl
                            }]
                    }];
            }
            const response = await axios_1.default.post(this.webhookUrl, card, {
                headers: {
                    'Content-Type': 'application/json'
                },
                timeout: 10000
            });
            if (response.status === 200) {
                logger_1.logger.info('Teams alert sent successfully', { title: alert.title, severity: alert.severity });
                return true;
            }
            else {
                logger_1.logger.error('Failed to send Teams alert', { status: response.status, statusText: response.statusText });
                return false;
            }
        }
        catch (error) {
            logger_1.logger.error('Error sending Teams alert:', error);
            return false;
        }
    }
    async sendPipelineAlert(pipelineName, status, details) {
        const severity = status === 'success' ? 'success' : status === 'failed' ? 'error' : 'warning';
        const facts = [
            { name: 'Pipeline', value: pipelineName },
            { name: 'Status', value: status.toUpperCase() },
            { name: 'Duration', value: details.duration ? `${details.duration}s` : 'N/A' },
            { name: 'Platform', value: details.platform || 'Unknown' },
            { name: 'Environment', value: details.environment || 'Unknown' }
        ];
        if (details.commit) {
            facts.push({ name: 'Commit', value: details.commit.substring(0, 8) });
        }
        if (details.branch) {
            facts.push({ name: 'Branch', value: details.branch });
        }
        const alert = {
            title: `Pipeline ${status.toUpperCase()}`,
            message: `Pipeline **${pipelineName}** has ${status}`,
            severity,
            facts,
            actionUrl: process.env.FRONTEND_URL ? `${process.env.FRONTEND_URL}/pipelines` : undefined,
            actionText: 'View Dashboard'
        };
        return await this.sendAlert(alert);
    }
    async sendSystemAlert(alertType, message, data = {}) {
        const facts = Object.entries(data).map(([key, value]) => ({
            name: key.charAt(0).toUpperCase() + key.slice(1).replace(/_/g, ' '),
            value: String(value)
        }));
        const alert = {
            title: `System Alert: ${alertType}`,
            message,
            severity: 'warning',
            facts,
            actionUrl: process.env.FRONTEND_URL ? `${process.env.FRONTEND_URL}/monitoring` : undefined,
            actionText: 'View Monitoring'
        };
        return await this.sendAlert(alert);
    }
    async sendHealthAlert(service, status, details) {
        const severity = status === 'up' ? 'success' : 'error';
        const alert = {
            title: `Service Health: ${service}`,
            message: `Service **${service}** is ${status.toUpperCase()}${details ? `: ${details}` : ''}`,
            severity,
            facts: [
                { name: 'Service', value: service },
                { name: 'Status', value: status.toUpperCase() },
                { name: 'Timestamp', value: new Date().toISOString() }
            ]
        };
        return await this.sendAlert(alert);
    }
    isConfigured() {
        return this.isEnabled;
    }
}
exports.teamsService = new TeamsService();
//# sourceMappingURL=teamsService.js.map