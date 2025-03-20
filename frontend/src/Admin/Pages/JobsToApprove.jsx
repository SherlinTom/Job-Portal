import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Button, Col, Container, Pagination, Row, Table } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import {   approveOrRejectJob } from '../../Redux/JobSlice';
import { useNavigate } from 'react-router-dom';

const JobsToApprove = () => {
    const [job,setJob] = useState([]);
    const dispatch = useDispatch();
    const navigate = useNavigate(); 
    const [page,setPage] = useState(1);
    const [totalPages,setTotalPages] = useState(1);
    const limit = 10;
    const token = useSelector((state)=>state.users.loggedUser?.token);
    
    useEffect(()=>{
        
        if (!token) return;
        const fetchJobs = async()=>{
            try {
                const {data} = await axios.get(`http://localhost:4005/api/v1/admin/pending-jobs?page=${page}&${limit}`,{withCredentials:true,
                    headers: {
                        Authorization: `Bearer ${token}` // Ensure it's prefixed with "Bearer"
                    },});
                    setJob(data.jobs);
                    setTotalPages(data.totalPages);
            } catch (error) {
                console.log(error);
                
            }
        };
        fetchJobs();
    },[token,page]);
    const handleApprove = async(id) =>{
        try {
            const {data} = await axios.put(`http://localhost:4005/api/v1/admin/approve-job/${id}`,{},{withCredentials: true,headers:{Authorization: `Bearer ${token}`}});
            if(data.success && data.updated_data ){
                dispatch(approveOrRejectJob(data.updated_data));
                setJob((prevJobs) => prevJobs.filter((job) => job._id !== id));
                toast.success(data.message);
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
            if(data.success){
                dispatch(approveOrRejectJob(data.updated_data));
                setJob((prevJobs) => prevJobs.filter((job) => job._id !== id));
                toast.success(data.message);
            }
            else{
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    }
    const showJobDetails = (id) =>{
        navigate(`/job-details/${id}`);
    }
    const handlePageChange = (pageNumber) => {
        setPage(pageNumber);
    };
  return (
    <Container fluid>
        <Row>
            <Col>
            <h2 className='text-center py-3'>Pending Jobs</h2>
            <Table bordered hover style={{ boxShadow: "1px 4px 8px rgba(0, 0, 0, 0.5)",borderRadius: "10px",overflow:"hidden"}} >
                <thead>
                    <tr>
                    <th>#</th>
                    <th>Job Title</th>
                    <th>Company Name</th>
                    <th>Company Address</th>
                    <th>Posted Date</th>
                    <th>Post Status</th>
                    <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {
                (job.length > 0) ? (job && job.map((item,i)=>(
                    <tr key={i} >
                    <td onClick={()=>{showJobDetails(item._id)}} >{(page - 1) * limit + i + 1}</td>
                    <td onClick={()=>{showJobDetails(item._id)}}>{item.job_title}</td>
                    <td onClick={()=>{showJobDetails(item._id)}}>{item.company_name}</td>
                    <td onClick={()=>{showJobDetails(item._id)}}>{item.company_address}</td>
                    <td onClick={()=>{showJobDetails(item._id)}}>{new Date(item.posted_on).toLocaleString("en-GB", { 
                            day: "2-digit", 
                            month: "2-digit", 
                            year: "numeric", 
                            hour: "2-digit", 
                            minute: "2-digit", 
                            second: "2-digit", 
                            hour12: true 
                        }).replace(",", "")}</td>
                    <td onClick={()=>{showJobDetails(item._id)}}>{{pending : "Pending"}[item.status] || "Unknown"}</td>
                    <td>
                        <Button className='btn btn-sm btn-success' onClick={()=>handleApprove(item._id)}> Approve</Button><br />
                        <Button className='btn btn-sm btn-danger' onClick={()=>handleReject(item._id)} > Reject</Button>
                    </td>
                    </tr>
                    ))):( <tr className='text-center' >
                        <td colSpan={7}>No Pending Jobs available..!</td>
                        </tr> )}
                    
                </tbody>
                
                </Table>
                <Pagination className="justify-content-center mt-4">
                <Pagination.First onClick={() => handlePageChange(1)} disabled={page === 1} />
                <Pagination.Prev onClick={() => handlePageChange(page - 1)} disabled={page === 1} />

                {[...Array(totalPages)].map((_, index) => (
                    <Pagination.Item
                        key={index + 1}
                        active={index + 1 === page}
                        onClick={() => handlePageChange(index + 1)}
                    >
                        {index + 1}
                    </Pagination.Item>
                ))}

                <Pagination.Next onClick={() => handlePageChange(page + 1)} disabled={page === totalPages} />
                <Pagination.Last onClick={() => handlePageChange(totalPages)} disabled={page === totalPages} />
            </Pagination>
            </Col>
        </Row>
    </Container>
  )
}

export default JobsToApprove