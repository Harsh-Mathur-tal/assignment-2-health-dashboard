import React from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  TextField,
  Button,
  Divider,
  Switch,
  FormControlLabel,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Chip,
} from '@mui/material';
import {
  Save as SaveIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
  CheckCircle as TestIcon,
} from '@mui/icons-material';

const Settings: React.FC = () => {
  // Mock integrations
  const integrations = [
    {
      id: 'integration-1',
      name: 'GitHub Actions',
      platform: 'github_actions',
      status: 'connected',
    },
    {
      id: 'integration-2',
      name: 'Company Jenkins',
      platform: 'jenkins',
      status: 'connected',
    },
  ];

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Settings
      </Typography>

      <Grid container spacing={3}>
        {/* User Profile */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                User Profile
              </Typography>
              <Box component="form" sx={{ '& .MuiTextField-root': { mb: 2 } }}>
                <TextField
                  fullWidth
                  label="First Name"
                  defaultValue="John"
                  variant="outlined"
                />
                <TextField
                  fullWidth
                  label="Last Name"
                  defaultValue="Doe"
                  variant="outlined"
                />
                <TextField
                  fullWidth
                  label="Email"
                  defaultValue="john.doe@company.com"
                  variant="outlined"
                  disabled
                />
                <Button
                  variant="contained"
                  startIcon={<SaveIcon />}
                  sx={{ mt: 1 }}
                >
                  Save Changes
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Notification Settings */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Notification Settings
              </Typography>
              <Box>
                <FormControlLabel
                  control={<Switch defaultChecked />}
                  label="Email notifications"
                />
                <FormControlLabel
                  control={<Switch defaultChecked />}
                  label="Slack notifications"
                />
                <FormControlLabel
                  control={<Switch />}
                  label="SMS notifications"
                />
                <FormControlLabel
                  control={<Switch defaultChecked />}
                  label="Browser notifications"
                />
              </Box>
              <Divider sx={{ my: 2 }} />
              <TextField
                fullWidth
                label="Default Slack Channel"
                defaultValue="#dev-alerts"
                variant="outlined"
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                label="Email Address"
                defaultValue="john.doe@company.com"
                variant="outlined"
                sx={{ mb: 2 }}
              />
              <Button
                variant="contained"
                startIcon={<SaveIcon />}
              >
                Save Settings
              </Button>
            </CardContent>
          </Card>
        </Grid>

        {/* Integrations */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">
                  CI/CD Integrations
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={() => {
                    // TODO: Open add integration dialog
                  }}
                >
                  Add Integration
                </Button>
              </Box>
              
              <List>
                {integrations.map((integration) => (
                  <ListItem key={integration.id}>
                    <ListItemText
                      primary={integration.name}
                      secondary={`Platform: ${integration.platform}`}
                    />
                    <Box sx={{ mr: 2 }}>
                      <Chip
                        label={integration.status}
                        size="small"
                        color={integration.status === 'connected' ? 'success' : 'error'}
                      />
                    </Box>
                    <ListItemSecondaryAction>
                      <IconButton edge="end" aria-label="test">
                        <TestIcon />
                      </IconButton>
                      <IconButton edge="end" aria-label="delete">
                        <DeleteIcon />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* System Settings */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                System Settings
              </Typography>
              <Box sx={{ '& .MuiTextField-root': { mb: 2 } }}>
                <TextField
                  fullWidth
                  label="Refresh Interval (seconds)"
                  type="number"
                  defaultValue="30"
                  variant="outlined"
                />
                <TextField
                  fullWidth
                  label="Data Retention (days)"
                  type="number"
                  defaultValue="90"
                  variant="outlined"
                />
                <FormControlLabel
                  control={<Switch defaultChecked />}
                  label="Real-time updates"
                />
                <FormControlLabel
                  control={<Switch defaultChecked />}
                  label="Auto-refresh dashboard"
                />
                <Button
                  variant="contained"
                  startIcon={<SaveIcon />}
                  sx={{ mt: 1 }}
                >
                  Save Settings
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* API Settings */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                API Settings
              </Typography>
              <Box sx={{ '& .MuiTextField-root': { mb: 2 } }}>
                <TextField
                  fullWidth
                  label="API Timeout (ms)"
                  type="number"
                  defaultValue="10000"
                  variant="outlined"
                />
                <TextField
                  fullWidth
                  label="Rate Limit (requests/min)"
                  type="number"
                  defaultValue="100"
                  variant="outlined"
                />
                <FormControlLabel
                  control={<Switch defaultChecked />}
                  label="Enable API logging"
                />
                <FormControlLabel
                  control={<Switch />}
                  label="Debug mode"
                />
                <Button
                  variant="contained"
                  startIcon={<SaveIcon />}
                  sx={{ mt: 1 }}
                >
                  Save Settings
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Settings;
