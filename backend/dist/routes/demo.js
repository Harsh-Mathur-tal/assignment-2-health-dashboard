"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const errorHandler_1 = require("../middleware/errorHandler");
const logger_1 = require("../utils/logger");
const emailService_1 = require("../services/emailService");
const router = (0, express_1.Router)();
router.post('/alert-email', (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const recipient = process.env.DEMO_EMAIL_RECIPIENT || 'harsh.mathur@talentica.com';
    logger_1.logger.info('Sending demo alert email', { recipient, userId: "system" });
    const alertData = {
        pipelineName: 'Frontend CI/CD Demo Pipeline',
        alertType: 'failure',
        severity: 'high',
        message: 'Pipeline failed during test execution. The build process encountered errors in the unit test suite.',
        timestamp: new Date(),
        runId: 'demo-run-12345',
        branch: 'main',
        commitSha: 'abc123def456789',
    };
    const success = await emailService_1.emailService.sendAlertEmail(recipient, alertData);
    if (success) {
        res.json({
            success: true,
            message: `Demo alert email sent successfully to ${recipient}`,
            data: {
                recipient,
                alertType: alertData.alertType,
                severity: alertData.severity,
                timestamp: alertData.timestamp
            }
        });
    }
    else {
        res.status(500).json({
            success: false,
            error: 'Failed to send demo alert email',
            message: 'Please check email configuration and logs'
        });
    }
}));
router.post('/pipeline-run', (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const { status = 'failed', pipelineId = 'demo-pipeline-1' } = req.body;
    logger_1.logger.info('Simulating pipeline run', { status, pipelineId, userId: "system" });
    const pipelineRun = {
        id: `demo-run-${Date.now()}`,
        pipelineId,
        pipelineName: 'Demo Frontend Pipeline',
        status,
        duration: Math.floor(Math.random() * 300) + 60,
        branch: 'main',
        commitSha: Math.random().toString(36).substring(2, 15),
        triggeredBy: 'demo@example.com',
        startTime: new Date(Date.now() - 300000),
        endTime: new Date(),
        timestamp: new Date(),
    };
    if (status === 'failed') {
        const recipient = process.env.DEMO_EMAIL_RECIPIENT || 'harsh.mathur@talentica.com';
        const alertData = {
            pipelineName: pipelineRun.pipelineName,
            alertType: 'failure',
            severity: 'high',
            message: `Pipeline run #${pipelineRun.id} failed on branch ${pipelineRun.branch}. Please check the logs for more details.`,
            timestamp: pipelineRun.endTime,
            runId: pipelineRun.id,
            branch: pipelineRun.branch,
            commitSha: pipelineRun.commitSha,
        };
        await emailService_1.emailService.sendAlertEmail(recipient, alertData);
    }
    if (global.io) {
        global.io.to('dashboard').emit('pipeline:run:completed', pipelineRun);
        if (status === 'failed') {
            global.io.to('alerts').emit('alert:triggered', {
                id: `alert-${Date.now()}`,
                pipelineName: pipelineRun.pipelineName,
                alertType: 'failure',
                severity: 'high',
                message: `Pipeline failed on ${pipelineRun.branch} branch`,
                timestamp: pipelineRun.endTime,
            });
        }
    }
    res.json({
        success: true,
        message: 'Pipeline run simulated successfully',
        data: {
            run: pipelineRun,
            alertSent: status === 'failed'
        }
    });
}));
router.get('/test-email', (0, errorHandler_1.asyncHandler)(async (req, res) => {
    logger_1.logger.info('Testing email configuration', { userId: "system" });
    const connectionTest = await emailService_1.emailService.testEmailConnection();
    res.json({
        success: true,
        data: {
            emailConfigured: !!process.env.EMAIL_USER,
            connectionTest,
            recipient: process.env.DEMO_EMAIL_RECIPIENT || 'harsh.mathur@talentica.com',
            emailService: process.env.EMAIL_SERVICE || 'gmail',
            emailHost: process.env.EMAIL_HOST || 'smtp.gmail.com'
        }
    });
}));
router.post('/sample-data', (0, errorHandler_1.asyncHandler)(async (req, res) => {
    logger_1.logger.info('Creating sample demo data', { userId: "system" });
    const samplePipelines = [
        {
            id: 'demo-pipeline-1',
            name: 'Frontend CI/CD Demo',
            repositoryUrl: 'https://github.com/demo/frontend-app',
            platform: 'github_actions',
            status: 'active',
            metrics: {
                successRate: 92.5,
                avgBuildTime: 145,
                totalRuns: 48,
                lastRun: { status: 'success', timestamp: new Date() }
            }
        },
        {
            id: 'demo-pipeline-2',
            name: 'Backend API Demo',
            repositoryUrl: 'https://github.com/demo/backend-api',
            platform: 'github_actions',
            status: 'active',
            metrics: {
                successRate: 88.2,
                avgBuildTime: 230,
                totalRuns: 34,
                lastRun: { status: 'failed', timestamp: new Date(Date.now() - 600000) }
            }
        }
    ];
    const sampleRuns = [
        {
            id: 'demo-run-1',
            pipelineId: 'demo-pipeline-1',
            status: 'success',
            duration: 142,
            branch: 'main',
            commitSha: 'abc123def',
            timestamp: new Date(Date.now() - 300000)
        },
        {
            id: 'demo-run-2',
            pipelineId: 'demo-pipeline-2',
            status: 'failed',
            duration: 89,
            branch: 'develop',
            commitSha: 'def456ghi',
            timestamp: new Date(Date.now() - 600000)
        }
    ];
    res.json({
        success: true,
        message: 'Sample demo data created',
        data: {
            pipelines: samplePipelines,
            runs: sampleRuns,
            metricsGenerated: true
        }
    });
}));
router.get('/status', (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const demoStatus = {
        environment: process.env.NODE_ENV,
        emailConfigured: !!process.env.EMAIL_USER,
        emailRecipient: process.env.DEMO_EMAIL_RECIPIENT || 'harsh.mathur@talentica.com',
        databaseConnected: true,
        redisConnected: true,
        websocketEnabled: !!global.io,
        timestamp: new Date()
    };
    res.json({
        success: true,
        data: demoStatus
    });
}));
exports.default = router;
//# sourceMappingURL=demo.js.map