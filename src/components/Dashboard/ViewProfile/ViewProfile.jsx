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
} from "antd";
import React, { useCallback, useEffect, useState } from "react";
import "./ViewProfile.css";
import { useNavigate } from "react-router-dom";
import {
  editProfile,
  fetchViewProfile,
  uploadAvatar,
} from "../../../services/apiServices";
import { Col, Row } from "react-bootstrap";
import { Card as CardRB } from "react-bootstrap";
import { ExclamationCircleFilled, UploadOutlined } from "@ant-design/icons";
import ImgCrop from "antd-img-crop";

const { Text, Title, Paragraph } = Typography;
const { Item } = Form;

function ViewProfile() {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [isFetchingProfile, setIsFetchingProfile] = useState(false);
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [profileData, setProfileData] = useState({});
  const [avatarPreview, setAvatarPreview] = useState("");
  const [fileList, setFileList] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const onFinishSubmit = async (values) => {
    console.log("Form values:", values);
    setIsUpdatingProfile(true);
    try {
      const uploadedPhotoPath = await handleProfilePicUpdate(
        fileList[0]?.originFileObj
      );

      const updatedValues = {
        ...values,
        avatar: uploadedPhotoPath || profileData.avatar,
      };

      const response = await editProfile(updatedValues);
      if (response && response.status === 200) {
        message.success(response.data.message);
        fetchViewProfileData();
      } else {
        message.error(response.data.message);
      }
    } catch (error) {
      console.error("API request failed:", error);
      message.error("Failed to update profile. Please try again later.");
      setIsUpdatingProfile(false);
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  const handleProfilePicUpdate = async (imageFile) => {
    // Check if there's a new file in fileList
    if (fileList.length > 0) {
      const file = fileList[0].originFileObj; // Assuming only one file is selected

      // Upload the file and get the path
      const response = await uploadAvatar(imageFile);
      console.log(response);
      if (response.status === 201) {
        let imagePath = response.data.data;
        return imagePath;
      } else {
        message.error(response.data.message);
        return;
      }
    } else {
      // If no new file selected, use the current avatar path
      return profileData.avatar || "";
    }
  };

  const fetchViewProfileData = useCallback(async () => {
    setIsFetchingProfile(true);
    try {
      const response = await fetchViewProfile();
      if (response && response.status === 200) {
        // message.success(response.data.message);
        setProfileData(response.data.data);
        // setAvatarPreview(response.data.data.avatar); // Set avatar preview

        form.setFieldsValue(response.data.data);
        navigate("/dashboard");
      } else {
        message.error(response.data.message);
      }
    } catch (error) {
      console.error("API request failed:", error);
      message.error("Failed to Load Details. Please try again later.");
    } finally {
      setIsFetchingProfile(false);
    }
  }, [navigate, form]);

  useEffect(() => {
    fetchViewProfileData();
  }, [navigate, fetchViewProfileData]);

  const onChange = ({ fileList: newFileList }) => {
    // Assuming only one file is selected
    console.log(newFileList);
    if (newFileList.length > 0) {
      const newAvatarPreview = URL.createObjectURL(
        newFileList[0].originFileObj
      );
      setAvatarPreview(newAvatarPreview);
    } else {
      setAvatarPreview(""); // Clear the preview if no file is selected
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

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const confirmSaveChanges = () => {
    setIsModalVisible(false);
    form.submit();
  };

  return (
    <>
      <Spin spinning={isFetchingProfile}>
        <Card
          type="inner"
          title={<span className="fw-bold text-center">Profile</span>}
          className="view-profile-custom-card"
        >
          <div>
            <Form form={form} layout="vertical" onFinish={onFinishSubmit}>
              <Row></Row>
              <Row>
                <Col lg={2} md={0} sm={0}></Col>
                <Col lg={4} md={6} sm={6} className="my-2">
                  <label className="fw-bold my-1">Profile Photo</label>
                  <br />
                  <ImgCrop rotationSlider showReset>
                    <Upload
                      accept="image/*"
                      onChange={onChange}
                      onPreview={onPreview}
                      showUploadList={false}
                      fileList={fileList} // Pass the fileList prop here
                      maxCount={1}
                      customRequest={({ file, onSuccess }) => {
                        setTimeout(() => {
                          onSuccess("ok");
                        }, 0);
                      }} // Use customRequest instead of action
                    >
                      <label htmlFor="avatar-upload">
                        <Avatar
                          id="avatar-upload" // This id is used for associating the label with the upload input
                          size={120}
                          src={avatarPreview || profileData?.avatar}
                          alt="User Profile Picture"
                        />
                      </label>
                      {/* Button is not needed anymore */}
                      {/* <Button icon={<UploadOutlined />}> */}
                      {/*   Select File to Update */}
                      {/* </Button> */}
                    </Upload>
                  </ImgCrop>

                  <br />
                </Col>
                <Col lg={4} md={6} sm={6} className="my-2">
                  <label className="fw-bold my-1">Company Name</label>
                  <br />
                  {(
                    <Text className="p-2 text-primary fw-bold">
                      {profileData?.company_name}
                    </Text>
                  ) || (
                    <Text className="p-2 text-danger fw-bold">
                      {"Not Available"}
                    </Text>
                  )}
                </Col>
                <Col lg={2} md={0} sm={0}></Col>
              </Row>
              <Row>
                <Col lg={6} md={12} sm={6}>
                  <label className="fw-bold my-1">First Name</label>
                  <Item
                    name="first_name"
                    rules={[
                      {
                        required: true,
                        message: "Please enter your first name",
                      },
                    ]}
                    hasFeedback
                  >
                    <Input
                      placeholder="Enter Your First Name"
                      defaultValue={profileData.first_name || "N/A"}
                    />
                  </Item>
                </Col>
                <Col lg={6} md={12} sm={6}>
                  <label className="fw-bold my-1">Last Name</label>
                  <Item
                    name="last_name"
                    rules={[
                      {
                        required: true,
                        message: "Please enter your last name",
                      },
                    ]}
                    hasFeedback
                  >
                    <Input
                      placeholder="Enter Your Last Name"
                      defaultValue={profileData.last_name || "N/A"}
                    />
                  </Item>
                </Col>
                <Col lg={6} md={12} sm={6}>
                  <label className="fw-bold my-1">Email</label>
                  <Item
                    name="email"
                    rules={[
                      { required: true, message: "Please enter your email" },
                      { type: "email", message: "Please enter a valid email" },
                    ]}
                    hasFeedback
                  >
                    <Input
                      placeholder="Enter Your Email"
                      defaultValue={profileData.email || "N/A"}
                    />
                  </Item>
                </Col>
                <Col lg={6} md={12} sm={6}>
                  <label className="fw-bold my-1">Mobile Number</label>
                  <Item
                    name="mobile_number"
                    rules={[
                      {
                        required: true,
                        message: "Please enter your mobile number",
                      },
                    ]}
                    hasFeedback
                  >
                    <Input
                      placeholder="Enter Your Mobile Number"
                      defaultValue={profileData.mobile_number || "N/A"}
                    />
                  </Item>
                </Col>

                <Col lg={6} md={12} sm={6}>
                  <label className="fw-bold my-1">Phone Number</label>
                  <Item
                    name="phone_number"
                    rules={[
                      {
                        required: true,
                        message: "Please enter your phone number",
                      },
                    ]}
                    hasFeedback
                  >
                    <Input
                      placeholder="Enter Your Phone Number"
                      defaultValue={profileData.phone_number || "N/A"}
                    />
                  </Item>
                </Col>
              </Row>

              <Row>
                <Col lg={4} md={4} sm={3} className="text-center"></Col>
                <Col lg={4} md={4} sm={6} className="text-center">
                  <Item>
                    <Button
                      type="primary"
                      className="w-100"
                      shape="round"
                      // htmlType="submit"
                      loading={isUpdatingProfile}
                      onClick={showModal}
                    >
                      Save Changes
                    </Button>
                  </Item>
                </Col>
                <Col lg={4} md={4} sm={3} className="text-center"></Col>
              </Row>
            </Form>
          </div>
        </Card>
      </Spin>

      <Modal
        centered
        title={
          <span className="fw-bold fs-5">
            <ExclamationCircleFilled className="mx-2 text-warning" />
            Do you Want to Save Changes?
          </span>
        }
        open={isModalVisible}
        onCancel={handleCancel}
        footer={[
          <Button key="cancel" onClick={handleCancel} shape="round" danger>
            Cancel
          </Button>,
          <Button
            key="confirm"
            type="primary"
            onClick={confirmSaveChanges}
            shape="round"
          >
            Confirm
          </Button>,
        ]}
      ></Modal>
    </>
  );
}

export default ViewProfile;
