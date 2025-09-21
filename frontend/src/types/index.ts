// API Response Types
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

// User Types
export interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  role: UserRole;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
  VIEWER = 'viewer',
}


// Pipeline Types
export interface Pipeline {
  id: string;
  name: string;
  repositoryUrl: string;
  platform: PipelinePlatform;
  workflowId?: string;
  configuration: PipelineConfiguration;
  status: PipelineStatus;
  metrics?: PipelineMetricsSummary;
  createdBy?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PipelineConfiguration {
  workflowFile?: string;
  branches: string[];
  triggers: string[];
  environment?: Record<string, any>;
  [key: string]: any;
}

export enum PipelinePlatform {
  GITHUB_ACTIONS = 'github_actions',
  JENKINS = 'jenkins',
  GITLAB_CI = 'gitlab_ci',
  AZURE_DEVOPS = 'azure_devops',
}

export enum PipelineStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  ARCHIVED = 'archived',
}

export interface PipelineMetricsSummary {
  successRate: number;
  avgBuildTime: number;
  totalRuns: number;
  lastRun?: {
    id: string;
    status: RunStatus;
    duration: number;
    timestamp: string;
  };
}

// Pipeline Run Types
export interface PipelineRun {
  id: string;
  pipelineId: string;
  pipelineName?: string;
  externalRunId?: string;
  runNumber?: number;
  status: RunStatus;
  startTime?: string;
  endTime?: string;
  duration?: number;
  commitSha?: string;
  branch?: string;
  triggeredBy?: string;
  triggerEvent?: string;
  logsUrl?: string;
  errorMessage?: string;
  metadata?: Record<string, any>;
  createdAt: string;
}

export enum RunStatus {
  PENDING = 'pending',
  QUEUED = 'queued',
  RUNNING = 'running',
  SUCCESS = 'success',
  FAILURE = 'failure',
  CANCELLED = 'cancelled',
  TIMEOUT = 'timeout',
}

// Metrics Types
export interface DashboardMetrics {
  overview: {
    totalPipelines: number;
    activePipelines: number;
    totalRuns: number;
    successRate: number;
    avgBuildTime: number;
    lastUpdateTime: string;
  };
  recentRuns: PipelineRun[];
  alerts: AlertHistory[];
  trends?: TrendData[];
}

export interface TrendData {
  date: string;
  successRate: number;
  avgBuildTime: number;
  totalRuns: number;
  failures: number;
}

export interface MetricPoint {
  time: string;
  value: number;
  [key: string]: any;
}

// Alert Types
export interface AlertConfiguration {
  id: string;
  pipelineId: string;
  name: string;
  alertType: AlertType;
  conditions: AlertConditions;
  notificationChannels: NotificationChannel[];
  isActive: boolean;
  createdBy?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AlertConditions {
  threshold?: number;
  timeWindow?: number;
  operator?: 'gt' | 'lt' | 'eq' | 'gte' | 'lte';
  metric?: string;
  [key: string]: any;
}

export interface NotificationChannel {
  type: NotificationType;
  config: Record<string, any>;
}

export enum AlertType {
  FAILURE = 'failure',
  PERFORMANCE_DEGRADATION = 'performance_degradation',
  SUCCESS_RATE_DROP = 'success_rate_drop',
  BUILD_TIME_INCREASE = 'build_time_increase',
  CONSECUTIVE_FAILURES = 'consecutive_failures',
}

export enum NotificationType {
  SLACK = 'slack',
  EMAIL = 'email',
  WEBHOOK = 'webhook',
  SMS = 'sms',
}

export interface AlertHistory {
  id: string;
  alertConfigurationId?: string;
  pipelineId: string;
  pipelineRunId?: string;
  pipelineName?: string;
  alertType: AlertType;
  severity: AlertSeverity;
  message: string;
  details?: Record<string, any>;
  notificationStatus?: Record<string, NotificationStatus>;
  createdAt: string;
}

export enum AlertSeverity {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical',
}

export interface NotificationStatus {
  status: 'pending' | 'sent' | 'failed';
  timestamp: string;
  error?: string;
}

// Integration Types
export interface Integration {
  id: string;
  name: string;
  platform: PipelinePlatform;
  configuration: IntegrationConfiguration;
  isActive: boolean;
  createdBy?: string;
  createdAt: string;
  updatedAt: string;
}

export interface IntegrationConfiguration {
  apiUrl?: string;
  apiToken?: string;
  webhookSecret?: string;
  [key: string]: any;
}

export interface IntegrationTestResult {
  success: boolean;
  connectionStatus: string;
  responseTime: number;
  lastTested: string;
  details?: {
    apiVersion?: string;
    rateLimitRemaining?: number;
    endpoints?: Array<{
      endpoint: string;
      status: string;
    }>;
  };
}

// Chart Data Types
export interface ChartDataPoint {
  time: string;
  value: number;
  label?: string;
  color?: string;
}

export interface ChartSeries {
  name: string;
  data: ChartDataPoint[];
  color?: string;
}

// Form Types
export interface CreatePipelineForm {
  name: string;
  repositoryUrl: string;
  platform: PipelinePlatform;
  workflowId?: string;
  branches: string[];
  triggers: string[];
}

export interface CreateAlertForm {
  pipelineId: string;
  name: string;
  alertType: AlertType;
  threshold: number;
  metric: string;
  notificationChannels: {
    slack?: {
      enabled: boolean;
      channel: string;
    };
    email?: {
      enabled: boolean;
      recipients: string[];
    };
  };
}

// Filter Types
export interface PipelineFilters {
  platform?: PipelinePlatform;
  status?: PipelineStatus;
  search?: string;
}

export interface RunFilters {
  pipelineId?: string;
  status?: RunStatus;
  branch?: string;
  search?: string;
  startDate?: string;
  endDate?: string;
}

// Theme Types
export interface Theme {
  palette: {
    mode: 'light' | 'dark';
    primary: {
      main: string;
      light: string;
      dark: string;
    };
    secondary: {
      main: string;
      light: string;
      dark: string;
    };
    error: {
      main: string;
    };
    warning: {
      main: string;
    };
    success: {
      main: string;
    };
    background: {
      default: string;
      paper: string;
    };
  };
}
