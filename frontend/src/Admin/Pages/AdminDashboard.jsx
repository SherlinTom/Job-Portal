import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Card, Col, Container, Image, Row } from 'react-bootstrap'

const AdminDashboard = () => {
  const [jobCount, setJobCount] = useState(0);
  const [companyCount, setCompanyCount] = useState(0);
  const [userCount, setUserCount] = useState(0);
  

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [jobRes, userRes] = await Promise.all([
          axios.get("http://localhost:4005/api/v1/user/approved-jobs"),
          axios.get("http://localhost:4005/api/v1/admin/all-users"),
        ]);

        // Set job count
        setJobCount(jobRes.data.jobs.length);

        // Extract unique companies
        const uniqueCompanies = new Set(jobRes.data.jobs.map(job => job.company_name));
        setCompanyCount(uniqueCompanies.size);

        // Set user count
        setUserCount(userRes.data.users_only);

      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      }
    };

    fetchDashboardData();
  }, []);

  return (
      <Container className="py-5">
        <Row>
          <Col md={4}>
            <Card style={{ boxShadow: "0px 4px 5px rgba(0, 0, 0, 0.5)" }}>
                <Card.Body>
                  <center>
                    <Image src='https://cdn-icons-png.flaticon.com/512/65/65053.png' height={50} />
                    <Card.Title className="pt-3">Job Vacancies</Card.Title>
                    <Card.Subtitle className="mb-2 text-muted">
                      {jobCount}
                    </Card.Subtitle>
                  </center>
                </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card style={{ boxShadow: "0px 4px 5px rgba(0, 0, 0, 0.5)" }}>
              <Card.Body>
                <center>
                  <Image src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSapvX7v75nFz-gw9gyU7HFQkU3Yvky5A-0Zw&s' height={50} />
                  <Card.Title className="pt-3">Companies</Card.Title>
                  <Card.Subtitle className="mb-2 text-muted">
                    {companyCount}
                  </Card.Subtitle>
                </center>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card style={{ boxShadow: "0px 4px 5px rgba(0, 0, 0, 0.5)" }}>
                <Card.Body>
                  <center>
                    <Image src='https://cdn-icons-png.flaticon.com/512/850/850337.png' height={50} />
                    <Card.Title className="pt-3">Job Seekers</Card.Title>
                    <Card.Subtitle className="mb-2 text-muted">
                      {userCount}
                    </Card.Subtitle>
                  </center>
                </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
  );
}

export default AdminDashboard;
