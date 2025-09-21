import { Router, Request, Response } from 'express';
import { asyncHandler } from '../middleware/errorHandler';
import { logger } from '../utils/logger';

const router = Router();

// GET /api/alerts - List alert configurations
router.get('/', asyncHandler(async (req: Request, res: Response) => {
  logger.info('Fetching alert configurations');

  const mockAlerts = [
    {
      id: 'alert-1',
      pipelineId: 'pipeline-1',
      name: 'Frontend CI/CD - Build Failure Alert',
      alertType: 'failure',
      conditions: {
        threshold: 1,
        metric: 'failure_count'
      },
      notificationChannels: [
        { type: 'slack', config: { channel: '#dev-alerts' } },
        { type: 'email', config: { recipients: ['team@company.com'] } }
      ],
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 'alert-2',
      pipelineId: 'pipeline-2',
      name: 'Backend API - Performance Alert',
      alertType: 'performance_degradation',
      conditions: {
        threshold: 600,
        metric: 'avg_build_time'
      },
      notificationChannels: [
        { type: 'slack', config: { channel: '#performance-alerts' } }
      ],
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ];

  res.json({
    success: true,
    data: mockAlerts
  });
}));

// POST /api/alerts - Create alert rule
router.post('/', asyncHandler(async (req: Request, res: Response) => {
  const { pipelineId, name, alertType, conditions, notificationChannels } = req.body;

  logger.info('Creating alert configuration', { 
    pipelineId, 
    alertType, 
    userId: "system" 
  });

  const newAlert = {
    id: Date.now().toString(),
    pipelineId,
    name,
    alertType,
    conditions,
    notificationChannels,
    isActive: true,
    createdBy: "system",
    createdAt: new Date(),
    updatedAt: new Date()
  };

  res.status(201).json({
    success: true,
    data: newAlert,
    message: 'Alert configuration created successfully'
  });
}));

// GET /api/alerts/history - Alert history
router.get('/history', asyncHandler(async (req: Request, res: Response) => {
  const { page = 1, limit = 10, severity, pipelineId } = req.query;

  logger.info('Fetching alert history', { 
    userId: "system",
    filters: { severity, pipelineId }
  });

  const mockHistory = [
    {
      id: 'alert-history-1',
      alertConfigurationId: 'alert-1',
      pipelineId: 'pipeline-1',
      pipelineRunId: 'run-124',
      alertType: 'failure',
      severity: 'high',
      message: 'Pipeline failed on develop branch',
      details: {
        error: 'Test suite timeout',
        duration: 90,
        commitSha: 'def456ghi789'
      },
      notificationStatus: {
        slack: { status: 'sent', timestamp: new Date() },
        email: { status: 'sent', timestamp: new Date() }
      },
      createdAt: new Date(Date.now() - 600000)
    }
  ];

  res.json({
    success: true,
    data: mockHistory,
    pagination: {
      page: Number(page),
      limit: Number(limit),
      total: mockHistory.length,
      totalPages: 1,
      hasNext: false,
      hasPrev: false
    }
  });
}));

export default router;
