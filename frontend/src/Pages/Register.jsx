import React from 'react'
import { Button, Card, Col, Container, Form, Image, InputGroup, Row } from 'react-bootstrap'
import {Link, useNavigate} from 'react-router-dom'
import * as formik from 'formik';
import * as yup from 'yup';
import {toast} from 'react-toastify';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { userRegister } from '../Redux/UserSlice';
const Register = () => {
    const {Formik} = formik;
    const schema = yup.object().shape({
        name: yup.string().required(),
        contact_no: yup.string().required(),
        email: yup.string().required(),
        password: yup.string().required().min(3,),
        role: yup.string(),
      });
      const dispatch = useDispatch();
      const navigate = useNavigate();
      const handleSubmit = async(values) =>{
        try {
            const {data} = await axios.post('http://localhost:4005/api/v1/user/register',values,{withCredentials: true});
            
            console.log(data);
            if(data.success){
                
                dispatch(userRegister(data.newUser));
                toast.success(data.message);
                navigate('/login');
            }
            else{
                toast.error(data.message);
              }
        } catch (error) {
            toast.error(error.message);
        }
      }
  return (
    <Container>
      <Row>
        <Col className='md-6'>
        <Container className='my-5'>
            <Row>
            <Col className='mx-auto' md={12}>
              <Card style={{ backgroundColor: '#2d5649', borderColor: '#2d5649', color: '#fff', boxShadow: "3px 5px 7px rgba(0, 0, 0, 0.5)" }}>
                <Card.Body>
                  <Card.Title className="py-3 text-center"><h3>Register</h3></Card.Title>
                <Formik
                validationSchema={schema}
                onSubmit={handleSubmit}
                initialValues={{
                    name: '',
                    role: 'admin',
                    email: '',
                    password: '',
                    contact_no: ''
                }}
                >
                {({ handleSubmit, handleChange, values, touched, errors }) => (
                    <Form noValidate onSubmit={handleSubmit}>
                    <Row className="mb-3">
                    <Form.Group as={Col} md="6" controlId="validationFormik01" className='mb-3 position-relative' >
                      <Form.Label>Name</Form.Label>
                      <Form.Control
                        type="text"
                        name="name"
                        placeholder='Enter Name'
                        value={values.name}
                        onChange={handleChange}
                        isValid={touched.name && !errors.name}
                        isInvalid={!!errors.name}

                      />
                      <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                      <Form.Control.Feedback type="invalid" tooltip>
                            {errors.name}
                      </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group as={Col} md="6" className="position-relative">
                        <Form.Label>Role</Form.Label>
                        <Form.Control
                          as="select" // Change the input to a select dropdown
                          name="role"
                          value={values.role}
                          onChange={handleChange}
                          isValid={touched.role && !errors.role}
                          isInvalid={touched.role && errors.role}
                        >
                          <option value="">Select Role</option> 
                          <option value="user">Job Seeker</option>
                          <option value="employer">Employer</option>
                        </Form.Control>
                        <Form.Control.Feedback type="invalid">
                          {errors.role}
                        </Form.Control.Feedback>
                      </Form.Group>
                        <Form.Group as={Col} md="6" controlId="validationFormikUsername2" >
                        <Form.Label>Email</Form.Label>
                        <InputGroup hasValidation>
                            <InputGroup.Text id="inputGroupPrepend"  style={{ backgroundColor: '#2d5649', borderColor: '#fff', color: '#fff' }}>@</InputGroup.Text>
                            <Form.Control
                            type="email"
                            placeholder="Enter Email"
                            aria-describedby="inputGroupPrepend"
                            name="email"
                            value={values.email}
                            onChange={handleChange}
                            isInvalid={!!errors.email}
                            />
                            <Form.Control.Feedback type="invalid" tooltip>
                            {errors.email}
                            </Form.Control.Feedback>
                        </InputGroup>
                        </Form.Group>
                  
                        <Form.Group
                        as={Col}
                        md="6"
                        controlId="validationFormik103"
                        className="position-relative"
                        >
                        <Form.Label>Password</Form.Label>
                        <Form.Control
                            type="password"
                            placeholder="Enter Password"
                            name="password"
                            value={values.password}
                            onChange={handleChange}
                            isInvalid={!!errors.password}
                        />

                        <Form.Control.Feedback type="invalid" tooltip>
                            {errors.password}
                        </Form.Control.Feedback>
                        </Form.Group>
                    
                    </Row> 
                    <Row>
                    <Form.Group
                        as={Col}
                        md="12"
                        controlId="validationFormik"
                        className="position-relative"
                        >
                        <Form.Label>Contact No.</Form.Label>
                        <Form.Control
                            type="String"
                            placeholder="Enter Contact Number"
                            name="contact_no"
                            value={values.contact_no}
                            onChange={handleChange}
                            isInvalid={!!errors.contact_no}
                        />

                        <Form.Control.Feedback type="invalid" tooltip>
                            {errors.contact_no}
                        </Form.Control.Feedback>
                        </Form.Group>
                    
                    </Row>
                    <div className="py-3">
                    <Button type="submit" style={{ backgroundColor: '#2d5649', borderColor: '#fff', color: '#fff' }}>Register</Button>
                    </div>
                    <p>If you have an account?  Please <Link to='/login' style={{ color: '#fff' }}> <b>Login</b></Link></p> 
                    </Form>
                )}
                </Formik>
                </Card.Body>
                </Card>
                </Col>
            </Row>
        </Container>
        </Col>
        <Col className='md-6'>
            <Image src='./Images/register.png' className='w-100' alt=''/>
        </Col>
      </Row>
    </Container>
 
  )
}

export default Register