import React, { useState, useEffect } from 'react';
import axios from 'axios';
import instance from '../../API';
import {useAuth} from '../../context/AuthContext'
import { useNavigate } from 'react-router-dom';
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
    FilledInput,
    MenuItem,
    Select,
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
    Autocomplete,
    Checkbox,
    InputAdornment,
    CircularProgress,
    FormControl,
    InputLabel
    
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
    Details as DetailsIcon,
    Check,
    LocalShipping,
    Airlines,
    CheckBox,
    AccountBalance as AccountBalanceIcon,
    ContactSupportOutlined,
    AccountBalanceWallet as AccountBalanceWalletIcon
  } from '@mui/icons-material';

const CRMPage = () => {

  const { user, isAuthenticated, isAdmin, login, logout } = useAuth();
  const navigate = useNavigate();

  console.log(user);
  console.log(isAdmin);
  const theme = useTheme();
  const [tabValue, setTabValue] = useState(0);
  const [openDialog, setOpenDialog] = useState(false);
  const [openUserDetails, setOpenUserDetails] = useState(false);
  const [users, setUsers] = useState([]);
  const [openOpportunityDialog, setOpenOpportunityDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedOpportunity, setSelectedOpportunity] = useState(null);
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const [selectedCarriers, setSelectedCarriers] = useState({});
  const [inventoryID, setInventoryID] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reloadOpp, setReloadOpp] = useState(false);
  const [reloadUser, setReloadUser] = useState(false);
  const [reloadExpenses, setReloadExpenses] = useState(false);
  // const [isAdminEditMode, setIsAdminEditMode] = useState(false);
  const [inventoryDetails, setInventoryDetails] = useState([
    {
      id : 0,
      inventoryType : [],
      units : '',
      handlingUnit : [],
      peices : '',
      weight : '',
      weightUnit : '',
      Length : '',
      Width : '',
      Height : '',
      volume : '',
      dimUnit : '',
      class : '',
      NMFC : '',
      commodityName : ''
    }
  ]);

  const deliveryAccessorialOptions = 
  [
    { value: "delivery-appointment", label: "Delivery Appointment" },
    { value: "residential-delivery", label: "Residential Delivery" },
    { value: "notify-consignee", label: "Notify Consignee" },
    { value: "limited-access-delivery", label: "Limited Access Delivery" },
    { value: "lift-gate-delivery", label: "Lift Gate Delivery" },
    { value: "hazardous-material", label: "Hazardous Material" },
    { value: "excessive-length-20ft", label: "Excessive Length, 20ft" },
    { value: "excessive-length-15ft", label: "Excessive Length, 15ft" },
    { value: "excessive-length-14ft", label: "Excessive Length, 14ft" },
    { value: "excessive-length-12ft", label: "Excessive Length, 12ft" },
    { value: "excessive-length-10ft", label: "Excessive Length, 10ft" },
    { value: "excessive-length-8ft", label: "Excessive Length, 8ft" },
    { value: "inside-delivery", label: "Inside Delivery" },
    { value: "trade-show-delivery", label: "Trade Show Delivery" },
    { value: "construction-site-delivery", label: "Construction Site Delivery" },
    { value: "dock-pickup-(will-call)", label: "Dock Pickup (Will Call)" },
    { value: "sort/segregate-delivery", label: "Sort/Segregate Delivery" },
    { value: "container-freight-station-delivery", label: "Container Freight Station Delivery" },
    { value: "farm-delivery", label: "Farm Delivery" },
    { value: "airport-delivery", label: "Airport Delivery" },
    { value: "camp-delivery", label: "Camp Delivery" },
    { value: "church-delivery", label: "Church Delivery" },
    { value: "country-club-delivery", label: "Country Club Delivery" },
    { value: "school-delivery", label: "School Delivery" },
    { value: "government-site-delivery", label: "Government Site Delivery" },
    { value: "hospital-delivery", label: "Hospital Delivery" },
    { value: "hotel-delivery", label: "Hotel Delivery" },
    { value: "prison-delivery", label: "Prison Delivery" },
    { value: "misc-freight-charge", label: "Misc Freight Charge" },
    { value: "utility-site-delivery", label: "Utility Site Delivery" },
    { value: "pier-delivery", label: "Pier Delivery" },
    { value: "military-installation-delivery", label: "Military Installation Delivery" },
    { value: "excessive-length-6ft", label: "Excessive Length, 6ft" },
    { value: "grocery-warehouse-delivery", label: "Grocery Warehouse Delivery" },
    { value: "residential-direct-no-signature", label: "Residential Direct No Signature" },
    { value: "residential-direct-threshold", label: "Residential Direct Threshold" },
    { value: "residential-direct-room-of-choice-service", label: "Residential Direct Room of Choice Service" },
    { value: "residential-direct-white-glove-service", label: "Residential Direct White Glove Service" },
    { value: "mine-site-delivery", label: "Mine Site Delivery" },
    { value: "residential-direct-white-glove-service-20-min", label: "Residential Direct White Glove Service 20 min" },
    { value: "residential-direct-white-glove-service-30-min", label: "Residential Direct White Glove Service 30 min" },
    { value: "residential-direct-white-glove-service-45-min", label: "Residential Direct White Glove Service 45 min" },
    { value: "residential-direct-white-glove-service-60-min", label: "Residential Direct White Glove Service 60 min" },
    { value: "2-man-delivery", label: "2 Man Delivery" },
    { value: "3-man-delivery", label: "3 Man Delivery" },
    { value: "4-man-delivery", label: "4 Man Delivery" },
    { value: "liftgate-pickup", label: "Liftgate Pickup" },
    { value: "appointment", label: "Appointment" }
    ]


  const [pickupAccessorialOptions, setPickupAccessorialOptions] = useState( 
  [
    { value: "residential-pickup", label: "Residential Pickup" },
    { value: "lift-gate-pickup", label: "Lift Gate Pickup" },
    { value: "limited-access-pickup", label: "Limited Access Pickup" },
    { value: "inside-pickup", label: "Inside Pickup" },
    { value: "sort/segregate-pickup", label: "Sort/Segregate Pickup" },
    { value: "trade-show-pickup", label: "Trade Show Pickup" },
    { value: "excessive-length-13ft", label: "Excessive Length, 13ft" },
    { value: "construction-site-pickup", label: "Construction Site Pickup" },
    { value: "excessive-length-11ft", label: "Excessive Length, 11ft" },
    { value: "excessive-length-15ft", label: "Excessive Length, 15ft" },
    { value: "excessive-length-17ft", label: "Excessive Length, 17ft" },
    { value: "excessive-length-19ft", label: "Excessive Length, 19ft" },
    { value: "excessive-length-23ft", label: "Excessive Length, 23ft" },
    { value: "excessive-length-24ft", label: "Excessive Length, 24ft" },
    { value: "excessive-length-26ft", label: "Excessive Length, 26ft" },
    { value: "excessive-length-28ft", label: "Excessive Length, 28ft" },
    { value: "excessive-length-30ft-and-over", label: "Excessive Length, 30ft and over" },
    { value: "excessive-length-9ft", label: "Excessive Length, 9ft" },
    { value: "airport-pickup", label: "Airport Pickup" },
    { value: "container-freight-station-pickup", label: "Container Freight Station Pickup" },
    { value: "camp-pickup", label: "Camp Pickup" },
    { value: "church-pickup", label: "Church Pickup" },
    { value: "country-club-pickup", label: "Country Club Pickup" },
    { value: "school-pickup", label: "School Pickup" },
    { value: "farm-pickup", label: "Farm Pickup" },
    { value: "government-site-pickup", label: "Government Site Pickup" },
    { value: "hospital-pickup", label: "Hospital Pickup" },
    { value: "hotel-pickup", label: "Hotel Pickup" },
    { value: "prison-pickup", label: "Prison Pickup" },
    { value: "utility-site-pickup", label: "Utility Site Pickup" },
    { value: "pier-pickup", label: "Pier Pickup" },
    { value: "military-installation-pickup", label: "Military Installation Pickup" },
    { value: "grocery-warehouse-pickup", label: "Grocery Warehouse Pickup" },
    { value: "mine-site-pickup", label: "Mine Site Pickup" }
  ]);
  
  const Incoterms = 
  [
    {theValue : 'EXW', theLabel : 'EXW'},
    {theValue : 'FCA', theLabel : 'FCA'},
    {theValue : 'FAS', theLabel : 'FAS'},
    {theValue : 'FOB', theLabel : 'FOB'},
    {theValue : 'CFR', theLabel : 'CFR'},
    {theValue : 'CIF', theLabel : 'CIF'},
    {theValue : 'CPT', theLabel : 'CPT'},
    {theValue : 'CIP', theLabel : 'CIP'},
    {theValue : 'DAP', theLabel : 'DAP'},
    {theValue : 'DPU', theLabel : 'DPU'},
    {theValue : 'DDP', theLabel : 'DDP'},
    {theValue : 'CCO', theLabel : 'CCO'}
  ]

  const shippingModes = 
  [
    {theValue : 'AIR- Small Cargo', theLabel : 'AIR- Small Cargo'},
    {theValue : 'AIR- Cargo: Freight', theLabel : 'AIR- Cargo- Freight'},
    {theValue : 'OCEAN- LCL', theLabel : 'OCEAN- LCL'},
    {theValue : 'OCEAN- FCL- 20ft', theLabel : 'OCEAN- FCL- 20ft'},
    {theValue : 'OCEAN- FCL- 20HQ', theLabel : 'OCEAN- FCL- 20HQ'},
    {theValue : 'OCEAN- FCL- 40ft', theLabel : 'OCEAN- FCL- 40ft'},
    {theValue : 'OCEAN- FCL- 40HQ', theLabel : 'OCEAN- FCL- 40HQ'}
  ]

  const inventoryType = 
  [
    { value: "Stackable", label: "Stackable"},
    { value: "Non-Stackable", label: "Non-Stackable"},
    { value: "Hazmat", label: "Hazmat"},
    { value: "Used", label: "Used"},
    { value: "Machinery", label: "Machinery"},
    { value: "Loose/On-Wheels", label: "Loose/On-Wheels"}
  ]

  const handlingUnit = 
  [
    {value: "Blanket Wrap", label: "Blanket Wrap"}, 
    {value: "Bag", label: "Bag"}, 
    {value: "Bale", label: "Bale"}, 
    {value: "Box", label: "Box"}, 
    {value: "Bucket", label: "Bucket"}, 
    {value: "Bundle", label: "Bundle"}, 
    {value: "Can", label: "Can"}, 
    {value: "Carton", label: "Carton"}, 
    {value: "Case", label: "Case"}, 
    {value: "Coil", label: "Coil"}, 
    {value: "Crate", label: "Crate"}, 
    {value: "Cylinder", label: "Cylinder"}, 
    {value: "Drums", label: "Drums"}, 
    {value: "Pail", label: "Pail"}, 
    {value: "Pieces", label: "Pieces"}, 
    {value: "Pallet", label: "Pallet"}, 
    {value: "Reel", label: "Reel"},
    {value: "Roll", label: "Roll"}, 
    {value: "Skid", label: "Skid"}, 
    {value: "Tube", label: "Tube"}, 
    {value: "Tote", label: "Tote"}
  ]


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
    email: [''],
    phoneNumber: [''],
    directLine: '',
    shippingAddress1: '',
    shippingAddress2: '',
    shippingZip: '',
    shippingCity: '',
    shippingState: ''
  });

  const [opportunities, setOpportunities] = useState([
    {
      "id": 0,
      "pickupDate" : '',
      "pickupTimeStart" : '',
      "pickupTimeEnd" :'',
      "user": null,
      "pickupContactName" : '',
      "pickupContactNumber" : '',
      "pickupCompanyName" : '',
      "pickupAddressLine1": '',
      "pickupAddressLine2": '',
      "pickupAddressLine3": '',
      "pickupZipCode": '',
      "pickupCountry": '',
      "pickupCity": '',
      "pickupState": '',
      "pickupAccessorials": [],
      "pickupNotes": '',
      "deliveryTimeStart" : '',
      "deliveryTimeEnd" : '',
      "deliveryContactName" : '',
      "deliveryContactNumber" : '',
      "deliveryCompanyName" : '',
      "deliveryAddressLine1": '',
      "deliveryAddressLine2": '',
      "deliveryAddressLine3": '',
      "deliveryZipCode": '',
      "deliveryCountry": '',
      "deliveryCity": '',
      "deliveryState": '',
      "deliveryAccessorials": [],
      "deliveryNotes": '',
      "inventoryDetails": null,
      "incoTerm": '',
      "shipmentMode": '',
      "shipmentType": '',
      "freightInsurance": '',
      "insuranceValue" : '',      
      "status": ''
    }
  ]);

  const [opportunityForm, setOpportunityForm] = useState({
        "pickupDate" : '',
        "pickupTimeStart" : '',
        "pickupTimeEnd" :'',
        "user": null,
        "pickupContactName" : '',
        "pickupContactNumber" : '',
        "pickupCompanyName" : '',
        "pickupAddressLine1": '',
        "pickupAddressLine2": '',
        "pickupAddressLine3": '',
        "pickupZipCode": '',
        "pickupCountry": '',
        "pickupCity": '',
        "pickupState": '',
        "pickupAccessorials": [],
        "pickupNotes": '',
        "deliveryTimeStart" : '',
        "deliveryTimeEnd" : '',
        "deliveryContactName" : '',
        "deliveryContactNumber" : '',
        "deliveryCompanyName" : '',
        "deliveryAddressLine1": '',
        "deliveryAddressLine2": '',
        "deliveryAddressLine3": '',
        "deliveryZipCode": '',
        "deliveryCountry": '',
        "deliveryCity": '',
        "deliveryState": '',
        "deliveryAccessorials": [],
        "deliveryNotes": '',
        "inventoryDetails": null,
        "incoTerm": '',
        "shipmentMode": '',
        "shipmentType": '',
        "freightInsurance": '',
        "insuranceValue" : ''
        
  });

  
  const [opportunityUpdateForm, setOpportunityUpdateForm] = useState({
    "pickupDate" : '',
    "pickupTimeStart" : '',
    "pickupTimeEnd" :'',
    "user": null,
    "pickupContactName" : '',
    "pickupContactNumber" : '',
    "pickupCompanyName" : '',
    "pickupAddressLine1": '',
    "pickupAddressLine2": '',
    "pickupAddressLine3": '',
    "pickupZipCode": '',
    "pickupCountry": '',
    "pickupCity": '',
    "pickupState": '',
    "pickupAccessorials": [],
    "pickupNotes": '',
    "deliveryTimeStart" : '',
    "deliveryTimeEnd" : '',
    "deliveryContactName" : '',
    "deliveryContactNumber" : '',
    "deliveryCompanyName" : '',
    "deliveryAddressLine1": '',
    "deliveryAddressLine2": '',
    "deliveryAddressLine3": '',
    "deliveryZipCode": '',
    "deliveryCountry": '',
    "deliveryCity": '',
    "deliveryState": '',
    "deliveryAccessorials": [],
    "deliveryNotes": '',
    "inventoryDetails": null,
    "incoTerm": '',
    "shipmentMode": '',
    "shipmentType": '',
    "freightInsurance": '',
    "insuranceValue" : ''
});

  const [shipmentTypes, setShipmentTypes] = useState('');

  const [selectedOpportunityAcc, setSelectedOpportunityAcc] = useState(null);


  const theShipmentType = [
    {label : 'Domestic' ,value : 'Domestic'},
    {label : 'International' ,value : 'International'}
  ];
  
  const domesticLoadTypes = [
    'LTL (Pallets)',
    'LTL (Loose)',
    'LTL (Blanket Wrap Air Ride)',
    'TL (Box Truck)',
    'TL (54 feet Trailer)',
    'White Glove',
    'Blind Shipment',
    'SPD'
  ];

  const internationalTypes = ['Air', 'Ocean'];

  const airOptions = [
    'Freight',
    'Small Parcel',
    'Compliance',
    'Customs'
  ];

  const oceanOptions = [
    'LCL (Import)',
    'FCL (Import/Export)',
    'Compliance',
    'Customs'
  ];
  
  // Supplier Payment Status Options
  const supplierPaymentStatuses = [
    'Pending',
    'Paid',
    'Verified',
    'Partially Paid'
  ];
  
  // Customer Payment Status Options
  const customerPaymentStatuses = [
    'Invoiced',
    'Not Invoiced',
    'Paid',
    'Verified',
    'Partially Paid'
  ];
  
  // Payment Methods (you can customize this list)
  const paymentMethods = [
    'Bank Transfer',
    'Credit Card',
    'Debit Card',
    'Cash',
    'Check',
    'PayPal'
  ];

  const [expenses, setExpenses] = useState([]);
  const [expenseForm, setExpenseForm] = useState({
    category: '',
    particular: '',
    paidAmount: '',
    date: '',
    paidBy: ''
  });

  const [edittingPermission, setEdittingPermission] = useState(false);

  var trueTypeOf = (obj) => Object.prototype.toString.call(obj).slice(8, -1).toLowerCase();

  useEffect(()=>{
    
    const getUserData = async () => {
      setLoading(true); // Start loading
      setReloadUser(false);
        console.log("getting User Data");
        const reqData = {
          "user" : user,
          "dataType": "UserData",
          "ID" : "All"
        }
        try {
        
          //const response = await axios.post('https://the-crm-backend-4sst.onrender.com/getData', reqData);      
          const response = await instance.post('/getData', reqData);
          //console.log((response.data.data));
          setUsers(JSON.parse(response.data.data));
          console.log(users[0])
          const responseEdit = await instance.post('/getData',{"dataType": "editPermission","ID":"All"});
          const editperm = JSON.parse(responseEdit.data.data);
          setEdittingPermission(editperm['editing'])
          //setShowUsers(1);
        } catch (error) {
          //window.alert('Masla');
          console.error(error);
        } finally {
          setLoading(false); // End loading
        }
    
      }

      const getOppData = async () => {
        setLoading(true); // Start loading
        setReloadOpp(false);
        console.log("getting Opp Data");
        const reqData = {
          "user" : user,
          "dataType": "OppData",
          "ID" : "All"
        }
        try {
          const response = await instance.post('/getData', reqData);
          console.log((JSON.parse(response.data.data)));
          setOpportunities(JSON.parse(response.data.data));
          console.log(JSON.parse(response.data.data).length);
          //setShowUsers(1);
        } catch (error) {
          //window.alert('Masla');
          console.error(error);
        } finally {
          setLoading(false); // End loading
        }
        // handleSelectedCarrierInfo();
      }
      const getExpensesData = async () => {
        setLoading(true);
        try {
          const response = await instance.post('/getData', {
            "user" : user,
            dataType: "ExpensesData",
            ID: "All"
          });
          setExpenses(JSON.parse(response.data.data));
          console.log((JSON.parse(response.data.data)));
        } catch (error) {
          console.error('Failed to fetch expenses', error);
        } finally {
          setLoading(false);
        }
      };

      if(tabValue === 0){
        //setShowUsers(0);
        getUserData();
        getOppData();
        getExpensesData();
      }
      // else if(tabValue >= 1){
      //   getOppData();
      // }
      if(reloadUser){
        getUserData();
      }

      if(reloadOpp){
        getOppData();
      }

      if(reloadExpenses){
        getExpensesData();
      }


  },[tabValue,reloadOpp,reloadUser,reloadExpenses])

