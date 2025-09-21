export interface EmailNotification {
    to: string;
    subject: string;
    html: string;
    text?: string;
}
export interface AlertEmailData {
    pipelineName: string;
    alertType: string;
    severity: string;
    message: string;
    timestamp: Date;
    runId?: string;
    branch?: string;
    commitSha?: string;
}
declare class EmailService {
    private transporter;
    constructor();
    private initializeTransporter;
    sendEmail(notification: EmailNotification): Promise<boolean>;
    sendAlertEmail(to: string, alertData: AlertEmailData): Promise<boolean>;
    private generateAlertEmailHtml;
    private generateAlertEmailText;
    private getSeverityColor;
    testEmailConnection(): Promise<boolean>;
}
export declare const emailService: EmailService;
export {};
//# sourceMappingURL=emailService.d.ts.map