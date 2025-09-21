export interface Pipeline {
    id: string;
    name: string;
    repositoryUrl: string;
    platform: PipelinePlatform;
    workflowId?: string;
    configuration: PipelineConfiguration;
    status: PipelineStatus;
    createdBy: string;
    createdAt: Date;
    updatedAt: Date;
}
export interface PipelineConfiguration {
    workflowFile?: string;
    branches: string[];
    triggers: string[];
    environment?: Record<string, any>;
    [key: string]: any;
}
export declare enum PipelinePlatform {
    GITHUB_ACTIONS = "github_actions",
    JENKINS = "jenkins",
    GITLAB_CI = "gitlab_ci",
    AZURE_DEVOPS = "azure_devops"
}
export declare enum PipelineStatus {
    ACTIVE = "active",
    INACTIVE = "inactive",
    ARCHIVED = "archived"
}
export interface PipelineRun {
    id: string;
    pipelineId: string;
    externalRunId: string;
    runNumber?: number;
    status: RunStatus;
    startTime?: Date;
    endTime?: Date;
    duration?: number;
    commitSha?: string;
    branch?: string;
    triggeredBy?: string;
    triggerEvent?: string;
    logsUrl?: string;
    errorMessage?: string;
    metadata?: Record<string, any>;
    createdAt: Date;
}
export declare enum RunStatus {
    PENDING = "pending",
    QUEUED = "queued",
    RUNNING = "running",
    SUCCESS = "success",
    FAILURE = "failure",
    CANCELLED = "cancelled",
    TIMEOUT = "timeout"
}
export interface PipelineMetrics {
    time: Date;
    pipelineId: string;
    metricType: MetricType;
    metricValue: number;
    aggregationPeriod: AggregationPeriod;
    metadata?: Record<string, any>;
}
export declare enum MetricType {
    SUCCESS_RATE = "success_rate",
    FAILURE_RATE = "failure_rate",
    AVG_BUILD_TIME = "avg_build_time",
    BUILD_COUNT = "build_count",
    FAILURE_COUNT = "failure_count",
    QUEUE_TIME = "queue_time"
}
export declare enum AggregationPeriod {
    HOUR = "hour",
    DAY = "day",
    WEEK = "week",
    MONTH = "month"
}
export interface AlertConfiguration {
    id: string;
    pipelineId: string;
    name: string;
    alertType: AlertType;
    conditions: AlertConditions;
    notificationChannels: NotificationChannel[];
    isActive: boolean;
    createdBy: string;
    createdAt: Date;
    updatedAt: Date;
}
export interface AlertConditions {
    threshold?: number;
    timeWindow?: number;
    operator?: 'gt' | 'lt' | 'eq' | 'gte' | 'lte';
    metric?: MetricType;
    [key: string]: any;
}
export interface NotificationChannel {
    type: NotificationType;
    config: Record<string, any>;
}
export declare enum AlertType {
    FAILURE = "failure",
    PERFORMANCE_DEGRADATION = "performance_degradation",
    SUCCESS_RATE_DROP = "success_rate_drop",
    BUILD_TIME_INCREASE = "build_time_increase",
    CONSECUTIVE_FAILURES = "consecutive_failures"
}
export declare enum NotificationType {
    SLACK = "slack",
    EMAIL = "email",
    DISCORD = "discord",
    TEAMS = "teams",
    WEBHOOK = "webhook",
    SMS = "sms"
}
export interface AlertHistory {
    id: string;
    alertConfigurationId: string;
    pipelineId: string;
    pipelineRunId?: string;
    alertType: AlertType;
    severity: AlertSeverity;
    message: string;
    details?: Record<string, any>;
    notificationStatus: Record<string, NotificationStatus>;
    createdAt: Date;
}
export declare enum AlertSeverity {
    LOW = "low",
    MEDIUM = "medium",
    HIGH = "high",
    CRITICAL = "critical"
}
export interface NotificationStatus {
    status: 'pending' | 'sent' | 'failed';
    timestamp: Date;
    error?: string;
}
export interface User {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: UserRole;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}
export declare enum UserRole {
    ADMIN = "admin",
    DEVELOPER = "developer",
    USER = "user",
    VIEWER = "viewer"
}
export interface ApiResponse<T = any> {
    success: boolean;
    data?: T;
    error?: string;
    message?: string;
    pagination?: PaginationInfo;
}
export interface PaginationInfo {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
}
export interface DashboardMetrics {
    overview: {
        totalPipelines: number;
        activePipelines: number;
        totalRuns: number;
        successRate: number;
        avgBuildTime: number;
        lastUpdateTime: Date;
    };
    recentRuns: PipelineRun[];
    alerts: AlertHistory[];
    trends: TrendData[];
}
export interface TrendData {
    date: Date;
    successRate: number;
    avgBuildTime: number;
    totalRuns: number;
    failures: number;
}
export interface WebhookPayload {
    platform: PipelinePlatform;
    event: string;
    data: any;
    timestamp: Date;
    signature?: string;
}
export interface Integration {
    id: string;
    name: string;
    platform: PipelinePlatform;
    configuration: IntegrationConfiguration;
    isActive: boolean;
    createdBy: string;
    createdAt: Date;
    updatedAt: Date;
}
export interface IntegrationConfiguration {
    apiUrl?: string;
    apiToken?: string;
    webhookSecret?: string;
    [key: string]: any;
}
export interface PipelineFilters {
    platform?: PipelinePlatform;
    status?: PipelineStatus;
    search?: string;
    createdAfter?: Date;
    createdBefore?: Date;
}
export interface RunFilters {
    pipelineId?: string;
    status?: RunStatus;
    branch?: string;
    startDate?: Date;
    endDate?: Date;
    search?: string;
}
export interface SocketEvents {
    'subscribe:dashboard': () => void;
    'subscribe:pipeline': (pipelineId: string) => void;
    'unsubscribe:pipeline': (pipelineId: string) => void;
    'subscribe:alerts': () => void;
    'metrics:update': (data: DashboardMetrics) => void;
    'pipeline:run:started': (run: PipelineRun) => void;
    'pipeline:run:completed': (run: PipelineRun) => void;
    'pipeline:run:failed': (run: PipelineRun) => void;
    'alert:triggered': (alert: AlertHistory) => void;
    'system:status': (status: SystemStatus) => void;
}
export interface SystemStatus {
    status: 'healthy' | 'degraded' | 'down';
    timestamp: Date;
    services: {
        database: boolean;
        redis: boolean;
        github: boolean;
        jenkins: boolean;
    };
}
export interface LoginRequest {
    email: string;
    password: string;
}
export interface LoginResponse {
    user: Omit<User, 'passwordHash'>;
    token: string;
    refreshToken: string;
}
export interface CreatePipelineRequest {
    name: string;
    repositoryUrl: string;
    platform: PipelinePlatform;
    workflowId?: string;
    configuration: PipelineConfiguration;
}
export interface UpdatePipelineRequest {
    name?: string;
    configuration?: Partial<PipelineConfiguration>;
    status?: PipelineStatus;
}
export interface CreateAlertRequest {
    pipelineId: string;
    name: string;
    alertType: AlertType;
    conditions: AlertConditions;
    notificationChannels: NotificationChannel[];
}
//# sourceMappingURL=index.d.ts.map