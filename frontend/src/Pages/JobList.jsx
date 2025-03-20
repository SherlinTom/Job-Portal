import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { useSelector } from "react-redux";
import { Card, Col, Container, Row } from "react-bootstrap";
import moment from "moment";
import "./JobList.css";
import { FaBookmark, FaRegBookmark } from "react-icons/fa";

const JobList = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const query = searchParams.get("search");
  const navigate = useNavigate();

  const [jobs, setJobs] = useState([]);
  const [savedJobs, setSavedJobs] = useState([]);

  const token = useSelector((state) => state.users.loggedUser?.token);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const { data } = await axios.get(
          `http://localhost:4005/api/v1/user/search-jobs?search=${query}`
        );
        setJobs(data.jobs);
      } catch (error) {
        console.error("Error fetching jobs:", error);
      }
    };
  
    fetchJobs();
  }, [query]); // ✅ Fetch jobs based only on search query
  
  useEffect(() => {
    if (!token) return; // ✅ Fetch saved jobs **only if logged in**
  
    const fetchSavedJobs = async () => {
      try {
        const { data } = await axios.get(
          "http://localhost:4005/api/v1/user/all-saved-jobs",
          {
            headers: { Authorization: `Bearer ${token}` }, // ✅ Pass token for authentication
          }
        );
        setSavedJobs(data.job || []);
      } catch (error) {
        console.error("Error fetching saved jobs:", error);
      }
    };
  
    fetchSavedJobs();
  }, [token]); // ✅ Fetch saved jobs only when token is available
  

  const handleJobDetails = (id) => {
    navigate(`/details/${id}`);
  };

  const toggleSaveJob = async (jobId) => {
    if (!token) {
      alert("Please log in to save jobs!");
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

  return (
    <Container>
      <Row className="mt-4">
        {jobs.length > 0 ? (
          jobs.map((job) => {
            const isNew = moment().diff(moment(job.posted_on), "days") <= 7;
            const isSaved = savedJobs.some((savedJob) => savedJob.job_id === job._id);

            return (
              <Col md={4} key={job._id} className="d-flex ">
                <Card className="mb-3 shadow">
                  <div className="badge-bookmark-wrapper">
                    {isNew && <div className="badge bg-success text-white">New</div>}

                    {token && ( // Show save job button only if logged in
                      isSaved ? (
                        <FaBookmark
                          title="Remove from saved list"
                          className="favourite-icon saved"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleSaveJob(job._id);
                          }}
                        />
                      ) : (
                        <FaRegBookmark
                          title="Save Job"
                          className="favourite-icon"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleSaveJob(job._id);
                          }}
                        />
                      )
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
    </Container>
  );
};

export default JobList;
