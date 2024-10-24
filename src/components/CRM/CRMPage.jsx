import React, { useState, useEffect } from 'react';
import instance from '../../API';
import {
    Box,
    AppBar,
    Toolbar,
    Typography,
    Tabs,
    Tab,
    Paper,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    MenuItem,
    Grid,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    IconButton,
    Avatar,
    Chip,
    useTheme,
    alpha,
    Autocomplete
  } from '@mui/material';
  import {
    Person,
    BusinessCenter,
    Assessment,
    Receipt,
    ShoppingCart,
    Add as AddIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    Close as CloseIcon,
    LocalShipping
  } from '@mui/icons-material';

const CRMPage = () => {
  const theme = useTheme();
  const [tabValue, setTabValue] = useState(0);
  const [openDialog, setOpenDialog] = useState(false);
  const [users, setUsers] = useState([]);
  const [openOpportunityDialog, setOpenOpportunityDialog] = useState(false);

  const [formData, setFormData] = useState({
    userType: '',
    firstName: '',
    lastName: '',
    companyName: '',
    billingAddress1: '',
    billingAddress2: '',
    billingZip: '',
    billingCity: '',
    billingState: '',
    email: '',
    phoneNumber: '',
    directLine: '',
    shippingAddress1: '',
    shippingAddress2: '',
    shippingZip: '',
    shippingCity: '',
    shippingState: ''
  });

  const [opportunities, setOpportunities] = useState([
    {
      id: 0,
      user: '',
      loadType: '',
      weight: '',
      dimensions: '',
      pickupAddress: '',
      deliveryAddress: '',
      commodityName: '',
      status: ''
    }
  ]);

  const [opportunityForm, setOpportunityForm] = useState({
    user: null,
    loadType: '',
    weight: '',
    dimensions: '',
    pickupAddress: '',
    deliveryAddress: '',
    commodityName: ''
  });

  const loadTypes = [
    'LTL (Pallets)',
    'LTL (Loose)',
    'LTL (Blanket Wrap Air Ride)',
    'TL (Box Truck)',
    'TL (54 feet Trailer)'
  ];


  useEffect(()=>{
    
    const getUserData = async () => {
        console.log("getting User Data");
        const reqData = {
          "dataType": "UserData",
          "ID" : "All"
        }
        try {
          const response = await instance.post('/getData', reqData);
          console.log(JSON.parse(response.data.data));
          setUsers(JSON.parse(response.data.data));
          console.log(users[0])
          //setShowUsers(1);
        } catch (error) {
          //window.alert('Masla');
          console.error(error);
        }
    
      }

      const getOppData = async () => {
        console.log("getting Opp Data");
        const reqData = {
          "dataType": "OppData",
          "ID" : "All"
        }
        try {
          const response = await instance.post('/getData', reqData);
          console.log(JSON.parse(response.data.data));
          setOpportunities(JSON.parse(response.data.data));
          //setShowUsers(1);
        } catch (error) {
          //window.alert('Masla');
          console.error(error);
        }
    
      }
      if(tabValue === 0){
        //setShowUsers(0);
        getUserData();
      }
      else if(tabValue === 1){
        getOppData();
      }

  },[tabValue])


  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async () => {
    const newUser = {
      id: users.length + 1,
      ...formData
    };
    setUsers(prev => [...prev, newUser]);
    setOpenDialog(false);

    const UserData = {
        "id" : users.length + 1,
        "userType": formData.userType,
        "firstName": formData.firstName,
        "lastName": formData.lastName,
        "email": formData.email,
        "companyName": formData.companyName,
        "phoneNumber": formData.phoneNumber,
        "directLine": formData.directLine,
        "billingAddress": formData.billingAddress1 + " " + formData.billingAddress2,
        "billingZip": formData.billingZip,
        "billingCity": formData.billingCity,
        "billingState": formData.billingState,
        "shippingAddress" : formData.shippingAddress1 + " " + formData.shippingAddress2,
        "shippingZip": formData.shippingZip,
        "shippingCity": formData.shippingCity,
        "shippingState" : formData.shippingState,
      }
    try {
        await instance.post('/CreateUser', UserData);
        window.alert('Data has been submitted');
      } catch (error) {
        window.alert('Data not submitted');
        console.error(error);
      }

      setFormData({
        userType: '',
        firstName: '',
        lastName: '',
        companyName: '',
        billingAddress1: '',
        billingAddress2: '',
        billingZip: '',
        billingCity: '',
        billingState: '',
        email: '',
        phoneNumber: '',
        directLine: '',
        shippingAddress1: '',
        shippingAddress2: '',
        shippingZip: '',
        shippingCity: '',
        shippingState: ''
      });

  };

  const handleOpportunityChange = (field, value) => {
    setOpportunityForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleOpportunitySubmit = async () => {
    const newOpportunity = {
      id: opportunities.length + 1,
      ...opportunityForm,
      status: 'New'
    };
    setOpportunities(prev => [...prev, newOpportunity]);
    setOpenOpportunityDialog(false);

    const OppData = {
        "id" : opportunities.length + 1,
        "user": opportunityForm.user,
        "loadType": opportunityForm.loadType,
        "weight": opportunityForm.weight,
        "dimensions": opportunityForm.dimensions,
        "pickupAddress": opportunityForm.pickupAddress,
        "deliveryAddress": opportunityForm.deliveryAddress,
        "commodityName": opportunityForm.commodityName,
      }
    try {
        await instance.post('/CreateOpportunity', OppData);
        window.alert('Data has been submitted');
      } catch (error) {
        window.alert('Data not submitted');
        console.error(error);
      }

      setOpportunityForm({
        user: null,
        loadType: '',
        weight: '',
        dimensions: '',
        pickupAddress: '',
        deliveryAddress: '',
        commodityName: ''
      });
  };


  const tabItems = [
    { label: 'Users', icon: <Person /> },
    { label: 'Sales Opportunities', icon: <BusinessCenter /> },
    { label: 'Sales Estimates', icon: <Assessment /> },
    { label: 'Sales Invoice', icon: <Receipt /> },
    { label: 'Purchasing Invoice', icon: <ShoppingCart /> }
  ];

  const UsersList = () => {

        return (
            <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Users Management
                </Typography>
                <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => setOpenDialog(true)}
                sx={{
                    backgroundColor: theme.palette.primary.main,
                    '&:hover': {
                    backgroundColor: alpha(theme.palette.primary.main, 0.9),
                    }
                }}
                >
                Create New User
                </Button>
            </Box>

            <TableContainer component={Paper} elevation={0} sx={{ border: `1px solid ${theme.palette.divider}` }}>
                <Table>
                <TableHead>
                    <TableRow>
                    <TableCell>User</TableCell>
                    <TableCell>Type</TableCell>
                    <TableCell>Company</TableCell>
                    <TableCell>Contact</TableCell>
                    <TableCell align="right">Actions</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {users.map((user) => (
                    <TableRow key={user.id} hover>
                        <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Avatar sx={{ bgcolor: user.type === 'customer' ? 'primary.main' : 'secondary.main' }}>
                            {user.firstName[0]}{user.lastName[0]}
                            </Avatar>
                            <Box>
                            <Typography variant="subtitle2">{`${user.firstName} ${user.lastName}`}</Typography>
                            <Typography variant="body2" color="text.secondary">{user.email}</Typography>
                            </Box>
                        </Box>
                        </TableCell>
                        <TableCell>
                        <Chip
                            label={user.userType}
                            size="small"
                            color={user.userType === 'customer' ? 'primary' : 'secondary'}
                            sx={{ textTransform: 'capitalize' }}
                        />
                        </TableCell>
                        <TableCell>{user.companyName}</TableCell>
                        <TableCell>{user.phoneNumber}</TableCell>
                        <TableCell align="right">
                        <IconButton size="small" color="primary">
                            <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton size="small" color="error">
                            <DeleteIcon fontSize="small" />
                        </IconButton>
                        </TableCell>
                    </TableRow>
                    ))}
                </TableBody>
                </Table>
            </TableContainer>
            </Box>
        );
    }

const OpportunitiesList = () => (
        <Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Sales Opportunities
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setOpenOpportunityDialog(true)}
              sx={{
                backgroundColor: theme.palette.primary.main,
                '&:hover': {
                  backgroundColor: alpha(theme.palette.primary.main, 0.9),
                }
              }}
            >
              Create New Opportunity
            </Button>
          </Box>
    
          <TableContainer component={Paper} elevation={0} sx={{ border: `1px solid ${theme.palette.divider}` }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Customer</TableCell>
                  <TableCell>Load Type</TableCell>
                  <TableCell>Weight/Dimensions</TableCell>
                  <TableCell>Commodity</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {opportunities.map((opportunity) => (
                  <TableRow key={opportunity.id} hover>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar sx={{ bgcolor: 'primary.main' }}>
                      {opportunity.user.firstName[0]}{opportunity.user.lastName[0]}
                    </Avatar>
                    <Box>
                      <Typography variant="subtitle2">
                        {`${opportunity.user.firstName} ${opportunity.user.lastName}`}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {opportunity.user.companyName}
                      </Typography>
                    </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <LocalShipping fontSize="small" color="action" />
                        <Typography variant="body2">{opportunity.loadType}</Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">{`${opportunity.weight} lbs`}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {opportunity.dimensions}
                      </Typography>
                    </TableCell>
                    <TableCell>{opportunity.commodityName}</TableCell>
                    <TableCell>
                      <Chip
                        label={opportunity.status}
                        size="small"
                        color="primary"
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell align="right">
                      <IconButton size="small" color="primary">
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton size="small" color="error">
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      );

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <AppBar position="static" elevation={0} sx={{ bgcolor: 'background.paper', borderBottom: `1px solid ${theme.palette.divider}` }}>
        <Toolbar>
          <Typography variant="h5" sx={{ color: 'text.primary', fontWeight: 600 }}>
            CRM Dashboard
          </Typography>
        </Toolbar>
        <Tabs
          value={tabValue}
          onChange={(e, newValue) => setTabValue(newValue)}
          sx={{
            px: 2,
            '& .MuiTab-root': {
              minHeight: 64,
              textTransform: 'none'
            }
          }}
        >
          {tabItems.map((tab, index) => (
            <Tab
              key={index}
              label={tab.label}
              icon={tab.icon}
              iconPosition="start"
            />
          ))}
        </Tabs>
      </AppBar>

      <Box sx={{ p: 3, bgcolor: 'grey.50', flexGrow: 1 }}>
        {tabValue === 0 && <UsersList />}
        {tabValue === 1 && <OpportunitiesList />}
        {tabValue > 1 && (
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6">{tabItems[tabValue].label}</Typography>
            <Typography color="text.secondary" sx={{ mt: 2 }}>
              Content for {tabItems[tabValue].label} will be displayed here.
            </Typography>
          </Paper>
        )}
      </Box>

      <Dialog 
        open={openDialog} 
        onClose={() => setOpenDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle sx={{ m: 0, p: 2, pb: 1 }}>
          <Typography variant="h6">Create New User</Typography>
          <IconButton
            onClick={() => setOpenDialog(false)}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                select
                fullWidth
                label="User Type"
                name="userType"
                value={formData.userType}
                onChange={handleChange}
              >
                <MenuItem value="customer">Customer</MenuItem>
                <MenuItem value="vendor">Vendor</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="First Name"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Last Name"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Company Name"
                name="companyName"
                value={formData.companyName}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <Typography variant="subtitle2" sx={{ mb: 2 }}>Billing Address</Typography>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Address Line 1"
                    name="billingAddress1"
                    value={formData.billingAddress1}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Address Line 2"
                    name="billingAddress2"
                    value={formData.billingAddress2}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    label="Zip Code"
                    name="billingZip"
                    value={formData.billingZip}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    label="City"
                    name="billingCity"
                    value={formData.billingCity}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    label="State"
                    name="billingState"
                    value={formData.billingState}
                    onChange={handleChange}
                  />
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Email Address"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Phone Number"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Direct Line"
                name="directLine"
                value={formData.directLine}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <Typography variant="subtitle2" sx={{ mb: 2 }}>Shipping Address</Typography>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Address Line 1"
                    name="shippingAddress1"
                    value={formData.shippingAddress1}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Address Line 2"
                    name="shippingAddress2"
                    value={formData.shippingAddress2}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    label="Zip Code"
                    name="shippingZip"
                    value={formData.shippingZip}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    label="City"
                    name="shippingCity"
                    value={formData.shippingCity}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    label="State"
                    name="shippingState"
                    value={formData.shippingState}
                    onChange={handleChange}
                  />
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button 
            variant="contained"
            onClick={handleSubmit}
          >
            Create User
          </Button>
        </DialogActions>
      </Dialog>

    {/* Create Opportunity Dialog */}
    <Dialog 
        open={openOpportunityDialog} 
        onClose={() => setOpenOpportunityDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle sx={{ m: 0, p: 2, pb: 1 }}>
          <Typography variant="h6">Create New Opportunity</Typography>
          <IconButton
            onClick={() => setOpenOpportunityDialog(false)}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Autocomplete
                options={users}
                getOptionLabel={(option) => 
                  `${option.firstName} ${option.lastName} - ${option.companyName} (ID: ${option.id})`
                }
                value={opportunityForm.user}
                onChange={(event, newValue) => {
                  handleOpportunityChange('user', newValue);
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Select User"
                    fullWidth
                  />
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                select
                fullWidth
                label="Type of Load"
                value={opportunityForm.loadType}
                onChange={(e) => handleOpportunityChange('loadType', e.target.value)}
              >
                {loadTypes.map((type) => (
                  <MenuItem key={type} value={type}>
                    {type}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Weight (lbs)"
                value={opportunityForm.weight}
                onChange={(e) => handleOpportunityChange('weight', e.target.value)}
                type="number"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Dimensions (HxLxW)"
                value={opportunityForm.dimensions}
                onChange={(e) => handleOpportunityChange('dimensions', e.target.value)}
                placeholder="Example: 48x40x48"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Pick up Address"
                value={opportunityForm.pickupAddress}
                onChange={(e) => handleOpportunityChange('pickupAddress', e.target.value)}
                multiline
                rows={2}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Delivery Address"
                value={opportunityForm.deliveryAddress}
                onChange={(e) => handleOpportunityChange('deliveryAddress', e.target.value)}
                multiline
                rows={2}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Commodity Name"
                value={opportunityForm.commodityName}
                onChange={(e) => handleOpportunityChange('commodityName', e.target.value)}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setOpenOpportunityDialog(false)}>Cancel</Button>
          <Button 
            variant="contained"
            onClick={handleOpportunitySubmit}
          >
            Create Opportunity
          </Button>
        </DialogActions>
      </Dialog>

    </Box>
  );
};

export default CRMPage;