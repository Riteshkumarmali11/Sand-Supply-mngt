const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const SalesmanLoginRoute = require('./routes/getSalesmanLogin');
const loginDriver=require('./routes/loginDriver');
const loginRoute = require('./routes/login');
const registrationRoute = require('./routes/registration');
const getCustomerRoute = require('./routes/getCustomerRegistration');
const salesmanRegistration = require('./routes/salesmanRegistration');
//const vehicleregistrationRoute=require('./routes/vehicleRegistration');  
const getSalesmanRoute = require('./routes/getSalesman');
const getAdmin = require('./routes/getAdmin');
const siteRegistration = require('./routes/siteRegistration');
const getSiteRoute = require('./routes/getSite');
const supplierRegistration = require('./routes/supplyRegistration');
const getSupplyRoute = require('./routes/getSupply');
const materialRegistration = require('./routes/materialRegistration');
const getMaterialRoute = require('./routes/getMaterial');
const vehicleRegistration = require('./routes/vehicleRegistration');
const getVehicleRoute = require('./routes/getVehicle');
const driverRegistration = require('./routes/driverRegistration');
const getDriverRoutes = require('./routes/getDriver');
const staffRegistration = require('./routes/staffRegistration');
const vendorRegistration = require('./routes/vendorRegistration');
const getVendor = require('./routes/getVendor');
const getStaffRoute = require('./routes/getStaff');
const builderAvailable = require('./routes/builderAvailable');
const getBuilderAvailableRoute = require('./routes/getBuilderAvailable');
const SampleProductRoute = require('./routes/sampleProducts');
const GetSampleProductRoute = require('./routes/getSampleProduct');
const otpLogin = require('./routes/otpBaseLogin');
const otpVerify = require("./routes/otpVerify");
const salesRegistration = require("./routes/salesRegistration");
const getSales = require("./routes/getSales");
const purchaseRegistration = require('./routes/purchaseRegistration');
const getPurchase = require('./routes/getPurchase');
const builderNotAvailable = require('./routes/builderNotAvailable');
const getBuilderNotAvailableRoute = require('./routes/getBuilderNotAvailable');
const SalesInventoryRegister= require('./routes/salesInventory');
const getSalesInventory=require('./routes/getSalesInventory');
const PurchaseInventoryRegister=require('./routes/PurchseInventory');
const getPurchaseInventory=require('./routes/getPurchaseInventory');
const ImageUpload=require('./routes/imageUpload');
const getDCSales=require('./routes/getDCSales');
const getImageUpload=require('./routes/getImageUpload');
const getSalesReport=require('./routes/getsalereport');

const app = express();
const port = 5000;

app.use(bodyParser.json());
app.use(cors());

// Mounting route handlers
app.use('/admin', getAdmin);

app.use('/salesmanLogin', SalesmanLoginRoute);
app.use('/driverLogin', loginDriver);
app.use('/login', loginRoute);
app.use('/registration', registrationRoute);

app.use('/getCustomerRegistration', getCustomerRoute);
app.use('/salesmanRegistration', salesmanRegistration);
app.use('/getSalesmanRegistration', getSalesmanRoute);
app.use('/updateSalesman', salesmanRegistration);
app.use('/deleteSalesman', salesmanRegistration);

app.use('/siteRegistration', siteRegistration);
app.use('/getSiteRegistration', getSiteRoute);
app.use('/updateSite', siteRegistration);
app.use('/deleteSite', siteRegistration);

app.use('/supplyRegistration', supplierRegistration);
app.use('/getSupplyRegistration', getSupplyRoute);
app.use('/updateSupply', supplierRegistration);
app.use('/deleteSupply', supplierRegistration);

app.use('/materialRegistration', materialRegistration);
app.use('/getMaterialRegistration', getMaterialRoute);
app.use('/updateMaterial', materialRegistration);
app.use('/deleteMaterial', materialRegistration);

app.use('/vehicleRegistration', vehicleRegistration);
app.use('/getVehicleRegistration', getVehicleRoute);
app.use('/updateVehicle', vehicleRegistration);
app.use('/deleteVehicle', vehicleRegistration);

app.use('/driverRegistration', driverRegistration);
app.use('/getDriverRegistrations', getDriverRoutes);
app.use('/updateDriver', driverRegistration);
app.use('/deleteDriver', driverRegistration);

app.use('/staffRegistration', staffRegistration);
app.use('/getStaffRegistration', getStaffRoute);
app.use('/updateStaff', staffRegistration);
app.use('/deleteStaff', staffRegistration);

app.use('/vendorRegistration', vendorRegistration);
app.use('/getVendor', getVendor);
app.use('/updateVendor', vendorRegistration);
app.use('/deleteVendor', vendorRegistration);

app.use('/builderAvailableRegistration', builderAvailable);
app.use('/getBuilderAvailable', getBuilderAvailableRoute);
app.use('/updateBuilderAvailable', builderAvailable);
app.use('/deleteBuilderAvailable', builderAvailable);

app.use('/builderNotAvailableRegistration', builderNotAvailable);
app.use('/getBuilderNotAvailable', getBuilderNotAvailableRoute);
app.use('/updateBuilderNotAvailable', builderNotAvailable);
app.use('/deleteBuilderNotAvailable', builderNotAvailable);

app.use('/salesRegistration', salesRegistration);
app.use('/getSales', getSales);
app.use('/updateSales', salesRegistration);
app.use('/deleteSales', salesRegistration);

app.use('/purchaseRegistration', purchaseRegistration);
app.use('/getPurchase', getPurchase);
app.use('/updatePurchase', purchaseRegistration);
app.use('/deletePurchase', purchaseRegistration);
//app.use('/vehicleregistration', vehicleregistrationRoute);

app.use('/api/products', SampleProductRoute);
app.use('/api/products', GetSampleProductRoute);

app.use('/salesInventoryRegister', SalesInventoryRegister);
app.use('/getSalesInventory', getSalesInventory);

app.use('/PurchaseInventoryRegister', PurchaseInventoryRegister);
app.use('/getPurchaseInventory', getPurchaseInventory);

app.use('/salesproductreport', getSalesReport);

app.use('/imageupload', ImageUpload);
app.use('/getImageUpload', getImageUpload);

app.use('/getDCSales', getDCSales);

app.use('/generate-otp', otpLogin);
app.use('/verify-otp', otpVerify);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
