import React, { useState } from "react";
import { Button, Card, Form, Input, Upload, message } from "antd";
import "./ViewCreateCard.css";

import { Col, Row } from "react-bootstrap";
import { UploadOutlined } from "@ant-design/icons";
import ViewBusinessCardPreviewModal from "./ViewBusinessCardPreviewModal";
import "react-quill/dist/quill.snow.css"; // Import Quill's CSS for styling
import { Editor } from "@tinymce/tinymce-react";
import MidinFooter from "../../MidinFooter/MidinFooter";
import ImgCrop from "antd-img-crop";
import { downloadSampleExcel } from "../../../utils/constants";
import { createMultipleBusinessCard } from "../../../services/apiServices";
import { handleAuthenticationError } from "../../../utils/authHelpers";
import { useNavigate } from "react-router-dom";

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
  const navigate = useNavigate();

  const [businessCardData, setBusinessCardData] = useState(
    initialBusinessCardData
  );
  const [isPreviewModalVisible, setIsPreviewModalVisible] = useState(false);
  const [fileList, setFileList] = useState([]);
  const [previewImageUrl, setPreviewImageUrl] = useState("");
  const [bioHtml, setBioHtml] = useState("");
  // const [bioTxtQuill, setBioTxtQuill] = useState("");

  const [form] = Form.useForm();
  const formRef = React.createRef();

  const onChange = async ({ fileList: newFileList }) => {
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
  };

  const onFinish = (values) => {
    setBusinessCardData({ ...businessCardData, ...values });
    handlePreviewModalOpen();
  };

  const handleExcelUpload = async (file) => {
    // Check file extension
    const allowedExtensions = [".xlsx", ".xls"];
    const fileExtension = file.name
      .slice(file.name.lastIndexOf("."))
      .toLowerCase();

    if (!allowedExtensions.includes(fileExtension)) {
      // File extension not allowed, return with error message
      message.error("Only .xlsx and .xls files are allowed.");
      return;
    }
    try {
      let fileData = { file: file, fieldName: "file" };
      const response = await createMultipleBusinessCard(fileData);
      if (response.status === 201) {
        message.success(response.data.message);
      } else if (response.status === 401) {
        handleAuthenticationError(response.data.message, navigate);
      } else {
        message.error(response.data.message);
      }
    } catch (error) {
      console.error("Error uploading file:", error.message);
      message.error("Error While Creating Cards from File.", error.message);
    }
  };

  const handlePreviewModalOpen = () => {
    setIsPreviewModalVisible(true);
  };

  const handlePreviewModalClose = () => {
    setIsPreviewModalVisible(false);
  };

  const handleEditorChange = (content, editor) => {
    setBioHtml(content);
  };

  // const handleBioQuillChange = (value) => {
  //   setBioTxtQuill(value);
  // };

  return (
    <>
      <Card
        type="inner"
        title={<span className="fw-bold text-center">Create Card</span>}
        className="view-profile-custom-card"
      >
        <Row>
          <Col lg={3} md={0} sm={0} xs={0}></Col>
          <Col lg={3} md={6} sm={6} xs={6}>
            <Upload
              accept=".xlsx, .xls"
              beforeUpload={handleExcelUpload}
              showUploadList={false}
            >
              <Button type="primary" className="mb-3">
                Create Multiple Cards
              </Button>
            </Upload>
          </Col>
          <Col lg={3} md={6} sm={6} xs={6}>
            <a href={downloadSampleExcel} target="_blank" rel="noreferrer">
              <Button type="primary" className="mb-3">
                Download Sample File
              </Button>
            </a>
          </Col>
          <Col lg={3} md={0} sm={0} xs={0}></Col>
        </Row>

        <div className="viewCreateCardContainer">
          <Form
            form={form}
            ref={formRef}
            className="p-2"
            name="createCardForm"
            onFinish={onFinish}
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
                  hasFeedback
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
                  hasFeedback
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
                  hasFeedback
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
                  hasFeedback
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
                      message: "Please enter your contact number",
                    },
                    {
                      pattern: /^\d+$/,
                      message: "Please enter a valid contact number",
                    },
                  ]}
                  hasFeedback
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
        </div>
      </Card>

      <MidinFooter />

      <ViewBusinessCardPreviewModal
        isVisible={isPreviewModalVisible}
        onClose={handlePreviewModalClose}
        data={businessCardData}
        imageUrl={previewImageUrl}
        fileList={fileList}
        onSuccess={(cardDetails) => {
          formRef.current.resetFields();
          form.resetFields();
          setFileList([]);
          setBioHtml("");
          // console.log("Success Message", cardDetails);
        }}
        bioHtml={bioHtml}
        // bioTxtQuill={bioTxtQuill}
      />
    </>
  );
}

export default ViewCreateCard;
