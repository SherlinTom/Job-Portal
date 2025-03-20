import React, { useEffect, useState } from 'react'
import { Button, Card, Col, Container, Form, Row } from 'react-bootstrap'
import * as formik from 'formik';
import * as yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import { postAJob } from '../Redux/JobSlice';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
const PostJob = () => {
  const [companyDetails,setCompanyDetails] = useState(null);
  const token = useSelector((state) => state.users.loggedUser?.token);
    console.log("TOKEN",token);
  useEffect(()=>{
    if(!token) return;
    const fetchEmployerDetails = async() =>{
      try {
        const {data} = await axios.get(`http://localhost:4005/api/v1/user/user-profile`,{withCredentials: true,headers: {Authorization:`Bearer ${token}`}});
        if(data.success){
          setCompanyDetails(data.user_details)
        }
      } catch (error) {
        console.log(error.message);
        
      }
    } 
   fetchEmployerDetails();
  },[token])
     const { Formik } = formik;
     const schema = yup.object().shape({
        job_title: yup.string().required("Please enter Title of Job"),
        description: yup.string().required("Please enter Job Description"),
        salary: yup.string().required("Please enter Salary of Job"),
        company_name: yup.string().required("Please enter Company Name"),
        company_address: yup.string().required("Please enter Company Address")
       });
       const dispatch = useDispatch();
       const navigate = useNavigate();

        const handleSubmit = async (values,{resetForm}) => {
          try {
              if (!token) {
                  toast.error("User not authenticated");
                  return;
              }

              console.log("Sending token:", token); // Debugging

              const { data } = await axios.post(
                  'http://localhost:4005/api/v1/employer/add-job',
                  values,
                  {
                      withCredentials: true,
                      headers: {
                          Authorization: `Bearer ${token}` // Ensure it's prefixed with "Bearer"
                      },
                  }
              );

              console.log("Response:", data); // Debugging

              if (data.success) {
                  dispatch(postAJob(data.newJob));
                  toast.success(data.message);
                  navigate('/posted-jobs')
                  resetForm();
              } else {
                  toast.error(data.message);
              }
          } catch (error) {
              console.error("Error:", error);
              toast.error(error.response?.data?.message || "Something went wrong.");
          }
        };



  return (
    <Container className='my-5'>
    <Row>
    <Col className='mx-auto' md={8}>
      <Card  style={{ boxShadow: "3px 5px 7px rgba(0, 0, 0, 3)" }}>
        <Card.Body>
          <Card.Title className="py-3 text-center"><h3>Post A Job</h3></Card.Title>
          {companyDetails && (
        <Formik
        validationSchema={schema}
        onSubmit={handleSubmit}
        initialValues={{
            job_title: '',
            description: '',
            salary:'',
            company_name: companyDetails.company_name || '',
            company_address: companyDetails.company_address || ''
        }}
        >
        {({ handleSubmit, handleChange, values, touched, errors,setFieldValue }) => (
            <Form noValidate onSubmit={handleSubmit}>
            <Row className="mb-3">
                  <Form.Group as={Col} md="6" className="position-relative">
                    <Form.Label>Job Title</Form.Label>
                    <Form.Control
                    type="text"
                    placeholder="Enter Job Title"
                    name="job_title"
                    value={values.job_title}
                    onChange={handleChange}
                    isInvalid={!!errors.job_title}
                />

                <Form.Control.Feedback type="invalid" tooltip>
                    {errors.job_title}
                </Form.Control.Feedback>
                </Form.Group>
                <Form.Group as={Col} md="6" className="position-relative">
                    <Form.Label>Salary</Form.Label>
                    <Form.Control
                    type="text"
                    placeholder="Enter Salary"
                    name="salary"
                    value={values.salary}
                    onChange={handleChange}
                    isInvalid={!!errors.salary}
                />

                <Form.Control.Feedback type="invalid" tooltip>
                    {errors.salary}
                </Form.Control.Feedback>
                </Form.Group>
            </Row>
            <Row className="mb-3">
            <Form.Group>
              <Form.Label>Job Description</Form.Label>
              <ReactQuill
                value={values.description}
                onChange={(value) => setFieldValue('description', value)}
              />
              {errors.description && (
                <div className="text-danger mt-2">{errors.description}</div>
              )}
            </Form.Group>
            </Row>
            <Row className="mb-3">
                  <Form.Group as={Col} md="6" className="position-relative">
                    <Form.Label>Company Name</Form.Label>
                    <Form.Control
                    type="text"
                    placeholder="Enter Company Name"
                    name="company_name"
                    value={values.company_name}
                    onChange={handleChange}
                    isInvalid={!!errors.company_name}
                />

                <Form.Control.Feedback type="invalid" tooltip>
                    {errors.company_name}
                </Form.Control.Feedback>
                </Form.Group>
            <Form.Group as={Col} md="6" className="position-relative">
                    <Form.Label>Company Address</Form.Label>
                    <Form.Control
                    type="text"
                    placeholder="Enter Company Address"
                    name="company_address"
                    value={values.company_address}
                    onChange={handleChange}
                    isInvalid={!!errors.company_address}
                />

                <Form.Control.Feedback type="invalid" tooltip>
                    {errors.company_address}
                </Form.Control.Feedback>
                </Form.Group>
            </Row>
            <div className=" text-center">
            <Button type="submit" style={{ backgroundColor: '#2d5649', borderColor: '#2d5649', color: '#fff' }}>Submit</Button>
            </div>
            </Form>
        )}
        </Formik>
          )
        }
        </Card.Body>
        </Card>
        </Col>
    </Row>
</Container>
  )
}

export default PostJob