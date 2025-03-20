import axios from "axios";
import React, { useEffect, useState } from "react";
import { Card, Col, Container, Row, Tab, Tabs as BootstrapTabs, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { BsFillBuildingsFill } from "react-icons/bs";
import { BiBlock } from "react-icons/bi";
import { applyForJob, withdrawApplication } from "../Redux/JobSlice";
import { toast } from "react-toastify";
import { FaBookmark } from "react-icons/fa";
import './Applications.css';

const Applications = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [applications, setApplications] = useState([]);
  const [savedjob, setSavedJob] = useState([]);
  const [interviews,setInterviews] = useState([]);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("applied");
  const token = useSelector((state) => state.users.loggedUser?.token);

  useEffect(() => {
    if (!token || activeTab !== "applied") return;
  
    const fetchApplication = async () => {
      try {
        const { data } = await axios.get(
          `http://localhost:4005/api/v1/user/all-applied-jobs`,
          {
            withCredentials: true,
            headers: { Authorization: `Bearer ${token}` },
          }
        );
  
        console.log("Applied Jobs Data:", data);
  
        if (data.success) {
          setApplications(data.jobs || []);
          setError(null);  // Reset error when API succeeds
        } else {
          setApplications([]);
        }
      } catch (error) {
        console.error("Error fetching applications:", error);
        setError("Failed to fetch applications. Please try again.");
      }
    };
  
    fetchApplication();
  }, [token,activeTab]);
  

  const handleWithdraw = async(id) =>{
    if (window.confirm("Are you sure you want to withdraw this application?")) {
      try {
        const {data} = await axios.delete(`http://localhost:4005/api/v1/user/delete-application/${id}`,{withCredentials: true,headers: {Authorization:`Bearer ${token}`}});
        if(data.success){
          dispatch(withdrawApplication({ _id: id }));
          setApplications((prevApplication)=>prevApplication.filter((applications) =>applications._id !== id));
          toast.success(data.message);
        }
        else{
          toast.error(data.message);
        }
      } catch (error) {
        toast.error(error.message);
      }
    }
  }

  useEffect(()=>{
    if(!token) return;
      const fetchSavedJobs = async() =>{
        try {
        const {data} = await axios.get(`http://localhost:4005/api/v1/user/all-saved-jobs`,{withCredentials: true, headers:{Authorization: `Bearer ${token}`}});
        console.log("Saved Jobs: ",data);
        
        if(data.success){
          setSavedJob(data.job || []);
        }
        else{
          setSavedJob([]);
        }
      }
    catch (error) {
      console.error("Error fetching saved jobs:", error);
      setError("Failed to fetch saved job list. Please try again.");
    }
  };
  fetchSavedJobs();
  },[token]);
  const handleApply = async(id) =>{
    try {
      const {data} = await axios.post(`http://localhost:4005/api/v1/user/apply-for-job/${id}`,{},{withCredentials: true,headers:{Authorization:`Bearer ${token}`}});
    if(data.success){
      dispatch(applyForJob(data.new_application));
      setApplications((prevApplications) => [...prevApplications, data.new_application]);
      
      toast.success(data.message);
    }
    else{
      toast.error(data.message);
    }
    } catch (error) {
      console.warn("API Warning:", error.response.data.message);
       toast.error(error.response.data.message);
    }
    
  }

  const removeFromSave = async (jobId) => {
    console.log("Removing job with ID:", jobId); // Debugging
  
    try {
      const { data } = await axios.delete(
        `http://localhost:4005/api/v1/user/remove-from-saved-list/${jobId}`,
        {
          withCredentials: true,
          headers: { Authorization: `Bearer ${token}` },
        }
      );
  
      if (data.success) {
        setSavedJob((prevJobs) =>
          prevJobs.filter((savedJob) => savedJob._id !== jobId)
        );
  
        toast.success(data.message);
      } else {
        toast.error("Failed to remove job.");
      }
    } catch (error) {
      console.error("Error removing saved job:", error);
      toast.error("An error occurred while removing the job.");
    }
  };
  
  useEffect(()=>{
    if(!token) return;
      const fetchInterview = async() =>{
        try {
        const {data} = await axios.get(`http://localhost:4005/api/v1/user/shortlisted-jobs`,{withCredentials: true, headers:{Authorization: `Bearer ${token}`}});
        console.log("interview Jobs: ",data);
        
        if(data.success){
          setInterviews(data.selected_job || []);
        }
        else{
          setInterviews([]);
        }
      }
    catch (error) {
      console.error("Error fetching interview jobs:", error);
      setError("Failed to fetch interview job list. Please try again.");
    }
  };
  fetchInterview();
  },[token]);
  return (
    <Container>
      <Row>
        <Col md={12}>
          <h2 className="py-3">My Jobs</h2>
          <BootstrapTabs  activeKey={activeTab} onSelect={(k) => setActiveTab(k)} defaultActiveKey="applied" id="uncontrolled-tab-example" className="mb-5">
            <Tab eventKey="saved" title={
          <>
            Saved <span className="badge bg-primary">{savedjob.length}</span>
          </>
        }>
            <Row>
                <Col>
                  {error ? (
                    <p className="text-danger">{error}</p>
                  ) : savedjob.length > 0 ? (
                    savedjob.map((job) => (
                      <Card key={job._id} className="mb-3">
                        <Card.Body>
                          <Row>
                            <Col md={1}>
                              <div
                                style={{
                                  backgroundColor: "#e0e0e0",
                                  textAlign: "center",
                                  padding: "10px",
                                  borderRadius: "5px",
                                }}
                              >
                                <BsFillBuildingsFill size={30} color="grey" />
                              </div>
                            </Col>
                            <Col md={8}  onClick={()=>{navigate(`/details/${job.job_id._id}`)}}>
                        
                              <h5>
                                <b>{job.job_id.job_title}</b>
                              </h5>
                              <p ><b>{job.job_id.company_name}</b> <br />{job.job_id.company_address}</p>
                              <p className="text-secondary">Saved On {new Date(job.saved_on).toLocaleString("en-GB", { 
                                    day: "2-digit", 
                                    month: "short", 
                                    year: "numeric", 
                                }).replace(",", "")}</p>
                            </Col>
                            <Col md={3}>
                            <Row>
                              <Col md={6}>
                              <div className="text-center text-primary" style={{borderRadius:'5px',fontWeight:'bold'}}>
                               <Button className="btn btn-md" onClick={()=>handleApply(job.job_id._id)}>Apply Now</Button>
                              </div>
                              </Col>
                              <Col md={6}>
                              <FaBookmark  
                                title="Remove from saved list"
                                className="favourite-icon saved"
                                onClick={() =>removeFromSave(job._id)}
                              />
                              </Col>
                            </Row>
                            </Col>
                          </Row>
                        </Card.Body>
                      </Card>
                    ))
                  ) : (
                    <p>No Jobs Saved</p>
                  )}
                </Col>
              </Row>
            </Tab>

            <Tab eventKey="applied" title={
          <>
            Applied <span className="badge bg-primary">{applications.length}</span>
          </>
        } >
              <Row>
                <Col>
                  {error ? (
                    <p className="text-danger">{error}</p>
                  ) : applications.length > 0 ? (
                    applications.map((job) => (
                      
                      <Card key={job._id} className="mb-3">
                        <Card.Body>
                          <Row>
                            <Col md={1}>
                              <div
                                style={{
                                  backgroundColor: "#e0e0e0",
                                  textAlign: "center",
                                  padding: "10px",
                                  borderRadius: "5px",
                                }}
                              >
                                <BsFillBuildingsFill size={30} color="grey" />
                              </div>
                            </Col>
                            <Col md={9}  onClick={()=>{ if (!job.remark && job.job_id) { navigate(`/details/${job.job_id._id}`);}}}>
                            <Row>
                              <Col md={3}>
                              {job.status === 'rejected'? <div className="text-left text-danger bg-light" style={{padding:'5px',borderRadius:'5px',fontWeight:'bold',paddingLeft:'10px'}}>
                                {job.status} </div>  :  <div className="text-left text-primary bg-light" style={{padding:'5px',borderRadius:'5px',fontWeight:'bold',paddingLeft:'10px'}}>
                                {job.status}
                              </div>}
                              </Col>
                            </Row>
                            
                              <h5>
                                <b>{job.job_id.job_title}</b>
                              </h5>
                              <p ><b>{job.job_id.company_name}</b> <br />{job.job_id.company_address}</p>
                              <p className="text-secondary">Applied On {new Date(job.applied_on).toLocaleString("en-GB", { 
                                    day: "2-digit", 
                                    month: "short", 
                                    year: "numeric", 
                                }).replace(",", "")}</p>
                                  <Row>
                              <Col md={4}>
                              {job.remark ? <div className="text-left text-danger bg-light" style={{padding:'5px',borderRadius:'5px',fontWeight:'bold',paddingLeft:'10px'}}>
                                Job Closed by Employer </div>  : null}
                              </Col>
                            </Row>
                            </Col>
                            <Col md={2}>
                            <div className="text-center text-primary" style={{borderRadius:'5px',fontWeight:'bold'}}>
                               <Button className="btn btn-md btn-danger" title="Withdraw Application" onClick={()=>handleWithdraw(job._id)}><BiBlock size={25}/></Button>
                              </div>
                            </Col>
                          </Row>
                        </Card.Body>
                      </Card>
                    ))
                  ) : (
                    <p>No Applications</p>
                  )}
                </Col>
              </Row>
            </Tab>

            <Tab eventKey="interviews" title={
               <>
            Interviews <span className="badge bg-primary">{interviews.length}</span>
          </>
            }>
              <Row>
                <Col>
                  {error ? (
                    <p className="text-danger">{error}</p>
                  ) : interviews.length > 0 ? (
                    interviews.map((job) => (
                      <Card key={job._id} className="mb-3">
                        <Card.Body>
                          <Row>
                            <Col md={1}>
                              <div
                                style={{
                                  backgroundColor: "#e0e0e0",
                                  textAlign: "center",
                                  padding: "10px",
                                  borderRadius: "5px",
                                }}
                              >
                                <BsFillBuildingsFill size={30} color="grey" />
                              </div>
                            </Col>
                            <Col md={9}  onClick={()=>{ if (!job.remark && job.job_id) { navigate(`/details/${job.job_id._id}`);}}}>
                            <Row>
                              <Col md={3}>
                              <div className="text-left text-primary bg-light" style={{padding:'5px',borderRadius:'5px',fontWeight:'bold',paddingLeft:'10px'}}>
                                {job.status}
                              </div>
                              </Col>
                            </Row>
                            
                              <h5>
                                <b>{job.job_id.job_title}</b>
                              </h5>
                              <p ><b>{job.job_id.company_name}</b> <br />{job.job_id.company_address}</p>
                              <p className="text-secondary">Interview Scheduled On {new Date(job.interview_date).toLocaleString("en-GB", { 
                                    day: "2-digit", 
                                    month: "short", 
                                    year: "numeric", 
                                }).replace(",", "")}</p>
                                <Row>
                              <Col md={4}>
                              {job.remark ? <div className="text-left text-danger bg-light" style={{padding:'5px',borderRadius:'5px',fontWeight:'bold',paddingLeft:'10px'}}>
                                Job Closed by Employer </div>  : null}
                              </Col>
                            </Row>
                            </Col>
                            
                          
                          </Row>
                        </Card.Body>
                      </Card>
                    ))
                  ) : (
                    <p>No interviews scheduled yet</p>
                  )}
                </Col>
                
              </Row>
            </Tab>
          </BootstrapTabs>
        </Col>
      </Row>
    </Container>
  );
};

export default Applications;
