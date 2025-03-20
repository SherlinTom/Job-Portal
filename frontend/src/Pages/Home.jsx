import React from 'react'
import About from '../Components/About'
import Dashboard from '../Components/Dashboard'
import Hero from '../Components/Hero'
import SearchBar from './SearchBar'
import JobsWithoutLogin from './JobsWithoutLogin'
import AllJobs from './AllJobs'
import {useSelector} from 'react-redux'
import { Col, Container, Row } from 'react-bootstrap'
const Home = () => {
  const token = useSelector((state) => state.users.loggedUser?.token);

  return (
    <Container fluid>
      <Row>
        <Col>
        <Hero/>
    {!token ? <SearchBar/> : ''}
   {token ? <AllJobs/> : <JobsWithoutLogin/>}
    <Dashboard/>
    <About/>
    <br /><br /><br />
        </Col>
      </Row>
    </Container>
    
  )
}

export default Home