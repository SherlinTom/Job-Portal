import React from 'react'
import { Col, Container, Image, Row } from 'react-bootstrap';
const Hero = () => {

  return (
     <Container >
      <Row>
        <Col>
        <Row className='py-5'>
          <Col md={5}>
          <h1>Find a job that suits</h1>
            <h1>your interests and skills</h1><br />
            <p>
            In today's fast-paced digital world, connecting the right talent with the right opportunity is more crucial than ever. Traditional job-seeking methods are rapidly being replaced by dynamic, online platforms that bridge the gap between employers and job seekers efficiently. Enter JobHive – a modern job portal designed to revolutionize the recruitment landscape.
            </p>
          </Col>
          <Col md={7}>
          <Image src='https://img.freepik.com/premium-vector/event-management-wedding-planner-manager-planning-event-conference-party_501813-2157.jpg' className='w-100'/>
          </Col>
        </Row>
        </Col>
      </Row>
      </Container>
  )}
   
export default Hero;