// Function to add a new email field
const addEmailField = () => {
  setFormData(prev => ({
    ...prev,
    email: [...prev.email, ''] // Add a new empty string for the new email
  }));
};

// Function to add a new phone number field
const addPhoneNumberField = () => {
  setFormData(prev => ({
    ...prev,
    phoneNumber: [...prev.phoneNumber, ''] // Add a new empty string for the new phone number
  }));
};

// Function to handle changes in email fields
const handleEmailChange = (index, value) => {
  const updatedEmails = [...formData.email];
  updatedEmails[index] = value; // Update the specific email field
  setFormData(prev => ({
    ...prev,
    email: updatedEmails
  }));
};

// Function to handle changes in phone number fields
const handlePhoneNumberChange = (index, value) => {
  const updatedPhoneNumbers = [...formData.phoneNumber];
  updatedPhoneNumbers[index] = value; // Update the specific phone number field
  setFormData(prev => ({
    ...prev,
    phoneNumber: updatedPhoneNumbers
  }));
};


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
        "theUser" : user
      }
    try {
        setLoading(true);
        await instance.post('/CreateUser', UserData);
        window.alert('Data has been submitted');
      } catch (error) {
        window.alert('Data not submitted');
        console.error(error);
        setLoading(false);
      } finally{
        setLoading(false);
        setReloadUser(true);
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





  const addInventoryItem = () => {
    setInventoryID((prevIDs) => [...prevIDs, prevIDs.length + 1]);
    setInventoryDetails((prevItems) => [
      ...prevItems,
      {
        id: prevItems.length,
        inventoryType: [],
        units: '',
        handlingUnit: '',
        peices: '',
        weight: '',
        weightUnit: '',
        length: '',
        width: '',
        height: '',
        volume: '',
        dimUnit: '',
        class: '',
        NMFC: '',
        commodityName: '',
      },
    ]);
  };

  const handleInventoryChange = (field, value, inventoryIndx) => {
    setInventoryDetails((prevDetails) =>
      prevDetails.map((detail, index) =>
        index === inventoryIndx
          ? { ...detail, [field]: value }
          : detail
      )
    );

    console.log(inventoryDetails);

  };

  const handleCancelOpp = () => {
    setOpenOpportunityDialog(false);
    setOpportunityForm({
      "pickupDate" : '',
      "pickupTimeStart" : '',
      "pickupTimeEnd" :'',
      "user": null,
      "pickupContactName" : '',
      "pickupContactNumber" : '',
      "pickupCompanyName" : '',
      "pickupAddressLine1": '',
      "pickupAddressLine2": '',
      "pickupAddressLine3": '',
      "pickupZipCode": '',
      "pickupCountry": '',
      "pickupCity": '',
      "pickupState": '',
      "pickupNotes": '',
      "pickupAccessorials": [],
      "deliveryTimeStart" : '',
      "deliveryTimeEnd" : '',
      "deliveryContactName" : '',
      "deliveryContactNumber" : '',
      "deliveryCompanyName" : '',
      "deliveryAddressLine1": '',
      "deliveryAddressLine2": '',
      "deliveryAddressLine3": '',
      "deliveryZipCode": '',
      "deliveryCountry": '',
      "deliveryCity": '',
      "deliveryState": '',
      "deliveryAccessorials": [],
      "deliveryNotes": '',
      "inventoryDetails": null,
      "incoTerm": '',
      "shipmentMode": '',
      "shipmentType": '',
      "freightInsurance": '',
      "insuranceValue" : ''
    });

    setInventoryDetails([{
      id : 0,
      inventoryType : [],
      units : '',
      handlingUnit : '',
      peices : '',
      weight : '',
      weightUnit : '',
      length : '',
      width : '',
      height : '',
      volume : '',
      dimUnit : '',
      class : '',
      NMFC : '',
      commodityName : ''
    }]);
    setInventoryID([]);
    setShipmentTypes('');
  }

  const handleOpportunityChange = (field, value) => {
    const updates = { [field]: value };
    if(field === 'shipmentType'){
      setShipmentTypes(value);
    }
    console.log(updates)
    setOpportunityForm(prev => ({
      ...prev,
      ...updates
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
        "id" : "WS-0" + (100 + opportunities.length),
        "pickupDate" : opportunityForm.pickupDate,
        "pickupTimeStart" : opportunityForm.pickupTimeStart,
        "pickupTimeEnd" : opportunityForm.pickupTimeEnd,
        "user": opportunityForm.user,
        "pickupContactName" : opportunityForm.pickupContactName,
        "pickupContactNumber" : opportunityForm.pickupContactNumber,
        "pickupCompanyName" : opportunityForm.pickupCompanyName,
        "pickupAddressLine1": opportunityForm.pickupAddressLine1,
        "pickupAddressLine2": opportunityForm.pickupAddressLine2,
        "pickupAddressLine3": opportunityForm.pickupAddressLine3,
        "pickupZipCode": opportunityForm.pickupZipCode,
        "pickupCountry": opportunityForm.pickupCountry,
        "pickupState": opportunityForm.pickupState,
        "pickupCity": opportunityForm.pickupCity,
        "pickupAccessorials": opportunityForm.pickupAccessorials,
        "pickupNotes": opportunityForm.pickupNotes,
        "deliveryContactName" : opportunityForm.deliveryContactName,
        "deliveryContactNumber" : opportunityForm.deliveryContactNumber,
        "deliveryCompanyName" : opportunityForm.deliveryCompanyName,
        "deliveryTimeStart" : opportunityForm.deliveryTimeStart,
        "deliveryTimeEnd" : opportunityForm.deliveryTimeEnd,
        "deliveryAddressLine1": opportunityForm.deliveryAddressLine1,
        "deliveryAddressLine2": opportunityForm.deliveryAddressLine2,
        "deliveryZipCode": opportunityForm.deliveryZipCode,
        "deliveryCountry": opportunityForm.deliveryCountry,
        "deliveryState": opportunityForm.deliveryState,
        "deliveryCity": opportunityForm.deliveryCity,
        "shipmentType": opportunityForm.shipmentType,
        "deliveryAccessorials": opportunityForm.deliveryAccessorials,
        "deliveryNotes": opportunityForm.deliveryNotes,
        "inventoryDetails": inventoryDetails,
        "incoTerm": opportunityForm.incoTerm,
        "shipmentMode": opportunityForm.shipmentMode,
        "freightInsurance": opportunityForm.freightInsurance,
        "insuranceValue" : opportunityForm.insuranceValue,
        "theUser" : user
      }
      console.log(OppData)
      try {
          setLoading(true);
          await instance.post('/CreateOpportunity', OppData);
          window.alert('Data has been submitted');
        } catch (error) {
          window.alert('Data not submitted');
          console.error(error);
          setLoading(false);
        } finally{
          setReloadOpp(true);
          setLoading(false);
        }

      setOpportunityForm({
        "pickupDate" : '',
        "pickupTimeStart" : '',
        "pickupTimeEnd" :'',
        "user": null,
        "pickupContactName" : '',
        "pickupContactNumber" : '',
        "pickupCompanyName" : '',
        "pickupAddressLine1": '',
        "pickupAddressLine2": '',
        "pickupAddressLine3": '',
        "pickupZipCode": '',
        "pickupCountry": '',
        "pickupCity": '',
        "pickupState": '',
        "pickupAccessorials": [],
        "pickupNotes": '',
        "deliveryTimeStart" : '',
        "deliveryTimeEnd" : '',
        "deliveryContactName" : '',
        "deliveryContactNumber" : '',
        "deliveryCompanyName" : '',
        "deliveryAddressLine1": '',
        "deliveryAddressLine2": '',
        "deliveryAddressLine3": '',
        "deliveryZipCode": '',
        "deliveryCountry": '',
        "deliveryCity": '',
        "deliveryState": '',
        "deliveryAccessorials": [],
        "deliveryNotes" : '',
        "inventoryDetails": null,
        "incoTerm": '',
        "shipmentMode": '',
        "shipmentType": '',
        "freightInsurance": '',
        "insuranceValue" : '',
        "status": ''
      });

      setInventoryDetails([{
        id : 0,
        inventoryType : [],
        units : '',
        handlingUnit : '',
        peices : '',
        weight : '',
        weightUnit : '',
        length : '',
        width : '',
        height : '',
        volume : '',
        dimUnit : '',
        class : '',
        NMFC : '',
        commodityName : ''
      }]);
      setInventoryID([]);
      setShipmentTypes('');
      
  };

  const handleRowClick = (item, type) => {
    if (type === 'user') {
      setSelectedUser(item);
    } else {
      setSelectedOpportunity(item);
    }
    setOpenDetailsDialog(true);
  };

  const renderDomesticDetails = () => (
    <>
    {/* Pickup Section */}
      <Grid item xs={12}>
        <Typography 
            variant="subtitle1" 
            bgcolor={'lightskyblue'}
            textAlign={'center'} 
            sx={{ fontWeight: 600 }}>
              PICKUP DETAILS
          </Typography>
      </Grid>
      <Grid item xs={12} sm={6}>
      <Typography variant="subtitle2">Pickup Date</Typography>
        <TextField
          fullWidth
          // label="Pickup Date"
          type="date"
          value={opportunityForm.pickupDate}
          onChange={(e) => handleOpportunityChange('pickupDate', e.target.value)}
        />
      </Grid>
      <Grid item xs={12} sm={3}>
      <Typography variant="subtitle2">Pickup Time Start</Typography>
        <TextField
          fullWidth
          // label="Pickup Time"
          type="time"
          value={opportunityForm.pickupTimeStart}
          onChange={(e) => handleOpportunityChange('pickupTimeStart', e.target.value)}
        />
      </Grid>
      <Grid item xs={12} sm={3}>
      <Typography variant="subtitle2">Pickup Time End</Typography>
        <TextField
          fullWidth
          type="time"
          value={opportunityForm.pickupTimeEnd}
          onChange={(e) => handleOpportunityChange('pickupTimeEnd', e.target.value)}
        />
      </Grid>
      <Grid item xs={12} sm={4}>
        <TextField
          fullWidth
          label="Pickup Contact Name"
          value={opportunityForm.pickupContactName}
          onChange={(e) => handleOpportunityChange('pickupContactName', e.target.value)}
        />
      </Grid>
      <Grid item xs={12} sm={4}>
        <TextField
          fullWidth
          label="Pickup Contact Number"
          value={opportunityForm.pickupContactNumber}
          onChange={(e) => handleOpportunityChange('pickupContactNumber', e.target.value)}
        />
      </Grid>
      <Grid item xs={12} sm={4}>
        <TextField
          fullWidth
          label="Pickup Company Name"
          value={opportunityForm.pickupCompanyName}
          onChange={(e) => handleOpportunityChange('pickupCompanyName', e.target.value)}
        />
      </Grid>
      <Grid item xs={12} sm={12}>
        <TextField
          fullWidth
          label="Pickup Address Line 1"
          value={opportunityForm.pickupAddressLine1}
          onChange={(e) => handleOpportunityChange('pickupAddressLine1', e.target.value)}
        />
      </Grid>
      <Grid item xs={12} sm={12}>
        <TextField
          fullWidth
          label="Pickup Address Line 2"
          value={opportunityForm.pickupAddressLine2}
          onChange={(e) => handleOpportunityChange('pickupAddressLine2', e.target.value)}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          required
          label="Pickup Zip Code"
          value={opportunityForm.pickupZipCode}
          onChange={(e) => handleOpportunityChange('pickupZipCode', e.target.value)}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          label="Pickup Country"
          value={opportunityForm.pickupCountry}
          onChange={(e) => handleOpportunityChange('pickupCountry', e.target.value)}
        />
      </Grid>
      <Grid item xs={12}>
        <Autocomplete
          multiple
          options={pickupAccessorialOptions || []}
          getOptionLabel={(option) => option.label}
          value={opportunityForm.pickupAccessorials}
          onChange={(event, newValue) => {
            handleOpportunityChange('pickupAccessorials', newValue);
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Pickup Accessorial Services"
              placeholder="Select services"
            />
          )}
        />
      </Grid>
      <Grid item xs={12} sm={12}>
        <TextField
          fullWidth
          label="Notes / Remarks"
          value={opportunityForm.pickupNotes}
          onChange={(e) => handleOpportunityChange('pickupNotes', e.target.value)}
        />
      </Grid>

      {/* Delivery Section */}
      <Grid item xs={12}>
        <Typography 
          variant="subtitle1" 
          bgcolor={'turquoise'} 
          textAlign={'center'} 
          sx={{ fontWeight: 600 }}>
            DELIVERY DETAILS
        </Typography>
      </Grid>
      <Grid item xs={12} sm={6}>
      <Typography variant="subtitle2">Delivery Time Start</Typography>
        <TextField
          fullWidth
          // label="Pickup Time"
          type="time"
          value={opportunityForm.deliveryTimeStart}
          onChange={(e) => handleOpportunityChange('deliveryTimeStart', e.target.value)}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
      <Typography variant="subtitle2">Delivery Time End</Typography>
        <TextField
          fullWidth
          type="time"
          value={opportunityForm.deliveryTimeEnd}
          onChange={(e) => handleOpportunityChange('deliveryTimeEnd', e.target.value)}
        />
      </Grid>
      <Grid item xs={12} sm={4}>
        <TextField
          fullWidth
          label="Delivery Contact Name"
          value={opportunityForm.deliveryContactName}
          onChange={(e) => handleOpportunityChange('deliveryContactName', e.target.value)}
        />
      </Grid>
      <Grid item xs={12} sm={4}>
        <TextField
          fullWidth
          label="Delivery Contact Number"
          value={opportunityForm.deliveryContactNumber}
          onChange={(e) => handleOpportunityChange('deliveryContactNumber', e.target.value)}
        />
      </Grid>
      <Grid item xs={12} sm={4}>
        <TextField
          fullWidth
          label="Delivery Company Name"
          value={opportunityForm.deliveryCompanyName}
          onChange={(e) => handleOpportunityChange('deliveryCompanyName', e.target.value)}
        />
      </Grid>
      <Grid item xs={12} sm={12}>
        <TextField
          fullWidth
          label="Delivery Address Line 1"
          value={opportunityForm.deliveryAddressLine1}
          onChange={(e) => handleOpportunityChange('deliveryAddressLine1', e.target.value)}
        />
      </Grid>
      <Grid item xs={12} sm={12}>
        <TextField
          fullWidth
          label="Delivery Address Line 2"
          value={opportunityForm.deliveryAddressLine2}
          onChange={(e) => handleOpportunityChange('deliveryAddressLine2', e.target.value)}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          required
          label="Delivery Zip Code"
          value={opportunityForm.deliveryZipCode}
          onChange={(e) => handleOpportunityChange('deliveryZipCode', e.target.value)}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          label="Delivery Country"
          value={opportunityForm.deliveryCountry}
          onChange={(e) => handleOpportunityChange('deliveryCountry', e.target.value)}
        />
      </Grid>
      <Grid item xs={12}>
        <Autocomplete
          multiple
          options={deliveryAccessorialOptions}
          getOptionLabel={(option) => option.label}
          value={opportunityForm.deliveryAccessorials}
          onChange={(event, newValue) => {
            handleOpportunityChange('deliveryAccessorials', newValue);
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Delivery Accessorial Services"
              placeholder="Select services"
            />
          )}
        />
      </Grid>
      <Grid item xs={12} sm={12}>
        <TextField
          fullWidth
          label="Notes / Remarks"
          value={opportunityForm.deliveryNotes}
          onChange={(e) => handleOpportunityChange('deliveryNotes', e.target.value)}
        />
      </Grid>

      {/* Item Details Section */}
      <Grid item xs={12} xl={12} >
        <Typography 
          variant="subtitle1" 
          bgcolor={'lightsteelblue'} 
          textAlign={'center'} 
          sx={{ fontWeight: 600 }}>
            ITEM DETAILS
          </Typography>
      </Grid>
      <Grid item xs={12}>
        <Button variant="contained" startIcon={<AddIcon />} onClick={()=>addInventoryItem()}>Add An Item</Button>
      </Grid>
      {(inventoryDetails.length !== 0) ? renderItemDetail([]) : null}
      <Grid item xs={12} xl={12} >
        <Typography 
          variant="subtitle1" 
          bgcolor={'lightblue'} 
          textAlign={'center'} 
          sx={{ fontWeight: 600 }}>
            INSURANCE DETAILS
          </Typography>
      </Grid>
      <Grid item xs={6}>
          <TextField
            select
            fullWidth
            label="Freight Insurance"
            value={opportunityForm.freightInsurance}
            onChange={(e) => handleOpportunityChange('freightInsurance', e.target.value)}
          >
              <MenuItem value="true">Required</MenuItem>
              <MenuItem value="false">Not Required</MenuItem>
            </TextField>                
          </Grid>
          <Grid item xs={6}>
            {(opportunityForm.freightInsurance === "true") ?
              <TextField
                  fullWidth
                  label="Insurance Value"
                  value={opportunityForm.insuranceValue}
                  onChange={(e) => handleOpportunityChange('insuranceValue', e.target.value)}
                />
                : null
            }
      </Grid>
      </>
  )

  const renderInternationDetails = () => (
    <>
    {/* Pickup Section */}
      <Grid item xs={12}>
        <Typography 
            variant="subtitle1" 
            bgcolor={'lightskyblue'}
            textAlign={'center'} 
            sx={{ fontWeight: 600 }}>
              PICKUP DETAILS
          </Typography>
      </Grid>
      <Grid item xs={12} sm={4}>
        <TextField
          fullWidth
          label="Pickup Contact Name"
          value={opportunityForm.pickupContactName}
          onChange={(e) => handleOpportunityChange('pickupContactName', e.target.value)}
        />
      </Grid>
      <Grid item xs={12} sm={4}>
        <TextField
          fullWidth
          label="Pickup Contact Number"
          value={opportunityForm.pickupContactNumber}
          onChange={(e) => handleOpportunityChange('pickupContactNumber', e.target.value)}
        />
      </Grid>
      <Grid item xs={12} sm={4}>
        <TextField
          fullWidth
          label="Pickup Company Name"
          value={opportunityForm.pickupCompanyName}
          onChange={(e) => handleOpportunityChange('pickupCompanyName', e.target.value)}
        />
      </Grid>
      <Grid item xs={12} sm={12}>
        <TextField
          fullWidth
          label="Pickup Address Line 1"
          value={opportunityForm.pickupAddressLine1}
          onChange={(e) => handleOpportunityChange('pickupAddressLine1', e.target.value)}
        />
      </Grid>
      <Grid item xs={12} sm={12}>
        <TextField
          fullWidth
          label="Pickup Address Line 2"
          value={opportunityForm.pickupAddressLine2}
          onChange={(e) => handleOpportunityChange('pickupAddressLine2', e.target.value)}
        />
      </Grid>
      <Grid item xs={12} sm={12}>
        <TextField
          fullWidth
          label="Pickup Address Line 3"
          value={opportunityForm.pickupAddressLine3}
          onChange={(e) => handleOpportunityChange('pickupAddressLine3', e.target.value)}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          required
          label="Pickup Zip Code"
          value={opportunityForm.pickupZipCode}
          onChange={(e) => handleOpportunityChange('pickupZipCode', e.target.value)}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          label="Pickup State/Province"
          value={opportunityForm.pickupState}
          onChange={(e) => handleOpportunityChange('pickupState', e.target.value)}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          label="Pickup City"
          value={opportunityForm.pickupCity}
          onChange={(e) => handleOpportunityChange('pickupCity', e.target.value)}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          label="Pickup Country"
          value={opportunityForm.pickupCountry}
          onChange={(e) => handleOpportunityChange('pickupCountry', e.target.value)}
        />
      </Grid>
      <Grid item xs={12} sm={12}>
        <TextField
          fullWidth
          label="Notes / Remarks"
          value={opportunityForm.pickupNotes}
          onChange={(e) => handleOpportunityChange('pickupNotes', e.target.value)}
        />
      </Grid>

      {/* Delivery Section */}
      <Grid item xs={12}>
        <Typography 
          variant="subtitle1" 
          bgcolor={'turquoise'} 
          textAlign={'center'} 
          sx={{ fontWeight: 600 }}>
            DELIVERY DETAILS
        </Typography>
      </Grid>
      <Grid item xs={12} sm={4}>
        <TextField
          fullWidth
          label="Delivery Contact Name"
          value={opportunityForm.deliveryContactName}
          onChange={(e) => handleOpportunityChange('deliveryContactName', e.target.value)}
        />
      </Grid>
      <Grid item xs={12} sm={4}>
        <TextField
          fullWidth
          label="Delivery Contact Number"
          value={opportunityForm.deliveryContactNumber}
          onChange={(e) => handleOpportunityChange('deliveryContactNumber', e.target.value)}
        />
      </Grid>
      <Grid item xs={12} sm={4}>
        <TextField
          fullWidth
          label="Delivery Company Name"
          value={opportunityForm.deliveryCompanyName}
          onChange={(e) => handleOpportunityChange('deliveryCompanyName', e.target.value)}
        />
      </Grid>
    
      <Grid item xs={12} sm={12}>
        <TextField
          fullWidth
          label="Delivery Address Line 1"
          value={opportunityForm.deliveryAddressLine1}
          onChange={(e) => handleOpportunityChange('deliveryAddressLine1', e.target.value)}
        />
      </Grid>
      <Grid item xs={12} sm={12}>
        <TextField
          fullWidth
          label="Delivery Address Line 2"
          value={opportunityForm.deliveryAddressLine2}
          onChange={(e) => handleOpportunityChange('deliveryAddressLine2', e.target.value)}
        />
      </Grid>
      <Grid item xs={12} sm={12}>
        <TextField
          fullWidth
          label="Delivery Address Line 3"
          value={opportunityForm.deliveryAddressLine3}
          onChange={(e) => handleOpportunityChange('deliveryAddressLine3', e.target.value)}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          required
          label="Delivery Zip Code"
          value={opportunityForm.deliveryZipCode}
          onChange={(e) => handleOpportunityChange('deliveryZipCode', e.target.value)}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          label="Delivery State/Province"
          value={opportunityForm.deliveryState}
          onChange={(e) => handleOpportunityChange('deliveryState', e.target.value)}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          label="Delivery City"
          value={opportunityForm.deliveryCity}
          onChange={(e) => handleOpportunityChange('deliveryCity', e.target.value)}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          label="Delivery Country"
          value={opportunityForm.deliveryCountry}
          onChange={(e) => handleOpportunityChange('deliveryCountry', e.target.value)}
        />
      </Grid>
      <Grid item xs={12} sm={12}>
        <TextField
          fullWidth
          label="Notes / Remarks"
          value={opportunityForm.deliveryNotes}
          onChange={(e) => handleOpportunityChange('deliveryNotes', e.target.value)}
        />
      </Grid>
      {/* Item Details Section */}
      <Grid item xs={12} xl={12} >
        <Typography 
          variant="subtitle1" 
          bgcolor={'lightsteelblue'} 
          textAlign={'center'} 
          sx={{ fontWeight: 600 }}>
            PACKAGE DETAILS
          </Typography>
      </Grid>
      <Grid item xs={12}>
        <Button variant="contained" startIcon={<AddIcon />} onClick={()=>addInventoryItem()}>Add An Item</Button>
      </Grid>
      {(inventoryDetails.length !== 0) ? renderItemDetail([]) : null}
      <Grid item xs={12} xl={12} >
        <Typography 
          variant="subtitle1" 
          bgcolor={'lightblue'} 
          textAlign={'center'} 
          sx={{ fontWeight: 600 }}>
            SHIPPING SPECIFICS
          </Typography>
      </Grid>
      <Grid item xs={12} sm={6}>
      <Autocomplete
          // multiple
          options={Incoterms || []}
          getOptionLabel={(option) => option.theLabel || []}
          value={opportunityForm.incoTerm}
          onChange={(event, newValue) => {
            handleOpportunityChange('incoTerm', newValue);
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Incoterms"
              placeholder="Select Incoterm"
            />
          )}
        />
        </Grid>
        <Grid item xs={12} sm={6}>
        <Autocomplete
            // multiple
            options={shippingModes || []}
            getOptionLabel={(option) => option.theLabel}
            value={opportunityForm.shipmentMode}
            onChange={(event, newValue) => {
              handleOpportunityChange('shipmentMode', newValue);
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Shipping Modes"
                placeholder="Select Shipping Modes"
              />
            )}
          />
        </Grid>
      </>
  )


  const renderInventoryDetail = (item1 , setItem) => {

    const updateInventoryDetail = (field, value, id) => {
      const updates = { [field]: value };

      item1.inventoryDetails.map((item)=>{
        if(item.id === id){
          item[field] = value;
      }});

      console.log(item1);

      //setItem(item1);
      setItem(prev => ({
        
        ...prev,
        ...item1
      }));
  
      console.log(updates)
    }

    console.log(item1.inventoryDetails);

    return item1.inventoryDetails.map((item)=>{
      console.log(item);
      return (item.id > 0) ?
        <> 
          <Grid item xs={12} sm={2}>
            <TextField
              fullWidth
              value={item.id}
              InputProps={{ readOnly: true }}
              type="number"
            />
          </Grid>
          {(item1.shipmentType.value === 'Domestic') ? 
            <>
          <Grid item xs={12} sm={10}>
          <Autocomplete
              //multiple
              options={inventoryType}
              getOptionLabel={(option) => option.label}
              value={item.inventoryType}
              onChange={(event, newValue) => {
                updateInventoryDetail('inventoryType', newValue, item.id);
              }}
              disabled={!edittingPermission}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Inventory Type"
                  placeholder="Select Inventory Type"
                />
              )}
            />
          </Grid>
          
          <Grid item xs={12} sm={2}>
            <TextField
              fullWidth
              label="Units"
              value={item.units}
              onChange={(e) => updateInventoryDetail('units', e.target.value, item.id)}
              type="number"
              disabled={!edittingPermission}
            />
          </Grid>

          <Grid item xs={12} sm={4}>
          <Autocomplete
              //multiple
              options={handlingUnit}
              getOptionLabel={(option) => option.label}
              value={item.handlingUnit}
              onChange={(event, newValue) => {
                updateInventoryDetail('handlingUnit', newValue, item.id);
              }}
              disabled={!edittingPermission}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Handling Unit"
                  placeholder="Handling Unit"
                />
              )}
            />
          </Grid>
          <Grid item xs={12} sm={2}>
            <TextField
              fullWidth
              label="Pieces"
              value={item.peices}
              onChange={(e) => updateInventoryDetail('peices', e.target.value, item.id)}
              type="number"
              disabled={!edittingPermission}
            />
          </Grid>
          
            <Grid item xs={12} sm={2}>
            <TextField
              fullWidth
              label="Weight"
              value={item.weight}
              onChange={(e) => updateInventoryDetail('weight', e.target.value, item.id)}
              type="number"
              disabled={!edittingPermission}
            />
          </Grid>

        <Grid item xs={12} sm={2}>
        <TextField
            select
            fullWidth
            label="lbs/kg"
            value={item.weightUnit}
            defaultValue={"lbs"}
            onChange={(e) => updateInventoryDetail('weightUnit', e.target.value, item.id)}
            disabled={!edittingPermission}
          >
            <MenuItem value="lbs">lbs</MenuItem>
            <MenuItem value="kg">kg</MenuItem>
          </TextField>
        </Grid>

          <Grid item xs={12} sm={2}>
          <TextField
            select
            fullWidth
            label="Dim Unit"
            value={item.dimUnit}
            defaultValue={"in"}
            onChange={(e) => updateInventoryDetail('dimUnit', e.target.value, item.id)}
            disabled={!edittingPermission}
          >
              <MenuItem value="in">in</MenuItem>
              <MenuItem value="ft">ft</MenuItem>
              <MenuItem value="cm">cm</MenuItem>
              <MenuItem value="m">m</MenuItem>
            </TextField>
          </Grid>

          <Grid item xs={12} sm={2}>
            <TextField
              fullWidth
              label="Length"
              value={item.Length}
              onChange={(e) => updateInventoryDetail('Length', e.target.value, item.id)}
              type="number"
              disabled={!edittingPermission}
            />
          </Grid>

          <Grid item xs={12} sm={2}>
            <TextField
              fullWidth
              label="Width"
              value={item.Width}
              onChange={(e) => updateInventoryDetail('Width', e.target.value, item.id)}
              type="number"
              disabled={!edittingPermission}
            />
          </Grid>

          <Grid item xs={12} sm={2}>
            <TextField
              fullWidth
              label="Height"
              value={item.Height}
              onChange={(e) => updateInventoryDetail('Height', e.target.value, item.id)}
              type="number"
              disabled={!edittingPermission}
            />

          </Grid>


          <Grid item xs={12} sm={2}>
            <TextField
              fullWidth
              label="Class"
              value={item.Class}
              onChange={(e) => updateInventoryDetail('Class', e.target.value, item.id)}
              type="number"
              disabled={!edittingPermission}
            />
          </Grid>
          
          <Grid item xs={12} sm={2}>
            <TextField
              fullWidth
              label="NMFC"
              value={item.NMFC}
              onChange={(e) => updateInventoryDetail('NMFC', e.target.value, item.id)}
              type="number"
              disabled={!edittingPermission}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Commodity Name"
              value={item.commodityName}
              onChange={(e) => updateInventoryDetail('commodityName', e.target.value, item.id)}
              disabled={!edittingPermission}
            />
          </Grid>
          </> : <>
          <Grid item xs={12} sm={10}></Grid>
          <Grid item xs={12} sm={2}>
              <TextField
                fullWidth
                label="Weight"
                value={item.weight}
                onChange={(e) => updateInventoryDetail('weight', e.target.value, item.id)}
                type="number"
                disabled={!edittingPermission}
              />
            </Grid>

          <Grid item xs={12} sm={2}>
          <TextField
              select
              fullWidth
              label="lbs/kg"
              value={item.weightUnit}
              onChange={(e) => updateInventoryDetail('weightUnit', e.target.value, item.id)}
              disabled={!edittingPermission}
            >
              <MenuItem value="lbs">lbs</MenuItem>
              <MenuItem value="kg">kg</MenuItem>
            </TextField>
          </Grid>

            <Grid item xs={12} sm={2}>
            <TextField
              select
              fullWidth
              label="Dim Unit"
              value={item.dimUnit}
              onChange={(e) => updateInventoryDetail('dimUnit', e.target.value, item.id)}
              disabled={!edittingPermission}
            >
                <MenuItem value="in">in</MenuItem>
                <MenuItem value="ft">ft</MenuItem>
                <MenuItem value="cm">cm</MenuItem>
                <MenuItem value="m">m</MenuItem>
              </TextField>
            </Grid>

            <Grid item xs={12} sm={2}>
              <TextField
                fullWidth
                label="Length"
                value={item.Length}
                onChange={(e) => updateInventoryDetail('Length', e.target.value, item.id)}
                type="number"
                disabled={!edittingPermission}
              />
            </Grid>

            <Grid item xs={12} sm={2}>
              <TextField
                fullWidth
                label="Width"
                value={item.Width}
                onChange={(e) => updateInventoryDetail('Width', e.target.value, item.id)}
                type="number"
                disabled={!edittingPermission}
              />
            </Grid>

            <Grid item xs={12} sm={2}>
              <TextField
                fullWidth
                label="Height"
                value={item.Height}
                onChange={(e) => updateInventoryDetail('Height', e.target.value, item.id)}
                type="number"
                disabled={!edittingPermission}
              />
            </Grid>
          </>}
      </> : null
    });

  }

  const renderItemDetail = () => 
      { console.log(shipmentTypes);
        if(inventoryID.length !== 0 ){ 
          console.log(inventoryID);
          return inventoryID.map((inventoryIndx) =>(
        <>
            <Grid item xs={12} sm={2}>
              <TextField
                fullWidth
                value={inventoryDetails[inventoryIndx].id}
                InputProps={{ readOnly: true }}
                type="number"
              />
            </Grid>
            {(shipmentTypes.value === 'Domestic') ? 
            <>
            <Grid item xs={12} sm={10}>
            <Autocomplete
                //multiple
                options={inventoryType}
                getOptionLabel={(option) => option.label}
                value={inventoryDetails[inventoryIndx].inventoryType}
                onChange={(event, newValue) => {
                  handleInventoryChange('inventoryType', newValue, inventoryIndx);
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Inventory Type"
                    placeholder="Select Inventory Type"
                  />
                )}
              />
            </Grid>
            
            <Grid item xs={12} sm={2}>
              <TextField
                fullWidth
                label="Units"
                value={inventoryDetails[inventoryIndx].units}
                onChange={(e) => handleInventoryChange('units', e.target.value, inventoryIndx)}
                type="number"
              />
            </Grid>

            <Grid item xs={12} sm={3}>
            <Autocomplete
                //multiple
                options={handlingUnit}
                getOptionLabel={(option) => option.label}
                value={inventoryDetails[inventoryIndx].handlingUnit}
                onChange={(event, newValue) => {
                  handleInventoryChange('handlingUnit', newValue, inventoryIndx);
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Handling Unit"
                    placeholder="Handling Unit"
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={2}>
              <TextField
                fullWidth
                label="Pieces"
                value={inventoryDetails[inventoryIndx].peices}
                onChange={(e) => handleInventoryChange('peices', e.target.value, inventoryIndx)}
                type="number"
              />
            </Grid>
            
              <Grid item xs={12} sm={3}>
              <TextField
                fullWidth
                label="Weight"
                value={inventoryDetails[inventoryIndx].weight}
                onChange={(e) => handleInventoryChange('weight', e.target.value, inventoryIndx)}
                type="number"
              />
            </Grid>

          <Grid item xs={12} sm={2}>
          <TextField
              select
              fullWidth
              label="lbs/kg"
              value={inventoryDetails[inventoryIndx].weightUnit}
              onChange={(e) => handleInventoryChange('weightUnit', e.target.value, inventoryIndx)}
            >
              <MenuItem value="lbs">lbs</MenuItem>
              <MenuItem value="kg">kg</MenuItem>
            </TextField>
          </Grid>

            <Grid item xs={12} sm={2}>
            <TextField
              select
              fullWidth
              label="Dim Unit"
              value={inventoryDetails[inventoryIndx].dimUnit}
              onChange={(e) => handleInventoryChange('dimUnit', e.target.value, inventoryIndx)}
            >
                <MenuItem value="in">in</MenuItem>
                <MenuItem value="ft">ft</MenuItem>
                <MenuItem value="cm">cm</MenuItem>
                <MenuItem value="m">m</MenuItem>
              </TextField>
            </Grid>

            <Grid item xs={12} sm={2}>
              <TextField
                fullWidth
                label="Length"
                value={inventoryDetails[inventoryIndx].Length}
                onChange={(e) => handleInventoryChange('Length', e.target.value, inventoryIndx)}
                type="number"
              />
            </Grid>

            <Grid item xs={12} sm={2}>
              <TextField
                fullWidth
                label="Width"
                value={inventoryDetails[inventoryIndx].Width}
                onChange={(e) => handleInventoryChange('Width', e.target.value, inventoryIndx)}
                type="number"
              />
            </Grid>

            <Grid item xs={12} sm={2}>
              <TextField
                fullWidth
                label="Height"
                value={inventoryDetails[inventoryIndx].Height}
                onChange={(e) => handleInventoryChange('Height', e.target.value, inventoryIndx)}
                type="number"
              />
            </Grid>

            <Grid item xs={12} sm={2}>
              <TextField
                fullWidth
                label="Class"
                value={inventoryDetails[inventoryIndx].Class}
                onChange={(e) => handleInventoryChange('Class', e.target.value, inventoryIndx)}
                type="number"
              />
            </Grid>
            
            <Grid item xs={12} sm={2}>
              <TextField
                fullWidth
                label="NMFC"
                value={inventoryDetails[inventoryIndx].NMFC}
                onChange={(e) => handleInventoryChange('NMFC', e.target.value, inventoryIndx)}
                type="number"
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Commodity Name"
                value={inventoryDetails[inventoryIndx].commodityName}
                onChange={(e) => handleInventoryChange('commodityName', e.target.value, inventoryIndx)}
              />
            </Grid>
          </> : 
          <>
          <Grid item xs={12} sm={10}></Grid>
          <Grid item xs={12} sm={2}>
              <TextField
                fullWidth
                label="Weight"
                value={inventoryDetails[inventoryIndx].weight}
                onChange={(e) => handleInventoryChange('weight', e.target.value, inventoryIndx)}
                type="number"
              />
            </Grid>

          <Grid item xs={12} sm={2}>
          <TextField
              select
              fullWidth
              label="lbs/kg"
              value={inventoryDetails[inventoryIndx].weightUnit}
              onChange={(e) => handleInventoryChange('weightUnit', e.target.value, inventoryIndx)}
            >
              <MenuItem value="lbs">lbs</MenuItem>
              <MenuItem value="kg">kg</MenuItem>
            </TextField>
          </Grid>

            <Grid item xs={12} sm={2}>
            <TextField
              select
              fullWidth
              label="Dim Unit"
              value={inventoryDetails[inventoryIndx].dimUnit}
              onChange={(e) => handleInventoryChange('dimUnit', e.target.value, inventoryIndx)}
            >
                <MenuItem value="in">in</MenuItem>
                <MenuItem value="ft">ft</MenuItem>
                <MenuItem value="cm">cm</MenuItem>
                <MenuItem value="m">m</MenuItem>
              </TextField>
            </Grid>

            <Grid item xs={12} sm={2}>
              <TextField
                fullWidth
                label="Length"
                value={inventoryDetails[inventoryIndx].Length}
                onChange={(e) => handleInventoryChange('Length', e.target.value, inventoryIndx)}
                type="number"
              />
            </Grid>

            <Grid item xs={12} sm={2}>
              <TextField
                fullWidth
                label="Width"
                value={inventoryDetails[inventoryIndx].Width}
                onChange={(e) => handleInventoryChange('Width', e.target.value, inventoryIndx)}
                type="number"
              />
            </Grid>

            <Grid item xs={12} sm={2}>
              <TextField
                fullWidth
                label="Height"
                value={inventoryDetails[inventoryIndx].Height}
                onChange={(e) => handleInventoryChange('Height', e.target.value, inventoryIndx)}
                type="number"
              />
            </Grid>
          </>}
      </>))} 
      else
        {}
  };

 

  const DetailsDialog = () => {
    const isUser = !!selectedUser;
    const selectedItem = selectedUser || selectedOpportunity
    const [item, setItem] = useState(null);    

    useEffect(() => {
      if(item){
        console.log(item.inventoryDetails)
      }
    },[item])

    useEffect(() => {
      if (selectedItem) {
          setItem(selectedItem);
      }
    }, [selectedItem]);

    if (!selectedItem) return null;
    if (!item) return null;



    const handleItemChange = (field, value)=>{
      const updates = { [field]: value };

      setItem(prev => ({
        ...prev,
        ...updates
      }));
  
      console.log(item)
    }

    const addInventoryItem1 = () => {
      const newInventoryItem = {
        id: item.inventoryDetails.length,
        inventoryType: [],
        units: '',
        handlingUnit: [],
        peices: '',
        weight: '',
        weightUnit: [],
        Length: '',
        Width: '',
        Height: '',
        volume: '',
        dimUnit: [],
        class: '',
        NMFC: '',
        commodityName: ''
      }

      item.inventoryDetails.push(newInventoryItem);
      const newItem = item;
      setItem(prev => ({
        ...prev,
        ...newItem
      }));

      //console.log(item.inventoryDetails);
    };

    //console.log(item);

    const updateOppChange = async () => {
      setOpenDetailsDialog(false);
      try {
        setLoading(true);
        const UpdateOpp = {
          "theUser" : user,
          'theID' : item.id,
          'theOpportunities' : item
        }
        const response = await instance.post('/updateOpportunityData', UpdateOpp);
        console.log((response));
        
        window.alert('Data has been submitted');
      } catch (error) {
        setLoading(false);
        window.alert('Data not submitted');
        console.error(error);
      }finally{
        setLoading(false);
        setReloadOpp(true);
      }  
    }

    const updateUserChange = async () => {
      setOpenDetailsDialog(false);
      try {
        setLoading(true);
        const UpdateUser = {
          "user" : user,
          'theID' : item.id,
          'theUsers' : item
        }
        const response = await instance.post('/updateUserData', UpdateUser);
        console.log((response));
        
        window.alert('Data has been submitted');
      } catch (error) {
        setLoading(false);
        window.alert('Data not submitted');
        console.error(error);
      }finally{
        setLoading(false);
        setReloadOpp(true);
      }  
    }


    return (
      <Dialog
        open={openDetailsDialog}
        onClose={() => {
          setOpenDetailsDialog(false);
          setSelectedUser(null);
          setSelectedOpportunity(null);
        }}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle sx={{ m: 0, p: 2, pb: 1 }}>
          <Typography variant="h6">
            {isUser ? 'User Details' : 'Opportunity Details'}
          </Typography>
          <IconButton
            onClick={() => {
              setOpenDetailsDialog(false);
              setSelectedUser(null);
              setSelectedOpportunity(null);
            }}
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
            {isUser ? (
              // User Details Form
              <>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Name"
                    value={item.firstName}
                    onChange={(e) => handleItemChange('firstName', e.target.value)}
                    InputProps={{
                      readOnly: !edittingPermission
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Last Name"
                    value={item.lastName}
                    onChange={(e) => handleItemChange('lastName', e.target.value)}
                    InputProps={{
                      readOnly: !edittingPermission
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Company"
                    value={item.companyName}
                    onChange={(e) => handleItemChange('companyName', e.target.value)}
                    InputProps={{
                      readOnly: !edittingPermission
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Type"
                    value={item.userType}
                    onChange={(e) => handleItemChange('userType', e.target.value)}
                    InputProps={{
                      readOnly: !edittingPermission
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Email"
                    value={item.email}
                    onChange={(e) => handleItemChange('email', e.target.value)}
                    InputProps={{
                      readOnly: !edittingPermission
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Phone Number"
                    value={item.phoneNumber}
                    onChange={(e) => handleItemChange('phoneNumber', e.target.value)}
                    InputProps={{
                      readOnly: !edittingPermission
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Direct Line"
                    value={item.directLine}
                    onChange={(e) => handleItemChange('directLine', e.target.value)}
                    InputProps={{
                      readOnly: !edittingPermission
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Billing Address"
                    value={`${item.billingAddress}`}
                    onChange={(e) => handleItemChange('billingAddress', e.target.value)}
                    InputProps={{
                      readOnly: !edittingPermission
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    label="Billing Zip Code"
                    value={item.billingZip}
                    onChange={(e) => handleItemChange('billingZip', e.target.value)}
                    InputProps={{
                      readOnly: !edittingPermission
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    label="Billing City"
                    value={item.billingCity}
                    onChange={(e) => handleItemChange('billingCity', e.target.value)}
                    InputProps={{
                      readOnly: !edittingPermission
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    label="Billing State"
                    value={item.billingState}
                    onChange={(e) => handleItemChange('billingState', e.target.value)}
                    InputProps={{
                      readOnly: !edittingPermission
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Shipping Address"
                    value={`${item.shippingAddress}`}
                    onChange={(e) => handleItemChange('shippingAddress', e.target.value)}
                    InputProps={{
                      readOnly: !edittingPermission
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    label="Shipping Zip Code"
                    value={item.shippingZip}
                    onChange={(e) => handleItemChange('shippingZip', e.target.value)}
                    InputProps={{
                      readOnly: !edittingPermission
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    label="Shipping City"
                    value={item.shippingCity}
                    onChange={(e) => handleItemChange('shippingCity', e.target.value)}
                    InputProps={{
                      readOnly: !edittingPermission
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    label="Shipping State"
                    value={item.shippingState}
                    onChange={(e) => handleItemChange('shippingState', e.target.value)}
                    InputProps={{
                      readOnly: !edittingPermission
                    }}
                  />
                </Grid>
              </>
            ) : (
            <DialogContent dividers>
              <Grid container spacing={3}>
              {
              (item.shipmentType.value === 'Domestic') ? 
              (
                <>
                <Grid item xs={12}>
                <TextField
                    fullWidth
                    label="Customer"
                    value={`${item.user.firstName} ${item.user.lastName} - ${item.user.companyName}`}
                    InputProps={{ readOnly: true }}
                  />
                </Grid>

                {/* Pickup Section */}
                <Grid item xs={12}>
                  <Typography 
                      variant="subtitle1" 
                      bgcolor={'lightskyblue'}
                      textAlign={'center'} 
                      sx={{ fontWeight: 600 }}>
                        PICKUP DETAILS
                    </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2">Pickup Date</Typography>
                  <TextField
                    fullWidth
                    // label="Pickup Date"
                    type="date"
                    value={item.pickupDate}
                    onChange={(e) => handleItemChange('pickupDate', e.target.value)}
                    InputProps={{
                      readOnly: !edittingPermission
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={3}>
                <Typography variant="subtitle2">Pickup Time Start</Typography>
                  <TextField
                    fullWidth
                    // label="Pickup Time"
                    type="time"
                    value={item.pickupTimeStart}
                    onChange={(e) => handleItemChange('pickupTimeStart', e.target.value)}
                    InputProps={{
                      readOnly: !edittingPermission
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={3}>
                <Typography variant="subtitle2">Pickup Time End</Typography>
                  <TextField
                    fullWidth
                    type="time"
                    value={item.pickupTimeEnd}
                    onChange={(e) => handleItemChange('pickupTimeEnd', e.target.value)}
                    InputProps={{
                      readOnly: !edittingPermission
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    label="Pickup Contact Name"
                    value={item.pickupContactName}
                    onChange={(e) => handleItemChange('pickupContactName', e.target.value)}
                    InputProps={{
                      readOnly: !edittingPermission
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    label="Pickup Contact Number"
                    value={item.pickupContactNumber}
                    onChange={(e) => handleItemChange('pickupContactNumber', e.target.value)}
                    InputProps={{
                      readOnly: !edittingPermission
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    label="Pickup Company Name"
                    value={item.pickupCompanyName}
                    onChange={(e) => handleItemChange('pickupCompanyName', e.target.value)}
                    InputProps={{
                      readOnly: !edittingPermission
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={12}>
                  <TextField
                    fullWidth
                    label="Pickup Address Line 1"
                    value={item.pickupAddressLine1}
                    onChange={(e) => handleItemChange('pickupAddressLine1', e.target.value)}
                    InputProps={{
                      readOnly: !edittingPermission
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={12}>
                  <TextField
                    fullWidth
                    label="Pickup Address Line 2"
                    value={item.pickupAddressLine2}
                    onChange={(e) => handleItemChange('pickupAddressLine2', e.target.value)}
                    InputProps={{
                      readOnly: !edittingPermission
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    required
                    label="Pickup Zip Code"
                    value={item.pickupZipCode}
                    onChange={(e) => handleItemChange('pickupZipCode', e.target.value)}
                    InputProps={{
                      readOnly: !edittingPermission
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Pickup Country"
                    value={item.pickupCountry}
                    onChange={(e) => handleItemChange('pickupCountry', e.target.value)}
                    InputProps={{
                      readOnly: !edittingPermission
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Autocomplete
                    multiple
                    options={pickupAccessorialOptions}
                    getOptionLabel={(option) => option.label}
                    value={item.pickupAccessorials}
                    onChange={(event, newValue) => {
                      handleItemChange('pickupAccessorials', newValue);
                    }}
                    disabled={!edittingPermission}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Pickup Accessorial Services"
                        placeholder="Select services"
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} sm={12}>
                  <TextField
                    fullWidth
                    label="Notes / Remarks"
                    value={item.pickupNotes}
                    onChange={(e) => handleItemChange('pickupNotes', e.target.value)}
                    InputProps={{
                      readOnly: !edittingPermission
                    }}
                  />
                </Grid>

                {/* Delivery Section */}
                <Grid item xs={12}>
                  <Typography 
                    variant="subtitle1" 
                    bgcolor={'turquoise'} 
                    textAlign={'center'} 
                    sx={{ fontWeight: 600 }}>
                      DELIVERY DETAILS
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2">Delivery Time Start</Typography>
                  <TextField
                    fullWidth
                    // label="Pickup Time"
                    type="time"
                    value={item.deliveryTimeStart}
                    onChange={(e) => handleItemChange('deliveryTimeStart', e.target.value)}
                    InputProps={{
                      readOnly: !edittingPermission
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2">Delivery Time End</Typography>
                  <TextField
                    fullWidth
                    type="time"
                    value={item.deliveryTimeEnd}
                    onChange={(e) => handleItemChange('deliveryTimeEnd', e.target.value)}
                    InputProps={{
                      readOnly: !edittingPermission
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    label="Delivery Contact Name"
                    value={item.deliveryContactName}
                    onChange={(e) => handleItemChange('deliveryContactName', e.target.value)}
                    InputProps={{
                      readOnly: !edittingPermission
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    label="Delivery Contact Number"
                    value={item.deliveryContactNumber}
                    onChange={(e) => handleItemChange('deliveryContactNumber', e.target.value)}
                    InputProps={{
                      readOnly: !edittingPermission
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    label="Delivery Company Name"
                    value={item.deliveryCompanyName}
                    onChange={(e) => handleItemChange('deliveryCompanyName', e.target.value)}
                    InputProps={{
                      readOnly: !edittingPermission
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={12}>
                  <TextField
                    fullWidth
                    label="Delivery Address Line 1"
                    value={item.deliveryAddressLine1}
                    onChange={(e) => handleItemChange('deliveryAddressLine1', e.target.value)}
                    InputProps={{
                      readOnly: !edittingPermission
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={12}>
                  <TextField
                    fullWidth
                    label="Delivery Address Line 2"
                    value={item.deliveryAddressLine2}
                    onChange={(e) => handleItemChange('deliveryAddressLine2', e.target.value)}
                    InputProps={{
                      readOnly: !edittingPermission
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    required
                    label="Delivery Zip Code"
                    value={item.deliveryZipCode}
                    onChange={(e) => handleItemChange('deliveryZipCode', e.target.value)}
                    InputProps={{
                      readOnly: !edittingPermission
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Delivery Country"
                    value={item.deliveryCountry}
                    onChange={(e) => handleItemChange('deliveryCountry', e.target.value)}
                    InputProps={{
                      readOnly: !edittingPermission
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Autocomplete
                    multiple
                    options={deliveryAccessorialOptions}
                    getOptionLabel={(option) => option.label}
                    value={item.deliveryAccessorials}
                    onChange={(event, newValue) => {
                      handleItemChange('deliveryAccessorials', newValue);
                    }}
                    disabled={!edittingPermission}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Delivery Accessorial Services"
                        placeholder="Select services"
                       
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} sm={12}>
                  <TextField
                    fullWidth
                    label="Notes / Remarks"
                    value={item.deliveryNotes}
                    onChange={(e) => handleItemChange('deliveryNotes', e.target.value)}
                    InputProps={{
                      readOnly: !edittingPermission
                    }}
                  />
                </Grid>

                {/* Item Details Section */}
                <Grid item xs={12} xl={12} >
                  <Typography 
                    variant="subtitle1" 
                    bgcolor={'lightsteelblue'} 
                    textAlign={'center'} 
                    sx={{ fontWeight: 600 }}>
                      ITEM DETAILS
                    </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Button variant="contained" disabled={!edittingPermission} startIcon={<AddIcon />} onClick={()=>addInventoryItem1()}>Add An Item</Button>
                </Grid>
                {renderInventoryDetail(item,setItem)}
                <Grid item xs={12} xl={12} >
                  <Typography 
                    variant="subtitle1" 
                    bgcolor={'lightblue'} 
                    textAlign={'center'} 
                    sx={{ fontWeight: 600 }}>
                      INSURANCE DETAILS
                    </Typography>
                </Grid>
                <Grid item xs={6}>
                    <TextField
                      select
                      fullWidth
                      label="Freight Insurance"
                      value={item.freightInsurance}
                      onChange={(e) => handleItemChange('freightInsurance', e.target.value)}
                      InputProps={{
                        readOnly: !edittingPermission
                      }}
                    >
                        <MenuItem value="true">Required</MenuItem>
                        <MenuItem value="false">Not Required</MenuItem>
                      </TextField>                
                    </Grid>
                    <Grid item xs={6}>
                      {(item.freightInsurance === "true") ?
                        <TextField
                            fullWidth
                            label="Insurance Value"
                            value={item.insuranceValue}
                            onChange={(e) => handleItemChange('insuranceValue', e.target.value)}
                            InputProps={{
                              readOnly: !edittingPermission
                            }}
                          />
                          : null
                      }
                </Grid>
                </>

            ) : 
            <>
                <Grid item xs={12}>
                <TextField
                    fullWidth
                    label="Customer"
                    value={`${item.user.firstName} ${item.user.lastName} - ${item.user.companyName}`}
                    InputProps={{ readOnly: true }}
                  />
                </Grid>
              {/* Pickup Section */}
                <Grid item xs={12}>
                  <Typography 
                      variant="subtitle1" 
                      bgcolor={'lightskyblue'}
                      textAlign={'center'} 
                      sx={{ fontWeight: 600 }}>
                        PICKUP DETAILS
                    </Typography>
                </Grid>
                <Grid item xs={12} sm={12}>
                  <TextField
                    fullWidth
                    label="Pickup Address Line 1"
                    value={item.pickupAddressLine1}
                    onChange={(e) => handleItemChange('pickupAddressLine1', e.target.value)}
                    InputProps={{
                      readOnly: !edittingPermission
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={12}>
                  <TextField
                    fullWidth
                    label="Pickup Address Line 2"
                    value={item.pickupAddressLine2}
                    onChange={(e) => handleItemChange('pickupAddressLine2', e.target.value)}
                    InputProps={{
                      readOnly: !edittingPermission
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={12}>
                  <TextField
                    fullWidth
                    label="Pickup Address Line 3"
                    value={item.pickupAddressLine3}
                    onChange={(e) => handleItemChange('pickupAddressLine3', e.target.value)}
                    InputProps={{
                      readOnly: !edittingPermission
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    required
                    label="Pickup Zip Code"
                    value={item.pickupZipCode}
                    onChange={(e) => handleItemChange('pickupZipCode', e.target.value)}
                    InputProps={{
                      readOnly: !edittingPermission
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Pickup State/Province"
                    value={item.pickupState}
                    onChange={(e) => handleItemChange('pickupState', e.target.value)}
                    InputProps={{
                      readOnly: !edittingPermission
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Pickup City"
                    value={item.pickupCity}
                    onChange={(e) => handleItemChange('pickupCity', e.target.value)}
                    InputProps={{
                      readOnly: !edittingPermission
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Pickup Country"
                    value={item.pickupCountry}
                    onChange={(e) => handleItemChange('pickupCountry', e.target.value)}
                    InputProps={{
                      readOnly: !edittingPermission
                    }}
                  />
                </Grid>

                {/* Delivery Section */}
                <Grid item xs={12}>
                  <Typography 
                    variant="subtitle1" 
                    bgcolor={'turquoise'} 
                    textAlign={'center'} 
                    sx={{ fontWeight: 600 }}>
                      DELIVERY DETAILS
                  </Typography>
                </Grid>
              
                <Grid item xs={12} sm={12}>
                  <TextField
                    fullWidth
                    label="Delivery Address Line 1"
                    value={item.deliveryAddressLine1}
                    onChange={(e) => handleItemChange('deliveryAddressLine1', e.target.value)}
                    InputProps={{
                      readOnly: !edittingPermission
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={12}>
                  <TextField
                    fullWidth
                    label="Delivery Address Line 2"
                    value={item.deliveryAddressLine2}
                    onChange={(e) => handleItemChange('deliveryAddressLine2', e.target.value)}
                    InputProps={{
                      readOnly: !edittingPermission
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={12}>
                  <TextField
                    fullWidth
                    label="Delivery Address Line 3"
                    value={item.deliveryAddressLine3}
                    onChange={(e) => handleItemChange('deliveryAddressLine3', e.target.value)}
                    InputProps={{
                      readOnly: !edittingPermission
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    required
                    label="Delivery Zip Code"
                    value={item.deliveryZipCode}
                    onChange={(e) => handleItemChange('deliveryZipCode', e.target.value)}
                    InputProps={{
                      readOnly: !edittingPermission
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Delivery State/Province"
                    value={item.deliveryState}
                    onChange={(e) => handleItemChange('deliveryState', e.target.value)}
                    InputProps={{
                      readOnly: !edittingPermission
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Delivery City"
                    value={item.deliveryCity}
                    onChange={(e) => handleItemChange('deliveryCity', e.target.value)}
                    InputProps={{
                      readOnly: !edittingPermission
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Delivery Country"
                    value={item.deliveryCountry}
                    onChange={(e) => handleItemChange('deliveryCountry', e.target.value)}
                    InputProps={{
                      readOnly: !edittingPermission
                    }}
                  />
                </Grid>

                {/* Item Details Section */}
                <Grid item xs={12} xl={12} >
                  <Typography 
                    variant="subtitle1" 
                    bgcolor={'lightsteelblue'} 
                    textAlign={'center'} 
                    sx={{ fontWeight: 600 }}>
                      PACKAGE DETAILS
                    </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Button disabled={!edittingPermission} variant="contained" startIcon={<AddIcon />} onClick={()=>addInventoryItem1()}>Add An Item</Button>
                </Grid>
                {renderInventoryDetail(item,setItem)}
                <Grid item xs={12} xl={12} >
                  <Typography 
                    variant="subtitle1" 
                    bgcolor={'lightblue'} 
                    textAlign={'center'} 
                    sx={{ fontWeight: 600 }}>
                      SHIPPING SPECIFICS
                    </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                <Autocomplete
                    // multiple
                    options={Incoterms || []}
                    getOptionLabel={(option) => option.theLabel || []}
                    value={item.incoTerm}
                    onChange={(event, newValue) => {
                      handleItemChange('incoTerm', newValue);
                    }}
                    InputProps={{
                      readOnly: !edittingPermission
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Incoterms"
                        placeholder="Select Incoterm"
                      />
                    )}
                  />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                  <Autocomplete
                      // multiple
                      options={shippingModes || []}
                      getOptionLabel={(option) => option.theLabel}
                      value={item.shipmentMode}
                      onChange={(event, newValue) => {
                        handleItemChange('shipmentMode', newValue);
                      }}
                      InputProps={{
                        readOnly: !edittingPermission
                      }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Shipping Modes"
                          placeholder="Select Shipping Modes"
                        />
                      )}
                    />
                  </Grid>
                </>}
          </Grid>
          </DialogContent>)
          }
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button 
            onClick={() => {
              setOpenDetailsDialog(false);
              setSelectedUser(null);
              setSelectedOpportunity(null);
            }}
          >
            Close
          </Button> 
          <Button 
            variant="contained"
            onClick={isUser ? updateUserChange : updateOppChange}
          >
            Submit Changes
          </Button>
        </DialogActions>
      </Dialog>
    );
  };


  const tabItems = [
    { label: 'Users', icon: <Person /> },
    { label: 'Sales Opportunities', icon: <BusinessCenter /> },
    { label: 'Sales Estimates', icon: <Assessment /> },
    { label: 'Sales Invoice', icon: <Receipt /> },
    { label: 'Accounting', icon: <AccountBalanceIcon />},
    { label: 'Expenses/Reimbursements', icon: <AccountBalanceWalletIcon />}
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
                    <TableCell><Typography variant="body1" sx={{ fontWeight: 600 }}>ID</Typography></TableCell>
                    <TableCell><Typography variant="body1" sx={{ fontWeight: 600 }}>User</Typography></TableCell>
                    <TableCell><Typography variant="body1" sx={{ fontWeight: 600 }}>Type</Typography></TableCell>
                    <TableCell><Typography variant="body1" sx={{ fontWeight: 600 }}>Company</Typography></TableCell>
                    <TableCell><Typography variant="body1" sx={{ fontWeight: 600 }}>Contact</Typography></TableCell>
                    {/* <TableCell align="right">Actions</TableCell> */}
                    </TableRow>
                </TableHead>
                <TableBody>
                    { users.map((user) => (
                    <TableRow key={user.id} 
                              hover 
                              onClick={() => handleRowClick(user, 'user')}
                              sx={{ cursor: 'pointer' }}>
                      <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Typography variant="subtitle2">
                        {`${user.id}`}
                      </Typography>
                      </Box>
                    </TableCell>
                        <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Avatar sx={{ bgcolor: user.type === 'customer' ? 'primary.main' : 'secondary.main' }}>
                            {user.firstName[0]}{user.lastName[0]}
                            </Avatar>
                            <Box>
                            <Typography variant="subtitle2">{`${user.firstName} ${user.lastName}`}</Typography>
                            {
                            (trueTypeOf(user.email) === "array") ? user.email.map((em)=>{ console.log(trueTypeOf(user.email));
                              <Typography variant="body2" color="text.secondary">{em}</Typography>
                            }) : <Typography variant="body2" color="text.secondary">{user.email}</Typography>
                            }
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
                        <TableCell>{<Typography variant="body2" color="text.secondary">{user.phoneNumber}</Typography>
                            // (trueTypeOf(user.phoneNumber) === "array") ? user.phoneNumber.map((em)=>{
                            //   <Typography variant="body2" color="text.secondary">{em}</Typography>
                            // }) : <Typography variant="body2" color="text.secondary">{user.phoneNumber}</Typography>
                            }</TableCell>
                        {/* <TableCell align="right">
                        <IconButton size="small" color="primary">
                            <DetailsIcon fontSize="small" />
                        </IconButton>
                        <IconButton size="small" color="error">
                            <DeleteIcon fontSize="small" />
                        </IconButton>
                        </TableCell> */}
                    </TableRow>
                    ))}
                </TableBody>
                </Table>
            </TableContainer>
            </Box>
        );
    }

const OpportunitiesList = () => {
  
  const [status, setStatus] = useState('');
  // const checkStatus = (opp)=>{
  //   if(opp.carrierEstimates != null){
  //     opp.status
  //   }
  //   else{
  //     setStatus('No Action Taken');
  //   }
  // }
  console.log(opportunities);

  return(
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
                  <TableCell><Typography variant="body1" sx={{ fontWeight: 600 }}>ID</Typography></TableCell>
                  <TableCell><Typography variant="body1" sx={{ fontWeight: 600 }}>Customer</Typography></TableCell>
                  <TableCell><Typography variant="body1" sx={{ fontWeight: 600 }}>Shipment Type</Typography></TableCell>
                  <TableCell><Typography variant="body1" sx={{ fontWeight: 600 }}>Weight/Dimensions</Typography></TableCell>
                  {/* <TableCell><Typography variant="body1" sx={{ fontWeight: 600 }}>Commodity</Typography></TableCell> */}
                  <TableCell><Typography variant="body1" sx={{ fontWeight: 600 }}>Status</Typography></TableCell>
                  {/* <TableCell align="right">Actions</TableCell> */}
                </TableRow>
              </TableHead>
              <TableBody>
                {
                 ((opportunities.length) > 1) ? opportunities.map((opportunity) => (
                  
                  <TableRow key={opportunity.id} 
                            hover
                            onClick={() => handleRowClick(opportunity, 'opportunity')}
                            sx={{ cursor: 'pointer' }}>

                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Typography variant="subtitle2">
                        {`${opportunity.id}`}
                      </Typography>
                      </Box>
                    </TableCell>
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
                      {(opportunity.shipmentType.value === "Domestic" ) ?
                        <LocalShipping fontSize="small" color="action" />:
                        <Airlines fontSize="small" color="action" />
                      }
                        <Box>
                        <Typography variant="subtitle2">{opportunity.shipmentType.value}</Typography>      
                        {(opportunity.shipmentType.value === "International" ) ?  
                        <>           
                          <Typography variant="body2" color="text.secondary">
                            {opportunity.incoTerm.theValue}
                          </Typography>
                          <Typography variant="caption text" color="text.secondary">
                            {opportunity.shipmentMode.theValue}
                          </Typography> 
                        </>: null}
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                    {/*  */}
                    { (opportunity.inventoryDetails !== null) ?
                    <Typography variant="body2">{`Total Items : ${opportunity.inventoryDetails.length - 1}`}</Typography> : null}
                      { (opportunity.inventoryDetails !== null) ? (                      
                      opportunity.inventoryDetails.map((inventory)=>{
                        return((inventory.id > 0) ?
                      <>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="body2">{`${inventory.weight} ${inventory.weightUnit}`}</Typography>
                        <Typography variant="body2" color="text.secondary">
                          {`${inventory.Length}x${inventory.Height}x${inventory.Width} ${inventory.dimUnit}`}
                        </Typography>
                        </Box>
                      </> : null)}) ):null}
                    </TableCell>
                    {/* <TableCell>{opportunity.commodityName}</TableCell> */}
                    <TableCell>
                      {(opportunity.carrierEstimates) ? <Typography
                                                                  sx={{
                                                                    backgroundColor: 'green',
                                                                    color: 'black',
                                                                    padding: '4px 8px',
                                                                    borderRadius: 1
                                                                  }}
                                                                >
                                                                  Action Taken
                                                                </Typography> : 
                                                                <Typography
                                                                  sx={{
                                                                    backgroundColor: 'red',
                                                                    color: 'black',
                                                                    padding: '4px 8px',
                                                                    borderRadius: 1
                                                                  }}
                                                                >
                                                                  No Action Taken
                                                                </Typography>}
                    </TableCell>
                    {/* <TableCell align="right">
                      <IconButton size="small" color="primary">
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton size="small" color="error">
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </TableCell> */}
                  </TableRow>
                )):null}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      );}

      const SalesEstimateTab = ({ opportunities, setOpportunities }) => {
        const [openEstimateDialog, setOpenEstimateDialog] = useState(false);
        const [openEditEstimateDialog, setOpenEditEstimateDialog] = useState(false);
        const [selectedOpportunity, setSelectedOpportunity] = useState(null);
        const [newCarrierName, setNewCarrierName] = useState('');
        const [newCarrierCost, setNewCarrierCost] = useState('');
        const [newCarrierDetails, setNewCarrierDetails] = useState('');
        const [editCarrierName, setEditCarrierName] = useState('');
        const [editCarrierCost, setEditCarrierCost] = useState('');
        const [editCarrierDetails, setEditCarrierDetails] = useState('');
        const [check, setCheck] = useState('');
        // opportunities.map((opp)=>{
        //   (opp.selectedCarrier !== null) ? 
        //   setSelectedCarriers({
        //     ...selectedCarriers,
        //     [opp.id] : JSON.stringify(opp.selectedCarrier)}) : setSelectedCarriers(...selectedCarriers)
        // })

        const handleAddEstimate = (opportunity) => {
          setSelectedOpportunity(opportunity);
          setCheck('new');
          setOpenEstimateDialog(true);
        };
      
        const handleEstimateSubmit = async () => {
          // Update the opportunity with the new carrier estimate
          let updatedOpportunities = [];

          if(check === 'edit'){
            updatedOpportunities = opportunities.map((opp) => {
              if (opp.id === selectedOpportunity.id) {
                opp.carrierEstimates.map((oppCar)=>{
                  if(oppCar.name === editCarrierName){
                      oppCar.name = editCarrierName;
                      oppCar.cost = editCarrierCost;
                      oppCar.details = editCarrierDetails;
                      return oppCar;
                  }
                })
              }
              return opp;
            });
          }else{
            updatedOpportunities = opportunities.map((opp) => {
              if (opp.id === selectedOpportunity.id) {
                return {
                  ...opp,
                  carrierEstimates: [
                    ...(opp.carrierEstimates || []),
                    { name: newCarrierName, cost: newCarrierCost, details: newCarrierDetails }
                  ]
                };
              }
              return opp;
            });
          }
          // Update the opportunities state with the new data

          setOpportunities(updatedOpportunities);
          console.log(updatedOpportunities);
          setOpenEstimateDialog(false);
          setNewCarrierName('');
          setNewCarrierCost('');

          try {
            setLoading(true);
            const UpdateOpp = {
              'theID' : selectedOpportunity.id,
              'theOpportunities' : updatedOpportunities
            }
            const response = await instance.post('/updateOpportunityData', UpdateOpp);
            console.log((response));
            // window.alert('Data has been submitted');
          } catch (error) {
            setLoading(false);
            window.alert('Data not submitted');
            console.error(error);
          } finally {
            setLoading(false);
            setReloadOpp(true);
          }
     
        };

       const handleCarrierChange =  async (opportunity, value) => {
          setSelectedCarriers({
            ...selectedCarriers,
            [opportunity.id]: value,
          });
          console.log(selectedCarriers);
          setSelectedOpportunity(opportunity);
          const updatedOpportunities = opportunities.map((opp) => {
            //console.log(opp)
            if (opp.id === opportunity.id) {
              return {
                ...opp,
                selectedCarrier: JSON.parse(value)     
              };
            }
            console.log(opp)
            return opp;
          });

          // setOpportunities(updatedOpportunities);
          console.log(updatedOpportunities);

          try { 
            setLoading(true);
            const UpdateOpp = {
              'theID' : opportunity.id,
              'theOpportunities' : updatedOpportunities
            }
            console.log(UpdateOpp);
            const response = await instance.post('/updateOpportunityData', UpdateOpp);
            console.log((response));
            // window.alert('Data has been submitted');
          } catch (error) { 
            setLoading(false);
            window.alert('Data not submitted');
            console.error(error);
          } finally {
            setLoading(false);
            setReloadOpp(true);
          }


          
        };

        const handleEditCarrier = async (carrier,opportunity) =>{
          setCheck('edit');
          setSelectedOpportunity(opportunity);
          setEditCarrierName(carrier.name);
          setEditCarrierCost(carrier.cost);
          setEditCarrierDetails(carrier.details);

          setOpenEditEstimateDialog(true);
        }
      
        const handleDeleteEstimate = (opportunity, index) => {
          const updatedOpportunities = opportunities.map((opp) => {
            if (opp.id === opportunity.id) {
              return {
                ...opp,
                carrierEstimates: opp.carrierEstimates.filter((_, i) => i !== index)
              };
            }
            return opp;
          });
          setOpportunities(updatedOpportunities);
        };

      
        return (
          <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Sales Estimates
              </Typography>
              {/* <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => setOpenEstimateDialog(true)}
                sx={{
                  backgroundColor: theme.palette.primary.main,
                  '&:hover': {
                    backgroundColor: alpha(theme.palette.primary.main, 0.9)
                  }
                }}
              >
                Add Carrier Estimate
              </Button> */}
            </Box>
      
            <TableContainer component={Paper} elevation={0} sx={{ border: `1px solid ${theme.palette.divider}` }} >
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell><Typography variant="body1" sx={{ fontWeight: 600 }}>ID</Typography></TableCell>
                    <TableCell><Typography variant="body1" sx={{ fontWeight: 600 }}>Customer</Typography></TableCell>
                    <TableCell><Typography variant="body1" sx={{ fontWeight: 600 }}>Shipment Type</Typography></TableCell>
                    <TableCell><Typography variant="body1" sx={{ fontWeight: 600 }}>Weight/Dimensions</Typography></TableCell>
                    {/* <TableCell><Typography variant="body1" sx={{ fontWeight: 600 }}>Commodity</Typography></TableCell> */}
                    <TableCell><Typography variant="body1" sx={{ fontWeight: 600 }}>Carrier Details</Typography></TableCell>
                    <TableCell><Typography variant="body1" sx={{ fontWeight: 600 }}>Actions</Typography></TableCell>
                    <TableCell><Typography variant="body1" sx={{ fontWeight: 600 }}>Status</Typography></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {( opportunities.length > 0)  ? opportunities.map((opportunity) => (
                    <TableRow key={opportunity.id}>

                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Typography variant="subtitle2">
                        {`${opportunity.id}`}
                      </Typography>
                      </Box>
                    </TableCell>


                      <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Avatar sx={{ bgcolor: 'primary.main' }}>
                          {opportunity.user.firstName[0]}{opportunity.user.lastName[0]}
                        </Avatar>
                        <Box>
                      <Typography variant="body2">{`${opportunity.user.firstName} ${opportunity.user.lastName}`}</Typography>
                      <Typography variant="body2" color="text.secondary">
                          {opportunity.user.companyName}
                        </Typography>
                        </Box>
                        </Box>                      
                        </TableCell>
                        <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      {(opportunity.shipmentType.value === "Domestic" ) ?
                        <LocalShipping fontSize="small" color="action" />:
                        <Airlines fontSize="small" color="action" />
                      }
                        <Box>
                        <Typography variant="subtitle2">{opportunity.shipmentType.value}</Typography>      
                        {(opportunity.shipmentType.value === "International" ) ?  
                        <>           
                          <Typography variant="body2" color="text.secondary">
                            {opportunity.incoTerm.theValue}
                          </Typography>
                          <Typography variant="caption text" color="text.secondary">
                            {opportunity.shipmentMode.theValue}
                          </Typography> 
                        </>: null}
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                    {/*  */}
                    { (opportunity.inventoryDetails !== null) ?
                    <Typography variant="body2">{`Total Items : ${opportunity.inventoryDetails.length - 1}`}</Typography> : null}
                      { (opportunity.inventoryDetails !== null) ? (                      
                      opportunity.inventoryDetails.map((inventory)=>{
                        return((inventory.id > 0) ?
                      <>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="body2">{`${inventory.weight} ${inventory.weightUnit}`}</Typography>
                        <Typography variant="body2" color="text.secondary">
                          {`${inventory.Length}x${inventory.Height}x${inventory.Width} ${inventory.dimUnit}`}
                        </Typography>
                        </Box>
                      </> : null)}) ):null}
                    </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          {(opportunity.userPayment && opportunity.selectedCarrier) ? 
                          <TextField
                            fullWidth
                            value={ `Carrier : ${opportunity.selectedCarrier.name} at $${opportunity.selectedCarrier.cost}`}
                            InputProps={{ readOnly: true }}
                          /> :<>
                          
                          <FormControl fullWidth>
                            <InputLabel id="carrier-select-label">Carrier</InputLabel>
                            <Select
                              labelId="carrier-select-label"
                              id="carrier-select"
                              value={(opportunity.selectedCarrier) ? JSON.stringify(opportunity.selectedCarrier) : selectedCarriers[opportunity.id] || ''}
                              onChange={(e) => handleCarrierChange(opportunity, e.target.value)}
                              label="Carrier"
                            >
                              <MenuItem value="">
                                <em>Select a carrier</em>
                              </MenuItem>
                              {(opportunity.carrierEstimates || []).map((carrier, index) => (
                                <MenuItem key={index} value={JSON.stringify(carrier)}>
                                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                                    <span>{`${carrier.name} quote $${carrier.cost}`}</span>
                                    <IconButton
                                      onClick={(e) => {
                                        e.stopPropagation(); // Prevent the menu from closing
                                        handleEditCarrier(carrier, opportunity);
                                      }}
                                      size="small"
                                    >
                                      <EditIcon fontSize="small" />
                                    </IconButton>
                                  </div>
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                          </>
                          }
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={() => handleAddEstimate(opportunity)}
                          size="small"
                        >
                          Add Estimate
                        </Button>
                      </TableCell>
                      <TableCell>
                      {(opportunity.userPayment) ? <Typography
                                                                  sx={{
                                                                    backgroundColor: 'green',
                                                                    color: 'black',
                                                                    padding: '4px 8px',
                                                                    borderRadius: 1
                                                                  }}
                                                                >
                                                                  Finalized
                                                                </Typography> : 
                                                                <Typography
                                                                  sx={{
                                                                    backgroundColor: 'red',
                                                                    color: 'black',
                                                                    padding: '4px 8px',
                                                                    borderRadius: 1
                                                                  }}
                                                                >
                                                                  In Progress
                                                                </Typography>}
                    </TableCell>
                    </TableRow>
                  )) : null}
                </TableBody>
              </Table>
            </TableContainer>
      
            {/* Add Carrier Estimate Dialog */}
            <Dialog
              open={openEstimateDialog}
              onClose={() => setOpenEstimateDialog(false)}
              maxWidth="md"
              fullWidth
            >
              <DialogTitle sx={{ m: 0, p: 2, pb: 1 }}>
                <Typography variant="h6">Add Carrier Estimate</Typography>
                <IconButton
                  onClick={() => setOpenEstimateDialog(false)}
                  sx={{
                    position: 'absolute',
                    right: 8,
                    top: 8
                  }}
                >
                  <CloseIcon />
                </IconButton>
              </DialogTitle>
              <DialogContent dividers>
                <Box>
                  <TextField
                    fullWidth
                    label="Carrier Name"
                    value={newCarrierName}
                    onChange={(e) => setNewCarrierName(e.target.value)}
                  />
                </Box>
                <Box sx={{ mt: 2 }}>
                  <TextField
                    fullWidth
                    label="Carrier Cost"
                    value={newCarrierCost}
                    onChange={(e) => setNewCarrierCost(e.target.value)}
                    type="number"
                  />
                </Box>
                <Box sx={{ mt: 2 }}>
                  <TextField
                    fullWidth
                    label="Carrier Details"
                    value={newCarrierDetails}
                    onChange={(e) => setNewCarrierDetails(e.target.value)}
                  />
                </Box>
              </DialogContent>
              <DialogActions sx={{ p: 2 }}>
                <Button onClick={() => setOpenEstimateDialog(false)}>Cancel</Button>
                <Button variant="contained" onClick={handleEstimateSubmit}>
                  Save Estimate
                </Button>
              </DialogActions>
            </Dialog>

            <Dialog
              open={openEditEstimateDialog}
              onClose={() => setOpenEditEstimateDialog(false)}
              maxWidth="md"
              fullWidth
            >
              <DialogTitle sx={{ m: 0, p: 2, pb: 1 }}>
                <Typography variant="h6">Add Carrier Estimate</Typography>
                <IconButton
                  onClick={() => setOpenEditEstimateDialog(false)}
                  sx={{
                    position: 'absolute',
                    right: 8,
                    top: 8
                  }}
                >
                  <CloseIcon />
                </IconButton>
              </DialogTitle>
              <DialogContent dividers>
                <Box>
                  <TextField
                    fullWidth
                    label="Carrier Name"
                    value={editCarrierName}
                    onChange={(e) => setEditCarrierName(e.target.value)}
                  />
                </Box>
                <Box sx={{ mt: 2 }}>
                  <TextField
                    fullWidth
                    label="Carrier Cost"
                    value={editCarrierCost}
                    onChange={(e) => setEditCarrierCost(e.target.value)}
                    type="number"
                  />
                </Box>
                <Box sx={{ mt: 2 }}>
                  <TextField
                    fullWidth
                    label="Carrier Details"
                    value={editCarrierDetails}
                    onChange={(e) => setEditCarrierDetails(e.target.value)}
                  />
                </Box>
              </DialogContent>
              <DialogActions sx={{ p: 2 }}>
                <Button onClick={() => setOpenEditEstimateDialog(false)}>Cancel</Button>
                <Button variant="contained" onClick={handleEstimateSubmit}>
                  Save Estimate
                </Button>
              </DialogActions>
            </Dialog>

          </Box>
        );
      };

      const SalesInvoiceTab = ({ opportunities, setOpportunities }) => {
        const [openCustPaymentDialog, setOpenCustPaymentDialog] = useState(false);
        const [newCustomerPayment, setNewCustomerPayment] = useState('');
        const [selectedOpportunity, setSelectedOpportunity] = useState(null);

        const handleAddPayment = (opportunity)=>{
          setSelectedOpportunity(opportunity);
          setOpenCustPaymentDialog(true);
        }

        const handlePaymentSubmit = async () => {
          // Update the opportunity with the new customer payment
          const updatedOpportunities = opportunities.map((opp) => {
            if (opp.id === selectedOpportunity.id) {
              return {
                ...opp,
                userPayment: newCustomerPayment
              };
            }
            return opp;
          });
          // Update the opportunities state with the new data

          setOpportunities(updatedOpportunities);
          console.log(updatedOpportunities);
          setOpenCustPaymentDialog(false);
          setNewCustomerPayment('');
          try {
            setLoading(true);
            const UpdateOpp = {
              'theID' : selectedOpportunity.id,
              'theOpportunities' : updatedOpportunities
            }
            const response = await instance.post('/updateOpportunityData', UpdateOpp);
            console.log((response));
            // window.alert('Data has been submitted');
          } catch (error) {
            window.alert('Data not submitted');
            console.error(error);
            setLoading(false);
          } finally {
            setLoading(false);
            setReloadOpp(true);
          }
     
        };

        return (
          <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Sales Invoice
              </Typography>
            </Box>
    
            <TableContainer component={Paper} elevation={0} sx={{ border: `1px solid ${theme.palette.divider}` }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell><Typography variant="body1" sx={{ fontWeight: 600 }}>ID</Typography></TableCell>
                    <TableCell><Typography variant="body1" sx={{ fontWeight: 600 }}>Customer</Typography></TableCell>
                    <TableCell><Typography variant="body1" sx={{ fontWeight: 600 }}>Load Type</Typography></TableCell>
                    <TableCell><Typography variant="body1" sx={{ fontWeight: 600 }}>Weight/Dimensions</Typography></TableCell>
                    {/* <TableCell><Typography variant="body1" sx={{ fontWeight: 600 }}>Commodity</Typography></TableCell> */}
                    <TableCell><Typography variant="body1" sx={{ fontWeight: 600 }}>Selected Carrier</Typography></TableCell>
                    <TableCell><Typography variant="body1" sx={{ fontWeight: 600 }}>Customer Payment</Typography></TableCell>
                    <TableCell><Typography variant="body1" sx={{ fontWeight: 600 }}>Action</Typography></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {( opportunities.length > 0)  ? opportunities.map((opportunity) => (
                    <TableRow key={opportunity.id}>

                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Typography variant="subtitle2">
                        {`${opportunity.id}`}
                      </Typography>
                      </Box>
                    </TableCell>


                      <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Avatar sx={{ bgcolor: 'primary.main' }}>
                          {opportunity.user.firstName[0]}{opportunity.user.lastName[0]}
                        </Avatar>
                        <Box>
                      <Typography variant="body2">{`${opportunity.user.firstName} ${opportunity.user.lastName}`}</Typography>
                      <Typography variant="body2" color="text.secondary">
                          {opportunity.user.companyName}
                        </Typography>
                        </Box>
                        </Box>  
                      </TableCell>
                      <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      {(opportunity.shipmentType.value === "Domestic" ) ?
                        <LocalShipping fontSize="small" color="action" />:
                        <Airlines fontSize="small" color="action" />
                      }
                        <Box>
                        <Typography variant="subtitle2">{opportunity.shipmentType.value}</Typography>      
                        {(opportunity.shipmentType.value === "International" ) ?  
                        <>           
                          <Typography variant="body2" color="text.secondary">
                            {opportunity.incoTerm.theValue}
                          </Typography>
                          <Typography variant="caption text" color="text.secondary">
                            {opportunity.shipmentMode.theValue}
                          </Typography> 
                        </>: null}
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                    {/*  */}
                    { (opportunity.inventoryDetails !== null) ?
                    <Typography variant="body2">{`Total Items : ${opportunity.inventoryDetails.length - 1}`}</Typography> : null}
                      { (opportunity.inventoryDetails !== null) ? (                      
                      opportunity.inventoryDetails.map((inventory)=>{
                        return((inventory.id > 0) ?
                      <>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="body2">{`${inventory.weight} ${inventory.weightUnit}`}</Typography>
                        <Typography variant="body2" color="text.secondary">
                          {`${inventory.Length}x${inventory.Height}x${inventory.Width} ${inventory.dimUnit}`}
                        </Typography>
                        </Box>
                      </> : null)}) ):null}
                    </TableCell>
                      <TableCell>
                      { (opportunity.selectedCarrier) ? <div>
                      <Typography variant="body1">{`Name : ${opportunity.selectedCarrier.name}`}</Typography>
                      <Typography variant="body1">{`Cost : $${opportunity.selectedCarrier.cost}`}</Typography>
                      </div> : ''
                      }
                      </TableCell>
                      <TableCell>
                      <Typography variant="body1">{(opportunity.userPayment)?`$${opportunity.userPayment}`: `Not Entered `}</Typography>
                      </TableCell>
                      <TableCell>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={() => handleAddPayment(opportunity)}
                            size="small"
                          >
                            Add Customer Payment
                          </Button>
                      </TableCell>
                    </TableRow>
                  )) : null}
                </TableBody>
              </Table>
            </TableContainer>

            {/* Add Customer Payment Dialog */}
            <Dialog
              open={openCustPaymentDialog}
              onClose={() => setOpenCustPaymentDialog(false)}
              maxWidth="md"
              fullWidth
            >
              <DialogTitle sx={{ m: 0, p: 2, pb: 1 }}>
                <Typography variant="h6">Add Carrier Estimate</Typography>
                <IconButton
                  onClick={() => setOpenCustPaymentDialog(false)}
                  sx={{
                    position: 'absolute',
                    right: 8,
                    top: 8
                  }}
                >
                  <CloseIcon />
                </IconButton>
              </DialogTitle>
              <DialogContent dividers>
                
                <Box sx={{ mt: 2 }}>
                  <TextField
                    fullWidth
                    label="Customer Payment"
                    value={newCustomerPayment}
                    onChange={(e) => setNewCustomerPayment(e.target.value)}
                    type="number"
                  />
                </Box>
              </DialogContent>
              <DialogActions sx={{ p: 2 }}>
                <Button onClick={() => setOpenCustPaymentDialog(false)}>Cancel</Button>
                <Button variant="contained" onClick={handlePaymentSubmit}>
                  Save Payment
                </Button>
              </DialogActions>
            </Dialog>

          </Box>
        );
      };

      const AccountingTab = ({ opportunities, setOpportunities }) => {
        const [selectedOpportunity, setSelectedOpportunity] = useState(null);
        const [openAccountingDialog, setOpenAccountingDialog] = useState(false);
        const [supplierPaymentForm, setSupplierPaymentForm] = useState({
          supplierCharge: '',
          dueDate: '',
          paidAmount: '',
          paymentDate: '',
          paymentMethod: '',
          amountDeductedFromBank: '',
          transactionRef: '',
          notes: '',
          status: ''
        });
        
        const [customerPaymentForm, setCustomerPaymentForm] = useState({
          customerCharge: '',
          dueDate: '',
          paidAmount: '',
          paymentDate: '',
          paymentMethod: '',
          amountReceivedInBank: '',
          transactionRef: '',
          notes: '',
          status: ''
        });

        // console.log("herehere");
        // console.log(selectedOpportunity);

        const handleAddAccountingInfo  = (opportunity)=>{
          setSelectedOpportunity(opportunity);
          if(opportunity.supplierPaymentForm !== undefined){
            setSupplierPaymentForm(opportunity.supplierPaymentForm);
            console.log(opportunity.supplierPaymentForm);
          }
          if(opportunity.customerPaymentForm !== undefined){
            setCustomerPaymentForm(opportunity.customerPaymentForm);
            console.log(opportunity.customerPaymentForm);
          }
          setOpenAccountingDialog(true);
        }

        const handleSupplierPaymentChange = (field, value) => {
          setSupplierPaymentForm(prev => ({
            ...prev,
            [field]: value
          }));

          setSelectedOpportunity(prev => ({
            ...prev,
            supplierPaymentForm
          }));
          console.log(supplierPaymentForm);
        };

        const handleCustomerPaymentChange = (field, value) => {
          setCustomerPaymentForm(prev => ({
            ...prev,
            [field]: value
          }));

          setSelectedOpportunity(prev => ({
            ...prev,
            customerPaymentForm
          }));
          // console.log(customerPaymentForm);
        };

        const handleAccInfoSubmit = async () => {
          // setSelectedOpportunity(prev => ({
          //   ...prev,
          //   supplierPaymentForm,
          //   customerPaymentForm
          // }))
          let theOpp = {...selectedOpportunity, supplierPaymentForm, customerPaymentForm};
          // console.log(supplierPaymentForm);
          // console.log(customerPaymentForm);

          console.log(theOpp);
          try {
            setLoading(true);
            const UpdateOpp = {
              'theID' : theOpp.id,
              'theOpportunities' : theOpp
            }
            const response = await instance.post('/updateOpportunityData', UpdateOpp);
            console.log((response));
            
            window.alert('Data has been submitted');
          } catch (error) {
            setLoading(false);
            window.alert('Data not submitted');
            console.error(error);
          } finally {
            setLoading(false);
            setReloadOpp(true);
          }  

          setSelectedOpportunity(null);

          setSupplierPaymentForm({
            supplierCharge: '',
            dueDate: '',
            paidAmount: '',
            paymentDate: '',
            paymentMethod: '',
            amountDeductedFromBank: '',
            transactionRef: '',
            notes: '',
            status: ''
          });

          setCustomerPaymentForm({
            customerCharge: '',
            dueDate: '',
            paidAmount: '',
            paymentDate: '',
            paymentMethod: '',
            amountReceivedInBank: '',
            transactionRef: '',
            notes: '',
            status: ''
          });

        }

        const closeDialogue = ()=>{

          setOpenAccountingDialog(false);
        
          setSelectedOpportunity(null);

          setSupplierPaymentForm({
            supplierCharge: '',
            dueDate: '',
            paidAmount: '',
            paymentDate: '',
            paymentMethod: '',
            amountDeductedFromBank: '',
            transactionRef: '',
            notes: '',
            status: ''
          });

          setCustomerPaymentForm({
            customerCharge: '',
            dueDate: '',
            paidAmount: '',
            paymentDate: '',
            paymentMethod: '',
            amountReceivedInBank: '',
            transactionRef: '',
            notes: '',
            status: ''
          });

        }
      
        return (
          <Box>
            {/* Opportunities List Section */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Accounting
              </Typography>
            </Box>
            
            <TableContainer component={Paper} elevation={0} sx={{ border: `1px solid ${theme.palette.divider}` }} >
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell><Typography variant="body1" sx={{ fontWeight: 600 }}>ID</Typography></TableCell>
                    <TableCell><Typography variant="body1" sx={{ fontWeight: 600 }}>Customer</Typography></TableCell>
                    <TableCell><Typography variant="body1" sx={{ fontWeight: 600 }}>Shipment Type</Typography></TableCell>
                    <TableCell><Typography variant="body1" sx={{ fontWeight: 600 }}>Carrier Cost</Typography></TableCell>
                    <TableCell><Typography variant="body1" sx={{ fontWeight: 600 }}>Customer Payment</Typography></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {( opportunities.length > 0) ? opportunities.map((opportunity) => (
                      <TableRow key={opportunity.id}
                      hover
                      selected={selectedOpportunity?.id === opportunity.id}
                      onClick={(opportunity.userPayment) ? () => handleAddAccountingInfo(opportunity) : null}
                      sx={{ cursor: 'pointer'}}
                          >

                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Typography variant="subtitle2">
                        {`${opportunity.id}`}
                      </Typography>
                      </Box>
                    </TableCell>
                      <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Avatar sx={{ bgcolor: 'primary.main' }}>
                          {opportunity.user.firstName[0]}{opportunity.user.lastName[0]}
                        </Avatar>
                        <Box>
                      <Typography variant="body2">{`${opportunity.user.firstName} ${opportunity.user.lastName}`}</Typography>
                      <Typography variant="body2" color="text.secondary">
                          {opportunity.user.companyName}
                        </Typography>
                        </Box>
                        </Box>                      
                        </TableCell>
                        <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      {(opportunity.shipmentType.value === "Domestic" ) ?
                        <LocalShipping fontSize="small" color="action" />:
                        <Airlines fontSize="small" color="action" />
                      }
                        <Box>
                        <Typography variant="subtitle2">{opportunity.shipmentType.value}</Typography>      
                        {(opportunity.shipmentType.value === "International" ) ?  
                        <>           
                          <Typography variant="body2" color="text.secondary">
                            {opportunity.incoTerm.theValue}
                          </Typography>
                          <Typography variant="caption text" color="text.secondary">
                            {opportunity.shipmentMode.theValue}
                          </Typography> 
                        </>: null}
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                    {/*  */}
                    <Typography variant="subtitle2">{opportunity.selectedCarrier 
                            ? `$${opportunity.selectedCarrier.cost}` 
                            : 'Not Selected'}</Typography> 
                    </TableCell>
                      <TableCell>
                      <Typography variant="subtitle2">{opportunity.userPayment 
                            ? `$${opportunity.userPayment}` 
                            : 'Not Paid'}</Typography> 
                      </TableCell>
                    </TableRow>
                  )) : null}
                </TableBody>
              </Table>
            </TableContainer>
      
            {/* Payment Forms Section Dialog */}
            <Dialog
              open={openAccountingDialog}
              onClose={closeDialogue}
              maxWidth={false}
              fullWidth
            >
              <DialogTitle sx={{ m: 0, p: 2, pb: 1 }}>
                <Typography variant="h6">Accounting Info</Typography>
                <IconButton
                  onClick={closeDialogue}
                  sx={{
                    position: 'absolute',
                    right: 8,
                    top: 8
                  }}
                >
                  <CloseIcon />
                </IconButton>
              </DialogTitle>
              <DialogContent dividers>
              <Box sx={{ display: 'flex', width: '100%', p: 2 }}>
              {(selectedOpportunity) ? (
                <Box sx={{ display: 'flex', width: '100%', gap: 3 }}>
                  {/* Supplier Payment Section */}
                  <Paper elevation={3} sx={{ p: 3, width: '100%' }}>
                    <Typography variant="h6" gutterBottom>
                      Supplier Payment for Opportunity ID: {selectedOpportunity.id}
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          label="Customer"
                          value={`${selectedOpportunity.user.firstName} ${selectedOpportunity.user.lastName}`}
                          InputProps={{ readOnly: true }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Supplier Charge"
                          type="number"
                          value={selectedOpportunity.selectedCarrier.cost}
                          onChange={(e) => handleSupplierPaymentChange('supplierCharge', e.target.value)}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Due Date"
                          type="date"
                          InputLabelProps={{ shrink: true }}
                          value={supplierPaymentForm.dueDate}
                          onChange={(e) => handleSupplierPaymentChange('dueDate', e.target.value)}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Paid Amount"
                          type="number"
                          value={supplierPaymentForm.paidAmount }
                          onChange={(e) => handleSupplierPaymentChange('paidAmount', e.target.value)}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Payment Date"
                          type="date"
                          InputLabelProps={{ shrink: true }}
                          value={supplierPaymentForm.paymentDate}
                          onChange={(e) => handleSupplierPaymentChange('paymentDate', e.target.value)}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          select
                          fullWidth
                          label="Payment Method"
                          value={supplierPaymentForm.paymentMethod}
                          onChange={(e) => handleSupplierPaymentChange('paymentMethod', e.target.value)}
                        >
                          {paymentMethods.map((method) => (
                            <MenuItem key={method} value={method}>
                              {method}
                            </MenuItem>
                          ))}
                        </TextField>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Amount Deducted from Bank"
                          type="number"
                          value={supplierPaymentForm.amountDeductedFromBank}
                          onChange={(e) => handleSupplierPaymentChange('amountDeductedFromBank', e.target.value)}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Transaction Reference"
                          value={supplierPaymentForm.transactionRef}
                          onChange={(e) => handleSupplierPaymentChange('transactionRef', e.target.value)}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          select
                          fullWidth
                          label="Status"
                          value={supplierPaymentForm.status}
                          onChange={(e) => handleSupplierPaymentChange('status', e.target.value)}
                        >
                          {supplierPaymentStatuses.map((status) => (
                            <MenuItem key={status} value={status}>
                              {status}
                            </MenuItem>
                          ))}
                        </TextField>
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          label="Notes"
                          multiline
                          rows={3}
                          value={supplierPaymentForm.notes}
                          onChange={(e) => handleSupplierPaymentChange('notes', e.target.value)}
                        />
                      </Grid>
                      {/* Rest of the supplier payment form fields (similar to previous implementation) */}
                    </Grid>
                  </Paper>
      
                  {/* Customer Payment Section */}
                  <Paper elevation={3} sx={{ p: 3, width: '100%' }}>
                    <Typography variant="h6" gutterBottom>
                      Customer Payment for Opportunity ID: {selectedOpportunity.id}
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          label="Customer"
                          value={`${selectedOpportunity.user.firstName} ${selectedOpportunity.user.lastName}`}
                          InputProps={{ readOnly: true }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Customer Charge"
                          type="number"
                          value={selectedOpportunity.userPayment}
                          onChange={(e) => handleCustomerPaymentChange('customerCharge', e.target.value)}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Due Date"
                        type="date"
                        InputLabelProps={{ shrink: true }}
                        value={customerPaymentForm.dueDate}
                        onChange={(e) => handleCustomerPaymentChange('dueDate', e.target.value)}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Paid Amount"
                        type="number"
                        value={customerPaymentForm.paidAmount}
                        onChange={(e) => handleCustomerPaymentChange('paidAmount', e.target.value)}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Payment Date"
                        type="date"
                        InputLabelProps={{ shrink: true }}
                        value={customerPaymentForm.paymentDate}
                        onChange={(e) => handleCustomerPaymentChange('paymentDate', e.target.value)}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        select
                        fullWidth
                        label="Payment Method"
                        value={customerPaymentForm.paymentMethod}
                        onChange={(e) => handleCustomerPaymentChange('paymentMethod', e.target.value)}
                      >
                        {paymentMethods.map((method) => (
                          <MenuItem key={method} value={method}>
                            {method}
                          </MenuItem>
                        ))}
                      </TextField>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Amount Received In Bank"
                        type="number"
                        value={customerPaymentForm.amountReceivedInBank}
                        onChange={(e) => handleCustomerPaymentChange('amountReceivedInBank', e.target.value)}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Transaction Reference"
                        value={customerPaymentForm.transactionRef}
                        onChange={(e) => handleCustomerPaymentChange('transactionRef', e.target.value)}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        select
                        fullWidth
                        label="Status"
                        value={customerPaymentForm.status}
                        onChange={(e) => handleCustomerPaymentChange('status', e.target.value)}
                      >
                        {customerPaymentStatuses.map((status) => (
                          <MenuItem key={status} value={status}>
                            {status}
                          </MenuItem>
                        ))}
                      </TextField>
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Notes"
                        multiline
                        rows={3}
                        value={customerPaymentForm.notes}
                        onChange={(e) => handleCustomerPaymentChange('notes', e.target.value)}
                      />
                    </Grid>
                      {/* Rest of the customer payment form fields (similar to previous implementation) */}
                    </Grid>
                  </Paper>
                </Box>
              ) : (
                <Box 
                  sx={{ 
                    display: 'flex', 
                    justifyContent: 'center', 
                    alignItems: 'center', 
                    width: '100%', 
                    height: '100%' 
                  }}
                >
                  <Typography variant="h6" color="text.secondary">
                    Select an Opportunity to View/Edit Payments
                  </Typography>
                </Box>
              )}
            </Box>
              </DialogContent>
              <DialogActions sx={{ p: 2 }}>
                <Button onClick={closeDialogue}>Cancel</Button>
                <Button variant="contained" onClick={handleAccInfoSubmit}>
                  Save Accounting Info
                </Button>
              </DialogActions>             
            </Dialog>
            
          </Box>
          )
        }

      const ExpensesTab = ({ expenses, setExpenses }) => {
          const [openExpenseDialog, setOpenExpenseDialog] = useState(false);
          const [selectedExpense, setSelectedExpense] = useState(null);
          const [expenses1, setExpenses1] = useState([]);
          const [expenseForm1, setExpenseForm1] = useState({
            category: '',
            particular: '',
            paidAmount: '',
            date: '',
            paidBy: ''
          });
          const handleAddExpense = () => {
            setOpenExpenseDialog(true);
          };
        
          const handleExpenseChange = (field, value) => {
            setExpenseForm1(prev => ({
              ...prev,
              [field]: value
            }));
          };
        
          const handleExpenseSubmit = async () => {
            const newExpense = {
              "theUser" : user,
              id: expenses.length + 1,
              ...expenseForm1
            };
        
            try {
              setLoading(true);
              // Assuming you have an API endpoint to create expenses
              const response = await instance.post('/CreateExpense', newExpense);
              
              setExpenses(prev => [...prev, newExpense]);
              setOpenExpenseDialog(false);
              
              // Reset form
              setExpenseForm({
                category: '',
                particular: '',
                paidAmount: '',
                date: '',
                paidBy: ''
              });
              setExpenseForm1({
                category: '',
                particular: '',
                paidAmount: '',
                date: '',
                paidBy: ''
              });
            } catch (error) {
              window.alert('Failed to add expense');
              console.error(error);
            } finally {
              setReloadExpenses(true);
              setLoading(false);
            }
          };
        
          return (
            <Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Expenses & Reimbursements
                </Typography>
                <Button 
                  variant="contained" 
                  color="primary" 
                  startIcon={<AddIcon />} 
                  onClick={handleAddExpense}
                >
                  Add Expense
                </Button>
              </Box>
        
              <TableContainer component={Paper} elevation={0} sx={{ border: `1px solid ${theme.palette.divider}` }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell><Typography variant="body1" sx={{ fontWeight: 600 }}>ID</Typography></TableCell>
                      <TableCell><Typography variant="body1" sx={{ fontWeight: 600 }}>Category</Typography></TableCell>
                      <TableCell><Typography variant="body1" sx={{ fontWeight: 600 }}>Particular</Typography></TableCell>
                      <TableCell><Typography variant="body1" sx={{ fontWeight: 600 }}>Paid Amount</Typography></TableCell>
                      <TableCell><Typography variant="body1" sx={{ fontWeight: 600 }}>Date</Typography></TableCell>
                      <TableCell><Typography variant="body1" sx={{ fontWeight: 600 }}>Paid By</Typography></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {(expenses.length > 0) ? expenses.map((expense) => (
                      <TableRow key={expense.id}>
                        <TableCell>{expense.id}</TableCell>
                        <TableCell>{expense.category}</TableCell>
                        <TableCell>{expense.particular}</TableCell>
                        <TableCell>${expense.paidAmount}</TableCell>
                        <TableCell>{expense.date}</TableCell>
                        <TableCell>{expense.paidBy}</TableCell>
                      </TableRow>
                    )) : null}
                  </TableBody>
                </Table>
              </TableContainer>
        
              {/* Add Expense Dialog */}
              <Dialog
                open={openExpenseDialog}
                onClose={() => setOpenExpenseDialog(false)}
                maxWidth="md"
                fullWidth
              >
                <DialogTitle>Add New Expense/Reimbursement</DialogTitle>
                <DialogContent>
                  <Grid container spacing={2} sx={{ mt: 1 }}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        select
                        fullWidth
                        label="Category"
                        value={expenseForm1.category}
                        onChange={(e) => handleExpenseChange('category', e.target.value)}
                      >
                        <MenuItem value="Expense">Expense</MenuItem>
                        <MenuItem value="Reimbursement">Reimbursement</MenuItem>
                      </TextField>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Particular"
                        value={expenseForm1.particular}
                        onChange={(e) => handleExpenseChange('particular', e.target.value)}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Paid Amount"
                        type="number"
                        value={expenseForm1.paidAmount}
                        onChange={(e) => handleExpenseChange('paidAmount', e.target.value)}
                        InputProps={{
                          startAdornment: <InputAdornment position="start">$</InputAdornment>,
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Paid By"
                        value={expenseForm1.paidBy}
                        onChange={(e) => handleExpenseChange('paidBy', e.target.value)}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Date"
                        type="date"
                        InputLabelProps={{ shrink: true }}
                        value={expenseForm1.date}
                        onChange={(e) => handleExpenseChange('date', e.target.value)}
                      />
                    </Grid>
                  </Grid>
                </DialogContent>
                <DialogActions>
                  <Button onClick={() => setOpenExpenseDialog(false)}>Cancel</Button>
                  <Button 
                    variant="contained" 
                    color="primary" 
                    onClick={handleExpenseSubmit}
                  >
                    Save Expense
                  </Button>
                </DialogActions>
              </Dialog>
            </Box>
          );
        };

        const openActivityLogs = ()=>{
          navigate('/admin');
        }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <AppBar position="static" elevation={0} sx={{ bgcolor: 'background.paper', borderBottom: `1px solid ${theme.palette.divider}` }}>
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h5" sx={{ color: 'text.primary', fontWeight: 600 }}>
          CRM Dashboard
        </Typography>
        <Box sx={{     p: 3, 
              bgcolor: 'grey.50', 
              flexGrow: 1, 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center'}}>
        {isAdmin ? <Button variant='contained' color='primary' onClick={openActivityLogs}>Open Activity Logs</Button> : null}
        {loading && <CircularProgress size={24} />}
        </Box>
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
        {tabValue === 2 && <SalesEstimateTab opportunities={opportunities} setOpportunities={setOpportunities} />}
        {tabValue === 3 && <SalesInvoiceTab opportunities={opportunities} setOpportunities={setOpportunities} />}
        {tabValue === 4 && <AccountingTab opportunities={opportunities} setOpportunities={setOpportunities} />}
        {tabValue === 5 && <ExpensesTab expenses={expenses} setExpenses={setExpenses} />}
        {tabValue > 5 && (
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6">{tabItems[tabValue].label}</Typography>
            <Typography color="text.secondary" sx={{ mt: 2 }}>
              Content for {tabItems[tabValue].label} will be displayed here.
            </Typography>
          </Paper>
        )}
      </Box>
      <DetailsDialog />
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
            {/* <Grid item xs={12} sm={4}> */}
              {/* <TextField
                fullWidth
                label="Email Address"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
              /> */}
              {(trueTypeOf(formData.email) === "array") ? formData.email.map((email, index) => (
                <Grid item xs={12} sm={4} key={index}>
                  <TextField
                    fullWidth
                    label={`Email Address ${index + 1}`}
                    name={`email-${index}`}
                    type="email"
                    value={email}
                    onChange={(e) => handleEmailChange(index, e.target.value)}
                  />
                  <IconButton onClick={addEmailField}>
                    <AddIcon />
                  </IconButton>
                </Grid>
              )) : <TextField
              fullWidth
              label="Email Address"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
            />}
              {(trueTypeOf(formData.email) === "array") ? formData.phoneNumber.map((phoneNumber, index) => (
                <Grid item xs={12} sm={4} key={index}>
                  <TextField
                    fullWidth
                    label={`Phone Number ${index + 1}`}
                    name={`phoneNumber-${index}`}
                    value={phoneNumber}
                    onChange={(e) => handlePhoneNumberChange(index, e.target.value)}
                  />
                  <IconButton onClick={addPhoneNumberField}>
                    <AddIcon />
                  </IconButton>
                </Grid>
              )): <TextField
              fullWidth
              label="Phone Number"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
            />}
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
      onClick={() => handleCancelOpp()}
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
        <Autocomplete
          // multiple
          options={theShipmentType || []}
          getOptionLabel={(option) => option.label}
          value={opportunityForm.shipmentType}
          onChange={(event, newValue) => {
            handleOpportunityChange('shipmentType', newValue);
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Shipment Type"
              placeholder="Select Shipment Type"
            />
          )}
        />
      </Grid>

      {(shipmentTypes === '') ? null : (shipmentTypes.value === 'Domestic') 
        ? renderDomesticDetails() 
        : renderInternationDetails()}    
    </Grid>
  </DialogContent>
  <DialogActions sx={{ p: 2 }}>
    <Button onClick={() => handleCancelOpp()}>Cancel</Button>
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