import React from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Chip,
  Button,
  IconButton,
} from '@mui/material';
import {
  Add as AddIcon,
  GitHub as GitHubIcon,
  Visibility as ViewIcon,
} from '@mui/icons-material';

// Mock pipeline data
const mockPipelines = [
  {
    id: '1',
    name: 'Frontend CI/CD',
    repositoryUrl: 'https://github.com/company/frontend-app',
    platform: 'github_actions',
    status: 'active',
    metrics: {
      successRate: 96.2,
      avgBuildTime: 145,
      totalRuns: 342,
      lastRun: {
        status: 'success',
        timestamp: '2 minutes ago'
      }
    }
  },
  {
    id: '2',
    name: 'Backend API Tests',
    repositoryUrl: 'https://github.com/company/backend-api',
    platform: 'github_actions',
    status: 'active',
    metrics: {
      successRate: 94.5,
      avgBuildTime: 230,
      totalRuns: 156,
      lastRun: {
        status: 'failed',
        timestamp: '10 minutes ago'
      }
    }
  },
  // Add more mock data as needed
];

const Pipelines: React.FC = () => {
  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Pipelines
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => {
            // TODO: Open create pipeline dialog
          }}
        >
          Add Pipeline
        </Button>
      </Box>

      {/* Pipeline Grid */}
      <Grid container spacing={3}>
        {mockPipelines.map((pipeline) => (
          <Grid item xs={12} md={6} lg={4} key={pipeline.id}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <GitHubIcon sx={{ mr: 1, color: 'text.secondary' }} />
                    <Typography variant="h6" component="h3">
                      {pipeline.name}
                    </Typography>
                  </Box>
                  <Chip
                    label={pipeline.status}
                    size="small"
                    color={pipeline.status === 'active' ? 'success' : 'default'}
                  />
                </Box>

                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {pipeline.repositoryUrl}
                </Typography>

                {/* Metrics */}
                <Box sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2">Success Rate</Typography>
                    <Typography variant="body2" fontWeight="bold">
                      {pipeline.metrics.successRate}%
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2">Avg Build Time</Typography>
                    <Typography variant="body2" fontWeight="bold">
                      {Math.floor(pipeline.metrics.avgBuildTime / 60)}m {pipeline.metrics.avgBuildTime % 60}s
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2">Total Runs</Typography>
                    <Typography variant="body2" fontWeight="bold">
                      {pipeline.metrics.totalRuns}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2">Last Run</Typography>
                    <Chip
                      label={pipeline.metrics.lastRun.status}
                      size="small"
                      color={pipeline.metrics.lastRun.status === 'success' ? 'success' : 'error'}
                    />
                  </Box>
                </Box>

                {/* Actions */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="caption" color="text.secondary">
                    Last run: {pipeline.metrics.lastRun.timestamp}
                  </Typography>
                  <IconButton
                    size="small"
                    onClick={() => {
                      // TODO: Navigate to pipeline details
                    }}
                  >
                    <ViewIcon />
                  </IconButton>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Pipelines;
