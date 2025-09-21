"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRole = exports.AlertSeverity = exports.NotificationType = exports.AlertType = exports.AggregationPeriod = exports.MetricType = exports.RunStatus = exports.PipelineStatus = exports.PipelinePlatform = void 0;
var PipelinePlatform;
(function (PipelinePlatform) {
    PipelinePlatform["GITHUB_ACTIONS"] = "github_actions";
    PipelinePlatform["JENKINS"] = "jenkins";
    PipelinePlatform["GITLAB_CI"] = "gitlab_ci";
    PipelinePlatform["AZURE_DEVOPS"] = "azure_devops";
})(PipelinePlatform || (exports.PipelinePlatform = PipelinePlatform = {}));
var PipelineStatus;
(function (PipelineStatus) {
    PipelineStatus["ACTIVE"] = "active";
    PipelineStatus["INACTIVE"] = "inactive";
    PipelineStatus["ARCHIVED"] = "archived";
})(PipelineStatus || (exports.PipelineStatus = PipelineStatus = {}));
var RunStatus;
(function (RunStatus) {
    RunStatus["PENDING"] = "pending";
    RunStatus["QUEUED"] = "queued";
    RunStatus["RUNNING"] = "running";
    RunStatus["SUCCESS"] = "success";
    RunStatus["FAILURE"] = "failure";
    RunStatus["CANCELLED"] = "cancelled";
    RunStatus["TIMEOUT"] = "timeout";
})(RunStatus || (exports.RunStatus = RunStatus = {}));
var MetricType;
(function (MetricType) {
    MetricType["SUCCESS_RATE"] = "success_rate";
    MetricType["FAILURE_RATE"] = "failure_rate";
    MetricType["AVG_BUILD_TIME"] = "avg_build_time";
    MetricType["BUILD_COUNT"] = "build_count";
    MetricType["FAILURE_COUNT"] = "failure_count";
    MetricType["QUEUE_TIME"] = "queue_time";
})(MetricType || (exports.MetricType = MetricType = {}));
var AggregationPeriod;
(function (AggregationPeriod) {
    AggregationPeriod["HOUR"] = "hour";
    AggregationPeriod["DAY"] = "day";
    AggregationPeriod["WEEK"] = "week";
    AggregationPeriod["MONTH"] = "month";
})(AggregationPeriod || (exports.AggregationPeriod = AggregationPeriod = {}));
var AlertType;
(function (AlertType) {
    AlertType["FAILURE"] = "failure";
    AlertType["PERFORMANCE_DEGRADATION"] = "performance_degradation";
    AlertType["SUCCESS_RATE_DROP"] = "success_rate_drop";
    AlertType["BUILD_TIME_INCREASE"] = "build_time_increase";
    AlertType["CONSECUTIVE_FAILURES"] = "consecutive_failures";
})(AlertType || (exports.AlertType = AlertType = {}));
var NotificationType;
(function (NotificationType) {
    NotificationType["SLACK"] = "slack";
    NotificationType["EMAIL"] = "email";
    NotificationType["DISCORD"] = "discord";
    NotificationType["TEAMS"] = "teams";
    NotificationType["WEBHOOK"] = "webhook";
    NotificationType["SMS"] = "sms";
})(NotificationType || (exports.NotificationType = NotificationType = {}));
var AlertSeverity;
(function (AlertSeverity) {
    AlertSeverity["LOW"] = "low";
    AlertSeverity["MEDIUM"] = "medium";
    AlertSeverity["HIGH"] = "high";
    AlertSeverity["CRITICAL"] = "critical";
})(AlertSeverity || (exports.AlertSeverity = AlertSeverity = {}));
var UserRole;
(function (UserRole) {
    UserRole["ADMIN"] = "admin";
    UserRole["DEVELOPER"] = "developer";
    UserRole["USER"] = "user";
    UserRole["VIEWER"] = "viewer";
})(UserRole || (exports.UserRole = UserRole = {}));
//# sourceMappingURL=index.js.map