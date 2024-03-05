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
  Modal,
} from "antd";
import React, { useCallback, useEffect, useRef, useState } from "react";
import "./ViewCompanyDetails.css";
import { useNavigate } from "react-router-dom";
import {
  editCompanyDetails,
  editProfile,
  fetchCompanyDetails,
  uploadAvatar,
  uploadCompanyLogo,
} from "../../../services/apiServices";
import { Col, Row } from "react-bootstrap";
import { Card as CardRB } from "react-bootstrap";
import {
  CloseCircleOutlined,
  ExclamationCircleFilled,
  UploadOutlined,
} from "@ant-design/icons";
import CountUp from "react-countup";
import { capitalizeAndJoin } from "../../../utils/helpers";
import ImgCrop from "antd-img-crop";
import {
  GoogleMap,
  LoadScript,
  StandaloneSearchBox,
} from "@react-google-maps/api";

const { Text, Title } = Typography;
const { Item } = Form;

function ViewCompanyDetails() {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [isFetchingCompany, setIsFetchingCompany] = useState(false);
  const [isUpdatingCompany, setIsUpdatingCompany] = useState(false);
  const [companyData, setCompanyData] = useState({});
  const [companyLogo, setCompanyLogo] = useState("");
  const [fileList, setFileList] = useState([]); // State for fileList
  // Inside your component function
  const [location, setLocation] = useState({
    location: "",
    latitude: null,
    longitude: null,
  }); // State for storing selected location
  const [isModalVisible, setIsModalVisible] = useState(false);

  const fileInputRef = useRef(null);
  const searchBoxRef = useRef(null); // Ref for StandaloneSearchBox

  // Handler function for when a location is selected
  const handlePlaceSelect = (place) => {
    console.log(place);
    if (place.geometry && place.geometry.location) {
      const selectedLocation = {
        location: place.url,
        latitude: place.geometry.location.lat(),
        longitude: place.geometry.location.lng(),
        name: place.name,
      };
      console.log(selectedLocation);
      setLocation(selectedLocation);
      form.setFieldsValue({ location: place.formatted_address }); // Update the form field
    }
  };

  // Google Maps API key (Replace 'YOUR_API_KEY' with your actual API key)
  const apiKey = "AIzaSyAz9BzJwfRWIDQTG8JdcJwn1JYJx1V25jg";

  const onFinishSubmit = async (values) => {
    setIsUpdatingCompany(true);
    try {
      const uploadedLogoPath = await handleCompanyLogoUpdate(
        fileList[0]?.originFileObj
      );

      const updatedValues = {
        ...values,
        company_id: companyData.id,
        company_logo: uploadedLogoPath || companyData.company_logo,
        location: location.location,
        latitude: location.latitude,
        longitude: location.longitude,
      };

      const response = await editCompanyDetails(updatedValues); // Send updated profile data to API
      if (response && response.status === 200) {
        message.success(response.data.message);
        fetchViewCompanyData();
      } else {
        message.error(response.data.message);
      }
    } catch (error) {
      console.error("API request failed:", error);
      message.error("Failed to Update Company. Please try again later.");
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
        setCompanyLogo(response.data.data[0].company_logo); // Set avatar preview

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

  const handleCompanyLogoUpdate = async (imageFile) => {
    // Check if there's a new file in fileList
    if (fileList.length > 0) {
      const file = fileList[0].originFileObj; // Assuming only one file is selected

      // Upload the file and get the path
      const response = await uploadCompanyLogo(imageFile);
      if (response.status === 201) {
        let imagePath = response.data.data;
        return imagePath;
      } else {
        message.error(response.data.message);
        return;
      }
    } else {
      // If no new file selected, use the current avatar path
      return companyData.company_logo || "";
    }
  };

  useEffect(() => {
    fetchViewCompanyData();
  }, [navigate, fetchViewCompanyData]);

  const formatter = (value) => <CountUp end={value} separator="," />;

  const onChange = ({ fileList: newFileList }) => {
    // Assuming only one file is selected
    if (newFileList.length > 0) {
      const newAvatarPreview = URL.createObjectURL(
        newFileList[0].originFileObj
      );
      setCompanyLogo(newAvatarPreview);
    } else {
      setCompanyLogo(""); // Clear the preview if no file is selected
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
      <Spin spinning={isFetchingCompany}>
        <Card
          type="inner"
          title={<span className="fw-bold text-center">Company Details</span>}
          className="view-company-details-custom-card"
        >
          <LoadScript googleMapsApiKey={apiKey} libraries={["places"]}>
            <Form form={form} layout="vertical" onFinish={onFinishSubmit}>
              <Row></Row>
              <Row>
                {/* <Col lg={2} md={0} sm={0}></Col> */}
                <Col lg={4} md={6} sm={6} className="my-2">
                  <label className="fw-bold my-1">Company Logo</label>
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
                          src={companyLogo || companyData?.company_logo}
                          alt="Company Logo"
                        />
                      </label>
                    </Upload>
                  </ImgCrop>
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
                      {
                        type: "email",
                        message: "Please enter a valid email",
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
                    // rules={[
                    //   { required: true, message: "Please enter Description" },
                    // ]}
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
                    // rules={[
                    //   {
                    //     required: true,
                    //     message: "Please enter your company website",
                    //   },
                    // ]}
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
                <Col lg={6} md={12} sm={6}>
                  <label className="fw-bold my-1">Location</label>
                  <Form.Item name="location">
                    <StandaloneSearchBox
                      onLoad={(ref) => (searchBoxRef.current = ref)}
                      onPlacesChanged={() =>
                        handlePlaceSelect(searchBoxRef.current.getPlaces()[0])
                      }
                    >
                      <div>
                        {" "}
                        {/* Wrap Input and Button in a parent element */}
                        <Input
                          placeholder="Search Location, Places"
                          value={location?.name} // Display the selected place name
                          onChange={(e) =>
                            setLocation({
                              ...location,
                              location: e.target.value,
                            })
                          } // Update the location name if manually changed
                          addonAfter={
                            <Button
                              danger
                              type="text"
                              title="Clear Location"
                              onClick={() =>
                                setLocation({
                                  location: "",
                                  latitude: null,
                                  longitude: null,
                                })
                              }

                              // icon={<CloseCircleOutlined />}
                            >
                              Clear
                            </Button>
                          }
                        />
                        {/* <Button
                            onClick={() =>
                              setLocation({
                                location: "",
                                latitude: null,
                                longitude: null,
                              })
                            }
                          >
                            Clear
                          </Button> */}
                      </div>
                    </StandaloneSearchBox>
                  </Form.Item>
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
                      // htmlType="submit"
                      loading={isUpdatingCompany}
                      onClick={showModal}
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
          </LoadScript>
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
            onClick={confirmSaveChanges} // Bind confirmSaveChanges function here
            shape="round"
          >
            Confirm
          </Button>,
        ]}
      ></Modal>
    </>
  );
}

export default ViewCompanyDetails;
