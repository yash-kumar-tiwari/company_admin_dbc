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
import MidinFooter from "../../MidinFooter/MidinFooter";

const { Text, Title, Paragraph } = Typography;
const { Item } = Form;
const { TextArea } = Input;
const { Step } = Steps;

const initialBusinessCardData = {
  first_name: "",
  last_name: "",
  user_email: "",
  designation: "",
  bio: "",
  contact_number: "",
  cover_pic: "",
  profile_picture: "",
};

function ViewCreateCard() {
  const [businessCardData, setBusinessCardData] = useState(
    initialBusinessCardData
  );
  const [isImgPreModalVisible, setIsImgPreModalVisible] = useState(false);
  const [isPreviewModalVisible, setIsPreviewModalVisible] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [fileList, setFileList] = useState([]);
  const [previewImageUrl, setPreviewImageUrl] = useState("");
  const [bioHtml, setBioHtml] = useState("");
  const [bioTxtQuill, setBioTxtQuill] = useState("");

  const [form] = Form.useForm();
  const formRef = React.createRef();

  const onChange = async ({ fileList: newFileList }) => {
    setFileList(newFileList);
  };

  const onPreview = async (file) => {
    console.log(file);
    let src = file.url || file.preview;
    console.log(src);

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
    // Save data to the component or perform any action you need
    // For demonstration purposes, let's just log the data
    console.log("All data collected:", businessCardData);
    handlePreviewModalOpen();
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

  const handleEditorChange = (content, editor) => {
    console.log(content);
    setBioHtml(content);
  };

  const handleBioQuillChange = (value) => {
    console.log(value);
    setBioTxtQuill(value);
  };

  // Function to reset businessCardData to its initial state
  const resetBusinessCardData = () => {
    setBusinessCardData(initialBusinessCardData);
  };

  return (
    <>
      <Card
        type="inner"
        title={<span className="fw-bold text-center">Create Card</span>}
        className="view-profile-custom-card"
      >
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
                <Input placeholder="Enter First Name" size="large" />
              </Form.Item>
            </Col>
            <Col lg={4} md={12} sm={12}>
              <label className="fw-bold my-1">Last Name</label>
              <Form.Item
                name="last_name"
                rules={[{ required: true, message: "Please input last name!" }]}
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
          </Row>

          <Col lg={12} md={12} sm={12}>
            <label className="fw-bold my-1">Bio</label>
            <Form.Item
              // name="bio"
              className="quill-editor"
              // rules={[
              //   { required: true, message: "Please input your bio!" },
              // ]}
            >
              <Editor
                apiKey="wm5bqxko1kasuhyx26o0ax3jabo3kr7nj4gzhlm2oenw0ipn"
                init={{
                  placeholder: "Enter Bio Details",
                  plugins:
                    "anchor autolink charmap codesample emoticons image link searchreplace table visualblocks wordcount linkchecker lists fontsize fontfamily",
                  toolbar:
                    "undo redo | fontfamily fontsize | bold italic underline | image media | align lineheight | numlist bullist indent outdent | emoticons ",
                  images_default_resizing: "scale",
                  images_resizing: true,
                  file_picker_types: "image",
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
                  media_live_embeds: true,
                  media_embeds: true,
                  content_css: "tinymce-5",
                }}
                onEditorChange={handleEditorChange}
                value={bioHtml}
              />
              {/* <ReactQuill
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
                  /> */}
            </Form.Item>
          </Col>

          <Row>
            <Col></Col>
            <Col>
              <Button
                type="primary"
                htmlType="submit"
                size="large"
                className="w-100"
                // disabled={!isFormComplete}
              >
                Preview Card
              </Button>
            </Col>
            <Col></Col>
          </Row>
        </Form>
      </Card>

      <MidinFooter />

      {/* Your form and other components */}
      <ViewBusinessCardPreviewModal
        isVisible={isPreviewModalVisible}
        onClose={handlePreviewModalClose}
        data={businessCardData}
        imageUrl={previewImageUrl}
        fileList={fileList} // Pass fileList as a prop
        onSuccess={(cardDetails) => {
          formRef.current.resetFields();
          resetBusinessCardData();
          console.log("Success Message", cardDetails);
        }}
        bioHtml={bioHtml}
        bioTxtQuill={bioTxtQuill}
      />

      <ViewProfilePreviewModal
        isVisible={isImgPreModalVisible}
        imageUrl={previewImageUrl}
        onClose={handleImgPreModalClose}
      />
    </>
  );
}

export default ViewCreateCard;
