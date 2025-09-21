"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const errorHandler_1 = require("../middleware/errorHandler");
const logger_1 = require("../utils/logger");
const requestLogger_1 = require("../middleware/requestLogger");
const router = (0, express_1.Router)();
router.post('/github', (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const signature = req.headers['x-hub-signature-256'];
    const event = req.headers['x-github-event'];
    const payload = req.body;
    (0, requestLogger_1.logWebhookReceived)('github', event, payload);
    logger_1.logger.info('GitHub webhook received', {
        event,
        action: payload.action,
        repository: payload.repository?.name
    });
    switch (event) {
        case 'workflow_run':
            logger_1.logger.info('Workflow run event', {
                workflowName: payload.workflow_run?.name,
                status: payload.workflow_run?.status,
                conclusion: payload.workflow_run?.conclusion
            });
            break;
        case 'workflow_job':
            logger_1.logger.info('Workflow job event', {
                jobName: payload.workflow_job?.name,
                status: payload.workflow_job?.status,
                conclusion: payload.workflow_job?.conclusion
            });
            break;
        default:
            logger_1.logger.debug('Unhandled GitHub event', { event });
    }
    res.status(200).json({
        success: true,
        message: 'Webhook processed successfully'
    });
}));
router.post('/jenkins', (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const payload = req.body;
    (0, requestLogger_1.logWebhookReceived)('jenkins', 'build', payload);
    logger_1.logger.info('Jenkins webhook received', {
        jobName: payload.name,
        buildNumber: payload.build?.number,
        status: payload.build?.status,
        phase: payload.build?.phase
    });
    res.status(200).json({
        success: true,
        message: 'Jenkins webhook processed successfully'
    });
}));
router.post('/gitlab', (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const event = req.headers['x-gitlab-event'];
    const payload = req.body;
    (0, requestLogger_1.logWebhookReceived)('gitlab', event, payload);
    logger_1.logger.info('GitLab webhook received', {
        event,
        projectName: payload.project?.name,
        pipelineStatus: payload.object_attributes?.status
    });
    res.status(200).json({
        success: true,
        message: 'GitLab webhook processed successfully'
    });
}));
router.get('/verify/:platform', (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const { platform } = req.params;
    const { challenge } = req.query;
    logger_1.logger.info('Webhook verification request', { platform, challenge });
    switch (platform) {
        case 'github':
            res.status(200).json({ verified: true });
            break;
        case 'slack':
            if (challenge) {
                res.status(200).json({ challenge });
            }
            else {
                res.status(400).json({ error: 'Challenge parameter required' });
            }
            break;
        default:
            res.status(400).json({ error: 'Unsupported platform' });
    }
}));
exports.default = router;
//# sourceMappingURL=webhooks.js.map