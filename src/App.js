import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './dashboard/Dashboard';
import Login from './dashboard/components/admin/Login';
import Usercheck from './dashboard/components/user/Usercheck';
import { AdminProvider } from './dashboard/context/AdminContext';
import MainGrid from './dashboard/components/MainGrid';
import CustomizedDataGrid from './dashboard/components/CustomizedDataGrid';
import Userinfo from './dashboard/components/user/Userinfo';

import Midcategory from './dashboard/components/recycle/Midcategory';
import BigCategory from './dashboard/components/recycle/Bigcategory';
import Calendar from './dashboard/components/calendar/Calendar';
import Signup from './dashboard/components/admin/Signup';
import Company from './dashboard/components/company/Company';
import CompanyProduct from './dashboard/components/company/CompanyProduct';
import Faq from './dashboard/components/faq/Faq';
import Answer from './dashboard/components/faq/Answer';
import RealFaq from './dashboard/components/faq/RealFaq';
import RealAnswer from './dashboard/components/faq/RealAnswer';
import Coupon from './dashboard/components/coupon/Coupon'

function App() {
  return (
    <div className="App">
          <AdminProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/sign_up" element={<Signup/>}/>
          <Route path="/usercheck" element={<Usercheck />} />
          <Route path="/userinfo/:user_no" element={<Userinfo/>}/>
          <Route path="/bigcategory" element={<BigCategory/>}/>
          <Route path="/midcategory" element={<Midcategory/>}/>
          <Route path="/calendar" element={<Calendar/>}/>
          <Route path="/company" element={<Company/>}/>
          <Route path="/company_product" element={<CompanyProduct/>}/>
          <Route path="/faq" element={<Faq/>}/>
          <Route path="/answer" element={<Answer/>}/>
          <Route path="/faq_page" element={<RealFaq/>}/>
          <Route path="faq/:faq_no" element={<RealAnswer/>}/>
          <Route path="/coupons" element={<Coupon/>}/>
          {/* <Route path="/tree" element={<} */}
        </Routes>
      </Router>
      </AdminProvider>
    </div>
  );
}

export default App;
