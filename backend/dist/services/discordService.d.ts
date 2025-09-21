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
declare class DiscordService {
    private client;
    private isReady;
    private channelId;
    private botToken;
    constructor();
    initialize(): Promise<void>;
    private getEmbedColor;
    sendAlert(alert: DiscordAlert): Promise<boolean>;
    sendPipelineAlert(pipelineName: string, status: string, details: any): Promise<boolean>;
    sendSystemAlert(alertType: string, message: string, data?: any): Promise<boolean>;
    isEnabled(): boolean;
}
export declare const discordService: DiscordService;
export {};
//# sourceMappingURL=discordService.d.ts.map