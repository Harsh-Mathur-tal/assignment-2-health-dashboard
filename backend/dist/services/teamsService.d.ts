interface TeamsAlert {
    title: string;
    message: string;
    severity: 'info' | 'warning' | 'error' | 'success';
    facts?: Array<{
        name: string;
        value: string;
    }>;
    actionUrl?: string;
    actionText?: string;
}
declare class TeamsService {
    private webhookUrl;
    private isEnabled;
    constructor();
    private getThemeColor;
    private getSeverityEmoji;
    sendAlert(alert: TeamsAlert): Promise<boolean>;
    sendPipelineAlert(pipelineName: string, status: string, details: any): Promise<boolean>;
    sendSystemAlert(alertType: string, message: string, data?: any): Promise<boolean>;
    sendHealthAlert(service: string, status: 'up' | 'down', details: string): Promise<boolean>;
    isConfigured(): boolean;
}
export declare const teamsService: TeamsService;
export {};
//# sourceMappingURL=teamsService.d.ts.map