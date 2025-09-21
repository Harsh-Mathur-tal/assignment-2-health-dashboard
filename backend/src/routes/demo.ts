import { Router, Request, Response } from 'express';
import { asyncHandler } from '../middleware/errorHandler';
import { logger } from '../utils/logger';
import { emailService } from '../services/emailService';

const router = Router();

// POST /api/demo/alert-email - Send test alert email
router.post('/alert-email', asyncHandler(async (req: Request, res: Response) => {
  const recipient = process.env.DEMO_EMAIL_RECIPIENT || 'harsh.mathur@talentica.com';
  
  logger.info('Sending demo alert email', { recipient, userId: "system" });

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

  const success = await emailService.sendAlertEmail(recipient, alertData);

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
  } else {
    res.status(500).json({
      success: false,
      error: 'Failed to send demo alert email',
      message: 'Please check email configuration and logs'
    });
  }
}));

// POST /api/demo/pipeline-run - Simulate a pipeline run that triggers alerts
router.post('/pipeline-run', asyncHandler(async (req: Request, res: Response) => {
  const { status = 'failed', pipelineId = 'demo-pipeline-1' } = req.body;
  
  logger.info('Simulating pipeline run', { status, pipelineId, userId: "system" });

  // Simulate pipeline run data
  const pipelineRun = {
    id: `demo-run-${Date.now()}`,
    pipelineId,
    pipelineName: 'Demo Frontend Pipeline',
    status,
    duration: Math.floor(Math.random() * 300) + 60, // 60-360 seconds
    branch: 'main',
    commitSha: Math.random().toString(36).substring(2, 15),
    triggeredBy: 'demo@example.com',
    startTime: new Date(Date.now() - 300000), // 5 minutes ago
    endTime: new Date(),
    timestamp: new Date(),
  };

  // If it's a failure, send alert email
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

    await emailService.sendAlertEmail(recipient, alertData);
  }

  // Emit real-time update via WebSocket
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

// GET /api/demo/test-email - Test email configuration
router.get('/test-email', asyncHandler(async (req: Request, res: Response) => {
  logger.info('Testing email configuration', { userId: "system" });

  const connectionTest = await emailService.testEmailConnection();
  
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

// POST /api/demo/sample-data - Create sample pipeline data
router.post('/sample-data', asyncHandler(async (req: Request, res: Response) => {
  logger.info('Creating sample demo data', { userId: "system" });

  // This would typically insert into database
  // For demo, we'll just return the sample data that would be created
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

// GET /api/demo/status - Get demo status and configuration
router.get('/status', asyncHandler(async (req: Request, res: Response) => {
  const demoStatus = {
    environment: process.env.NODE_ENV,
    emailConfigured: !!process.env.EMAIL_USER,
    emailRecipient: process.env.DEMO_EMAIL_RECIPIENT || 'harsh.mathur@talentica.com',
    databaseConnected: true, // Would check actual DB connection
    redisConnected: true,    // Would check actual Redis connection
    websocketEnabled: !!global.io,
    timestamp: new Date()
  };

  res.json({
    success: true,
    data: demoStatus
  });
}));

export default router;
