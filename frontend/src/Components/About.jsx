import React from 'react'
import { Col, Container, Image, Row } from 'react-bootstrap'

const About = () => {
  return (
    <Container>
        <Row>
            <Col md={12}>
            <h1 className='text-center py-3'>About Us</h1>
            <Row>
            <Col md={6}>
            <Image src='https://cdni.iconscout.com/illustration/premium/thumb/online-job-search-illustration-download-in-svg-png-gif-file-formats--hr-recruitment-company-business-activities-pack-people-illustrations-4032953.png' alt='' className='w-100'/>
            </Col>
            <Col md={6} className='text-justify'>
            Job Hive is a dynamic platform designed to bridge the gap between job seekers and employers. It provides a seamless experience for candidates to create profiles, upload resumes, and apply for jobs, while employers can post job openings, review applications, and manage hiring efficiently. The platform is built with React.js, Node.js, and MongoDB, ensuring scalability and smooth performance. With advanced search filters, real-time notifications, and secure authentication, our job portal simplifies the recruitment process, making job hunting and hiring faster and more effective.
            </Col>
            </Row>
            
            </Col>
           
        </Row>
    </Container>
  )
}

export default About