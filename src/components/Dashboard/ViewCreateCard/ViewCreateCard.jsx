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
  Modal,
  Steps,
  Divider,
} from "antd";
import "./ViewCreateCard.css";
import { useNavigate } from "react-router-dom";
import {
  editProfile,
  fetchViewProfile,
  uploadAvatar,
} from "../../../services/apiServices";
import { Col, Image, Row } from "react-bootstrap";
import { Card as CardRB } from "react-bootstrap";
import {
  CheckCircleOutlined,
  ProfileOutlined,
  ShareAltOutlined,
  UploadOutlined,
  UserOutlined,
} from "@ant-design/icons";
import BusinessCard from "./BusinessCard";
import ViewBusinessCardPreviewModal from "./ViewBusinessCardPreviewModal";
import ImgCrop from "antd-img-crop";
import ViewProfilePreviewModal from "./ViewProfilePreviewModal";

const { Text, Title, Paragraph } = Typography;
const { Item } = Form;
const { TextArea } = Input;
const { Step } = Steps;

function ViewCreateCard() {
  const [businessCardData, setBusinessCardData] = useState({});
  const [isImgPreModalVisible, setIsImgPreModalVisible] = useState(false);
  const [isPreviewModalVisible, setIsPreviewModalVisible] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [fileList, setFileList] = useState([]);
  const [previewImageUrl, setPreviewImageUrl] = useState("");

  const formRef = React.createRef();

  const onChange = ({ fileList: newFileList }) => {
    setFileList(newFileList);
  };

  const onPreview = async (file) => {
    let src = file.url || file.preview;

    if (!src && file.originFileObj) {
      src = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(file.originFileObj);
        reader.onload = () => resolve(reader.result);
      });
    }

    setPreviewImageUrl(src); // Store the preview image URL
    handleImgPreModalOpen(); // Open the preview modal
  };

  const onFinish = (values) => {
    console.log("Received values:", values);
    setBusinessCardData({ ...businessCardData, ...values });
    if (currentStep === 3) {
      // Save data to the component or perform any action you need
      // For demonstration purposes, let's just log the data
      console.log("All data collected:", businessCardData);
      handlePreviewModalOpen();
    } else {
      handleNextStep();
    }
  };

  const handleImgPreModalOpen = () => {
    setIsImgPreModalVisible(true);
  };

  const handleImgPreModalClose = () => {
    setIsImgPreModalVisible(false);
  };

  const handlePreviewModalOpen = () => {
    setIsPreviewModalVisible(true);
  };

  const handlePreviewModalClose = () => {
    setIsPreviewModalVisible(false);
  };

  const handleNextStep = () => {
    setCurrentStep(currentStep + 1);
  };

  const handlePrevStep = () => {
    if (currentStep === 1) {
      setCurrentStep(0); // Go back to the personal information step
    } else {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleStepClick = (step) => {
    setCurrentStep(step);
  };

  return (
    <>
      <Card
        type="inner"
        title={<span className="fw-bold text-center">Create Card</span>}
        className="view-profile-custom-card"
      >
        <Card type="inner" className="view-profile-custom-card">
          <Steps
            type="navigation"
            current={currentStep}
            responsive
            size="small"
          >
            <Step
              title="Personal"
              icon={<UserOutlined />}
              onClick={() => handleStepClick(0)}
              status={currentStep >= 0 ? "finish" : "wait"}
            />
            <Step
              title="Bio"
              icon={<ProfileOutlined />}
              onClick={() => handleStepClick(1)}
              status={currentStep >= 1 ? "finish" : "wait"}
            />
            <Step
              title="Social"
              icon={<ShareAltOutlined />}
              onClick={() => handleStepClick(2)}
              status={currentStep >= 2 ? "finish" : "wait"}
            />
            <Step
              title="Review"
              icon={<CheckCircleOutlined />}
              onClick={() => handleStepClick(3)}
              status={currentStep === 3 ? "finish" : "wait"}
            />
          </Steps>
          <Form
            ref={formRef}
            style={{
              overflow: "auto",
              maxHeight: "60vh",
              overflowX: "hidden",
            }}
            className="p-2"
            name="createCardForm"
            onFinish={onFinish}
            initialValues={{
              // Updated initial values with additional fields
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
              linkedin_link: "",
              whatsapp: "",
              youtube: "",
              xiao_hong_shu: "",
              tiktok: "",
              wechat: "",
              line: "",
              telegram: "",
              webio: "",
              twitter: "",
            }}
          >
            {currentStep === 0 && (
              <div
                style={{
                  overflowY: "scroll",
                  maxHeight: "40vh",
                  overflowX: "hidden",
                }}
              >
                <Row>
                  <Col lg={4} md={12} sm={12}>
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
                  <Col lg={4} md={12} sm={12}>
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
                  <Col lg={4} md={12} sm={12}>
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
                  <Col lg={12} md={12} sm={12}>
                    <label className="fw-bold my-1">Profile Picture</label>
                    <ImgCrop rotationSlider showReset>
                      <Upload
                        hasControlInside
                        // action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                        accept="image/*"
                        listType="picture-card"
                        fileList={fileList}
                        onChange={onChange}
                        onPreview={onPreview}
                        maxCount={1}
                        customRequest={({ file, onSuccess }) => {
                          setTimeout(() => {
                            onSuccess("ok");
                          }, 0);
                        }} // Use customRequest instead of action
                      >
                        {fileList.length < 1 && (
                          <div>
                            <UploadOutlined />
                            <div style={{ marginTop: 8 }}>Upload</div>
                          </div>
                        )}
                      </Upload>
                    </ImgCrop>
                  </Col>
                </Row>
              </div>
            )}
            {currentStep === 1 && (
              <div
                style={{
                  overflowY: "scroll",
                  maxHeight: "40vh",
                  overflowX: "hidden",
                }}
              >
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
              </div>
            )}
            {currentStep === 2 && (
              <div
                style={{
                  overflowY: "scroll",
                  maxHeight: "40vh",
                  overflowX: "hidden",
                }}
              >
                <Row>
                  <Col lg={6} md={12} sm={12}>
                    <label className="fw-bold my-1">Facebook</label>
                    <Form.Item name="fb_link">
                      <Input placeholder="Enter Facebook Link" />
                    </Form.Item>
                  </Col>
                  <Col lg={6} md={12} sm={12}>
                    <label className="fw-bold my-1">Instagram</label>
                    <Form.Item name="insta_link">
                      <Input placeholder="Enter Instagram Link" />
                    </Form.Item>
                  </Col>
                  <Col lg={6} md={12} sm={12}>
                    <label className="fw-bold my-1">LinkedIn</label>
                    <Form.Item name="linkedin_link">
                      <Input placeholder="Enter LinkedIn Link" />
                    </Form.Item>
                  </Col>
                  <Col lg={6} md={12} sm={12}>
                    <label className="fw-bold my-1">Snapchat</label>
                    <Form.Item name="snapchat_link">
                      <Input placeholder="Enter Snapchat Link" />
                    </Form.Item>
                  </Col>
                  <Col lg={6} md={12} sm={12}>
                    <label className="fw-bold my-1">WhatsApp</label>
                    <Form.Item name="whatsapp_number">
                      <Input placeholder="Enter WhatsApp Number" />
                    </Form.Item>
                  </Col>
                  <Col lg={6} md={12} sm={12}>
                    <label className="fw-bold my-1">YouTube</label>
                    <Form.Item name="youtube">
                      <Input placeholder="Enter YouTube Link" />
                    </Form.Item>
                  </Col>
                  <Col lg={6} md={12} sm={12}>
                    <label className="fw-bold my-1">Xiao Hong Shu</label>
                    <Form.Item name="xiao_hong_shu">
                      <Input placeholder="Enter Xiao Hong Shu Link" />
                    </Form.Item>
                  </Col>
                  <Col lg={6} md={12} sm={12}>
                    <label className="fw-bold my-1">TikTok</label>
                    <Form.Item name="tiktok">
                      <Input placeholder="Enter TikTok Link" />
                    </Form.Item>
                  </Col>
                  <Col lg={6} md={12} sm={12}>
                    <label className="fw-bold my-1">WeChat</label>
                    <Form.Item name="wechat">
                      <Input placeholder="Enter WeChat Link" />
                    </Form.Item>
                  </Col>
                  <Col lg={6} md={12} sm={12}>
                    <label className="fw-bold my-1">Line</label>
                    <Form.Item name="line">
                      <Input placeholder="Enter Line Link" />
                    </Form.Item>
                  </Col>
                  <Col lg={6} md={12} sm={12}>
                    <label className="fw-bold my-1">Telegram</label>
                    <Form.Item name="telegram">
                      <Input placeholder="Enter Telegram Link" />
                    </Form.Item>
                  </Col>
                  <Col lg={6} md={12} sm={12}>
                    <label className="fw-bold my-1">Webio</label>
                    <Form.Item name="webio">
                      <Input placeholder="Enter Webio Link" />
                    </Form.Item>
                  </Col>
                  <Col lg={6} md={12} sm={12}>
                    <label className="fw-bold my-1">Twitter</label>
                    <Form.Item name="twitter">
                      <Input placeholder="Enter Twitter Link" />
                    </Form.Item>
                  </Col>
                </Row>
              </div>
            )}
            {currentStep === 3 && (
              <div>
                <h2>Review Your Information</h2>
                <div
                  className="createCard-reviewInformation"
                  style={{
                    overflowY: "scroll",
                    maxHeight: "40vh",
                    overflowX: "hidden",
                  }}
                >
                  <Row>
                    <Col lg={6} md={12} sm={12}>
                      <p>First Name: {businessCardData.first_name}</p>
                      <p>Last Name: {businessCardData.last_name}</p>
                      <p>Email: {businessCardData.user_email}</p>
                      <p>Designation: {businessCardData.designation}</p>
                      <p>Contact Number: {businessCardData.contact_number}</p>
                      <p>Bio: {businessCardData.bio}</p>
                    </Col>
                    <Col lg={6} md={12} sm={12}>
                      <p>Facebook Link: {businessCardData.fb_link}</p>
                      <p>Instagram Link: {businessCardData.insta_link}</p>
                      <p>LinkedIn Link: {businessCardData.linkedin_link}</p>
                      <p>Snapchat Link: {businessCardData.snapchat_link}</p>
                      <p>WhatsApp Number: {businessCardData.whatsapp_number}</p>
                      <p>Website URL: {businessCardData.website_url}</p>
                      <p>YouTube: {businessCardData.youtube}</p>
                      <p>Xiao Hong Shu: {businessCardData.xiao_hong_shu}</p>
                      <p>TikTok: {businessCardData.tiktok}</p>
                      <p>WeChat: {businessCardData.wechat}</p>
                      <p>Line: {businessCardData.line}</p>
                      <p>Telegram: {businessCardData.telegram}</p>
                      <p>Webio: {businessCardData.webio}</p>
                      <p>Twitter: {businessCardData.twitter}</p>
                    </Col>
                    {/* <Col>
                    {previewImageUrl && ( // Check if profile picture URL is available
                      <div>
                        <p>Profile Picture:</p>
                        <Image
                          src={previewImageUrl}
                          alt="Profile Picture"
                          style={{ maxWidth: "100px" }} // Set your desired max width
                        />
                      </div>
                    )}
                  </Col> */}
                  </Row>
                </div>

                <Button
                  style={{ marginRight: 8 }}
                  onClick={handlePrevStep}
                  shape="round"
                >
                  Previous
                </Button>

                <Button type="primary" htmlType="submit" shape="round">
                  Preview Card
                </Button>
              </div>
            )}
            <Divider />
            <div className="create-card-button-group">
              {currentStep < 3 && (
                <Col lg={6} md={12} sm={12} className="m-0 p-0">
                  <Form.Item className="m-0 p-0">
                    {currentStep > 0 && (
                      <Button
                        style={{ marginRight: 8 }}
                        onClick={handlePrevStep}
                        shape="round"
                      >
                        Previous
                      </Button>
                    )}
                    <Button type="primary" htmlType="submit" shape="round">
                      Save And Next
                    </Button>
                  </Form.Item>
                </Col>
              )}
            </div>
          </Form>
        </Card>
      </Card>

      {/* Your form and other components */}
      <ViewBusinessCardPreviewModal
        isVisible={isPreviewModalVisible}
        onClose={handlePreviewModalClose}
        data={businessCardData}
        imageUrl={previewImageUrl}
        fileList={fileList} // Pass fileList as a prop
        onSuccess={() => {
          formRef.current.resetFields();
          console.log("Success Message");
        }}
      />

      {/* Modal for image preview */}
      <ViewProfilePreviewModal
        isVisible={isImgPreModalVisible}
        imageUrl={previewImageUrl}
        onClose={handleImgPreModalClose}
      />
    </>
  );
}

export default ViewCreateCard;
