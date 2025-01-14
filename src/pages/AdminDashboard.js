import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Typography, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper,
  Box,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Pagination,
  Button
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'; // Import the date adapter
import { useAuth } from '../context/AuthContext';
import instance from '../API';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const { user,isAdmin } = useAuth();
  const [logs, setLogs] = useState([]);
  const navigate = useNavigate();
  const [filters, setFilters] = useState({
    page: 1,
    limit: 10,
    action: '',
    startDate: null,
    endDate: null
  });
  const [totalPages, setTotalPages] = useState(0);
  const [isEnabled, setIsEnabled] = useState(false);

  const openCRM = () => {
    //console.log("hererere");
    navigate('/crm');
  }

    // State to manage the toggle

  
    // Function to handle toggle change
    const handleToggleChange = (newValue) => {
      // Update the state
      setIsEnabled(newValue);
  
      // Call your function with the new value
      updatePermission(newValue);
    };
  
    // Function to update permission (replace with your actual implementation)
    const updatePermission = async (value) => {

      console.log(`Permission ${value}`);
      // Add your API call or logic here
      try {
        const response = await instance.post('/editingPermission', {
        "user" : user,
        "editing" : value
      });
      } catch(err){
        console.log(err);
      }
    };
  

  // Fetch activity logs
  const fetchActivityLogs = async () => {
    try {
      const response = await instance.get('/api/admin/logs', {
        params: {
          ...filters,
          startDate: filters.startDate?.toISOString(),
          endDate: filters.endDate?.toISOString()
        }
      });

      setLogs(response.data.logs);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error('Error fetching logs', error);
    }
  };

  // Effect to fetch logs
  useEffect(() => {
    if (isAdmin) {
      fetchActivityLogs();
    }
  }, [filters, isAdmin]);

  // Render component
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}> {/* Wrap with LocalizationProvider */}
      <Container maxWidth="xl">
        <Typography variant="h4" sx={{ my: 3 }}>
          Admin Activity Dashboard
        </Typography>

        {/* Filters */}
        <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
          {/* Action Filter */}
          <FormControl variant="outlined" sx={{ minWidth: 200 }}>
            <InputLabel>Action Type</InputLabel>
            <Select
              value={filters.action}
              onChange={(e) => setFilters(prev => ({
                ...prev, 
                action: e.target.value
              }))}
              label="Action Type"
            >
              <MenuItem value="">All Actions</MenuItem>
              {/* <MenuItem value="LOGIN">Login</MenuItem>
              <MenuItem value="LOGOUT">Logout</MenuItem> */}
              <MenuItem value="CREATE_USER">Create User</MenuItem>
              <MenuItem value="UPDATE_USER">Update User</MenuItem>
              <MenuItem value="CREATE_OPPORTUNITY">Create Opportunity</MenuItem>
              <MenuItem value="UPDATE_OPPORTUNITY">Update Opportunity</MenuItem>
              <MenuItem value="CREATE_EXPENSE">Create Expense</MenuItem>
              <MenuItem value="EDIT_PERMISSIONS">Edit Permissions</MenuItem>
              {/* Add more action types */}
            </Select>
          </FormControl>

          {/* <Button onSubmit={openCRM()}>Open CRM</Button> */}

          {/* Date Range Filters */}
          <DatePicker
            label="Start Date"
            value={filters.startDate}
            onChange={(date) => setFilters(prev => ({
              ...prev, 
              startDate: date
            }))}
          />
          <DatePicker
            label="End Date"
            value={filters.endDate}
            onChange={(date) => setFilters(prev => ({
              ...prev, 
              endDate: date
            }))}
          />

          <Button variant='contained' color='primary' onClick={openCRM}>Open CRM</Button>

          <Button
              variant="contained"
              color={isEnabled ? "error" : "success"}
              onClick={() => handleToggleChange(!isEnabled)}
            >
              {isEnabled ? "Disable Editting" : "Enable Editting"}
          </Button>  

        </ Box>

        {/* Activity Log Table */}
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>User</TableCell>
                <TableCell>Action</TableCell>
                <TableCell>Details</TableCell>
                <TableCell>Timestamp</TableCell>
                {/* <TableCell>IP Address</TableCell>
                <TableCell>Location</TableCell> */}
              </TableRow>
            </TableHead>
            <TableBody>
              {logs.map((log) => (
                <TableRow key={log._id}>
                  <TableCell>{log.user.name}</TableCell>
                  <TableCell>{log.action}</TableCell>
                  <TableCell>
                    {JSON.stringify(log.details)}
                  </TableCell>
                  <TableCell>
                    {new Date(log.timestamp).toLocaleString()}
                  </TableCell>
                  {/* <TableCell>{log.ipAddress}</TableCell>
                  <TableCell>{log.location.city}, {log.location.country}</TableCell> */}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Pagination */}
        <Pagination
          count={totalPages}
          page={filters.page}
          onChange={(event, value) => setFilters(prev => ({ ...prev, page: value }))}
          sx={{ mt: 3 }}
        />
      </Container>
    </LocalizationProvider> 
  );
};

export default AdminDashboard;