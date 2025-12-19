import react from "react";
import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "./auth/AuthContext";
import Privateroutes from "./Privateroutes";
import PublicOnlyRoute from "./PublicOnlyRoute";
import { CartProvider } from "./cart/CartContext";

import Navbar from "./comp/navbar";
import Footer from "./comp/Footer";
import CartSidebar from "./cart/Cart";

import Home from "./pages/Home";
import Aboutus from "./pages/Aboutus";
import Contactus from "./pages/Contact";
import Requestsample from "./pages/Requestsample";
import Bookexam from "./pages/Bookexam";
import Genquiz from "./pages/Genquiz";
import Signup from "./pages/Signup";
import Signin from "./pages/Signin";
import Verify from "./pages/Verify";
import Forgotpass from "./pages/Forgotpass";
import Resendverify from "./pages/Resendverify";
import Privacypolicy from "./pages/Privacypolicy";
import Singleproduct from "./pages/Singleproduct";
import UserProfile from './userdashboard/Userprofile';
import MyOrders from './userdashboard/MyOrders';
import OrderDetails from './userdashboard/OrderDetails';
import PaymentHistory from './userdashboard/PaymentHistory';
import MyReviews from './userdashboard/MyReviews';
import ReportsAnalytics from './admindashboard/ReportsAnalytics';
import AllUsers from './admindashboard/AllUsers';
import AllProducts from './admindashboard/AllProducts';
import AllOrders from './admindashboard/AllOrders';
import AllPayments from './admindashboard/AllPayments';
import AllSampleRequests from './admindashboard/AllSampleRequests';
import AllExams from './admindashboard/AllExams';
import AllQuizResults from './admindashboard/AllQuizResults';
import ShippingPartnerManagement from './admindashboard/ShippingPartnerManagement';
import PharmacistQuizResults from './pharmacistdashboard/PharmacistQuizResults';
import ApprovedSamples from './pharmacistdashboard/ApprovedSamples';
import ExaminationBooking from './pharmacistdashboard/ExaminationBooking';
import AddProducts from './pharmacistdashboard/AddProducts';
import Samples from "./userdashboard/Samples";
import Exams from "./userdashboard/Exams";
import SupplierManagement from "./admindashboard/SupplierManagement";
import Shop from "./pages/Shop";
import Checkout from "./pages/Checkout";
import Success from "./pages/Success";

export function App() {
  return (
    <>
        <CartProvider>

      <Navbar />
      <CartSidebar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/aboutus" element={<Aboutus />} />
        <Route path="/contactus" element={<Contactus />} />
        <Route path="/privacypolicy" element={<Privacypolicy />} />
        <Route path="/product/:id" element={<Singleproduct />} />
        <Route path="/shop" element={<Shop />} />



        <Route path="/signup" element={<PublicOnlyRoute><Signup /></PublicOnlyRoute>} />
        <Route path="/signin" element={<PublicOnlyRoute><Signin /></PublicOnlyRoute>}/>
        <Route path="/verify" element={<PublicOnlyRoute><Verify /></PublicOnlyRoute>} />
        <Route path="/forgotpass" element={<PublicOnlyRoute><Forgotpass /></PublicOnlyRoute>} />
        <Route path="/resendverify" element={<PublicOnlyRoute><Resendverify /></PublicOnlyRoute>} />



        <Route path="/requestsample" element={<Privateroutes allowedRoles={['user', 'admin', 'pharmacist']}><Requestsample /></Privateroutes>} />
        <Route path="/bookexam" element={<Privateroutes allowedRoles={['user', 'admin', 'pharmacist']}><Bookexam /></Privateroutes>} />
        <Route path="/genquiz" element={<Privateroutes allowedRoles={['user', 'admin', 'pharmacist']}><Genquiz /></Privateroutes>} />



        <Route path="/user" element={<Privateroutes allowedRoles={['user']}><UserProfile /></Privateroutes>} />
        <Route path="/user/profile" element={<Privateroutes allowedRoles={['user']}><UserProfile /></Privateroutes>} />
        <Route path="/user/orders" element={<Privateroutes allowedRoles={['user']}><MyOrders /></Privateroutes>} />
        <Route path="/user/order-details" element={<Privateroutes allowedRoles={['user']}><OrderDetails /></Privateroutes>} />
        <Route path="/user/payments" element={<Privateroutes allowedRoles={['user']}><PaymentHistory /></Privateroutes>} />
        <Route path="/user/reviews" element={<Privateroutes allowedRoles={['user']}><MyReviews /></Privateroutes>} />
        <Route path="/user/samples" element={<Privateroutes allowedRoles={['user']}><Samples/></Privateroutes>} />
        <Route path="/user/exams" element={<Privateroutes allowedRoles={['user']}><Exams/></Privateroutes>} />
        <Route path="/checkout/:orderId" element={<Privateroutes allowedRoles={['user']}><Checkout/></Privateroutes>} />
        <Route path="/success/:orderId" element={<Privateroutes allowedRoles={['user']}><Success/></Privateroutes>} />



        <Route path="/admin" element={<Privateroutes allowedRoles={['admin']}><ReportsAnalytics /></Privateroutes>} />
        <Route path="/admin/reports" element={<Privateroutes allowedRoles={['admin']}><ReportsAnalytics /></Privateroutes>} />
        <Route path="/admin/users" element={<Privateroutes allowedRoles={['admin']}><AllUsers /></Privateroutes>} />
        <Route path="/admin/products" element={<Privateroutes allowedRoles={['admin']}><AllProducts /></Privateroutes>} />
        <Route path="/admin/orders" element={<Privateroutes allowedRoles={['admin']}><AllOrders /></Privateroutes>} />
        <Route path="/admin/payments" element={<Privateroutes allowedRoles={['admin']}><AllPayments /></Privateroutes>} />
        <Route path="/admin/samples" element={<Privateroutes allowedRoles={['admin']}><AllSampleRequests /></Privateroutes>} />
        <Route path="/admin/allexams" element={<Privateroutes allowedRoles={['admin']}><AllExams /></Privateroutes>} />        
        <Route path="/admin/quizzes" element={<Privateroutes allowedRoles={['admin']}><AllQuizResults /></Privateroutes>} />
        <Route path="/admin/supplier" element={<Privateroutes allowedRoles={['admin']}><SupplierManagement/></Privateroutes>} />        
        <Route path="/admin/shipping" element={<Privateroutes allowedRoles={['admin']}><ShippingPartnerManagement /></Privateroutes>} />
  


        <Route path="/pharmacist" element={<Privateroutes allowedRoles={['pharmacist']}><PharmacistQuizResults /></Privateroutes>} />
        <Route path="/pharmacist/quizzes" element={<Privateroutes allowedRoles={['pharmacist']}><PharmacistQuizResults /></Privateroutes>} />
        <Route path="/pharmacist/samples" element={<Privateroutes allowedRoles={['pharmacist']}><ApprovedSamples /></Privateroutes>} />
        <Route path="/pharmacist/exams" element={<Privateroutes allowedRoles={['pharmacist']}><ExaminationBooking /></Privateroutes>} />
        <Route path="/pharmacist/products" element={<Privateroutes allowedRoles={['pharmacist']}><AddProducts /></Privateroutes>} />

        

        <Route path="/unauthorized" element={<h2>Unauthorized</h2>} />

        
      </Routes>

      <Footer />
          </CartProvider>

    </>
  );
}
