import React from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  LinearProgress,
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  Schedule,
  CheckCircle,
  Error,
  Warning,
  Refresh,
} from '@mui/icons-material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

// Mock data
const overviewData = {
  totalPipelines: 25,
  activePipelines: 22,
  totalRuns: 1247,
  successRate: 94.5,
  avgBuildTime: 180,
  lastUpdateTime: new Date(),
};

const trendData = [
  { date: '2024-01-01', successRate: 92, avgBuildTime: 165 },
  { date: '2024-01-02', successRate: 94, avgBuildTime: 170 },
  { date: '2024-01-03', successRate: 96, avgBuildTime: 155 },
  { date: '2024-01-04', successRate: 93, avgBuildTime: 180 },
  { date: '2024-01-05', successRate: 95, avgBuildTime: 175 },
  { date: '2024-01-06', successRate: 97, avgBuildTime: 160 },
  { date: '2024-01-07', successRate: 94, avgBuildTime: 185 },
];

const recentRuns = [
  {
    id: 'run-123',
    pipelineName: 'Frontend CI/CD',
    status: 'success',
    duration: 165,
    branch: 'main',
    timestamp: '2 min ago',
  },
  {
    id: 'run-124',
    pipelineName: 'Backend API Tests',
    status: 'failed',
    duration: 90,
    branch: 'develop',
    timestamp: '5 min ago',
  },
  {
    id: 'run-125',
    pipelineName: 'E2E Tests',
    status: 'running',
    duration: 240,
    branch: 'main',
    timestamp: '7 min ago',
  },
  {
    id: 'run-126',
    pipelineName: 'Mobile Build',
    status: 'success',
    duration: 380,
    branch: 'release',
    timestamp: '15 min ago',
  },
];

const statusColors = {
  success: '#4caf50',
  failed: '#f44336',
  running: '#ff9800',
  pending: '#9e9e9e',
};

const pieData = [
  { name: 'Success', value: 85, color: '#4caf50' },
  { name: 'Failed', value: 10, color: '#f44336' },
  { name: 'Running', value: 3, color: '#ff9800' },
  { name: 'Pending', value: 2, color: '#9e9e9e' },
];

const MetricCard: React.FC<{
  title: string;
  value: string | number;
  change?: number;
  icon: React.ReactNode;
}> = ({ title, value, change, icon }) => (
  <Card>
    <CardContent>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box>
          <Typography color="textSecondary" gutterBottom>
            {title}
          </Typography>
          <Typography variant="h4" component="div">
            {value}
          </Typography>
          {change !== undefined && (
            <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
              {change > 0 ? (
                <TrendingUp sx={{ color: 'success.main', mr: 0.5 }} />
              ) : (
                <TrendingDown sx={{ color: 'error.main', mr: 0.5 }} />
              )}
              <Typography
                variant="body2"
                color={change > 0 ? 'success.main' : 'error.main'}
              >
                {Math.abs(change)}%
              </Typography>
            </Box>
          )}
        </Box>
        <Box sx={{ color: 'primary.main' }}>
          {icon}
        </Box>
      </Box>
    </CardContent>
  </Card>
);

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'success':
      return <CheckCircle sx={{ color: statusColors.success }} />;
    case 'failed':
      return <Error sx={{ color: statusColors.failed }} />;
    case 'running':
      return <Warning sx={{ color: statusColors.running }} />;
    default:
      return <Schedule sx={{ color: statusColors.pending }} />;
  }
};

const Dashboard: React.FC = () => {
  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Dashboard
        </Typography>
        <IconButton>
          <Refresh />
        </IconButton>
      </Box>

      {/* Overview Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Total Pipelines"
            value={overviewData.totalPipelines}
            icon={<TrendingUp sx={{ fontSize: 40 }} />}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Active Pipelines"
            value={overviewData.activePipelines}
            change={5}
            icon={<CheckCircle sx={{ fontSize: 40 }} />}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Success Rate"
            value={`${overviewData.successRate}%`}
            change={2.3}
            icon={<TrendingUp sx={{ fontSize: 40 }} />}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Avg Build Time"
            value={`${Math.floor(overviewData.avgBuildTime / 60)}m ${overviewData.avgBuildTime % 60}s`}
            change={-5}
            icon={<Schedule sx={{ fontSize: 40 }} />}
          />
        </Grid>
      </Grid>

      {/* Charts */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Success Rate Trend
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="successRate" stroke="#1976d2" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Pipeline Status Distribution
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Recent Pipeline Runs */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Recent Pipeline Runs
          </Typography>
          <TableContainer component={Paper} elevation={0}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Pipeline</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Duration</TableCell>
                  <TableCell>Branch</TableCell>
                  <TableCell>Time</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {recentRuns.map((run) => (
                  <TableRow key={run.id} hover>
                    <TableCell>
                      <Typography variant="body2" fontWeight="medium">
                        {run.pipelineName}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        {getStatusIcon(run.status)}
                        <Chip
                          label={run.status}
                          size="small"
                          sx={{
                            ml: 1,
                            backgroundColor: statusColors[run.status as keyof typeof statusColors] + '20',
                            color: statusColors[run.status as keyof typeof statusColors],
                          }}
                        />
                      </Box>
                    </TableCell>
                    <TableCell>
                      {run.status === 'running' ? (
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <LinearProgress sx={{ width: 60, mr: 1 }} />
                          <Typography variant="body2">
                            {Math.floor(run.duration / 60)}m {run.duration % 60}s
                          </Typography>
                        </Box>
                      ) : (
                        `${Math.floor(run.duration / 60)}m ${run.duration % 60}s`
                      )}
                    </TableCell>
                    <TableCell>
                      <Chip label={run.branch} size="small" variant="outlined" />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="textSecondary">
                        {run.timestamp}
                      </Typography>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Dashboard;
