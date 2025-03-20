import React from 'react'
import { Button, Card, Col, Container, Form, Image, InputGroup, Row } from 'react-bootstrap';
import * as formik from 'formik';
import * as yup from 'yup';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { userLogin } from '../Redux/AuthSlice';
import { setLoggedUser } from '../Redux/UserSlice';
const Login = () => {
  
  const { Formik } = formik;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleSubmit = async(values) =>{
    try {
        const {data} = await axios.post('http://localhost:4005/api/v1/user/login',values,{withCredentials: true});
        if(data.success){
            navigate('/');
            dispatch(userLogin(data.user));
            dispatch(setLoggedUser(data.user));
            toast.success(data.message);
        }

        else{
          toast.error(data.message);
        }
    } catch (error) {
        toast.error(error.response?.data?.message )
    }
  }

  const schema = yup.object().shape({
    email: yup.string().required().email("Enter valid format"),
    password: yup.string().required().min(3,"Password contains atleast 3 characters"),
   
  });
  return (
  <Container className='my-5'>
    <Row>
    <Col className='mx-auto' md={12}>
      <Card style={{ backgroundColor: '#2d5649', borderColor: '#2d5649', color: '#fff', boxShadow: "3px 5px 7px rgba(0, 0, 0, 0.5)"}} >
        <Card.Body>
          <Card.Title className="py-3 text-center"><h3>Login</h3></Card.Title>
        <Formik
        validationSchema={schema}
        onSubmit={handleSubmit}
        initialValues={{
            email: '',
            password: ''
        }}
        >
        {({ handleSubmit, handleChange, values, touched, errors }) => (
            <Form noValidate onSubmit={handleSubmit}>
         
            <Row className="mb-3">
                <Form.Group as={Col} md="12" controlId="validationFormikUsername2" className="position-relative">
                <Form.Label>Email</Form.Label>
                <InputGroup hasValidation>
                    <InputGroup.Text id="inputGroupPrepend" style={{ backgroundColor: '#2d5649', borderColor: '#fff', color: '#fff' }}>@</InputGroup.Text>
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
            </Row>
            <Row className="mb-3">
                <Form.Group
                as={Col}
                md="12"
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
            <div className="py-3">
            <Button type="submit" style={{ backgroundColor: '#2d5649', borderColor: '#fff', color: '#fff' }}>Login</Button>
            </div>
            <p>Don't have an account?  Please <Link style={{ color: '#fff' }} to='/register'><b>SignUp</b></Link></p> 

            </Form>
        )}
        </Formik>
        </Card.Body>
        </Card>
        </Col>
    </Row>
    </Container>
    
  
  )
}

export default Login