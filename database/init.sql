-- CI/CD Dashboard Database Initialization Script
-- This script sets up the basic database structure

-- Enable TimescaleDB extension
CREATE EXTENSION IF NOT EXISTS timescaledb;

-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    role VARCHAR(50) DEFAULT 'user',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create pipelines table
CREATE TABLE IF NOT EXISTS pipelines (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    repository_url VARCHAR(500) NOT NULL,
    platform VARCHAR(50) NOT NULL,
    workflow_id VARCHAR(255),
    configuration JSONB,
    status VARCHAR(50) DEFAULT 'active',
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT unique_pipeline_per_repo UNIQUE(repository_url, workflow_id)
);

-- Create pipeline_runs table
CREATE TABLE IF NOT EXISTS pipeline_runs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    pipeline_id UUID REFERENCES pipelines(id) ON DELETE CASCADE,
    external_run_id VARCHAR(255) NOT NULL,
    run_number INTEGER,
    status VARCHAR(50) NOT NULL,
    start_time TIMESTAMP,
    end_time TIMESTAMP,
    duration INTEGER,
    commit_sha VARCHAR(255),
    branch VARCHAR(255),
    triggered_by VARCHAR(255),
    trigger_event VARCHAR(100),
    logs_url VARCHAR(500),
    error_message TEXT,
    metadata JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT unique_external_run UNIQUE(pipeline_id, external_run_id)
);

-- Create alert_configurations table
CREATE TABLE IF NOT EXISTS alert_configurations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    pipeline_id UUID REFERENCES pipelines(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    alert_type VARCHAR(50) NOT NULL,
    conditions JSONB NOT NULL,
    notification_channels JSONB NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create alert_history table
CREATE TABLE IF NOT EXISTS alert_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    alert_configuration_id UUID REFERENCES alert_configurations(id),
    pipeline_id UUID REFERENCES pipelines(id),
    pipeline_run_id UUID REFERENCES pipeline_runs(id),
    alert_type VARCHAR(50) NOT NULL,
    severity VARCHAR(20) NOT NULL,
    message TEXT NOT NULL,
    details JSONB,
    notification_status JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create pipeline_metrics table (time-series data)
CREATE TABLE IF NOT EXISTS pipeline_metrics (
    time TIMESTAMP NOT NULL,
    pipeline_id UUID NOT NULL,
    metric_type VARCHAR(50) NOT NULL,
    metric_value DOUBLE PRECISION NOT NULL,
    aggregation_period VARCHAR(20) NOT NULL,
    metadata JSONB
);

-- Convert pipeline_metrics to hypertable for time-series optimization
SELECT create_hypertable('pipeline_metrics', 'time', if_not_exists => TRUE);

-- Create system_metrics table (time-series data)
CREATE TABLE IF NOT EXISTS system_metrics (
    time TIMESTAMP NOT NULL,
    metric_name VARCHAR(100) NOT NULL,
    metric_value DOUBLE PRECISION NOT NULL,
    tags JSONB,
    host VARCHAR(100)
);

-- Convert system_metrics to hypertable
SELECT create_hypertable('system_metrics', 'time', if_not_exists => TRUE);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_pipelines_platform ON pipelines(platform);
CREATE INDEX IF NOT EXISTS idx_pipelines_status ON pipelines(status);
CREATE INDEX IF NOT EXISTS idx_pipeline_runs_pipeline_id ON pipeline_runs(pipeline_id);
CREATE INDEX IF NOT EXISTS idx_pipeline_runs_status ON pipeline_runs(status);
CREATE INDEX IF NOT EXISTS idx_pipeline_runs_start_time ON pipeline_runs(start_time);
CREATE INDEX IF NOT EXISTS idx_pipeline_runs_branch ON pipeline_runs(branch);
CREATE INDEX IF NOT EXISTS idx_alert_configurations_pipeline_id ON alert_configurations(pipeline_id);
CREATE INDEX IF NOT EXISTS idx_alert_configurations_active ON alert_configurations(is_active);
CREATE INDEX IF NOT EXISTS idx_alert_history_pipeline_id ON alert_history(pipeline_id);
CREATE INDEX IF NOT EXISTS idx_alert_history_created_at ON alert_history(created_at);
CREATE INDEX IF NOT EXISTS idx_pipeline_metrics_pipeline_id_time ON pipeline_metrics(pipeline_id, time DESC);
CREATE INDEX IF NOT EXISTS idx_pipeline_metrics_type_time ON pipeline_metrics(metric_type, time DESC);
CREATE INDEX IF NOT EXISTS idx_system_metrics_name_time ON system_metrics(metric_name, time DESC);

-- Insert default admin user (password: password123)
INSERT INTO users (email, password_hash, first_name, last_name, role) 
VALUES (
    'admin@example.com', 
    '$2a$10$rOjLZgJmBGHyJdTjJgKIH.Bh5eL0bJXz7xQJU0Z8lQR4MrOqJp3zK', 
    'Admin', 
    'User', 
    'admin'
) ON CONFLICT (email) DO NOTHING;

-- Insert sample pipeline data
INSERT INTO pipelines (name, repository_url, platform, configuration) 
VALUES 
    (
        'Frontend CI/CD', 
        'https://github.com/company/frontend-app', 
        'github_actions',
        '{"workflowFile": ".github/workflows/ci.yml", "branches": ["main", "develop"], "triggers": ["push", "pull_request"]}'
    ),
    (
        'Backend API Tests', 
        'https://github.com/company/backend-api', 
        'github_actions',
        '{"workflowFile": ".github/workflows/test.yml", "branches": ["main"], "triggers": ["push"]}'
    )
ON CONFLICT (repository_url, workflow_id) DO NOTHING;

COMMIT;
