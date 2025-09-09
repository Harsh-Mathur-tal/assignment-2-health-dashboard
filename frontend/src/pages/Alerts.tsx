import React from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';

const Alerts: React.FC = () => {
  // Mock alert configurations
  const alertConfigs = [
    {
      id: 'alert-1',
      name: 'Frontend CI/CD - Build Failure Alert',
      pipelineName: 'Frontend CI/CD',
      alertType: 'failure',
      isActive: true,
      notificationChannels: ['slack', 'email'],
    },
    {
      id: 'alert-2',
      name: 'Backend API - Performance Alert',
      pipelineName: 'Backend API Tests',
      alertType: 'performance_degradation',
      isActive: true,
      notificationChannels: ['slack'],
    },
  ];

  // Mock alert history
  const alertHistory = [
    {
      id: 'alert-history-1',
      pipelineName: 'Backend API Tests',
      alertType: 'failure',
      severity: 'high',
      message: 'Pipeline failed on develop branch',
      timestamp: '10 minutes ago',
    },
    {
      id: 'alert-history-2',
      pipelineName: 'Frontend CI/CD',
      alertType: 'performance_degradation',
      severity: 'medium',
      message: 'Build time exceeded 5 minutes',
      timestamp: '1 hour ago',
    },
  ];

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'error';
      case 'high':
        return 'error';
      case 'medium':
        return 'warning';
      case 'low':
        return 'info';
      default:
        return 'default';
    }
  };

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Alerts
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => {
            // TODO: Open create alert dialog
          }}
        >
          Create Alert
        </Button>
      </Box>

      {/* Active Alert Configurations */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Active Alert Configurations
          </Typography>
          <TableContainer component={Paper} elevation={0}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Pipeline</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>Channels</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {alertConfigs.map((alert) => (
                  <TableRow key={alert.id} hover>
                    <TableCell>
                      <Typography variant="body2" fontWeight="medium">
                        {alert.name}
                      </Typography>
                    </TableCell>
                    <TableCell>{alert.pipelineName}</TableCell>
                    <TableCell>
                      <Chip
                        label={alert.alertType.replace('_', ' ')}
                        size="small"
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        {alert.notificationChannels.map((channel) => (
                          <Chip key={channel} label={channel} size="small" />
                        ))}
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={alert.isActive ? 'Active' : 'Inactive'}
                        size="small"
                        color={alert.isActive ? 'success' : 'default'}
                      />
                    </TableCell>
                    <TableCell>
                      <IconButton size="small">
                        <EditIcon />
                      </IconButton>
                      <IconButton size="small">
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* Alert History */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Alert History
          </Typography>
          <TableContainer component={Paper} elevation={0}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Pipeline</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>Severity</TableCell>
                  <TableCell>Message</TableCell>
                  <TableCell>Time</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {alertHistory.map((alert) => (
                  <TableRow key={alert.id} hover>
                    <TableCell>
                      <Typography variant="body2" fontWeight="medium">
                        {alert.pipelineName}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={alert.alertType.replace('_', ' ')}
                        size="small"
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={alert.severity}
                        size="small"
                        color={getSeverityColor(alert.severity) as any}
                      />
                    </TableCell>
                    <TableCell>{alert.message}</TableCell>
                    <TableCell>
                      <Typography variant="body2" color="textSecondary">
                        {alert.timestamp}
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

export default Alerts;
