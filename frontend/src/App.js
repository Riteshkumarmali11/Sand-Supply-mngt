import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AuthProvider from './auth/AuthProvider';
import PrivateRoute from './component/PrivateRoute';
import Navbar from './component/Navbar';
import Navbar1 from './component/Navbar1';
import Login from './Login';
import DriverLogin from './DriverLogin';
import Salesman from './pages/registrations/Salesman';
import SiteMaster from './pages/registrations/SiteMaster';
import SupplyMaster from './pages/registrations/SupplyMaster';
import MaterialMaster from './pages/registrations/MaterialMaster';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import VehicleMaster from './pages/registrations/VehicleMaster';
import DriverMaster from './pages/registrations/DriverMaster';
import StaffMaster from './pages/registrations/StaffMaster';
import SalesQuotation from './pages/services/SalesQuotaion';
import Transport from './pages/registrations/Transport';
import Sales from './pages/transaction/Sales';
import Purchase from './pages/transaction/Purchase';
import PurchaseInventory from './pages/transaction/PurchaseInventory';
import Quotation from './pages/services/Quotation';
import SalesInvoice from './pages/transaction/SalesInvoice';
import VendorRegistration from './pages/registrations/VendorRegistration';
import SalesInventory from './pages/transaction/SalesInventory';
import Sample from './pages/services/Sample';
import SalesReport from './pages/reports/SalesReport';
import PurchaseReports from './pages/reports/PurchaseReports';
import HomeIndex from './homepages/HomeIndex';
import SalesmanLogin from './SalesmanLogin';
import SalesmanNavbar from './component/SalesmanNavbar';
import DriverNavbar from './component/DriverNavbar';
import SiteRegister from './pages/salesman/SiteRegister';
import SalesQuotation1 from './pages/salesman/SalesQuotaion1';
import Dchallan from './component/Dchallan';
import DriverReport from './pages/reports/DriverReport';
import SalesmanQuotation from './pages/salesman/SalesmanQuotation';
import Ledger from './pages/transaction/Ledger';
import SalesComponent from './pages/reports/SalesComponent';
import SalesProducts from './pages/reports/SalesProducts';
import PurchaseComponent from './pages/reports/PurchaseComponent';
import PurchaseProduct from './pages/reports/PurchaseProduct';
import PurchaseInvoice from './pages/transaction/PurchaseInvoice';

function App() {
  return (
    <>
        <Router>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<HomeIndex />} />
            <Route path="/salesmanLogin" element={<SalesmanLogin />} />
            <Route path="/driverLogin" element={<DriverLogin />} />
            <Route path="/salesmanNavbar" element={<SalesmanNavbar />} />
            <Route path="/driverNavbar" element={<DriverNavbar />} />
            <Route path="/dchallan/:id" element={<Dchallan />} />
            <Route path="/login" element={<Login />} />

            <Route element={<PrivateRoute />}>
              <Route path="/navbar" element={<Navbar />} />
              <Route path="/navbar1" element={<Navbar1 />} />
              <Route path="/salesmanreg" element={<Salesman />} />
              <Route path="/vendorregistration" element={<VendorRegistration />} />
              <Route path="/siteregistration" element={<SiteMaster />} />

              <Route path="/siteregister" element={<SiteRegister />} />
              <Route path="/salesquote" element={<SalesQuotation1 />} />
              <Route path="/builderregistration" element={<SupplyMaster />} />
              <Route path="/transporter" element={<Transport />} />
              <Route path="/vehiclemaster" element={<VehicleMaster />} />
              <Route path="/materialmaster" element={<MaterialMaster />} />
              <Route path="/salesinventory" element={<SalesInventory />} />
              <Route path="/drivermaster" element={<DriverMaster />} />
              <Route path="/staffmaster" element={<StaffMaster />} />
              <Route path="/salesquotation" element={<SalesQuotation />} />
              <Route path="/sales" element={<Sales />} />
              <Route path="/purchase" element={<Purchase />} />
              <Route path="/ledger" element={<Ledger />} />
              <Route path="/purchaseinventory" element={<PurchaseInventory />} />
              <Route path="/quotation/:id" element={<Quotation />} />
              <Route path="/quotation1/:id" element={<SalesmanQuotation />} />
              <Route path="/invoice/:id" element={<SalesInvoice />} />
              <Route path="/purchaseinvoice/:id" element={<PurchaseInvoice />} />
             

              <Route path="/sample" element={<Sample />} />
              <Route path="/driverreport" element={<DriverReport />} />
              <Route path="/salescomponent" element={<SalesComponent />} />
              <Route path="/salesproduct/:id" element={<SalesProducts />} />

              <Route path="/purchasecomponent" element={<PurchaseComponent />} />
              <Route path="/purchaseproduct/:id" element={<PurchaseProduct />} />
              <Route path="/salesreport" element={<SalesReport />} />
              <Route path="/purchasereport" element={<PurchaseReports />} />
            </Route>
          </Routes>
          </AuthProvider>
        </Router>
      
    </>
  );
}

export default App;
