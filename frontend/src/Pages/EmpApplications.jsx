import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Button, Col, Container, Form, Modal, Pagination, Row, Table } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import { Trash3 } from 'react-bootstrap-icons';
import { FaCheck, FaFilePdf } from 'react-icons/fa';

const EmpApplications = () => {
    const [application, setApplication] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const limit = 10;
    const [show, setShow] = useState(false);
    
    // ✅ Store selected job & user ID when opening modal
    const [selectedJobId, setSelectedJobId] = useState(null);
    const [selectedUserId, setSelectedUserId] = useState(null);

    const handleClose = () => setShow(false);
    const handleShow = (jobId, userId) => {
        setSelectedJobId(jobId);
        setSelectedUserId(userId);
        setShow(true);
    };
    const handleScheduleInterview = (id) => {
        formik.setFieldValue("applicationId", id);
        handleShow();
    };
    const token = useSelector((state) => state.users.loggedUser?.token);

    useEffect(() => {
        if (!token) return;
        const fetchApplication = async () => {
            try {
                const { data } = await axios.get(
                    `http://localhost:4005/api/v1/employer/all-applications?page=${page}&limit=${limit}`,
                    { headers: { Authorization: `Bearer ${token}` }, withCredentials: true }
                );
                if (data.success) {
                    setApplication(data.applications);
                    setTotalPages(data.totalPages || 1);
                }
            } catch (error) {
                console.log(error.message);
            }
        };
        fetchApplication();
    }, [token, page]);

    const handlePageChange = (pageNumber) => {
        setPage(pageNumber);
    };

    const showProfile = async (applicationId, resumeUrl ) => {
        try {
            const { data } = await axios.put(
                `http://localhost:4005/api/v1/employer/update-applications-status/${applicationId}`,
                { status: "application viewed" },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            if (resumeUrl) {
                window.open(`http://localhost:4005${resumeUrl}`, '_blank', 'noopener,noreferrer');
            }
            if (data.success) {
                setApplication((prevApplications) =>
                    prevApplications.map((app) =>
                        app._id === applicationId ? { ...app, status: "application viewed" } : app
                    )
                );
               
            }

        } catch (error) {
            console.error("Failed to update application status:", error);
        }
    };

    const formik = useFormik({
        initialValues: {
            interview_date: '',
            applicationId: '',
            status: 'Interview Scheduled'
        },
        validationSchema: Yup.object({
            interview_date: Yup.date().required('Interview date is required'),
            status: Yup.string().required('Status is required'),
        }),
        onSubmit: async (values, { resetForm }) => {
            if (!token) return;
            try {
                const { data } = await axios.put(
                    `http://localhost:4005/api/v1/employer/verify-applications/${values.applicationId}`,
                    { interview_date: values.interview_date, status: values.status },
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                
                if (data.success) {
                    toast.success(data.message);
                    resetForm();
                    window.location.href = '/applications-list';
                    handleClose();
                    // Update UI with new status if necessary
                }
            } catch (error) {
                console.error('Error setting interview date:', error);
            }
        }
    });
    
    const handleSelect = async (id) => {
        if (!token) return;
    
        try {
            const { data } = await axios.put(
                `http://localhost:4005/api/v1/employer/verify-applications/${id}`,
                { status: "selected" }, // Ensure status update
                { withCredentials: true, headers: { Authorization: `Bearer ${token}` } } // Correct placement
            );
    
            if (data.success) {
                toast.success('Selected for the Job..!');
                setApplication((prevApplications) =>
                    prevApplications.map((app) =>
                        app._id === id ? { ...app, status: "selected" } : app
                    )
                );
            }
        } catch (error) {
            console.error("Error selecting applicant:", error);
            toast.error("Failed to select applicant.");
        }
    };
    const handleReject = async (id) => {
        if (!token) return;
    
        try {
            const { data } = await axios.put(
                `http://localhost:4005/api/v1/employer/verify-applications/${id}`,
                { status: "rejected" }, // Ensure status update
                { withCredentials: true, headers: { Authorization: `Bearer ${token}` } } // Correct placement
            );
            console.log(data);
            
    
            if (data.success) {
                toast.success('Application Rejected..!');
                setApplication((prevApplications) =>
                    prevApplications.map((app) =>
                        app._id === id ? { ...app, status: "rejected" } : app
                    )
                );
            }
        } catch (error) {
            console.error("Error reject applicant:", error);
            toast.error("Failed to reject applicant.");
        }
    };
    
    

    return (
        <Container >
            <Row>
                <Col>
                    <h2 className='text-center py-3'>Applications</h2>
                    <Table bordered hover style={{ boxShadow: "1px 4px 8px rgba(0, 0, 0, 0.5)", borderRadius: "10px", overflow: "hidden" }}>
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Applicant Name</th>
                                <th>Job Title</th>
                                <th>Company Name</th>
                                <th>Applied On</th>
                                <th>Status</th>
                                <th>Interview Date</th>
                                <th>Resume</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {application.length > 0 ? (
                                application.map((item, i) => (
                                    <tr key={i}>
                                        <td>{(page - 1) * limit + i + 1}</td>
                                        <td >{item.user_id.name}</td>
                                        <td>{item.job_id.job_title}</td>
                                        <td>{item.job_id.company_name}</td>
                                        <td>{new Date(item.applied_on).toLocaleString("en-GB", {
                                            day: "2-digit",
                                            month: "2-digit",
                                            year: "numeric"
                                        }).replace(",", "")}</td>
                                        <td>{item.status === "application viewed" ? "Resume Viewed": item.status}</td>
                                        <td>  {item.interview_date 
                                                ? new Date(item.interview_date).toLocaleString("en-GB", {
                                                    day: "2-digit",
                                                    month: "2-digit",
                                                    year: "numeric"
                                                }).replace(",", "")
                                                : "Not Scheduled"}</td>
                                        <td className='text-center'>
                                        <Button className='btn-sm me-2' onClick={() => showProfile( item._id,item.user_id.resume)}><FaFilePdf size={15}/> </Button>
                                        </td>
                                        <td>
                                        <Button variant="warning" className='btn-sm me-2' onClick={() => handleScheduleInterview(item._id)}>
                                        {item.status === 'Interview Scheduled'? 'Change Date' : 'Schedule Interview'}
                                        </Button>
                                        
                                        <Button className='btn-sm btn-success me-2' title='Select for the post' onClick={() => handleSelect(item._id)}>
                                                <FaCheck/>
                                        </Button>
                                        <Button className='btn-sm btn-danger' title='Reject' onClick={() => handleReject(item._id)}>
                                                <Trash3 size={15}/>
                                        </Button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr className='text-center'>
                                    <td colSpan={8}>No Applications..!</td>
                                </tr>
                            )}
                        </tbody>
                    </Table>

                    <Pagination className="justify-content-center mt-4">
                        <Pagination.First onClick={() => handlePageChange(1)} disabled={page === 1} />
                        <Pagination.Prev onClick={() => handlePageChange(page - 1)} disabled={page === 1} />
                        {[...Array(totalPages)].map((_, index) => (
                            <Pagination.Item
                                key={index + 1}
                                active={index + 1 === page}
                                onClick={() => handlePageChange(index + 1)}
                            >
                                {index + 1}
                            </Pagination.Item>
                        ))}
                        <Pagination.Next onClick={() => handlePageChange(page + 1)} disabled={page === totalPages} />
                        <Pagination.Last onClick={() => handlePageChange(totalPages)} disabled={page === totalPages} />
                    </Pagination>
                </Col>
            </Row>

            {/* Interview Date Modal */}
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Schedule Date for Interview</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={formik.handleSubmit}>
                        <Form.Group controlId="interview_date">
                            <Form.Label>Interview Date</Form.Label>
                            <Form.Control
                                type="date"
                                name="interview_date"
                                value={formik.values.interview_date}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                isInvalid={formik.touched.interview_date && formik.errors.interview_date}
                            />
                            <Form.Control.Feedback type="invalid">
                                {formik.errors.interview_date}
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={handleClose}>
                                Close
                            </Button>
                            <Button variant="primary" type="submit">
                                Save Changes
                            </Button>
                        </Modal.Footer>
                    </Form>
                </Modal.Body>
            </Modal>
        </Container>
    );
};

export default EmpApplications;
