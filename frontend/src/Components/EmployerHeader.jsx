import React from 'react'
import { Container, Dropdown, Image, Nav, Navbar, NavDropdown } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom'
import { logoutUser } from '../Redux/UserSlice';
import { toast } from 'react-toastify';
import { RiUser2Fill } from 'react-icons/ri';
import axios from 'axios';

const EmployerHeader = () => {
    const user = JSON.parse(localStorage.getItem('loggedUser'));
    const dispatch = useDispatch();
    const navigate = useNavigate();
    
    const token = useSelector((state) => state.users.loggedUser?.token);
    const handleLogout = async() =>{
      try {
      const {data} = await axios.post('http://localhost:4005/api/v1/user/logout',{},{withCredentials: true,headers: {Authorization: `Bearer ${token}`}});
      if(data.success){
        toast.success(data.message);
        dispatch(logoutUser());
        navigate('/login');
      }
       else{
        toast.error(data.message);
       } 
      } catch (error) {
        toast.error(error.message);
      }
    }
       const handleDeleteAccount = async()=>{
          try {
            const {data} = await axios.delete(`http://localhost:4005/api/v1/user/delete-account`,{withCredentials: true, headers:{Authorization:`Bearer ${token}`}});
            if(data.success){
              toast.success(data.message);
              dispatch(logoutUser());
              navigate('/register');
            }
            else{
              toast.error(data.message);
            }
          } catch (error) {
            toast.error(error.message);
          }
        }
  return (
    <Navbar expand="lg" className="bg-body-light shadow-sm"   >
    <Container>
      <Navbar.Brand as={Link} to="/"><Image src='./Images/logooo.png' alt='' height={60}/></Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
     
        <Nav className="ms-auto">
          <Nav.Link as={Link} to="/">Home</Nav.Link>
          <Nav.Link as={Link} to="/post-a-job">Post a Job</Nav.Link>
          {/* <Nav.Link as={Link} to="/posted-jobs">All Jobs</Nav.Link> */}
          <Nav>
            <NavDropdown title="My Jobs">
              <NavDropdown.Item as={Link} to="/posted-jobs">All Jobs</NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/pending-jobs">Pending Jobs</NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/approved-jobs">Approved Jobs</NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/rejected-jobs">Rejected Jobs</NavDropdown.Item>
              
            </NavDropdown>
          </Nav>
          <Nav.Link as={Link} to="/applications-list">Applications</Nav.Link>
         
          {
            user ?  (
            <Dropdown>
            <Dropdown.Toggle variant="success" id="dropdown-basic">
            <RiUser2Fill/> {user.name}
            </Dropdown.Toggle>
            <Dropdown.Menu>
            {user ? (
              <>
                <Dropdown.Item as={Link} to="/profile">Profile</Dropdown.Item>
                <Dropdown.Item onClick={handleLogout}>Logout</Dropdown.Item>
                <Dropdown.Item onClick={handleDeleteAccount}>Delete Account</Dropdown.Item>
              </>
            ) : (
              <Dropdown.Item as={Link} to="/login">Login</Dropdown.Item>
            )}
          </Dropdown.Menu>
          </Dropdown>
           ):(<h4><span style={{fontWeight:'bold'}}><RiUser2Fill/></span></h4> )
          }

        </Nav>
      </Navbar.Collapse>
    </Container>
  </Navbar>
  )
}

export default EmployerHeader