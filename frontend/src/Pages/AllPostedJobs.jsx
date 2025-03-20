import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Button, Col, Container, Pagination, Row, Table } from 'react-bootstrap'
import { RiPencilFill } from 'react-icons/ri';
import { Link, useNavigate } from 'react-router-dom'
import { FaTrash } from "react-icons/fa";
import { useDispatch, useSelector } from 'react-redux';
import { deleteJob } from '../Redux/JobSlice';
import { toast } from 'react-toastify';


const AllPostedJobs = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [jobs, setJobs] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const limit = 10;
    const token = useSelector((state) => state.users.loggedUser?.token);
        console.log("TOKEN",token);
    // Fetch jobs from API
    useEffect(() => {
        if (!token) return;
        const fetchJobs = async () => {
          try {

            const {data} = await axios.get(`http://localhost:4005/api/v1/employer/job-by-employer?page=${page}&${limit}`,{withCredentials:true,
                headers: {
                    Authorization: `Bearer ${token}` 
                },});
                setJobs(data.jobs);
                setTotalPages(data.totalPages);
          } catch (error) {
            console.error("Error fetching jobs:", error);
          }
        };
        fetchJobs();
      }, [token,page]);

      const handlePageChange = (pageNumber) => {
        setPage(pageNumber);
    };
  
      const handleDelete = async (item) => {
        if (window.confirm("Are you sure you want to delete this job?")) {
          try {
            const {data} = await axios.delete(`http://localhost:4005/api/v1/employer/delete-job/${item._id}`,{withCredentials: true, headers: {Authorization: `Bearer ${token}` } });
            if(data.success){
                dispatch(deleteJob({ _id: item._id }));
                setJobs((prevJobs) => prevJobs.filter((jobs) => jobs._id !== item._id));
                toast.success(data.message);
            }else{
                toast.error(data.message);
            }
          } catch (error) {
            console.error("Error deleting job:", error.message);
          }
        }
      };
  return (
   <Container fluid >
    <Row>
        <Col>
        <div className='d-flex justify-content-end my-3'><Button className='btn-warning' onClick={()=>navigate('/post-a-job')}>Add Job</Button></div>
        <h2 className='text-center pb-3'>All Jobs</h2>
        <Table bordered hover style={{ boxShadow: "3px 5px 7px rgba(0, 0, 0, 1.5)",borderRadius: "10px",overflow:"hidden"}} >
      <thead>
        <tr>
          <th>#</th>
          <th>Job Title</th>
          <th>Company Name</th>
          <th>Company Address</th>
          <th>Salary</th>
          <th>Posted Date</th>
          <th>Post Status</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        {
       jobs.length > 0 ? (jobs && jobs.map((item,i)=>(
        <tr key={i}>
          <td>{(page - 1) * limit + i + 1}</td>
          <td>{item.job_title}</td>
          <td>{item.company_name}</td>
          <td>{item.company_address}</td>
          <td>{item.salary}</td>
          <td>{new Date(item.posted_on).toLocaleString("en-GB", { 
                day: "2-digit", 
                month: "2-digit", 
                year: "numeric", 
                hour: "2-digit", 
                minute: "2-digit", 
                second: "2-digit", 
                hour12: true 
            }).replace(",", "")}</td>
          <td>{ { pending: "Pending", approved: "Approved", rejected: "Rejected" }[item.status] || "Unknown" }</td>
          <td>
          <Link className='px-4' to={`/update-job/${item._id}`}  title='Edit'><RiPencilFill style={{color:'green'}}/></Link> 
          <FaTrash  title='Delete' style={{color:'red',cursor:'pointer'}} onClick={()=>handleDelete(item)}/> 
          </td>
        </tr>
        ))):( <tr className='text-center' >
          <td colSpan={8}>No Jobs available..!</td>
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

export default AllPostedJobs