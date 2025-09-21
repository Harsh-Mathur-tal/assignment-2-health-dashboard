"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.metrics = void 0;
const express_1 = require("express");
const prom_client_1 = require("prom-client");
const si = __importStar(require("systeminformation"));
const os = __importStar(require("os"));
const errorHandler_1 = require("../middleware/errorHandler");
const logger_1 = require("../utils/logger");
const router = (0, express_1.Router)();
(0, prom_client_1.collectDefaultMetrics)();
const pipelineRunsTotal = new prom_client_1.Counter({
    name: 'cicd_pipeline_runs_total',
    help: 'Total number of pipeline runs',
    labelNames: ['pipeline_name', 'status', 'platform', 'environment']
});
const pipelineDuration = new prom_client_1.Histogram({
    name: 'cicd_pipeline_duration_seconds',
    help: 'Pipeline execution duration in seconds',
    labelNames: ['pipeline_name', 'platform', 'environment'],
    buckets: [10, 30, 60, 120, 300, 600, 1800, 3600]
});
const activePipelinesGauge = new prom_client_1.Gauge({
    name: 'cicd_active_pipelines',
    help: 'Number of currently active pipelines',
    labelNames: ['environment', 'platform']
});
const systemResourcesGauge = new prom_client_1.Gauge({
    name: 'system_resources_usage',
    help: 'System resource usage metrics',
    labelNames: ['resource_type', 'unit']
});
const alertsTotal = new prom_client_1.Counter({
    name: 'cicd_alerts_total',
    help: 'Total number of alerts sent',
    labelNames: ['alert_type', 'channel', 'severity']
});
exports.metrics = {
    pipelineRunsTotal,
    pipelineDuration,
    activePipelinesGauge,
    systemResourcesGauge,
    alertsTotal
};
router.get('/metrics', (0, errorHandler_1.asyncHandler)(async (req, res) => {
    res.set('Content-Type', prom_client_1.register.contentType);
    res.end(await prom_client_1.register.metrics());
}));
router.get('/health', (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const healthData = {
        status: 'healthy',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        version: process.env.npm_package_version || '1.0.0',
        node_version: process.version,
        memory: process.memoryUsage(),
        system: {
            platform: os.platform(),
            arch: os.arch(),
            cpus: os.cpus().length,
            total_memory: os.totalmem(),
            free_memory: os.freemem(),
            load_average: os.loadavg(),
        },
        services: {
            database: 'connected',
            redis: 'connected',
            elasticsearch: 'connected'
        }
    };
    const cpuUsage = os.loadavg()[0] / os.cpus().length * 100;
    const memoryUsage = (os.totalmem() - os.freemem()) / os.totalmem() * 100;
    systemResourcesGauge.set({ resource_type: 'cpu', unit: 'percent' }, cpuUsage);
    systemResourcesGauge.set({ resource_type: 'memory', unit: 'percent' }, memoryUsage);
    systemResourcesGauge.set({ resource_type: 'disk', unit: 'percent' }, 0);
    res.json(healthData);
}));
router.get('/system', (0, errorHandler_1.asyncHandler)(async (req, res) => {
    logger_1.logger.info('Fetching detailed system information');
    try {
        const [cpu, mem, disk, network, docker] = await Promise.all([
            si.cpu(),
            si.mem(),
            si.fsSize(),
            si.networkStats(),
            si.dockerContainers()
        ]);
        const systemInfo = {
            timestamp: new Date().toISOString(),
            cpu: {
                manufacturer: cpu.manufacturer,
                brand: cpu.brand,
                cores: cpu.cores,
                physicalCores: cpu.physicalCores,
                speed: cpu.speed
            },
            memory: {
                total: mem.total,
                free: mem.free,
                used: mem.used,
                active: mem.active,
                usage_percent: ((mem.used / mem.total) * 100).toFixed(2)
            },
            disk: disk.map(d => ({
                filesystem: d.fs,
                type: d.type,
                size: d.size,
                used: d.used,
                usage_percent: d.use
            })),
            network: network.map(n => ({
                interface: n.iface,
                rx_bytes: n.rx_bytes,
                tx_bytes: n.tx_bytes,
                rx_sec: n.rx_sec,
                tx_sec: n.tx_sec
            })),
            containers: docker.map(c => ({
                id: c.id,
                name: c.name,
                image: c.image,
                state: c.state,
                created: c.created,
                ports: c.ports
            }))
        };
        res.json({
            success: true,
            data: systemInfo
        });
    }
    catch (error) {
        logger_1.logger.error('Error fetching system information:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch system information'
        });
    }
}));
router.get('/resources', (0, errorHandler_1.asyncHandler)(async (req, res) => {
    try {
        const [currentLoad, memory, networkStats] = await Promise.all([
            si.currentLoad(),
            si.mem(),
            si.networkStats()
        ]);
        const resources = {
            timestamp: new Date().toISOString(),
            cpu: {
                usage: currentLoad.currentLoad,
                user: currentLoad.currentLoadUser,
                system: currentLoad.currentLoadSystem,
                idle: currentLoad.currentLoadIdle
            },
            memory: {
                total: memory.total,
                free: memory.free,
                used: memory.used,
                usage_percent: ((memory.used / memory.total) * 100).toFixed(2)
            },
            network: networkStats.map(stat => ({
                interface: stat.iface,
                rx_sec: stat.rx_sec,
                tx_sec: stat.tx_sec,
                ms: stat.ms
            }))
        };
        systemResourcesGauge.set({ resource_type: 'cpu_usage', unit: 'percent' }, currentLoad.currentLoad);
        systemResourcesGauge.set({ resource_type: 'memory_usage', unit: 'percent' }, (memory.used / memory.total) * 100);
        res.json({
            success: true,
            data: resources
        });
    }
    catch (error) {
        logger_1.logger.error('Error fetching resource metrics:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch resource metrics'
        });
    }
}));
router.post('/pipeline-metrics', (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const { pipeline_name, platform, environment, status, duration } = req.body;
    if (!pipeline_name || !platform || !status) {
        return res.status(400).json({
            success: false,
            error: 'Missing required fields: pipeline_name, platform, status'
        });
    }
    pipelineRunsTotal.inc({ pipeline_name, status, platform, environment: environment || 'unknown' });
    if (duration) {
        pipelineDuration.observe({ pipeline_name, platform, environment: environment || 'unknown' }, duration);
    }
    logger_1.logger.info('Recorded pipeline metrics', { pipeline_name, platform, status, duration });
    return res.json({
        success: true,
        message: 'Pipeline metrics recorded successfully'
    });
}));
exports.default = router;
//# sourceMappingURL=monitoring.js.map