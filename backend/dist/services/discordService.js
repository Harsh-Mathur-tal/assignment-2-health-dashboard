"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.discordService = void 0;
const discord_js_1 = require("discord.js");
const logger_1 = require("../utils/logger");
class DiscordService {
    constructor() {
        this.client = null;
        this.isReady = false;
        this.botToken = process.env.DISCORD_BOT_TOKEN || '';
        this.channelId = process.env.DISCORD_CHANNEL_ID || '';
    }
    async initialize() {
        if (!this.botToken) {
            logger_1.logger.warn('Discord bot token not provided. Discord notifications disabled.');
            return;
        }
        try {
            this.client = new discord_js_1.Client({
                intents: [discord_js_1.GatewayIntentBits.Guilds, discord_js_1.GatewayIntentBits.GuildMessages]
            });
            this.client.once('ready', () => {
                this.isReady = true;
                logger_1.logger.info(`Discord bot logged in as ${this.client?.user?.tag}`);
            });
            await this.client.login(this.botToken);
        }
        catch (error) {
            logger_1.logger.error('Failed to initialize Discord client:', error);
        }
    }
    getEmbedColor(severity) {
        switch (severity) {
            case 'success': return 0x00ff00;
            case 'warning': return 0xffff00;
            case 'error': return 0xff0000;
            case 'info':
            default: return 0x0099ff;
        }
    }
    async sendAlert(alert) {
        if (!this.isReady || !this.client || !this.channelId) {
            logger_1.logger.warn('Discord service not ready or not configured');
            return false;
        }
        try {
            const channel = await this.client.channels.fetch(this.channelId);
            const embed = new discord_js_1.EmbedBuilder()
                .setTitle(`🔔 ${alert.title}`)
                .setDescription(alert.description)
                .setColor(this.getEmbedColor(alert.severity))
                .setTimestamp()
                .setFooter({
                text: 'CI/CD Dashboard Alert',
                iconURL: 'https://cdn.discordapp.com/embed/avatars/0.png'
            });
            if (alert.fields && alert.fields.length > 0) {
                embed.addFields(alert.fields);
            }
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
            logger_1.logger.info('Discord alert sent successfully', { title: alert.title, severity: alert.severity });
            return true;
        }
        catch (error) {
            logger_1.logger.error('Failed to send Discord alert:', error);
            return false;
        }
    }
    async sendPipelineAlert(pipelineName, status, details) {
        const severity = status === 'success' ? 'success' : status === 'failed' ? 'error' : 'warning';
        const statusEmoji = status === 'success' ? '✅' : status === 'failed' ? '❌' : '⚠️';
        const alert = {
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
    async sendSystemAlert(alertType, message, data = {}) {
        const alert = {
            title: `System Alert: ${alertType}`,
            description: message,
            severity: 'warning',
            metadata: data
        };
        return await this.sendAlert(alert);
    }
    isEnabled() {
        return this.isReady && !!this.client && !!this.channelId;
    }
}
exports.discordService = new DiscordService();
//# sourceMappingURL=discordService.js.map