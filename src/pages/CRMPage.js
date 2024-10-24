import React, { useState, useEffect } from 'react';
import { AppBar, Tabs, Tab, Box, Button, Typography, TextField, MenuItem, Grid, Paper, CircularProgress, List, ListItem, ListItemButton } from '@mui/material';
import instance from '../API';
// Dummy TabPanel Component for each tab
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

// Main App Component
function CRMPage() {
  const [tabIndex, setTabIndex] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [userType, setUserType] = useState('');
  const [showUsers, setShowUsers] = useState(0);
  const [users, setUsers] = useState([]); // Store fetched users data
  const [loading, setLoading] = useState(false); // Track loading state

  const handleTabChange = (event, newIndex) => {
    setTabIndex(newIndex);
    setShowForm(false); // Reset form on tab change
  };

  const handleCreateNewUser = () => {
    setShowForm(true);
  };

  const getUserData = async () => {
    const reqData = {
      "dataType": "UserData",
      "ID" : "All"
    }
    try {
      const response = await instance.post('/getData', reqData);
      console.log(JSON.parse(response.data.data));
      setUsers(JSON.parse(response.data.data));
      setShowUsers(1);
    } catch (error) {
      window.alert('Masla');
      console.error(error);
    }

  }

  const handleUserClick = (user) => {
    // Example: alert user's name and email
    alert(`User: ${user.firstName} ${user.lastName}\nEmail: ${user.emailAddress}`);
    // You can replace this with any action, such as navigating to a user details page, opening a modal, etc.
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      {/* Tabs Navigation */}
      <AppBar position="static">
        <Tabs value={tabIndex} onChange={handleTabChange}>
          <Tab label="Users" value={0} />
          <Tab label="Sales Opportunities" value={1} />
          <Tab label="Sales Estimates" value={2} />
          <Tab label="Sales Invoice" value={3} />
          <Tab label="Purchasing Invoice" value={4} />
        </Tabs>
      </AppBar>

      {/* Render content only when a tab is selected */}
      {tabIndex === 0 && (
        <Box>
          {/* Users Tab Content */}
          {!showForm ? (
            <>
              {/* <Typography variant="h6">User List</Typography> */}
              {/* Display loading spinner while data is being fetched */}

              {showUsers===1 ? 
              loading ? (
                <CircularProgress />
              ) : (
                <Box>
                  {users.length > 0 ? (
                    <List>
                    {users.map((user, index) => (
                      <ListItem key={index}>
                        <ListItemButton onClick={() => handleUserClick(user)}>
                          {user.firstName} {user.lastName} - {user.emailAddress}
                        </ListItemButton>
                      </ListItem>
                    ))}
                  </List>
                  ) : (
                    <Typography>No users available</Typography>
                  )}
                </Box>
              ): null}
              <Button variant="contained" color="primary" onClick={getUserData}>
                Get Users List
              </Button>
              <Button variant="contained" color="primary" onClick={handleCreateNewUser}>
                Create New User
              </Button>
            </>
          ) : (
            <UserForm />
          )}
        </Box>
      )}

      {tabIndex === 1 && <Typography>Sales Opportunities Content</Typography>}
      {tabIndex === 2 && <Typography>Sales Estimates Content</Typography>}
      {tabIndex === 3 && <Typography>Sales Invoice Content</Typography>}
      {tabIndex === 4 && <Typography>Purchasing Invoice Content</Typography>}
    </Box>
  );
}

