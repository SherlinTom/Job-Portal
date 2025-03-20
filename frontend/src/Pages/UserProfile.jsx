import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Button, Card, Col, Container, Row } from 'react-bootstrap'
import { useSelector } from 'react-redux';
import './EmployerProfile.css'
import { useNavigate } from 'react-router-dom';

const UserProfile = () => {
    const [profile,setProfile] = useState(null);
    const navigate = useNavigate();
    const token = useSelector((state) => state.users.loggedUser?.token); 
    useEffect(()=>{
        if(!token) return;
        const fetchUser = async ()=>{
        try {
            const {data} = await axios.get(`http://localhost:4005/api/v1/user/user-profile`,{withCredentials: true,headers: {Authorization:`Bearer ${token}`}});
            
            if(data.success){
                setProfile(data.user_details);
            } 
        } catch (error) {
            console.log(error.message);
        }
        }
        fetchUser();
    },[token]);
  return (
   <Container>
    <Row>
        <Col className='mx-auto' md={8}>
        {profile ? (
            <Card className='m-5 profile-card' >
            <Card.Body>
                <h2 className='text-center pb-3'>Profile</h2>
                    <Row>
                        <Col md={4}>
                        <Card.Img variant="top" src={profile.profilePic ? `http://localhost:4005${profile.profilePic}` : '/image.png'} alt="Profile Picture" className="rounded-circle" style={{ width: "130px", height: "130px", objectFit: "cover" }} />
                        </Col>   
                        <Col md={8}>
                        <p><b>Name:</b> {profile.name}</p>
                        <p><b>Email:</b> {profile.email}</p>
                        <p><b>Contact No:</b> {profile.contact_no}</p> 
                        <p><b>Qualification:</b> {profile.qualification.join(", ")}</p>
                        <p><b>Skills:</b> {profile.skills.join(", ")}</p>
                       
                        <p><b>Resume:</b> 
                            {profile.resume ? (
                             <a 
                                href={`http://localhost:4005${profile.resume}`} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                style={{color: '#ffff00'}}
                            > {profile.resume.split('/').pop()}
                            </a>
                            ) : (
                            "No resume uploaded"
                            )}</p> 

               

                        </Col>
                    </Row>
                    <div className='d-flex justify-content-end'>
                    <Button className='btn-md btn-primary border border-light' onClick={()=>navigate('/update-profile')}>Update Profile</Button>
                    </div>
                </Card.Body>
            </Card>
        ):null}
        
        </Col>
    </Row>
   </Container>
  )
}

export default UserProfile