"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const errorHandler_1 = require("../middleware/errorHandler");
const logger_1 = require("../utils/logger");
const router = (0, express_1.Router)();
router.get('/', (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const { page = 1, limit = 10, platform, status, search } = req.query;
    logger_1.logger.info('Fetching pipelines', {
        filters: { platform, status, search }
    });
    const mockPipelines = [
        {
            id: '1',
            name: 'Frontend CI/CD',
            repositoryUrl: 'https://github.com/company/frontend-app',
            platform: 'github_actions',
            status: 'active',
            configuration: {
                workflowFile: '.github/workflows/ci.yml',
                branches: ['main', 'develop'],
                triggers: ['push', 'pull_request']
            },
            metrics: {
                successRate: 96.2,
                avgBuildTime: 145,
                totalRuns: 342,
                lastRun: {
                    id: 'run-123',
                    status: 'success',
                    duration: 165,
                    timestamp: new Date()
                }
            },
            createdAt: new Date(),
            updatedAt: new Date()
        },
        {
            id: '2',
            name: 'Backend API Tests',
            repositoryUrl: 'https://github.com/company/backend-api',
            platform: 'github_actions',
            status: 'active',
            configuration: {
                workflowFile: '.github/workflows/test.yml',
                branches: ['main'],
                triggers: ['push']
            },
            metrics: {
                successRate: 94.5,
                avgBuildTime: 230,
                totalRuns: 156,
                lastRun: {
                    id: 'run-124',
                    status: 'failed',
                    duration: 180,
                    timestamp: new Date()
                }
            },
            createdAt: new Date(),
            updatedAt: new Date()
        }
    ];
    res.json({
        success: true,
        data: mockPipelines,
        pagination: {
            page: Number(page),
            limit: Number(limit),
            total: mockPipelines.length,
            totalPages: 1,
            hasNext: false,
            hasPrev: false
        }
    });
}));
router.get('/:id', (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const { id } = req.params;
    logger_1.logger.info('Fetching pipeline details', { pipelineId: id, userId: "system" });
    const mockPipeline = {
        id: id,
        name: 'Frontend CI/CD',
        repositoryUrl: 'https://github.com/company/frontend-app',
        platform: 'github_actions',
        status: 'active',
        configuration: {
            workflowFile: '.github/workflows/ci.yml',
            branches: ['main', 'develop'],
            triggers: ['push', 'pull_request']
        },
        metrics: {
            successRate: 96.2,
            avgBuildTime: 145,
            totalRuns: 342,
            lastRun: {
                id: 'run-123',
                status: 'success',
                duration: 165,
                timestamp: new Date()
            }
        },
        createdAt: new Date(),
        updatedAt: new Date()
    };
    res.json({
        success: true,
        data: mockPipeline
    });
}));
router.post('/', (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const { name, repositoryUrl, platform, workflowId, configuration } = req.body;
    logger_1.logger.info('Creating new pipeline', {
        name,
        repositoryUrl,
        platform,
        userId: "system"
    });
    const newPipeline = {
        id: Date.now().toString(),
        name,
        repositoryUrl,
        platform,
        workflowId,
        configuration,
        status: 'active',
        createdBy: "system",
        createdAt: new Date(),
        updatedAt: new Date()
    };
    res.status(201).json({
        success: true,
        data: newPipeline,
        message: 'Pipeline created successfully'
    });
}));
router.put('/:id', (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const { id } = req.params;
    const { name, configuration, status } = req.body;
    logger_1.logger.info('Updating pipeline', { pipelineId: id, userId: "system" });
    const updatedPipeline = {
        id,
        name: name || 'Frontend CI/CD',
        repositoryUrl: 'https://github.com/company/frontend-app',
        platform: 'github_actions',
        status: status || 'active',
        configuration: configuration || {
            workflowFile: '.github/workflows/ci.yml',
            branches: ['main', 'develop'],
            triggers: ['push', 'pull_request']
        },
        updatedAt: new Date()
    };
    res.json({
        success: true,
        data: updatedPipeline,
        message: 'Pipeline updated successfully'
    });
}));
router.delete('/:id', (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const { id } = req.params;
    logger_1.logger.info('Deleting pipeline', { pipelineId: id, userId: "system" });
    res.json({
        success: true,
        message: 'Pipeline deleted successfully'
    });
}));
router.get('/:id/runs', (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const { id } = req.params;
    const { page = 1, limit = 10, status, branch } = req.query;
    logger_1.logger.info('Fetching pipeline runs', {
        pipelineId: id,
        userId: "system",
        filters: { status, branch }
    });
    const mockRuns = [
        {
            id: 'run-342',
            pipelineId: id,
            runNumber: 342,
            status: 'success',
            startTime: new Date(Date.now() - 300000),
            endTime: new Date(Date.now() - 135000),
            duration: 165,
            commitSha: 'abc123def456',
            branch: 'main',
            triggeredBy: 'john.doe@company.com',
            triggerEvent: 'push'
        },
        {
            id: 'run-341',
            pipelineId: id,
            runNumber: 341,
            status: 'failed',
            startTime: new Date(Date.now() - 600000),
            endTime: new Date(Date.now() - 510000),
            duration: 90,
            commitSha: 'def456ghi789',
            branch: 'develop',
            triggeredBy: 'jane.smith@company.com',
            triggerEvent: 'pull_request',
            errorMessage: 'Test suite failed'
        }
    ];
    res.json({
        success: true,
        data: mockRuns,
        pagination: {
            page: Number(page),
            limit: Number(limit),
            total: mockRuns.length,
            totalPages: 1,
            hasNext: false,
            hasPrev: false
        }
    });
}));
exports.default = router;
//# sourceMappingURL=pipelines.js.map