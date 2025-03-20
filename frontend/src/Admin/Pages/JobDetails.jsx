import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Button, Card, Col, Container, Row } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux';
import {  useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { approveOrRejectJob } from '../../Redux/JobSlice';

const JobDetails = () => {
    const {id} = useParams();
    const dispatch = useDispatch();
    const [job,setJob] =useState(null);
    const token = useSelector((state) => state.users.loggedUser?.token);
        console.log("TOKEN",token);
    useEffect(()=>{
        if(!token) return;
        const fetchJob = async ()=>{
            
        try {
            const {data} = await axios.get(`http://localhost:4005/api/v1/admin/job-details/${id}`,{withCredentials: true,headers: {Authorization:`Bearer ${token}`}});
            if(data.success){
                setJob(data.job_details);
            } 
        } catch (error) {
            console.log(error.message);
        }
        }
        fetchJob();
    },[token,id]);
    const handleApprove = async(id) =>{
        try {
            const {data} = await axios.put(`http://localhost:4005/api/v1/admin/approve-job/${id}`,{},{withCredentials: true,headers:{Authorization: `Bearer ${token}`}});
            if(data.success && data.updated_data ){
                dispatch(approveOrRejectJob(data.updated_data));
                setJob(data.updated_data);
            }
            else{
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    }
    const handleReject = async(id) =>{
        try {
            const {data} = await axios.put(`http://localhost:4005/api/v1/admin/reject-job/${id}`,{},{withCredentials: true,headers:{Authorization: `Bearer ${token}`}});
             if(data.success && data.updated_data ){
                dispatch(approveOrRejectJob(data.updated_data));
                setJob(data.updated_data);

            }
            else{
                toast.error(data.message);
            }   
        } catch (error) {
            toast.error(error.message);
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
                            <p><b >Job Description:</b><div dangerouslySetInnerHTML={{ __html: job.description }} /></p>
                            {job.status === 'pending' ?
                             <p className='text-center pt-3'><Button className='btn btn-md btn-success me-5' onClick={()=>handleApprove(job._id)}> Approve</Button>
                            <Button className='btn btn-md btn-danger' onClick={()=>handleReject(job._id)} > Reject</Button></p>:
                            job.status === 'approved' ? <p className='text-center'><Button className='btn btn-md btn-success'>Approved</Button></p>:
                            <p className='text-center'><Button className='btn btn-md btn-danger'>Rejected</Button></p>
                             }
                           
                     
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

export default JobDetails