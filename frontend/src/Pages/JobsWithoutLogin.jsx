import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { useSelector } from "react-redux";
import { Card, Col, Container, Row, Pagination } from "react-bootstrap";
import moment from "moment";
import "./JobList.css";
import {  FaRegBookmark } from "react-icons/fa";
import { toast } from 'react-toastify';

const JobsWithoutLogin = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const query = searchParams.get("search");
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 18;
  const [jobs, setJobs] = useState([]);
  const [savedJobs, setSavedJobs] = useState([]);

  const token = useSelector((state) => state.users.loggedUser?.token);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const { data } = await axios.get(
          `http://localhost:4005/api/v1/user/approved-jobs?page=${page}&limit=${limit}`
        );
        setJobs(data.jobs);
        setTotalPages(data.totalPages);
      } catch (error) {
        console.error("Error fetching jobs:", error);
      }
    };
  
    fetchJobs();
  }, [query,page]); // ✅ Fetch jobs based only on search query
  

  const handleJobDetails = (id) => {
    navigate(`/details/${id}`);
  };

  const toggleSaveJob = async (jobId) => {
    if (!token) {
      toast.error("Please log in!");
      navigate('/login')
      return;
    }

    try {
      const { data } = await axios.post(
        `http://localhost:4005/api/v1/user/save-job/${jobId}`,
        {},
        {
          withCredentials: true,
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (savedJobs.some((job) => job.job_id === jobId)) {
        setSavedJobs(savedJobs.filter((job) => job.job_id !== jobId)); // Remove from saved jobs
      } else {
        setSavedJobs([...savedJobs, { job_id: jobId }]); // Add to saved jobs
      }

      console.log(data.message);
    } catch (error) {
      console.error("Error toggling saved job:", error);
    }
  };

  const handlePageChange = (pageNumber) => {
    setPage(pageNumber);
  };

  return (
    <Container>
      <Row className="mt-4">
        {jobs.length > 0 ? (
          jobs.map((job) => {
            const isNew = moment().diff(moment(job.posted_on), "days") <= 7;

            return (
              <Col md={4} key={job._id} className="d-flex ">
                <Card className="mb-3 shadow">
                  <div className="badge-bookmark-wrapper">
                    {isNew && <div className="badge bg-success text-white">New</div>}

                    {( 
                        <FaRegBookmark
                          title="Save Job"
                          className="favourite-icon"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleSaveJob(job._id);
                          }}
                        />
                      
                    )}
                  </div>

                  <Card.Body onClick={() => handleJobDetails(job._id)}>
                    <Card.Title>{job.job_title}</Card.Title>
                    <Card.Subtitle className="mb-2 text-muted">{job.company_name}</Card.Subtitle>
                    <Card.Text>{job.company_address}</Card.Text>
                    <Card.Text  style={{ display: "-webkit-box", WebkitBoxOrient: "vertical", overflow: "hidden", WebkitLineClamp: 2 }}><div dangerouslySetInnerHTML={{ __html: job.description }} /></Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            );
          })
        ) : (
          <p className="text-center text-muted mt-3">No jobs available.</p>
        )}
      </Row>
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
    </Container>
  );
};

export default JobsWithoutLogin;
