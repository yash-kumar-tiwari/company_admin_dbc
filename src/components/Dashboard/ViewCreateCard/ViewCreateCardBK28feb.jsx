import React, { useCallback, useEffect, useState } from "react";
import {
  Avatar,
  Button,
  Card,
  Form,
  Input,
  Typography,
  message,
  Spin,
  Tag,
  Upload,
  Steps,
  Modal,
} from "antd";
import "./ViewCreateCard.css";
import { useNavigate } from "react-router-dom";
import {
  editProfile,
  fetchViewProfile,
  uploadAvatar,
} from "../../../services/apiServices";
import { Col, Row } from "react-bootstrap";
import { Card as CardRB } from "react-bootstrap";
import { UploadOutlined, UserOutlined } from "@ant-design/icons";
import BusinessCard from "./BusinessCard";

const { Text, Title, Paragraph } = Typography;
const { Item } = Form;

const { TextArea } = Input;
const { Step } = Steps;

function ViewCreateCard() {
  const [businessCardData, setBusinessCardData] = useState({});
  const [current, setCurrent] = useState(0);
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    user_email: "",
    designation: "",
    bio: "",
    contact_number: "",
    cover_pic: "",
    profile_picture: "",
    fb_link: "",
    insta_link: "",
  });
  const [previewModalVisible, setPreviewModalVisible] = useState(false); // State to manage visibility of the preview modal

  // Function to handle opening and closing of the preview modal
  const handlePreviewModal = () => {
    setPreviewModalVisible(!previewModalVisible);
  };

  const navigate = useNavigate();

  const onChange = (value) => {
    console.log("onChange:", value);
    setCurrent(value);
  };

  const onFinish = (values) => {
    console.log("Received values:", values);
    setFormData({ ...formData, ...values });
    if (current === 2) {
      setBusinessCardData({ ...formData, ...values });
    }
  };

  const handleNext = () => {
    setCurrent(current + 1);
  };

  const handlePrevious = () => {
    setCurrent(current - 1);
  };

  return (
    <>
      <Card
        type="inner"
        title={<span className="fw-bold text-center">Create Card</span>}
        className="view-profile-custom-card"
      >
        <Card type="inner" className="view-profile-custom-card">
          <Row>
            <Col
              lg={6}
              md={6}
              sm={6}
              //   style={{ overflow: "auto", maxHeight: "60vh" }}
            >
              <Steps
                type="navigation"
                size="small"
                current={current}
                onChange={onChange}
                className="site-navigation-steps"
                items={[
                  {
                    status: "finish",
                    title: "Personal",
                    icon: <UserOutlined />,
                  },
                  {
                    status: "finish",
                    title: "Info",
                  },
                  {
                    status: "process",
                    title: "Social",
                  },
                ]}
              />
              <div>
                <Form
                  name="createCardForm"
                  onFinish={onFinish}
                  initialValues={{
                    first_name: "",
                    last_name: "",
                    user_email: "",
                    designation: "",
                    bio: "",
                    contact_number: "",
                    cover_pic: "",
                    profile_picture: "",
                    fb_link: "",
                    insta_link: "",
                  }}
                >
                  {current === 0 && (
                    <>
                      <Row
                        style={{
                          overflow: "auto",
                          maxHeight: "40vh",
                          overflowX: "hidden",
                        }}
                      >
                        <Col lg={12} md={12} sm={12}>
                          <label className="fw-bold my-1">First Name</label>
                          <Form.Item
                            name="first_name"
                            rules={[
                              {
                                required: true,
                                message: "Please input first name!",
                              },
                            ]}
                          >
                            <Input placeholder="Enter First Name" />
                          </Form.Item>
                        </Col>
                        <Col lg={12} md={12} sm={12}>
                          <label className="fw-bold my-1">Last Name</label>
                          <Form.Item
                            name="last_name"
                            rules={[
                              {
                                required: true,
                                message: "Please input last name!",
                              },
                            ]}
                          >
                            <Input placeholder="Enter Last Name" />
                          </Form.Item>
                        </Col>
                        <Col lg={12} md={12} sm={12}>
                          <label className="fw-bold my-1">Email</label>
                          <Form.Item
                            name="user_email"
                            rules={[
                              {
                                required: true,
                                message: "Please input email!",
                              },
                              {
                                type: "email",
                                message: "Please enter a valid email address!",
                              },
                            ]}
                          >
                            <Input placeholder="Enter Email Address" />
                          </Form.Item>
                        </Col>
                        <Col lg={12} md={12} sm={12}>
                          <label className="fw-bold my-1">Designation</label>
                          <Form.Item
                            name="designation"
                            rules={[
                              {
                                required: true,
                                message: "Please input designation!",
                              },
                            ]}
                          >
                            <Input placeholder="Enter Designation" />
                          </Form.Item>
                        </Col>
                        <Col lg={12} md={12} sm={12}>
                          <label className="fw-bold my-1">Contact Number</label>
                          <Form.Item
                            name="contact_number"
                            rules={[
                              {
                                required: true,
                                message: "Please input contact number!",
                              },
                            ]}
                          >
                            <Input placeholder="Enter Contact Number" />
                          </Form.Item>
                        </Col>
                      </Row>
                      <Row>
                        <Col lg={6} md={12} sm={12} className="my-2">
                          <Form.Item>
                            <Button type="primary" onClick={handleNext}>
                              Next
                            </Button>
                          </Form.Item>
                        </Col>
                      </Row>
                    </>
                  )}
                  {current === 1 && (
                    <>
                      <Row
                        style={{
                          overflow: "auto",
                          maxHeight: "60vh",
                          overflowX: "hidden",
                        }}
                      >
                        <Col lg={6} md={12} sm={12}>
                          <label className="fw-bold my-1">Cover Picture</label>
                          <Form.Item name="cover_pic">
                            <Input placeholder="Select Cover Picture" />
                          </Form.Item>
                        </Col>
                        <Col lg={6} md={12} sm={12}>
                          <label className="fw-bold my-1">
                            Profile Picture
                          </label>
                          <Form.Item name="profile_picture">
                            <Input placeholder="Select Profile Picture" />
                          </Form.Item>
                        </Col>
                      </Row>
                      <Row className="my-2">
                        <Col lg={6} md={12} sm={12}>
                          <Form.Item>
                            <Button onClick={handlePrevious}>Previous</Button>
                          </Form.Item>
                        </Col>
                        <Col lg={6} md={12} sm={12}>
                          <Form.Item>
                            <Button type="primary" onClick={handleNext}>
                              Next
                            </Button>
                          </Form.Item>
                        </Col>
                      </Row>
                    </>
                  )}
                  {current === 2 && (
                    <>
                      <Row
                        style={{
                          overflow: "auto",
                          maxHeight: "60vh",
                          overflowX: "hidden",
                        }}
                      >
                        <Col lg={6} md={12} sm={12}>
                          <label className="fw-bold my-1">Facebook Link</label>
                          <Form.Item name="fb_link">
                            <Input placeholder="Enter Facebook Link" />
                          </Form.Item>
                        </Col>
                        <Col lg={6} md={12} sm={12}>
                          <label className="fw-bold my-1">Instagram Link</label>

                          <Form.Item name="insta_link">
                            <Input placeholder="Enter Instagram Link" />
                          </Form.Item>
                        </Col>
                      </Row>
                      <Col lg={12} md={12} sm={12}>
                        <label className="fw-bold my-1">Bio</label>
                        <Form.Item
                          name="bio"
                          rules={[
                            {
                              required: true,
                              message: "Please input your bio!",
                            },
                          ]}
                        >
                          <TextArea rows={4} placeholder="Enter Bio Details" />
                        </Form.Item>
                      </Col>
                      <Row className="my-2">
                        <Col lg={6} md={12} sm={12}>
                          <Form.Item>
                            <Button onClick={handlePrevious}>Previous</Button>
                          </Form.Item>
                        </Col>
                        <Col lg={6} md={12} sm={12}>
                          <Form.Item>
                            <Button type="primary" htmlType="submit">
                              Create Card
                            </Button>
                          </Form.Item>
                        </Col>
                      </Row>
                    </>
                  )}
                </Form>
              </div>
              <Button onClick={handlePreviewModal}>Preview</Button>{" "}
              {/* Button to trigger preview modal */}
              {/* <Form
                name="createCardForm"
                onFinish={onFinish}
                initialValues={{
                  first_name: "",
                  last_name: "",
                  user_email: "",
                  designation: "",
                  bio: "",
                  contact_number: "",
                  cover_pic: "",
                  profile_picture: "",
                  fb_link: "",
                  insta_link: "",
                }}
              >
                <Row>
                  <Col lg={6} md={12} sm={12}>
                    <label className="fw-bold my-1">First Name</label>
                    <Form.Item
                      name="first_name"
                      rules={[
                        {
                          required: true,
                          message: "Please input first name!",
                        },
                      ]}
                    >
                      <Input placeholder="Enter First Name" />
                    </Form.Item>
                  </Col>
                  <Col lg={6} md={12} sm={12}>
                    <label className="fw-bold my-1">Last Name</label>
                    <Form.Item
                      name="last_name"
                      rules={[
                        { required: true, message: "Please input last name!" },
                      ]}
                    >
                      <Input placeholder="Enter Last Name" />
                    </Form.Item>
                  </Col>
                  <Col lg={6} md={12} sm={12}>
                    <label className="fw-bold my-1">Email</label>
                    <Form.Item
                      name="user_email"
                      rules={[
                        { required: true, message: "Please input email!" },
                        {
                          type: "email",
                          message: "Please enter a valid email address!",
                        },
                      ]}
                    >
                      <Input placeholder="Enter Email Address" />
                    </Form.Item>
                  </Col>
                  <Col lg={6} md={12} sm={12}>
                    <label className="fw-bold my-1">Designation</label>
                    <Form.Item
                      name="designation"
                      rules={[
                        {
                          required: true,
                          message: "Please input designation!",
                        },
                      ]}
                    >
                      <Input placeholder="Enter Designation" />
                    </Form.Item>
                  </Col>

                  <Col lg={6} md={12} sm={12}>
                    <label className="fw-bold my-1">Contact Number</label>
                    <Form.Item
                      name="contact_number"
                      rules={[
                        {
                          required: true,
                          message: "Please input contact number!",
                        },
                      ]}
                    >
                      <Input placeholder="Enter Contact Number" />
                    </Form.Item>
                  </Col>
                  <Col lg={6} md={12} sm={12}>
                    <label className="fw-bold my-1">Cover Picture</label>
                    <Form.Item name="cover_pic">
                      <Input placeholder="Select Cover Picture" />
                    </Form.Item>
                  </Col>
                  <Col lg={6} md={12} sm={12}>
                    <label className="fw-bold my-1">Profile Picture</label>
                    <Form.Item name="profile_picture">
                      <Input placeholder="Select Profile Picture" />
                    </Form.Item>
                  </Col>
                  <Col lg={6} md={12} sm={12}>
                    <label className="fw-bold my-1">Facebook Link</label>
                    <Form.Item name="fb_link">
                      <Input placeholder="Enter Facebook Link" />
                    </Form.Item>
                  </Col>
                  <Col lg={6} md={12} sm={12}>
                    <label className="fw-bold my-1">Instagram Link</label>

                    <Form.Item name="insta_link">
                      <Input placeholder="Enter Instagram Link" />
                    </Form.Item>
                  </Col>
                </Row>
                <Col lg={12} md={12} sm={12}>
                  <label className="fw-bold my-1">Bio</label>
                  <Form.Item
                    name="bio"
                    rules={[
                      { required: true, message: "Please input your bio!" },
                    ]}
                  >
                    <TextArea rows={4} placeholder="Enter Bio Details" />
                  </Form.Item>
                </Col>
                <Col lg={6} md={12} sm={12}>
                  <Form.Item>
                    <Button type="primary" htmlType="submit">
                      Create Card
                    </Button>
                  </Form.Item>
                </Col>
              </Form> */}
            </Col>
            <Col
              lg={6}
              md={6}
              sm={6}
              style={{
                overflow: "auto",
                maxHeight: "60vh",
              }}
            >
              <BusinessCard data={businessCardData} />
            </Col>
          </Row>
        </Card>
      </Card>

      {/* Modal for card preview */}
      <Modal
        title="Card Preview"
        open={previewModalVisible}
        onCancel={handlePreviewModal}
        footer={[
          <Button key="back" onClick={handlePreviewModal}>
            Close
          </Button>,
        ]}
      >
        <BusinessCard data={businessCardData} />
      </Modal>
    </>
  );
}

export default ViewCreateCard;
