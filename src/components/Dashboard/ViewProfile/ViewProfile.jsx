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
import { UploadOutlined } from "@ant-design/icons";

const { Text, Title } = Typography;
const { Item } = Form;

function ViewProfile() {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [isFetchingProfile, setIsFetchingProfile] = useState(false);
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [profileData, setProfileData] = useState({});
  const [avatarPreview, setAvatarPreview] = useState("");

  const onFinishSubmit = async (values) => {
    console.log("Form values:", values);
    // Ensure avatar field exists, set to empty string if not provided
    const updatedValues = { ...values, avatar: profileData.avatar || "" };
    try {
      setIsUpdatingProfile(true);

      const response = await editProfile(updatedValues); // Send updated profile data to API
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

  const fetchViewProfileData = useCallback(async () => {
    setIsFetchingProfile(true);
    try {
      const response = await fetchViewProfile();
      if (response && response.status === 200) {
        // message.success(response.data.message);
        setProfileData(response.data.data);
        setAvatarPreview(response.data.data.avatar); // Set avatar preview

        form.setFieldsValue(response.data.data);
        navigate("/dashboard");
      } else {
        message.error(response.data.message);
      }
    } catch (error) {
      console.error("API request failed:", error);
      message.error("Failed to login. Please try again later.");
    } finally {
      setIsFetchingProfile(false);
    }
  }, [navigate, form]);

  const handleProfilePictureChange = async (info) => {
    if (info.file.status === "done") {
      const file = info.file.originFileObj;
      const formData = new FormData();
      formData.append("avatar", file);
      try {
        const response = await uploadAvatar(formData);
        if (response && response.status === 200) {
          // Set the preview of the uploaded image
          setAvatarPreview(URL.createObjectURL(file));
          // Optionally, you may want to update the profile data or trigger form validation
        } else {
          message.error(response.data.message);
        }
      } catch (error) {
        console.error("Failed to upload profile picture:", error);
        message.error(
          "Failed to upload profile picture. Please try again later."
        );
      }
    }
  };

  useEffect(() => {
    fetchViewProfileData();
  }, [navigate, fetchViewProfileData]);

  return (
    <>
      <Spin spinning={isFetchingProfile}>
        <Card
          type="inner"
          title={<span className="fw-bold text-center">Profile</span>}
          className="view-profile-custom-card"
        >
          <Card type="inner" className="view-profile-custom-card">
            <Form form={form} layout="vertical" onFinish={onFinishSubmit}>
              <Row></Row>
              <Row>
                <Col lg={2} md={0} sm={0}></Col>
                <Col lg={4} md={6} sm={6} className="my-2">
                  <label className="fw-bold my-1">Profile Photo</label>
                  <br />
                  <Avatar
                    size={120}
                    src={profileData?.avatar}
                    alt="User Profile Picture"
                  />
                  <br />
                  <Upload
                    accept="image/*"
                    onChange={handleProfilePictureChange}
                    showUploadList={true}
                    beforeUpload={() => false} // Disable default upload behavior
                    customRequest={({ file, onSuccess }) => {
                      setTimeout(() => {
                        onSuccess("ok");
                      }, 0);
                    }} // Use customRequest instead of action
                  >
                    <Button icon={<UploadOutlined />}>
                      Select File to Update{" "}
                    </Button>
                  </Upload>
                  <br />
                </Col>
                <Col lg={4} md={6} sm={6} className="my-2">
                  <label className="fw-bold my-1">Company Name</label>
                  <br />
                  {(
                    <Tag color="processing" className="p-2 fw-bold fs-4">
                      {profileData?.company_name}
                    </Tag>
                  ) || <Tag color="default">{"N/A"}</Tag>}
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
                <Col lg={3} md={0} sm={0}></Col>
                <Col lg={3} md={6} sm={6}>
                  <Item>
                    <Button
                      type="primary"
                      className="w-100"
                      shape="round"
                      htmlType="submit"
                      loading={isUpdatingProfile}
                    >
                      Save Changes
                    </Button>
                  </Item>
                </Col>
                <Col lg={3} md={6} sm={6}>
                  {/* <Item>
                    <Button
                      type="primary"
                      className="w-100"
                      shape="round"
                      htmlType="button"
                    >
                      Change Password
                    </Button>
                  </Item> */}
                </Col>
                <Col lg={3} md={0} sm={0}></Col>
              </Row>
            </Form>
          </Card>
        </Card>
      </Spin>
    </>
  );
}

export default ViewProfile;
