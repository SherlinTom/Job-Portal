import React, { useEffect, useState } from 'react'
import { Button, Card, Col, Container, Form, Row } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom';
import * as formik from 'formik';
import * as yup from 'yup';
import axios from 'axios';
import { toast } from 'react-toastify';
import { updateJob } from '../Redux/JobSlice';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const UpdateJob = () => {
    const { Formik } = formik;
    const {id} = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const token = useSelector((state) => state.users.loggedUser?.token);
    // const jobs = useSelector((state) => state?.jobs?.job ?? []);
    
    const [job,setJob] = useState(null);

      useEffect(()=>{
        if(!token) return;
        const fetchJob = async ()=>{
            
        try {
            const {data} = await axios.get(`http://localhost:4005/api/v1/admin/job-details/${id}`,{withCredentials: true,headers: {Authorization:`Bearer ${token}`}});
            if(data.success){
                setJob(data.job_details);
            } 
        } catch (error) {
            console.log(error.message);
        }
        }
        fetchJob();
    },[token,id]);
      const handleUpdate = async (values) =>{
        try {
            const {data} = await axios.put(`http://localhost:4005/api/v1/employer/update-job/${id}`,values,{withCredentials: true,
                headers: {
                    Authorization: `Bearer ${token}` // Ensure it's prefixed with "Bearer"
                },});
            if(data.success){
                toast.success(data.message);
                dispatch(updateJob(data.my_jobs));
                navigate('/posted-jobs');
            }
            else{
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
      }

      const schema = yup.object().shape({
            job_title: yup.string(),
            description: yup.string(),
            salary: yup.string(),
            company_name: yup.string(),
            company_address: yup.string()
           });
  return (
    <Container className='my-5'>
    <Row>
    <Col className='mx-auto' md={8}>
      <Card style={{ boxShadow: "3px 5px 7px rgba(0, 0, 0, 3)" }}>
        <Card.Body>
          <Card.Title className="py-3 text-center"><h3>Update Job</h3></Card.Title>
        {
            job && (
                <Formik
                validationSchema={schema}
                onSubmit={handleUpdate}
        
                initialValues={{
                    job_title: job.job_title || '',
                    description: job.description || '',
                    salary: job.salary || '',
                    company_name: job.company_name || '',
                    company_address: job.company_address || ''
                }}
                >
                {({ handleSubmit, handleChange,setFieldValue, values, touched, errors }) => (
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
                    <Button type="submit" style={{ backgroundColor: '#2d5649', borderColor: '#2d5649', color: '#fff' }}>Update</Button>
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

export default UpdateJob