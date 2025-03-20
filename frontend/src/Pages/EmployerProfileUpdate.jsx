import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import * as formik from 'formik';
import * as yup from 'yup';
import { Button, Card, Col, Container, Form, InputGroup, Modal, Row } from "react-bootstrap";
import axios from "axios";
import { toast } from "react-toastify";
import { updateProfile } from "../Redux/UserSlice";
const EmployerProfileUpdate = () => {
  const { Formik } = formik;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const token = useSelector((state) => state.users.loggedUser?.token);
  const [profile, setProfile] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [show, setShow] = useState(false);
  const [newPassword, setNewPassword] = useState("");

    useEffect(()=>{
      if(!token) return;
      const fetchUser = async ()=>{
          
      try {
          const {data} = await axios.get(`http://localhost:4005/api/v1/user/user-profile`,{withCredentials: true,headers: {Authorization:`Bearer ${token}`}});
        
          if(data.success){
              setProfile(data.user_details);
            
          } 
      } catch (error) {
          console.log(error.message);
      }
      }
      fetchUser();
  },[token]);

    const handleUpdate = async (values, { setSubmitting }) => {
      const formData = new FormData();
      formData.append("name", values.name);
      formData.append("email", values.email);
      formData.append("contact_no", values.contact_no);
      formData.append("company_name", values.company_name);
      formData.append("company_address", values.company_address);
    
    
      // Append profile picture if selected
      if (values.profilePic) {
        formData.append("profilePic", values.profilePic);
      }
    
      try {
        const { data } = await axios.put(
          "http://localhost:4005/api/v1/user/update-profile",
          formData,
          {
            headers: { 
              Authorization: `Bearer ${token}`, 
              "Content-Type": "multipart/form-data"
            },
            withCredentials: true,
          }
        );
        console.log("Updated Data", data);
        
    
        if (data.success) {
          toast.success(data.message);
          dispatch(updateProfile(data.user));
          navigate("/profile");
        } else {
          toast.error(data.message);
        }
      } catch (error) {
        toast.error(error.response?.data?.message || error.message);
      } finally {
        setSubmitting(false);
      }
    };
    
    const handlePasswordChange = async (e) => {
      e.preventDefault();
      if (!newPassword) {
        toast.error("Please enter a new password.");
        return;
      }
    
      try {
        const { data } = await axios.put(
          "http://localhost:4005/api/v1/user/change-password",
          { password: newPassword },
          {
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true,
          }
        );
    
        if (data.success) {
          toast.success("Password updated successfully!");
          setShow(false);
          setNewPassword("");
        } else {
          toast.error(data.message);
        }
      } catch (error) {
        toast.error(error.response?.data?.message || error.message);
      }
    };
    const handleShow = () => setShow(true);
      const handleClose = () => {
        setShow(false);
        setNewPassword("");
      };

  const schema = yup.object().shape({
        name: yup.string(),
        email: yup.string(),
        contact_no: yup.string(),
        company_name: yup.string(),
        company_address: yup.string()
      });
  return (
    <Container className="my-5">
      <Row>
        <Col className="mx-auto" md={8}>
          <Card style={{ boxShadow: "3px 5px 7px rgba(0, 0, 0, 3)" }}>
            <Card.Body>
              <Card.Title className="py-3 text-center">
                <h3>Update Profile</h3>
              </Card.Title>
              {profile && (
                <Formik
                  validationSchema={schema}
                  onSubmit={handleUpdate}
                  initialValues={{
                    name: profile.name || "",
                    email: profile.email || "",
                    contact_no: profile.contact_no || "",
                    company_name: profile.company_name || "",
                    company_address: profile.company_address || ""
                  }}
                >
                  {({
                    handleSubmit,
                    handleChange,
                    values,
                    touched,
                    errors,
                    setFieldValue 
                  }) => (
                    <Form noValidate onSubmit={handleSubmit}>
                      <Row className="mb-3">
                        <Form.Group
                          as={Col}
                          md="6"
                          className="position-relative mb-2"
                        >
                          <Form.Label>Name</Form.Label>
                          <Form.Control
                            type="text"
                            placeholder="Enter Your Name"
                            name="name"
                            value={values.name}
                            onChange={handleChange}
                            isInvalid={!!errors.name}
                          />

                          <Form.Control.Feedback type="invalid" tooltip>
                            {errors.name}
                          </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group
                          as={Col}
                          md="6"
                          className="position-relative mb-2"
                        >
                          <Form.Label>Email</Form.Label>
                          <InputGroup hasValidation>
                            <InputGroup.Text
                              id="inputGroupPrepend"
                              style={{
                                backgroundColor: "#2d5649",
                                borderColor: "#fff",
                                color: "#fff",
                              }}
                            >
                              @
                            </InputGroup.Text>
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
                        {profile.role === 'employer' &&
                        (
                          <>
                          <Form.Group
                          as={Col}
                          md="6"
                          className="position-relative mb-2"
                        >
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
                          <Form.Group
                          as={Col}
                          md="6"
                          className="position-relative mb-2"
                        >
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
                        </>
                        )}
                        <Form.Group
                          as={Col}
                          md="6"
                          className="position-relative mb-2"
                        >
                          <Form.Label>Contact No</Form.Label>
                          <Form.Control
                            type="text"
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
                        <Form.Group as={Col} md={6} controlId="profilePic" className="position-relative mb-2">
                        <Form.Label>Profile Picture</Form.Label>
                        <Form.Control
                          type="file"
                          accept="image/*"
                          onChange={(event) => {
                            setFieldValue("profilePic", event.currentTarget.files[0]); 
                            setPreviewImage(URL.createObjectURL(event.currentTarget.files[0])); // Show preview
                          }}
                          isInvalid={!!errors.profilePic}
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.profilePic}
                        </Form.Control.Feedback>

                        {/* Show Preview if an Image is Selected */}
                        {previewImage && (
                          <div className="mt-3">
                            <img src={previewImage} alt="Profile Preview" style={{ width: "100px", height: "100px", borderRadius: "50%" }} />
                          </div>
                        )}
                      </Form.Group>

                      </Row>
                        <div className=" text-start">
                          <Button
                              type="button" 
                              onClick={(e) => {
                                e.preventDefault();  // Prevent any unintended submission
                                handleShow();
                              }}
                          >
                            Change Password
                          </Button>
                        </div>
                      <div className=" text-end">
                        <Button
                          type="submit"
                          style={{
                            backgroundColor: "#2d5649",
                            borderColor: "#2d5649",
                            color: "#fff",
                          }}
                        >
                          Update
                        </Button>
                      </div>
                    </Form>
                  )}
                </Formik>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
      
            <Modal show={show} onHide={handleClose}>
              <Modal.Header closeButton>
                <Modal.Title>Change Password</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <Form onSubmit={handlePasswordChange}>
                  <Form.Group>
                    <Form.Label>New Password</Form.Label>
                    <Form.Control type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
                  </Form.Group>
                  <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                      Close
                    </Button>
                    <Button type="submit">Save Changes</Button>
                  </Modal.Footer>
                </Form>
              </Modal.Body>
            </Modal>
    </Container>
  );
};

export default EmployerProfileUpdate;
