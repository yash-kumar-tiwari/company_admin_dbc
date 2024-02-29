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
  Statistic,
} from "antd";
import React, { useCallback, useEffect, useState } from "react";
import "./ViewCompanyDetails.css";
import { useNavigate } from "react-router-dom";
import {
  editProfile,
  fetchCompanyDetails,
  uploadAvatar,
} from "../../../services/apiServices";
import { Col, Row } from "react-bootstrap";
import { Card as CardRB } from "react-bootstrap";
import { UploadOutlined } from "@ant-design/icons";
import CountUp from "react-countup";
import { capitalizeAndJoin } from "../../../utils/helpers";

const { Text, Title } = Typography;
const { Item } = Form;

function ViewCompanyDetails() {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [isFetchingCompany, setIsFetchingCompany] = useState(false);
  const [isUpdatingCompany, setIsUpdatingCompany] = useState(false);
  const [companyData, setCompanyData] = useState({});
  const [avatarPreview, setAvatarPreview] = useState("");

  const onFinishSubmit = async (values) => {
    // Ensure avatar field exists, set to empty string if not provided
    const updatedValues = { ...values, avatar: companyData.avatar || "" };
    try {
      setIsUpdatingCompany(true);

      const response = await editProfile(updatedValues); // Send updated profile data to API
      if (response && response.status === 200) {
        message.success(response.data.message);
        fetchViewCompanyData();
      } else {
        message.error(response.data.message);
      }
    } catch (error) {
      console.error("API request failed:", error);
      message.error("Failed to update profile. Please try again later.");
      setIsUpdatingCompany(false);
    } finally {
      setIsUpdatingCompany(false);
    }
  };

  const fetchViewCompanyData = useCallback(async () => {
    try {
      setIsFetchingCompany(true);
      const response = await fetchCompanyDetails();
      if (response && response.status === 200) {
        // message.success(response.data.message);
        setCompanyData(response.data.data[0]);
        setAvatarPreview(response.data.data[0].company_logo); // Set avatar preview

        form.setFieldsValue(response.data.data[0]);
      } else {
        message.error(response.data.message);
      }
    } catch (error) {
      console.error("API request failed:", error);
      message.error("Failed to Load Details. Please try again later.");
    } finally {
      setIsFetchingCompany(false);
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
    fetchViewCompanyData();
  }, [navigate, fetchViewCompanyData]);

  console.log(companyData);

  const formatter = (value) => <CountUp end={value} separator="," />;

  return (
    <>
      <Spin spinning={isFetchingCompany}>
        <Card
          type="inner"
          title={<span className="fw-bold text-center">Company Details</span>}
          className="view-company-details-custom-card"
        >
          <Card
            type="inner"
            className="view-company-details-custom-card"
            style={{ overflow: "auto", maxHeight: "60vh" }}
          >
            <Form form={form} layout="vertical" onFinish={onFinishSubmit}>
              <Row></Row>
              <Row>
                {/* <Col lg={2} md={0} sm={0}></Col> */}
                <Col lg={4} md={6} sm={6} className="my-2">
                  <label className="fw-bold my-1">Company Logo</label>
                  <br />
                  <Avatar
                    size={120}
                    src={companyData?.company_logo} // Use company_logo instead of avatar
                    alt="Company Logo"
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
                    <Text className="p-2 text-primary fw-bold">
                      {companyData?.company_name}
                    </Text>
                  ) || (
                    <Text className="p-2 text-danger fw-bold">
                      {"Not Available"}
                    </Text>
                  )}
                </Col>
                <Col lg={4} md={0} sm={0} className="my-2">
                  <Row
                    className="my-1 p-4"
                    style={{
                      backgroundColor: "#bae7ff",
                      borderRadius: "15px",
                    }}
                  >
                    <Col lg={6}>
                      <Statistic
                        title={
                          <span className="fw-bold text-black">Used Cards</span>
                        }
                        value={companyData.used_cards}
                        formatter={formatter}
                      />
                    </Col>
                    <Col lg={6}>
                      <Statistic
                        title={
                          <span className="fw-bold text-black">Max Cards</span>
                        }
                        value={companyData.max_cards}
                        // precision={2}
                        formatter={formatter}
                      />
                    </Col>
                  </Row>
                </Col>
              </Row>

              <Row>
                <Col lg={6} md={12} sm={6}>
                  <label className="fw-bold my-1">Company Name</label>
                  <Item
                    name="company_name"
                    rules={[
                      {
                        required: true,
                        message: "Please enter company name",
                      },
                    ]}
                    hasFeedback
                  >
                    <Input
                      placeholder="Enter Your Company Name"
                      defaultValue={companyData?.company_name || "N/A"}
                    />
                  </Item>
                </Col>
                <Col lg={6} md={12} sm={6}>
                  <label className="fw-bold my-1">Company Email</label>
                  <Item
                    name="company_email"
                    rules={[
                      {
                        required: true,
                        message: "Please enter your company email",
                      },
                    ]}
                    hasFeedback
                  >
                    <Input
                      placeholder="Enter Your Company Email"
                      defaultValue={companyData?.company_email || "N/A"}
                    />
                  </Item>
                </Col>
                <Col lg={6} md={12} sm={6}>
                  <label className="fw-bold my-1">Description</label>
                  <Item
                    name="description"
                    rules={[
                      { required: true, message: "Please enter your email" },
                      { type: "email", message: "Please enter a valid email" },
                    ]}
                    hasFeedback
                  >
                    <Input
                      placeholder="Enter Company Description"
                      defaultValue={companyData?.description || "N/A"}
                    />
                  </Item>
                </Col>
                <Col lg={6} md={12} sm={6}>
                  <label className="fw-bold my-1">Company Address</label>
                  <Item
                    name="company_address"
                    rules={[
                      {
                        required: true,
                        message: "Please enter your company address",
                      },
                    ]}
                    hasFeedback
                  >
                    <Input
                      placeholder="Enter Your Company Address"
                      defaultValue={companyData?.company_address || "N/A"}
                    />
                  </Item>
                </Col>

                <Col lg={6} md={12} sm={6}>
                  <label className="fw-bold my-1">Company Contact Number</label>
                  <Item
                    name="company_contact_number"
                    rules={[
                      {
                        required: true,
                        message: "Please enter your company contact number",
                      },
                    ]}
                    hasFeedback
                  >
                    <Input
                      placeholder="Enter Your Company Contact Number"
                      defaultValue={companyData.company_contact_number || "N/A"}
                    />
                  </Item>
                </Col>

                <Col lg={6} md={12} sm={6}>
                  <label className="fw-bold my-1">Company Website</label>
                  <Item
                    name="company_website"
                    rules={[
                      {
                        required: true,
                        message: "Please enter your company website",
                      },
                    ]}
                    hasFeedback
                  >
                    <Input
                      placeholder="Enter Your Company Website"
                      defaultValue={companyData.company_website || "N/A"}
                    />
                  </Item>
                </Col>

                <Col lg={6} md={12} sm={6}>
                  <label className="fw-bold my-1">Contact Person Name</label>
                  <Item
                    name="contact_person_name"
                    rules={[
                      {
                        required: true,
                        message: "Please enter your contact person name",
                      },
                    ]}
                    hasFeedback
                  >
                    <Input
                      disabled
                      placeholder="Enter Your Contact Person Name"
                      defaultValue={companyData.contact_person_name || "N/A"}
                    />
                  </Item>
                </Col>
                <Col lg={6} md={12} sm={6}>
                  <label className="fw-bold my-1">Contact Person Email</label>
                  <Item
                    name="contact_person_email"
                    rules={[
                      {
                        required: true,
                        message: "Please enter your contact person email",
                      },
                    ]}
                    hasFeedback
                  >
                    <Input
                      disabled
                      placeholder="Enter Your Contact Person Email"
                      defaultValue={companyData.contact_person_email || "N/A"}
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
                      loading={isUpdatingCompany}
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

export default ViewCompanyDetails;
