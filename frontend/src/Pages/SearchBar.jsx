import React, { useState } from "react";
import { Button, Col, Container, FormControl, InputGroup, Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const SearchBar = () => {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = () => {
    if (query.trim() !== "") {
      navigate(`/jobs?search=${query}`);
    }
  };

  return (
<Container className="mt-4 ">
      <Row className="justify-content-center">
        <Col md={8} className="pb-3">
          <InputGroup className="shadow" style={{ height: "60px" }}>
            <FormControl
              type="text"
              placeholder="Job title, company, or keywords"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="form-control-lg"
            />
            <Button variant="primary" onClick={handleSearch}>
              Search
            </Button>
          </InputGroup>
        </Col>
      </Row>
    </Container>
  );
};

export default SearchBar;
