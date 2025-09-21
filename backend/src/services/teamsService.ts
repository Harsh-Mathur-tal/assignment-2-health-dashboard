import axios from 'axios';
import { logger } from '../utils/logger';

interface TeamsCard {
  title: string;
  text: string;
  themeColor: string;
  sections?: Array<{
    activityTitle?: string;
    activitySubtitle?: string;
    facts?: Array<{
      name: string;
      value: string;
    }>;
  }>;
  potentialAction?: Array<{
    "@type": string;
    name: string;
    targets: Array<{
      os: string;
      uri: string;
    }>;
  }>;
}

interface TeamsAlert {
  title: string;
  message: string;
  severity: 'info' | 'warning' | 'error' | 'success';
  facts?: Array<{ name: string; value: string }>;
  actionUrl?: string;
  actionText?: string;
}

class TeamsService {
  private webhookUrl: string;
  private isEnabled: boolean;

  constructor() {
    this.webhookUrl = process.env.TEAMS_WEBHOOK_URL || '';
    this.isEnabled = !!this.webhookUrl;

    if (!this.isEnabled) {
      logger.warn('Teams webhook URL not provided. Teams notifications disabled.');
    }
  }

  private getThemeColor(severity: string): string {
    switch (severity) {
      case 'success': return '00FF00'; // Green
      case 'warning': return 'FFA500'; // Orange
      case 'error': return 'FF0000';   // Red
      case 'info':
      default: return '0078D4';        // Microsoft Blue
    }
  }

  private getSeverityEmoji(severity: string): string {
    switch (severity) {
      case 'success': return '✅';
      case 'warning': return '⚠️';
      case 'error': return '❌';
      case 'info':
      default: return 'ℹ️';
    }
  }

  async sendAlert(alert: TeamsAlert): Promise<boolean> {
    if (!this.isEnabled) {
      logger.warn('Teams service not configured');
      return false;
    }

    try {
      const emoji = this.getSeverityEmoji(alert.severity);
      
      const card: TeamsCard = {
        title: `${emoji} ${alert.title}`,
        text: alert.message,
        themeColor: this.getThemeColor(alert.severity)
      };

      // Add facts section if provided
      if (alert.facts && alert.facts.length > 0) {
        card.sections = [{
          facts: alert.facts
        }];
      }

      // Add action button if provided
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

      const response = await axios.post(this.webhookUrl, card, {
        headers: {
          'Content-Type': 'application/json'
        },
        timeout: 10000
      });

      if (response.status === 200) {
        logger.info('Teams alert sent successfully', { title: alert.title, severity: alert.severity });
        return true;
      } else {
        logger.error('Failed to send Teams alert', { status: response.status, statusText: response.statusText });
        return false;
      }
    } catch (error) {
      logger.error('Error sending Teams alert:', error);
      return false;
    }
  }

  async sendPipelineAlert(pipelineName: string, status: string, details: any): Promise<boolean> {
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

    const alert: TeamsAlert = {
      title: `Pipeline ${status.toUpperCase()}`,
      message: `Pipeline **${pipelineName}** has ${status}`,
      severity,
      facts,
      actionUrl: process.env.FRONTEND_URL ? `${process.env.FRONTEND_URL}/pipelines` : undefined,
      actionText: 'View Dashboard'
    };

    return await this.sendAlert(alert);
  }

  async sendSystemAlert(alertType: string, message: string, data: any = {}): Promise<boolean> {
    const facts = Object.entries(data).map(([key, value]) => ({
      name: key.charAt(0).toUpperCase() + key.slice(1).replace(/_/g, ' '),
      value: String(value)
    }));

    const alert: TeamsAlert = {
      title: `System Alert: ${alertType}`,
      message,
      severity: 'warning',
      facts,
      actionUrl: process.env.FRONTEND_URL ? `${process.env.FRONTEND_URL}/monitoring` : undefined,
      actionText: 'View Monitoring'
    };

    return await this.sendAlert(alert);
  }

  async sendHealthAlert(service: string, status: 'up' | 'down', details: string): Promise<boolean> {
    const severity = status === 'up' ? 'success' : 'error';
    
    const alert: TeamsAlert = {
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

  isConfigured(): boolean {
    return this.isEnabled;
  }
}

export const teamsService = new TeamsService();
