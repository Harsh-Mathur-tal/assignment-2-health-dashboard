import { Client, GatewayIntentBits, EmbedBuilder, TextChannel } from 'discord.js';
import { logger } from '../utils/logger';

interface DiscordAlert {
  title: string;
  description: string;
  severity: 'info' | 'warning' | 'error' | 'success';
  fields?: Array<{
    name: string;
    value: string;
    inline?: boolean;
  }>;
  metadata?: Record<string, any>;
}

class DiscordService {
  private client: Client | null = null;
  private isReady = false;
  private channelId: string;
  private botToken: string;

  constructor() {
    this.botToken = process.env.DISCORD_BOT_TOKEN || '';
    this.channelId = process.env.DISCORD_CHANNEL_ID || '';
  }

  async initialize(): Promise<void> {
    if (!this.botToken) {
      logger.warn('Discord bot token not provided. Discord notifications disabled.');
      return;
    }

    try {
      this.client = new Client({
        intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages]
      });

      this.client.once('ready', () => {
        this.isReady = true;
        logger.info(`Discord bot logged in as ${this.client?.user?.tag}`);
      });

      await this.client.login(this.botToken);
    } catch (error) {
      logger.error('Failed to initialize Discord client:', error);
    }
  }

  private getEmbedColor(severity: string): number {
    switch (severity) {
      case 'success': return 0x00ff00; // Green
      case 'warning': return 0xffff00; // Yellow
      case 'error': return 0xff0000;   // Red
      case 'info':
      default: return 0x0099ff;        // Blue
    }
  }

  async sendAlert(alert: DiscordAlert): Promise<boolean> {
    if (!this.isReady || !this.client || !this.channelId) {
      logger.warn('Discord service not ready or not configured');
      return false;
    }

    try {
      const channel = await this.client.channels.fetch(this.channelId) as TextChannel;
      
      const embed = new EmbedBuilder()
        .setTitle(`🔔 ${alert.title}`)
        .setDescription(alert.description)
        .setColor(this.getEmbedColor(alert.severity))
        .setTimestamp()
        .setFooter({ 
          text: 'CI/CD Dashboard Alert',
          iconURL: 'https://cdn.discordapp.com/embed/avatars/0.png'
        });

      // Add custom fields if provided
      if (alert.fields && alert.fields.length > 0) {
        embed.addFields(alert.fields);
      }

      // Add metadata as fields
      if (alert.metadata) {
        Object.entries(alert.metadata).forEach(([key, value]) => {
          embed.addFields({
            name: key.charAt(0).toUpperCase() + key.slice(1).replace(/_/g, ' '),
            value: String(value),
            inline: true
          });
        });
      }

      await channel.send({ embeds: [embed] });
      logger.info('Discord alert sent successfully', { title: alert.title, severity: alert.severity });
      return true;
    } catch (error) {
      logger.error('Failed to send Discord alert:', error);
      return false;
    }
  }

  async sendPipelineAlert(pipelineName: string, status: string, details: any): Promise<boolean> {
    const severity = status === 'success' ? 'success' : status === 'failed' ? 'error' : 'warning';
    const statusEmoji = status === 'success' ? '✅' : status === 'failed' ? '❌' : '⚠️';

    const alert: DiscordAlert = {
      title: `Pipeline ${status.toUpperCase()}`,
      description: `${statusEmoji} Pipeline **${pipelineName}** has ${status}`,
      severity,
      fields: [
        {
          name: 'Pipeline',
          value: pipelineName,
          inline: true
        },
        {
          name: 'Status',
          value: status.toUpperCase(),
          inline: true
        },
        {
          name: 'Duration',
          value: details.duration ? `${details.duration}s` : 'N/A',
          inline: true
        }
      ],
      metadata: {
        platform: details.platform || 'Unknown',
        environment: details.environment || 'Unknown',
        commit: details.commit || 'N/A',
        branch: details.branch || 'N/A'
      }
    };

    return await this.sendAlert(alert);
  }

  async sendSystemAlert(alertType: string, message: string, data: any = {}): Promise<boolean> {
    const alert: DiscordAlert = {
      title: `System Alert: ${alertType}`,
      description: message,
      severity: 'warning',
      metadata: data
    };

    return await this.sendAlert(alert);
  }

  isEnabled(): boolean {
    return this.isReady && !!this.client && !!this.channelId;
  }
}

export const discordService = new DiscordService();
