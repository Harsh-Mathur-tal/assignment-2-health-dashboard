import { Router, Request, Response } from 'express';
import { register, collectDefaultMetrics, Counter, Histogram, Gauge } from 'prom-client';
import * as si from 'systeminformation';
import * as os from 'os';
import { asyncHandler } from '../middleware/errorHandler';
import { logger } from '../utils/logger';

const router = Router();

// Initialize Prometheus metrics collection
collectDefaultMetrics();

// Custom metrics for CI/CD monitoring
const pipelineRunsTotal = new Counter({
  name: 'cicd_pipeline_runs_total',
  help: 'Total number of pipeline runs',
  labelNames: ['pipeline_name', 'status', 'platform', 'environment']
});

const pipelineDuration = new Histogram({
  name: 'cicd_pipeline_duration_seconds',
  help: 'Pipeline execution duration in seconds',
  labelNames: ['pipeline_name', 'platform', 'environment'],
  buckets: [10, 30, 60, 120, 300, 600, 1800, 3600] // 10s to 1h
});

const activePipelinesGauge = new Gauge({
  name: 'cicd_active_pipelines',
  help: 'Number of currently active pipelines',
  labelNames: ['environment', 'platform']
});

const systemResourcesGauge = new Gauge({
  name: 'system_resources_usage',
  help: 'System resource usage metrics',
  labelNames: ['resource_type', 'unit']
});

const alertsTotal = new Counter({
  name: 'cicd_alerts_total',
  help: 'Total number of alerts sent',
  labelNames: ['alert_type', 'channel', 'severity']
});

// Export metrics for use in other parts of the application
export const metrics = {
  pipelineRunsTotal,
  pipelineDuration,
  activePipelinesGauge,
  systemResourcesGauge,
  alertsTotal
};

// GET /api/monitoring/metrics - Prometheus metrics endpoint
router.get('/metrics', asyncHandler(async (req: Request, res: Response) => {
  res.set('Content-Type', register.contentType);
  res.end(await register.metrics());
}));

// GET /api/monitoring/health - Enhanced health check with system info
router.get('/health', asyncHandler(async (req: Request, res: Response) => {
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
      database: 'connected', // TODO: Add actual DB health check
      redis: 'connected', // TODO: Add actual Redis health check
      elasticsearch: 'connected' // TODO: Add actual ES health check
    }
  };

  // Update system resource metrics
  const cpuUsage = os.loadavg()[0] / os.cpus().length * 100;
  const memoryUsage = (os.totalmem() - os.freemem()) / os.totalmem() * 100;
  
  systemResourcesGauge.set({ resource_type: 'cpu', unit: 'percent' }, cpuUsage);
  systemResourcesGauge.set({ resource_type: 'memory', unit: 'percent' }, memoryUsage);
  systemResourcesGauge.set({ resource_type: 'disk', unit: 'percent' }, 0); // TODO: Add disk usage

  res.json(healthData);
}));

// GET /api/monitoring/system - Detailed system information
router.get('/system', asyncHandler(async (req: Request, res: Response) => {
  logger.info('Fetching detailed system information');

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
  } catch (error) {
    logger.error('Error fetching system information:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch system information'
    });
  }
}));

// GET /api/monitoring/resources - Real-time resource monitoring
router.get('/resources', asyncHandler(async (req: Request, res: Response) => {
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

    // Update Prometheus metrics
    systemResourcesGauge.set({ resource_type: 'cpu_usage', unit: 'percent' }, currentLoad.currentLoad);
    systemResourcesGauge.set({ resource_type: 'memory_usage', unit: 'percent' }, (memory.used / memory.total) * 100);

    res.json({
      success: true,
      data: resources
    });
  } catch (error) {
    logger.error('Error fetching resource metrics:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch resource metrics'
    });
  }
}));

// POST /api/monitoring/pipeline-metrics - Record pipeline metrics
router.post('/pipeline-metrics', asyncHandler(async (req: Request, res: Response) => {
  const { pipeline_name, platform, environment, status, duration } = req.body;

  if (!pipeline_name || !platform || !status) {
    return res.status(400).json({
      success: false,
      error: 'Missing required fields: pipeline_name, platform, status'
    });
  }

  // Record pipeline run
  pipelineRunsTotal.inc({ pipeline_name, status, platform, environment: environment || 'unknown' });
  
  // Record duration if provided
  if (duration) {
    pipelineDuration.observe({ pipeline_name, platform, environment: environment || 'unknown' }, duration);
  }

  logger.info('Recorded pipeline metrics', { pipeline_name, platform, status, duration });

  return res.json({
    success: true,
    message: 'Pipeline metrics recorded successfully'
  });
}));

export default router;
