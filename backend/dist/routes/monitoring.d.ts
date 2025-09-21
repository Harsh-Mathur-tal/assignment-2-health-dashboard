import { Counter, Histogram, Gauge } from 'prom-client';
declare const router: import("express-serve-static-core").Router;
export declare const metrics: {
    pipelineRunsTotal: Counter<"platform" | "status" | "pipeline_name" | "environment">;
    pipelineDuration: Histogram<"platform" | "pipeline_name" | "environment">;
    activePipelinesGauge: Gauge<"platform" | "environment">;
    systemResourcesGauge: Gauge<"resource_type" | "unit">;
    alertsTotal: Counter<"channel" | "severity" | "alert_type">;
};
export default router;
//# sourceMappingURL=monitoring.d.ts.map