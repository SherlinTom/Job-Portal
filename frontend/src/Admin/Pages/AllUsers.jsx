import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Col, Container, Pagination, Row, Table } from 'react-bootstrap';
import { FaTrash } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { deleteUsers } from '../../Redux/UserSlice';
import { toast } from 'react-toastify';

const AllUsers = () => {
   const dispatch = useDispatch();
   const [user,setUser] = useState([]);
   const [page,setPage] = useState(1);
   const [totalPages,setTotalPages] = useState(1);
   const limit = 10;
    const token = useSelector((state) => state.users.loggedUser?.token);
        console.log("TOKEN",token);
    useEffect(()=>{
        if(!token) return;
        const fetchUsers = async ()=>{
            
        try {
            const {data} = await axios.get(`http://localhost:4005/api/v1/admin/all-users?page=${page}&${limit}`,{withCredentials: true,headers: {Authorization:`Bearer ${token}`}});
            if(data.success){
                setUser(data.users);
                setTotalPages(data.totalPages);
            } 
        } catch (error) {
            console.log(error.message);
            
        }
        }
        fetchUsers();
    },[token,page]);

    const handlePageChange = (pageNumber) => {
        setPage(pageNumber);
    };
    
     const handleDelete = async (item) => {
            if (window.confirm("Are you sure you want to delete this user?")) {
              try {
                const {data} = await axios.delete(`http://localhost:4005/api/v1/admin/delete-users/${item._id}`,{withCredentials: true, headers: {Authorization: `Bearer ${token}` } });
                if(data.success){
                    dispatch(deleteUsers({ _id: item._id }));
                    toast.success(data.message);
                    setUser((prevUsers) => prevUsers.filter((user) => user._id !== item._id));
                }else{
                    toast.error(data.message);
                }
              } catch (error) {
                console.error("Error deleting job:", error.message);
              }
            }
          };
  return (
    <Container>
    <Row>
        <Col>
        <h2 className='text-center py-3'>Users</h2>
        <Table bordered hover style={{ boxShadow: "1px 4px 8px rgba(0, 0, 0, 0.5)",borderRadius: "10px",overflow:"hidden"}} >
            <thead>
                <tr>
                <th>#</th>
                <th>Name</th>
                <th>Email</th>
                <th>Contact No.</th>
                <th>Role</th>
                <th>Action</th>
                </tr>
            </thead>
            <tbody>
                {
            (user.length > 0) ? (user && user.map((item,i)=>(
                <tr key={i}>
                <td>{(page - 1) * limit + i + 1}</td>
                <td>{item.name}</td>
                <td>{item.email}</td>
                <td>{item.contact_no}</td>
                <td>{{user : "Job Seeker",employer:"Employer",admin:"Admin"}[item.role] || "Unknown"}</td>
                <td className='text-center'> <FaTrash  title='Delete' style={{color:'red',cursor:'pointer'}} onClick={(event)=>handleDelete(item,event)}/> </td>
                </tr>
                ))):( <tr className='text-center' >
                    <td colSpan={5}>No Users..!</td>
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

export default AllUsers