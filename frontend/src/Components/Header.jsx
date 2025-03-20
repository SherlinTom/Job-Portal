import React from 'react'
import { Container, Image, Nav, Navbar } from 'react-bootstrap'
import { Link } from 'react-router-dom'

const Header = () => {
  return (
   <Navbar expand="lg" className="bg-body-light shadow-sm"  >
      <Container>
        <Navbar.Brand as={Link} to="/"><Image src='./Images/logooo.png' alt='' height={60}/></Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
       {/* <SearchBar/> */}
          <Nav className="ms-auto">
            <Nav.Link as={Link} to="/">Home</Nav.Link>
            <Nav.Link as={Link} to="/register">Register</Nav.Link>
            <Nav.Link as={Link} to="/login">Login</Nav.Link>

          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}

export default Header