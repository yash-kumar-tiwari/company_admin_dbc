import React, { useCallback, useEffect, useState } from "react";
import {
  Button,
  Card,
  Form,
  Input,
  Typography,
  Upload,
  Steps,
  Divider,
} from "antd";
import "./ViewCreateCard.css";
import { useNavigate } from "react-router-dom";

import { Col, Image, Row } from "react-bootstrap";
import { Card as CardRB } from "react-bootstrap";
import { UploadOutlined } from "@ant-design/icons";
import BusinessCard from "./BusinessCard";
import ViewBusinessCardPreviewModal from "./ViewBusinessCardPreviewModal";
import ImgCrop from "antd-img-crop";
import ViewProfilePreviewModal from "./ViewProfilePreviewModal";
import { FaUser, FaCircleInfo, FaCircleCheck } from "react-icons/fa6";
import { IoShareSocialSharp } from "react-icons/io5";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css"; // Import Quill's CSS for styling
import ViewCoverPreviewModal from "./ViewCoverPreviewModal";
import { Editor } from "@tinymce/tinymce-react";
import { toolbarOptions } from "../../../utils/helpers";

const { Text, Title, Paragraph } = Typography;
const { Item } = Form;
const { TextArea } = Input;
const { Step } = Steps;

function ViewCreateCard() {
  const [businessCardData, setBusinessCardData] = useState({
    // Initialize your state with default values
    first_name: "",
    last_name: "",
    user_email: "",
    designation: "",
    bio: "",
    contact_number: "",
    cover_pic: "",
    profile_picture: "",
    facebook: "",
    instagram: "",
    linkedin: "",
    whatsapp: "",
    youtube: "",
    xiao_hong_shu: "",
    tiktok: "",
    wechat: "",
    line: "",
    telegram: "",
    webio: "",
    twitter: "",
  });
  const [isImgPreModalVisible, setIsImgPreModalVisible] = useState(false);
  const [isCoverPicPreModalVisible, setIsCoverPicPreModalVisible] =
    useState(false);
  const [isPreviewModalVisible, setIsPreviewModalVisible] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [fileList, setFileList] = useState([]);
  const [previewImageUrl, setPreviewImageUrl] = useState("");
  const [coverPicUrl, setCoverPicUrl] = useState("");
  const [coverPicFileList, setCoverPicFileList] = useState([]);
  const [bioHtml, setBioHtml] = useState("");
  const [bioTxtQuill, setBioTxtQuill] = useState("");

  const [form] = Form.useForm(); // Define form instance using useForm hook
  const formRef = React.createRef();

  const onChange = ({ fileList: newFileList }) => {
    setFileList(newFileList);
  };

  const onCoverPicChange = ({ fileList: newFileList }) => {
    setCoverPicFileList(newFileList);
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

  const onCoverPicPreview = async (file) => {
    let src = file.url || file.preview;

    if (!src && file.originFileObj) {
      src = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(file.originFileObj);
        reader.onload = () => resolve(reader.result);
      });
    }

    setCoverPicUrl(src); // Store the cover pic URL
    handleCoverPicPreModalOpen(); // Open the preview modal
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

  const handleCoverPicPreModalOpen = () => {
    setIsCoverPicPreModalVisible(true);
  };

  const handleCoverPicPreModalClose = () => {
    setIsCoverPicPreModalVisible(false);
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

  const handleEditorChange = (content, editor) => {
    console.log(content);
    setBioHtml(content);
  };

  const handleBioQuillChange = (value) => {
    console.log(value);
    setBioTxtQuill(value);
  };

  return (
    <>
      <Card
        type="inner"
        title={<span className="fw-bold text-center">Create Card</span>}
        className="view-profile-custom-card"
      >
        <div className="view-create-card-steps">
          <Steps
            type="navigation"
            current={currentStep}
            responsive
            size="small"
          >
            <Step
              title="Personal"
              icon={<FaUser style={{ color: "blue" }} />}
              onClick={() => handleStepClick(0)}
              status={currentStep >= 0 ? "finish" : "wait"}
              style={{ cursor: "pointer" }}
            />
            <Step
              title="Bio"
              icon={<FaCircleInfo style={{ color: "gray" }} />}
              onClick={() => handleStepClick(1)}
              status={currentStep >= 1 ? "finish" : "wait"}
              style={{ cursor: "pointer" }}
            />
            <Step
              title="Social"
              icon={<IoShareSocialSharp style={{ color: "orange" }} />}
              onClick={() => handleStepClick(2)}
              status={currentStep >= 2 ? "finish" : "wait"}
              style={{ cursor: "pointer" }}
            />
            <Step
              title="Review"
              icon={<FaCircleCheck style={{ color: "green" }} />}
              onClick={() => handleStepClick(3)}
              status={currentStep === 3 ? "finish" : "wait"}
              style={{ cursor: "pointer" }}
            />
          </Steps>
        </div>
        <Form
          form={form}
          ref={formRef}
          className="p-2"
          name="createCardForm"
          onFinish={onFinish}
          initialValues={{
            // Updated initial values with additional fields
            first_name: businessCardData.first_name,
            last_name: businessCardData.last_name,
            user_email: businessCardData.user_email,
            designation: businessCardData.designation,
            bio: businessCardData.bio,
            contact_number: businessCardData.contact_number,
            cover_pic: businessCardData.cover_pic,
            profile_picture: businessCardData.profile_picture,
            facebook: businessCardData.facebook,
            instagram: businessCardData.instagram,
            linkedin: businessCardData.linkedin,
            whatsapp: businessCardData.whatsapp,
            youtube: businessCardData.youtube,
            xiao_hong_shu: businessCardData.xiao_hong_shu,
            tiktok: businessCardData.tiktok,
            wechat: businessCardData.wechat,
            line: businessCardData.line,
            telegram: businessCardData.telegram,
            webio: businessCardData.webio,
            twitter: businessCardData.twitter,
          }}
        >
          {currentStep === 0 && (
            <div>
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
                    <Input placeholder="Enter First Name" size="large" />
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
                    <Input placeholder="Enter Last Name" size="large" />
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
                    <Input placeholder="Enter Email Address" size="large" />
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
                    <Input placeholder="Enter Designation" size="large" />
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
                    <Input placeholder="Enter Contact Number" size="large" />
                  </Form.Item>
                </Col>
                <Col lg={6} md={6} sm={6}>
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
                          <div style={{ marginTop: 8 }}>Upload Profile</div>
                        </div>
                      )}
                    </Upload>
                  </ImgCrop>
                </Col>
                <Col lg={6} md={6} sm={6}>
                  <label className="fw-bold my-1">Cover Picture</label>
                  <ImgCrop rotationSlider showReset>
                    <Upload
                      hasControlInside
                      accept="image/*"
                      listType="picture-card"
                      fileList={coverPicFileList}
                      onChange={onCoverPicChange}
                      onPreview={onCoverPicPreview}
                      maxCount={1}
                      customRequest={({ file, onSuccess }) => {
                        setTimeout(() => {
                          onSuccess("ok");
                        }, 0);
                      }}
                    >
                      {coverPicFileList.length < 1 && (
                        <div>
                          <UploadOutlined />
                          <div style={{ marginTop: 8 }}>Upload Cover</div>
                        </div>
                      )}
                    </Upload>
                  </ImgCrop>
                </Col>
              </Row>
            </div>
          )}
          {currentStep === 1 && (
            <div>
              <Col lg={12} md={12} sm={12}>
                <label className="fw-bold my-1">Bio</label>
                <Form.Item
                  // name="bio"
                  className="quill-editor"
                  // rules={[
                  //   { required: true, message: "Please input your bio!" },
                  // ]}
                >
                  {/* <Editor
                    apiKey="wm5bqxko1kasuhyx26o0ax3jabo3kr7nj4gzhlm2oenw0ipn"
                    init={{
                      placeholder: "Enter Bio Details",
                      plugins:
                        "anchor autolink charmap codesample emoticons image link searchreplace table visualblocks wordcount casechange formatpainter pageembed linkchecker tinymcespellchecker permanentpen powerpaste mentions tableofcontents footnotes mergetags autocorrect  inlinecss lists", // added 'lists' plugin for bullets
                      toolbar:
                        "undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table mergetags | addcomment showcomments | spellcheckdialog a11ycheck typography | align lineheight | checklist numlist bullist indent outdent | emoticons charmap | removeformat",
                      // tinycomments_mode: "embedded",
                      // tinycomments_author: "Author name",
                      mergetags_list: [
                        { value: "First.Name", title: "First Name" },
                        { value: "Email", title: "Email" },
                      ],
                      ai_request: (request, respondWith) =>
                        respondWith.string(() =>
                          Promise.reject("See docs to implement AI Assistant")
                        ),
                      images_default_resizing: "scale",
                      images_resizing: true,
                      file_picker_types: "image", // Add this line to enable selecting images
                      file_picker_callback: function (callback, value, meta) {
                        if (meta.filetype === "image") {
                          var input = document.createElement("input");
                          input.setAttribute("type", "file");
                          input.setAttribute("accept", "image/*");

                          // Trigger the file selection dialog when the input element changes
                          input.onchange = function () {
                            var file = this.files[0];
                            var reader = new FileReader();

                            reader.onload = function (e) {
                              // Pass the selected file back to the editor
                              callback(e.target.result, {
                                alt: file.name, // You can customize this if needed
                              });
                            };

                            reader.readAsDataURL(file);
                          };

                          // Click the input element to open the file selection dialog
                          input.click();
                        }
                      },
                    }}
                    // initialValue="Welcome to TinyMCE!"
                    onEditorChange={handleEditorChange} // Call handleEditorChange when the editor content changes
                  /> */}
                  <ReactQuill
                    theme="snow"
                    placeholder="Enter Bio Details"
                    onChange={handleBioQuillChange}
                    value={bioTxtQuill}
                    // onChange={(value) => {
                    //   console.log(value);
                    //   formRef.current.setFieldsValue({
                    //     bio: value ? value : null,
                    //   });
                    // }}
                    // Additional props
                    modules={{
                      toolbar: toolbarOptions,
                    }}
                    // formats={formatOptions}
                  />
                </Form.Item>
              </Col>
            </div>
          )}
          {currentStep === 2 && (
            <div>
              <Row>
                <Col lg={6} md={12} sm={12}>
                  <label className="fw-bold my-1">Facebook</label>
                  <Form.Item name="facebook">
                    <Input placeholder="Enter Facebook Link" size="large" />
                  </Form.Item>
                </Col>
                <Col lg={6} md={12} sm={12}>
                  <label className="fw-bold my-1">Instagram</label>
                  <Form.Item name="instagram">
                    <Input placeholder="Enter Instagram Link" size="large" />
                  </Form.Item>
                </Col>
                <Col lg={6} md={12} sm={12}>
                  <label className="fw-bold my-1">LinkedIn</label>
                  <Form.Item name="linkedin">
                    <Input placeholder="Enter LinkedIn Link" size="large" />
                  </Form.Item>
                </Col>
                {/* <Col lg={6} md={12} sm={12}>
                  <label className="fw-bold my-1">Snapchat</label>
                  <Form.Item name="snapchat_link">
                    <Input placeholder="Enter Snapchat Link" size="large" />
                  </Form.Item>
                </Col> */}
                <Col lg={6} md={12} sm={12}>
                  <label className="fw-bold my-1">WhatsApp</label>
                  <Form.Item name="whatsapp">
                    <Input placeholder="Enter WhatsApp Number" size="large" />
                  </Form.Item>
                </Col>
                <Col lg={6} md={12} sm={12}>
                  <label className="fw-bold my-1">YouTube</label>
                  <Form.Item name="youtube">
                    <Input placeholder="Enter YouTube Link" size="large" />
                  </Form.Item>
                </Col>
                <Col lg={6} md={12} sm={12}>
                  <label className="fw-bold my-1">Xiao Hong Shu</label>
                  <Form.Item name="xiao_hong_shu">
                    <Input
                      placeholder="Enter Xiao Hong Shu Link"
                      size="large"
                    />
                  </Form.Item>
                </Col>
                <Col lg={6} md={12} sm={12}>
                  <label className="fw-bold my-1">TikTok</label>
                  <Form.Item name="tiktok">
                    <Input placeholder="Enter TikTok Link" size="large" />
                  </Form.Item>
                </Col>
                <Col lg={6} md={12} sm={12}>
                  <label className="fw-bold my-1">WeChat</label>
                  <Form.Item name="wechat">
                    <Input placeholder="Enter WeChat Link" size="large" />
                  </Form.Item>
                </Col>
                <Col lg={6} md={12} sm={12}>
                  <label className="fw-bold my-1">Line</label>
                  <Form.Item name="line">
                    <Input placeholder="Enter Line Link" size="large" />
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
              <div className="createCard-reviewInformation pt-4 pb-0">
                <Row>
                  <Col lg={6} md={12} sm={12}>
                    <p>First Name: {businessCardData.first_name}</p>
                    <p>Last Name: {businessCardData.last_name}</p>
                    <p>Email: {businessCardData.user_email}</p>
                    <p>Designation: {businessCardData.designation}</p>
                    <p>Contact Number: {businessCardData.contact_number}</p>
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
              <Divider />
              <div className="Last-create-card-button-group">
                <Button
                  style={{ marginRight: 8 }}
                  onClick={handlePrevStep}
                  size="large"
                >
                  Previous
                </Button>

                <Button type="primary" htmlType="submit" size="large">
                  Preview Card
                </Button>
              </div>
            </div>
          )}

          <div className="create-card-button-group">
            {currentStep < 3 && (
              <Col lg={12} md={12} sm={12} className="m-0 p-0">
                <Divider />
                <Form.Item className="m-0 p-0 ">
                  {currentStep > 0 && (
                    <Button
                      style={{ marginRight: 8 }}
                      onClick={handlePrevStep}
                      size="large"
                    >
                      Previous
                    </Button>
                  )}
                  <Button type="primary" htmlType="submit" size="large">
                    Save And Next
                  </Button>
                </Form.Item>
              </Col>
            )}
          </div>
        </Form>
      </Card>

      {/* Your form and other components */}
      <ViewBusinessCardPreviewModal
        isVisible={isPreviewModalVisible}
        onClose={handlePreviewModalClose}
        data={businessCardData}
        imageUrl={previewImageUrl}
        fileList={fileList} // Pass fileList as a prop
        coverPicFileList={coverPicFileList}
        onSuccess={() => {
          formRef.current.resetFields();
          console.log("Success Message");
        }}
        bioHtml={bioHtml}
        bioTxtQuill={bioTxtQuill}
      />

      {/* Modal for image preview */}
      <ViewProfilePreviewModal
        isVisible={isImgPreModalVisible}
        imageUrl={previewImageUrl}
        onClose={handleImgPreModalClose}
      />

      <ViewCoverPreviewModal
        isVisible={isCoverPicPreModalVisible}
        imageUrl={coverPicUrl}
        onClose={handleCoverPicPreModalClose}
      />
    </>
  );
}

export default ViewCreateCard;