// User Form Component
function UserForm() {

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [billingAddress, setBillingAddress] = useState('');
  const [billingAddress2, setBillingAddress2] = useState('');
  const [billingZipCode, setBillingZipCode] = useState('');
  const [billingState, setBillingState] = useState('');
  const [billingCity, setBillingCity] = useState('');
  const [emailAddress, setEmailAddress] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [directLine, setDirectLine] = useState('');
  const [shippingAdd1, setShippingAdd1] = useState('');
  const [shippingAdd2, setShippingAdd2] = useState('');
  const [shippingState, setShippingState] = useState('');
  const [shippingZipCode, setShippingZipCode] = useState('');
  const [shippingCity, setShippingCity] = useState('');
  const [userType, setUserType] = useState('');


  const handleChange = (e) => {
      switch (e.target.id) {
        case 'firstName':
          setFirstName(e.target.value);
          break;
        case 'lastName':
          setLastName(e.target.value);
          break;
        case 'companyName':
          setCompanyName(e.target.value);
          break;
        case 'billingAddress':
          setBillingAddress(e.target.value);
          break;
        case 'billingAddress2':
          setBillingAddress2(e.target.value);
          break;
        case 'billingZipCode':
          setBillingZipCode(e.target.value);
          break;
        case 'billingCity':
          setBillingCity(e.target.value);
          break;
        case 'billingState':
          setBillingState(e.target.value);
          break;
        case 'emailAddress':
          setEmailAddress(e.target.value);
          break;
        case 'phoneNumber':
          setPhoneNumber(e.target.value);
          break;
        case 'directLine':
          setDirectLine(e.target.value);
          break;
        case 'shippingAddLine1':
          setShippingAdd1(e.target.value);
          break;
        case 'shippingAddLine2':
          setShippingAdd2(e.target.value);
          break;
        case 'shippingZipCode':
          setShippingZipCode(e.target.value);
          break;
        case 'shippingCity':
          setShippingCity(e.target.value);
          break;
        case 'shippingState':
          setShippingState(e.target.value);
          break;
        default:
          break;
      }
    };

    const handleSubmit = async (e)=> {
      const UserData = {
        "firstName": firstName,
        "lastName": lastName,
        "emailAddress": emailAddress,
        "companyName": companyName,
        "phoneNumber": phoneNumber,
        "directLine": directLine,
        "billingAddress": billingAddress + " " + billingAddress2,
        "billingZipCode": billingZipCode,
        "billingCity": billingCity,
        "billingState": billingState,
        "shippingAddress" : shippingAdd1 + " " + shippingAdd2,
        "shippingZipCode": shippingZipCode,
        "shippingCity": shippingCity,
        "shippingState" : shippingState,
      }

      try {
        await instance.post('/CreateUser', UserData);
        window.alert('Data has been submitted');
      } catch (error) {
        window.alert('Data not submitted');
        console.error(error);
      }

    }

  return (
    <Paper elevation={3} sx={{ padding: 3 }}>
      <Typography variant="h5" gutterBottom>Create New User</Typography>
      <form>
        <Grid container spacing={2}>
          {/* User Type */}
          <Grid item xs={12}>
            <TextField
              select
              label="User Type"
              fullWidth
              value={userType}
              onChange={(e) => setUserType(e.target.value)}
            >
              <MenuItem value="customer">Customer</MenuItem>
              <MenuItem value="vendor">Vendor</MenuItem>
            </TextField>
          </Grid>

          {/* First Name */}
          <Grid item xs={12} sm={6}>
            <TextField 
                id='firstName'
                label="First Name" 
                fullWidth 
                value={firstName}
                onChange={handleChange}/>
          </Grid>

          {/* Last Name */}
          <Grid item xs={12} sm={6}>
            <TextField 
                id='lastName'
                label="Last Name" 
                fullWidth 
                value={lastName}
                onChange={handleChange}/>
          </Grid>

          {/* Company Name */}
          <Grid item xs={12}>
            <TextField 
              id='companyName'
              label="Company Name" 
              fullWidth 
              value={companyName}
              onChange={handleChange}/>
          </Grid>

          {/* Billing Address */}
          <Grid item xs={12}>
            <TextField 
            id='billingAddress'
            label="Billing Address Line 1" 
            fullWidth 
            value={billingAddress}
            onChange={handleChange}/>
          </Grid>
          <Grid item xs={12}>
            <TextField 
            id='billingAddress2'
            label="Billing Address Line 2" 
            fullWidth 
            value={billingAddress2}
            onChange={handleChange}/>
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField 
              id='billingZipCode'
              label="Billing Zip Code" 
              fullWidth 
              value={billingZipCode}
              onChange={handleChange}/>
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField 
            id='billingCity'
            label="Billing City" 
            fullWidth 
            value={billingCity}
            onChange={handleChange}/>
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField 
            id='billingState'
            label="Billing State" 
            fullWidth 
            value={billingState}
            onChange={handleChange}/>
          </Grid>

          {/* Email Address */}
          <Grid item xs={12}>
            <TextField 
            id='emailAddress'
            label="Email Address" 
            fullWidth 
            value={emailAddress}
            onChange={handleChange}/>
          </Grid>

          {/* Phone Number */}
          <Grid item xs={12} sm={6}>
            <TextField 
            id='phoneNumber'
            label="Phone Number" 
            fullWidth 
            value={phoneNumber}
            onChange={handleChange}/>
          </Grid>

          {/* Direct Line */}
          <Grid item xs={12} sm={6}>
            <TextField 
            id='directLine'
            label="Direct Line" 
            fullWidth 
            value={directLine}
            onChange={handleChange}/>
          </Grid>

          {/* Shipping Address */}
          <Grid item xs={12}>
            <TextField 
            id='shippingAddLine1'
            label="Shipping Address Line 1" 
            fullWidth 
            value={shippingAdd1}
            onChange={handleChange}/>
          </Grid>
          <Grid item xs={12}>
            <TextField 
            id='shippingAddLine2'
            label="Shipping Address Line 2" 
            fullWidth 
            value={shippingAdd2}
            onChange={handleChange}/>
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField 
            id='shippingZipCode'
            label="Shipping Zip Code" 
            fullWidth 
            value={shippingZipCode}
            onChange={handleChange}/>
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField 
            id='shippingCity'
            label="Shipping City" 
            fullWidth 
            value={shippingCity}
            onChange={handleChange}/>
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField 
            id='shippingState'
            label="Shipping State" 
            fullWidth 
            value={shippingState}
            onChange={handleChange}/>
          </Grid>

          {/* Submit Button */}
          <Grid item xs={12}>
            <Button 
              variant="contained" 
              color="primary" 
              fullWidth
              onClick={handleSubmit}>
              Submit
            </Button>
          </Grid>
        </Grid>
      </form>
    </Paper>
  );
}

export default CRMPage;