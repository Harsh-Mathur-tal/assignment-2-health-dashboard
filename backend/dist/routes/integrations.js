"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const errorHandler_1 = require("../middleware/errorHandler");
const logger_1 = require("../utils/logger");
const router = (0, express_1.Router)();
router.get('/', (0, errorHandler_1.asyncHandler)(async (req, res) => {
    logger_1.logger.info('Fetching integrations');
    const mockIntegrations = [
        {
            id: 'integration-1',
            name: 'GitHub Actions',
            platform: 'github_actions',
            configuration: {
                apiUrl: 'https://api.github.com',
                webhookSecret: '[REDACTED]'
            },
            isActive: true,
            createdAt: new Date(),
            updatedAt: new Date()
        },
        {
            id: 'integration-2',
            name: 'Company Jenkins',
            platform: 'jenkins',
            configuration: {
                apiUrl: 'https://jenkins.company.com',
                apiToken: '[REDACTED]'
            },
            isActive: true,
            createdAt: new Date(),
            updatedAt: new Date()
        }
    ];
    res.json({
        success: true,
        data: mockIntegrations
    });
}));
router.post('/', (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const { name, platform, configuration } = req.body;
    logger_1.logger.info('Creating integration', {
        name,
        platform,
        userId: "system"
    });
    const newIntegration = {
        id: Date.now().toString(),
        name,
        platform,
        configuration,
        isActive: true,
        createdBy: "system",
        createdAt: new Date(),
        updatedAt: new Date()
    };
    res.status(201).json({
        success: true,
        data: newIntegration,
        message: 'Integration created successfully'
    });
}));
router.put('/:id', (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const { id } = req.params;
    const { name, configuration, isActive } = req.body;
    logger_1.logger.info('Updating integration', {
        integrationId: id,
        userId: "system"
    });
    const updatedIntegration = {
        id,
        name: name || 'Updated Integration',
        platform: 'github_actions',
        configuration: configuration || {},
        isActive: isActive !== undefined ? isActive : true,
        updatedAt: new Date()
    };
    res.json({
        success: true,
        data: updatedIntegration,
        message: 'Integration updated successfully'
    });
}));
router.delete('/:id', (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const { id } = req.params;
    logger_1.logger.info('Deleting integration', {
        integrationId: id,
        userId: "system"
    });
    res.json({
        success: true,
        message: 'Integration deleted successfully'
    });
}));
router.post('/:id/test', (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const { id } = req.params;
    logger_1.logger.info('Testing integration', {
        integrationId: id,
        userId: "system"
    });
    const testResult = {
        success: true,
        connectionStatus: 'connected',
        responseTime: 150,
        lastTested: new Date(),
        details: {
            apiVersion: '2021-09-01',
            rateLimitRemaining: 4950,
            endpoints: [
                { endpoint: '/user', status: 'ok' },
                { endpoint: '/repos', status: 'ok' },
                { endpoint: '/actions/runs', status: 'ok' }
            ]
        }
    };
    res.json({
        success: true,
        data: testResult,
        message: 'Integration test completed successfully'
    });
}));
exports.default = router;
//# sourceMappingURL=integrations.js.map