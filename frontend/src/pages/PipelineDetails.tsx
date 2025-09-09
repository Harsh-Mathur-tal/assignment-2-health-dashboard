import React from 'react';
import { useParams } from 'react-router-dom';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';

const PipelineDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  // Mock pipeline details
  const pipeline = {
    id: id,
    name: 'Frontend CI/CD',
    repositoryUrl: 'https://github.com/company/frontend-app',
    platform: 'github_actions',
    status: 'active',
    metrics: {
      successRate: 96.2,
      avgBuildTime: 145,
      totalRuns: 342,
    },
  };

  const recentRuns = [
    {
      id: 'run-342',
      runNumber: 342,
      status: 'success',
      duration: 165,
      branch: 'main',
      commitSha: 'abc123def456',
      triggeredBy: 'john.doe@company.com',
      timestamp: '2 minutes ago',
    },
    {
      id: 'run-341',
      runNumber: 341,
      status: 'failed',
      duration: 90,
      branch: 'develop',
      commitSha: 'def456ghi789',
      triggeredBy: 'jane.smith@company.com',
      timestamp: '10 minutes ago',
    },
  ];

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          {pipeline.name}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          {pipeline.repositoryUrl}
        </Typography>
      </Box>

      {/* Metrics Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Success Rate
              </Typography>
              <Typography variant="h4">{pipeline.metrics.successRate}%</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Avg Build Time
              </Typography>
              <Typography variant="h4">
                {Math.floor(pipeline.metrics.avgBuildTime / 60)}m {pipeline.metrics.avgBuildTime % 60}s
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total Runs
              </Typography>
              <Typography variant="h4">{pipeline.metrics.totalRuns}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Status
              </Typography>
              <Chip label={pipeline.status} color="success" />
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Recent Runs */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Recent Runs
          </Typography>
          <TableContainer component={Paper} elevation={0}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Run #</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Duration</TableCell>
                  <TableCell>Branch</TableCell>
                  <TableCell>Commit</TableCell>
                  <TableCell>Triggered By</TableCell>
                  <TableCell>Time</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {recentRuns.map((run) => (
                  <TableRow key={run.id} hover>
                    <TableCell>#{run.runNumber}</TableCell>
                    <TableCell>
                      <Chip
                        label={run.status}
                        size="small"
                        color={run.status === 'success' ? 'success' : 'error'}
                      />
                    </TableCell>
                    <TableCell>
                      {Math.floor(run.duration / 60)}m {run.duration % 60}s
                    </TableCell>
                    <TableCell>
                      <Chip label={run.branch} size="small" variant="outlined" />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                        {run.commitSha.substring(0, 8)}
                      </Typography>
                    </TableCell>
                    <TableCell>{run.triggeredBy}</TableCell>
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

export default PipelineDetails;
