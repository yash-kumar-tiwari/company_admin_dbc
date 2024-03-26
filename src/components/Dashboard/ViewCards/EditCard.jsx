import React, { useCallback, useEffect, useState } from "react";
import { Avatar, Button, Form, Input, Modal, Upload, message } from "antd";
import { useNavigate } from "react-router-dom";
import { Col, Row } from "react-bootstrap";
import { Editor } from "@tinymce/tinymce-react";
import ImgCrop from "antd-img-crop";
import {
  editCardDetails,
  fetchViewDigitalCard,
  uploadAvatar,
} from "../../../services/apiServices";
import { handleAuthenticationError } from "../../../utils/authHelpers";
import { ExclamationCircleFilled } from "@ant-design/icons";
import { editorApiKey } from "../../../utils/constants";

function EditCard({ visible, onCancel, onEditSuccess, record, isUpdating }) {
  console.log(record);
  const card_id = record?.id;

  const navigate = useNavigate();
  const [form] = Form.useForm();

  const [isUpdatingCard, setIsUpdatingCard] = useState(false);
  const [businessCardData, setBusinessCardData] = useState({});
  const [cardDetails, setCardDetails] = useState({});
  const [profilePreview, setProfilePreview] = useState("");
  const [fileList, setFileList] = useState([]);
  const [bioHtml, setBioHtml] = useState("");

  const onChange = ({ fileList: newFileList }) => {
    // Assuming only one file is selected
    if (newFileList.length > 0) {
      const newAvatarPreview = URL.createObjectURL(
        newFileList[0].originFileObj
      );
      setProfilePreview(newAvatarPreview);
    } else {
      setProfilePreview(""); // Clear the preview if no file is selected
    }
    setFileList(newFileList);
  };

  const onPreview = async (file) => {
    let src = file.url;
    if (!src) {
      src = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(file.originFileObj);
        reader.onload = () => resolve(reader.result);
      });
    }
    const image = new Image();
    image.src = src;
    const imgWindow = window.open(src);
    imgWindow?.document.write(image.outerHTML);
  };

  const handleProfilePicUpdate = async (imageFile) => {
    // Check if there's a new file in fileList
    if (fileList.length > 0) {
      const file = fileList[0].originFileObj; // Assuming only one file is selected

      // Upload the file and get the path
      const response = await uploadAvatar(imageFile);
      if (response.status === 201) {
        let imagePath = response.data.data;
        return imagePath;
      } else {
        message.error(response.data.message);
        return;
      }
    } else {
      // If no new file selected, use the current avatar path
      return businessCardData.profile_picture || "";
    }
  };

  const onFinish = async (values) => {
    // console.log("Received values:", values);
    try {
      setIsUpdatingCard(true);

      const uploadedPhotoPath = await handleProfilePicUpdate(
        fileList[0]?.originFileObj
      );

      let updatedDetails = {
        ...values,
        card_id: card_id,
        bio: bioHtml,
        profile_picture: uploadedPhotoPath
          ? uploadedPhotoPath
          : businessCardData.profile_picture,
      };
      const response = await editCardDetails(updatedDetails);
      if (response && response.status === 200) {
        message.success(response.data.message);
        // fetchCardData();
        onEditSuccess(updatedDetails);
      } else if (response.status === 401) {
        handleAuthenticationError(response.data.message, navigate);
      } else {
        message.error(response.data.message);
      }
    } catch (error) {
      console.error("API request failed:", error);
      message.error("Failed to Update Company. Please try again later.");
      setIsUpdatingCard(false);
    } finally {
      setIsUpdatingCard(false);
    }
  };

  const handleEditorChange = (content, editor) => {
    setBioHtml(content);
  };

  // form.setFieldsValue(record);

  const fetchCardData = useCallback(async () => {
    try {
      const response = await fetchViewDigitalCard(card_id);

      if (response && response.status === 200) {
        setCardDetails(response.data.data);
        const cardData = response.data.data;
        // setCompID(response.data.data.company_id);

        form.setFieldsValue({
          first_name: cardData.first_name,
          last_name: cardData.last_name,
          user_email: cardData.user_email,
          designation: cardData.designation,
          contact_number: cardData.contact_number,
          cover_pic: cardData.cover_pic,
          profile_picture: cardData.profile_picture,
          bio: cardData.bio,
        });

        setBusinessCardData(cardData);
        setBioHtml(cardData.bio || "");
        setBusinessCardData(response.data.data);
      } else if (response.status === 401) {
        handleAuthenticationError(response.data.message, navigate);
      } else {
        message.error(response.data.message);
      }
    } catch (error) {
      console.error("Error fetching card data:", error);
      message.error(error.message);
    }
  }, [form, navigate, card_id]);

  useEffect(() => {
    if (visible) {
      fetchCardData();
    }
  }, [visible, fetchCardData]);

  return (
    <>
      <Modal
        centered
        title={
          <span className="fw-bold fs-5">
            <ExclamationCircleFilled className="mx-2 text-primary" />
            Edit Card -{" "}
            <span className="fw-normal">
              {`${record?.first_name} ${record?.last_name}`}
            </span>
          </span>
        }
        open={visible}
        onCancel={onCancel}
        footer={null}
        destroyOnClose
      >
        <Form
          form={form}
          className="p-2"
          name="editUserForm"
          onFinish={onFinish}
          initialValues={businessCardData}
        >
          <div className="edit-card-modal-form">
            <Row>
              <Col lg={4} md={12} sm={12} xs={12}></Col>
              <Col lg={4} md={12} sm={12} xs={12}>
                <center>
                  <label className="fw-bold my-1">Profile Picture</label>
                  <br />
                  <ImgCrop rotationSlider showReset>
                    <Upload
                      accept="image/*"
                      onChange={onChange}
                      onPreview={onPreview}
                      showUploadList={false}
                      fileList={fileList}
                      maxCount={1}
                      customRequest={({ file, onSuccess }) => {
                        setTimeout(() => {
                          onSuccess("ok");
                        }, 0);
                      }}
                    >
                      <label htmlFor="avatar-upload">
                        <Avatar
                          id="avatar-upload" // This id is used for associating the label with the upload input
                          size={120}
                          src={
                            profilePreview || businessCardData?.profile_picture
                          }
                          alt="User Profile Picture"
                        />
                      </label>
                    </Upload>
                  </ImgCrop>
                  <br />{" "}
                </center>
              </Col>
              <Col lg={4} md={12} sm={12} xs={12}></Col>
            </Row>
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
                  <Input placeholder="Enter First Name" size="large" />
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
                  <Input placeholder="Enter Last Name" size="large" />
                </Form.Item>
              </Col>
              <Col lg={12} md={12} sm={12}>
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
                      message: "Please enter your contact number",
                    },
                    {
                      pattern: /^\d+$/,
                      message: "Please enter a valid contact number",
                    },
                  ]}
                >
                  <Input placeholder="Enter Contact Number" size="large" />
                </Form.Item>
              </Col>
            </Row>
            <Col lg={12} md={12} sm={12}>
              <label className="fw-bold my-1">Bio</label>
              <Form.Item
                //   name="bio"
                className="quill-editor"
                //   rules={[{ required: true, message: "Please input your bio!" }]}
              >
                <Editor
                  apiKey={editorApiKey}
                  initialValue={cardDetails?.bio || null}
                  init={{
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
                />
              </Form.Item>
            </Col>
          </div>

          <Row className="edit-card-modal-footer mt-2">
            <Col lg={3} md={3} sm={3}></Col>
            <Col lg={3} md={3} sm={3}>
              <Button size="large" className="w-100" onClick={onCancel}>
                Cancel
              </Button>
            </Col>
            <Col lg={3} md={3} sm={3}>
              <Button
                type="primary"
                htmlType="submit"
                size="large"
                className="w-100"
              >
                Edit Card
              </Button>
            </Col>
            <Col lg={3} md={3} sm={3}></Col>
          </Row>
        </Form>
      </Modal>
    </>
  );
}

export default EditCard;
