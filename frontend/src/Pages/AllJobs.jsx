import { useState, useEffect } from "react";
import { Container, Row, Col, InputGroup, FormControl, Button, Card, Pagination } from "react-bootstrap";
import axios from "axios";
import './JobList.css';
import moment from "moment";
import { FaBookmark, FaRegBookmark } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const AllJobs = () => {
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 18;
  const [query, setQuery] = useState("");
  const [jobs, setJobs] = useState([]);
  const [error, setError] = useState("");
  const [savedJobs, setSavedJobs] = useState([]);
  const navigate = useNavigate();
  const token = useSelector((state) => state.users.loggedUser?.token);
  const role = useSelector((state) => state.users.loggedUser?.role);
  useEffect(() => {
    if (!token || role !== 'user') return; // Prevent API calls if token is not available

    const fetchSavedJobs = async () => {
      try {
        const { data } = await axios.get(
          "http://localhost:4005/api/v1/user/all-saved-jobs",
          {
            withCredentials: true,
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setSavedJobs(data.job || []); // Ensure it's always an array
      } catch (error) {
        console.error("Error fetching saved jobs:", error);
      }
    };

    fetchSavedJobs();
  }, [token]);
  // Fetch all jobs on component mount
  useEffect(() => {
    fetchAllJobs();
  }, [token,page]);

 
  
  const fetchAllJobs = async () => {
    if (!token) return;
    try {
      const {data} = await axios.get(`http://localhost:4005/api/v1/user/approved-jobs?page=${page}&limit=${limit}`,{withCredentials: true,headers: {Authorization:`Bearer ${token}`}}); 
      
      if (data.success) {
        setJobs(data.jobs);
        setTotalPages(data.totalPages);
      } else {
        setJobs([]);
        setError("No jobs available.");
      }
    } catch (err) {
      setError("Error fetching jobs. Please try again.");
    }
  };
  const handleSearch = async () => {
    if (query.trim() === "") {
        fetchAllJobs();  // Reset to all jobs when search is empty
        return;
    }
    setError(""); 
    if (!token) return; // Prevent search if not logged in
    try {
        console.log("Searching for:", query);

        const { data } = await axios.get(
            `http://localhost:4005/api/v1/user/search-jobs?search=${query}`,
            {
                withCredentials: true,
                headers: { Authorization: `Bearer ${token}` }
            }
        );

        console.log("API Response:", data);

        if (data.success && data.jobs.length > 0) {
            setJobs(data.jobs);
        } else {
            setJobs([]);
            setError(data.message); // ✅ Show "No jobs found" instead of error
        }
    } catch (err) {
        console.error("Search Error:", err.response?.data || err.message);

        if (err.response?.status === 404) {
            setJobs([]);
            setError("No jobs found..!"); // ✅ If 404, show "No jobs found"
        } else {
            setError(error); // ✅ If server error, show actual error
        }
    }
};

const toggleSaveJob = async (jobId) => {
  try {
    const { data } = await axios.post(
      `http://localhost:4005/api/v1/user/save-job/${jobId}`,
      {},
      {
        withCredentials: true,
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    setSavedJobs((prevSavedJobs) => {
      const isAlreadySaved = prevSavedJobs.some((job) => job.job_id?._id === jobId);
      
      if (isAlreadySaved) {
        // Remove from saved jobs
        return prevSavedJobs.filter((job) => job.job_id?._id !== jobId);
      } else {
        // Add to saved jobs
        return [...prevSavedJobs, { job_id: { _id: jobId } }];
      }
    });

  } catch (error) {
    console.error("Error toggling saved job:", error);
  }
};

const handleJobDetails = (id) => {
  navigate(`/details/${id}`);
};

const handlePageChange = (pageNumber) => {
  setPage(pageNumber);
};

  return (
    <Container className="mt-4">
      {/* Search Bar */}
      <Row className="justify-content-center">
        <Col md={8} className="pb-3">
          <InputGroup className="shadow" style={{ height: "60px" }}>
          <FormControl
              className="form-control-lg"
              type="text"
              placeholder="Job title, company, or keywords"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()} // 🔍 Trigger search on Enter
          />
          <Button variant="primary" onClick={handleSearch}>Search</Button>

          </InputGroup>
          {error && <p className="text-danger mt-2">{error}</p>}
        </Col>
      </Row>

      <Row className="mt-4">
        {jobs.length > 0 ? (
          jobs.map((job) => {
            
            const isNew = moment().diff(moment(job.posted_on), "days") <= 4;
            
            const isSaved = savedJobs.some((savedJob) => savedJob.job_id?._id === job._id);

            
            return(
              <Col md={4} key={job._id} className="d-flex ">
                <Card className="mb-4 shadow-sm">  <div className="badge-bookmark-wrapper">
                  {isNew && <div className="badge bg-success text-white">New</div>}
                  {isSaved ? (
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
            )
          }
        
          ))
         : (
          <p className="text-center text-muted mt-3">{error || "No jobs available."}</p>
        )}

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


      </Row>
    </Container>
  );
};

export default AllJobs;
