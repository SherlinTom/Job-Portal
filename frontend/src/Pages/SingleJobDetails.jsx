import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Button, Card, Col, Container, Row } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux';
import {  useNavigate, useParams } from 'react-router-dom';
import { applyForJob } from '../Redux/JobSlice';
import { toast } from 'react-toastify';

const SingleJobDetails = () => {
  const {id} = useParams();
  const dispatch = useDispatch();
  const [job,setJob] = useState(null);
  const [application,setApplication] = useState([]);
  const navigate = useNavigate();
  const token = useSelector((state) => state.users.loggedUser?.token);
        console.log("TOKEN",token);
    useEffect(()=>{
        const fetchJob = async ()=>{
            
        try {
            const {data} = await axios.get(`http://localhost:4005/api/v1/admin/job-details/${id}`);
            if(data.success){
                setJob(data.job_details);
                console.log(data);
                
            } 
        } catch (error) {
            console.log(error.message);
        }
        }
        fetchJob();
    },[id]);



    useEffect(() => {
      if (!token) return;
    
      const fetchApplication = async () => {
        try {
          const { data } = await axios.get(`http://localhost:4005/api/v1/user/check-applied-or-not`, {
            withCredentials: true,
            headers: { Authorization: `Bearer ${token}` },
          });
    
          setApplication(data.success && Array.isArray(data.jobs) ? data.jobs : []);
        } catch (error) {
          console.error("Error fetching jobs:", error);
          setApplication([]); // Handle errors by setting an empty array
        }
      };
    
      fetchApplication();
    }, [token]);
    
    
    
    const handleApply = async(id) =>{
      if (!token) {
        toast.error("Please log in!");
        navigate('/login')
        return;
      }
      try {
        const {data} = await axios.post(`http://localhost:4005/api/v1/user/apply-for-job/${id}`,{},{withCredentials: true,headers:{Authorization:`Bearer ${token}`}});
        console.log(data);
        
      if(data.success){
        dispatch(applyForJob(data.new_application));
        setApplication((prevApplications) => [...prevApplications, data.new_application]);
        toast.success(data.message);
      }
      else{
        toast.error(data.message);
      }
      } catch (error) {
        toast.error(error.response?.data?.message);
      }
      
    }
 

  return (
    <Container >
    <Row className='m-5 justify-content-center'>
        <Col md={8}>
            <h3 className='text-center'>Job Details</h3>
            <Card style={{ boxShadow: "3px 5px 7px rgba(0, 0, 0, 3)" }}>
            {job ? (
                <Row className='p-5'>
                    <Col>
                        <h5> <b>{job.job_title}</b></h5>
                        <p className='text-secondary'><b>{job.company_name}</b>, {job.company_address}</p>
                        <p><b>Salary Scale:</b> {job.salary}</p>
                        <p><b>Job Description:</b> <div dangerouslySetInnerHTML={{ __html: job.description }} /></p>
                        <div className='text-center pt-3'>
                            <Button className='btn btn-md btn-success'>
                              
                            {application.some(app => String(app.job_id?._id) === String(job._id)) 
                            ? "Applied" 
                            : <span onClick={() => handleApply(job._id)}>Apply Now</span>
                        }

                            </Button>
                        </div>
                 
                    </Col>
                </Row>
                    ) : (
                        <p>Loading...</p>
                    )}
            </Card>
        </Col>
    </Row>
</Container>
  )
}

export default SingleJobDetails