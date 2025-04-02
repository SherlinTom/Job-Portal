import { BrowserRouter as Router, Routes,Route } from "react-router-dom";
import Register from "./Pages/Register";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-toastify/dist/ReactToastify.css';
import Header from "./Components/Header";
import { ToastContainer } from "react-toastify";
import Home from "./Pages/Home";
import Login from "./Pages/Login";
import Footer from "./Components/Footer";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import UserHeader from "./Components/UserHeader";
import PostJob from "./Pages/PostJob";
import EmployerHeader from "./Components/EmployerHeader";
import AdminHeader from "./Components/AdminHeader";
import { getLoggedUser } from "./Redux/UserSlice";
import AllPostedJobs from "./Pages/AllPostedJobs";
import UpdateJob from "./Pages/UpdateJob";
import { getAllJobs, pendingJobs } from "./Redux/JobSlice";
import JobsToApprove from "./Admin/Pages/JobsToApprove";
import JobDetails from "./Admin/Pages/JobDetails";
import AllUsers from "./Admin/Pages/AllUsers";
import PendingJobs from "./Pages/PendingJobs";
import ApprovedJobs from "./Pages/ApprovedJobs";
import RejectedJobs from "./Pages/RejectedJobs";
import JobList from "./Pages/JobList";
import AllJobs from "./Pages/AllJobs";
import SingleJobDetails from "./Pages/SingleJobDetails";
import Applications from "./Pages/Applications";
import EmpApplications from "./Pages/EmpApplications";
import EmployerProfileUpdate from "./Pages/EmployerProfileUpdate";
import EmployerProfile from "./Pages/EmployerProfile";
import UserRoute from "./utils/UserRoute";
import UserProfile from "./Pages/UserProfile";
import UpdateProfile from "./Pages/UpdateProfile";
import Dashboard from "./Components/Dashboard";
import AdminDashboard from "./Admin/Pages/AdminDashboard";
function App() {
  const dispatch = useDispatch();
  useEffect(()=>{
    dispatch(getLoggedUser());
    dispatch(getAllJobs());
    dispatch(pendingJobs());
  },[dispatch]);
  const role = useSelector((state) => state.users.loggedUser?.role || 'No Role Found');

console.log(role);

  
  return (
      <Router>
       {role === 'employer' ? <EmployerHeader/>: role === 'user'? <UserHeader/> : role === 'admin' ? <AdminHeader/> : <Header/>}
        <ToastContainer position='top-center' autoClose={2000}/>
        <Routes>
          <Route path="/" element={<Home/>}/>
          <Route path="/Job-Portal" element={<Home/>}/>
          <Route path="/register" element={<Register/>}/>
          <Route path="/login" element={<Login/>}/>
          <Route path="/post-a-job" element={<PostJob/>}/>
          <Route path="/posted-jobs" element={<AllPostedJobs/>}/>
          <Route path="/update-job/:id" element={<UpdateJob/>}/>
          <Route path="/all-pending-jobs" element={<JobsToApprove/>}/>
          <Route path="/job-details/:id" element={<JobDetails/>}/>
          <Route path="/users" element={<AllUsers/>}/>
          <Route path="/pending-jobs" element={<PendingJobs/>}/>
          <Route path="/approved-jobs" element={<ApprovedJobs/>}/>
          <Route path="/rejected-jobs" element={<RejectedJobs/>}/>
          <Route path="/jobs" element={<JobList/>}/>
          <Route path="/all-jobs" element={<AllJobs/>}/>
          <Route path="/details/:id" element={<SingleJobDetails/>}/>
          <Route path="/my-applications" element={<Applications/>}/>
          <Route path="/profile" element={<UserRoute requiredRole={['admin','employer']}><EmployerProfile/></UserRoute>}/>
          <Route path="/profile-update" element={<EmployerProfileUpdate/>}/>
          <Route path="/applications-list" element={<EmpApplications/>}/>
          <Route path="/my-profile" element={<UserProfile/>}/>
          <Route path="/update-profile" element={<UpdateProfile/>}/>
          <Route path="/dashboard" element={<AdminDashboard/>}/>
        </Routes>
        <Footer/>
      </Router>
  );
}

export default App;
