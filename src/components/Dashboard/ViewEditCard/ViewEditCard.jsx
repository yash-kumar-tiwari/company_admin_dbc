import React, { useCallback, useEffect, useState } from "react";
import {
  Avatar,
  Button,
  Card,
  Form,
  Input,
  Typography,
  Upload,
  message,
} from "antd";
import { useNavigate, useParams } from "react-router-dom";
import { Col, Row } from "react-bootstrap";
import { Editor } from "@tinymce/tinymce-react";
import { UploadOutlined } from "@ant-design/icons";
import ImgCrop from "antd-img-crop";
import {
  editCardDetails,
  fetchViewDigitalCard,
  uploadAvatar,
  uploadCardCoverPic,
} from "../../../services/apiServices";
import { handleAuthenticationError } from "../../../utils/authHelpers";

const { Text, Title } = Typography;
const { Item } = Form;
const { TextArea } = Input;

function ViewEditCard() {
  const navigate = useNavigate();
  const [form] = Form.useForm(); // Create form instance

  const params = useParams();
  const urlString = params["*"];
  // Extract the ID after the slash
  const cardID = urlString.split("/")[1];
  //   console.log(cardID);

  const [isUpdatingCard, setIsUpdatingCard] = useState(false);
  const [businessCardData, setBusinessCardData] = useState({});
  const [cardDetails, setCardDetails] = useState({});
  const [profilePreview, setProfilePreview] = useState("");
  const [fileList, setFileList] = useState([]);
  const [coverPreview, setCoverPreview] = useState("");
  const [coverPicList, setCoverPicList] = useState([]);

  const [isPreviewModalVisible, setIsPreviewModalVisible] = useState(false);
  const [bioHtml, setBioHtml] = useState("");
  const [compID, setCompID] = useState("");

  const onChange = ({ fileList: newFileList }) => {
    // Assuming only one file is selected
    console.log(newFileList);
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

  const onCoverChange = ({ fileList: newFileList }) => {
    // Assuming only one file is selected
    console.log(newFileList);
    if (newFileList.length > 0) {
      const newAvatarPreview = URL.createObjectURL(
        newFileList[0].originFileObj
      );
      setCoverPreview(newAvatarPreview);
    } else {
      setCoverPreview(""); // Clear the preview if no file is selected
    }
    setCoverPicList(newFileList);
  };

  const onCoverPreview = async (file) => {
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
      return businessCardData.profile_picture || "";
    }
  };

  const handleCoverPicUpdate = async (imageFile) => {
    // Check if there's a new file in fileList
    if (coverPicList.length > 0) {
      const file = coverPicList[0].originFileObj; // Assuming only one file is selected

      // Upload the file and get the path
      const response = await uploadCardCoverPic(imageFile);
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
      return businessCardData.cover_pic || "";
    }
  };

  const onFinish = async (values) => {
    console.log("Received values:", values);
    try {
      setIsUpdatingCard(true);

      const uploadedPhotoPath = await handleProfilePicUpdate(
        fileList[0]?.originFileObj
      );

      const uploadedCoverPath = await handleCoverPicUpdate(
        coverPicList[0]?.originFileObj
      );

      let updatedDetails = {
        ...values,
        card_id: cardID,
        bio: bioHtml,
        profile_picture: uploadedPhotoPath
          ? uploadedPhotoPath
          : businessCardData.profile_picture,
        cover_pic: uploadedCoverPath
          ? uploadedCoverPath
          : businessCardData.cover_pic,
      };
      console.log(updatedDetails);
      const response = await editCardDetails(updatedDetails); // Send updated profile data to API
      if (response && response.status === 200) {
        message.success(response.data.message);
        fetchCardData();
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

  const fetchCardData = useCallback(async () => {
    try {
      // Fetch card data from the backend based on the cardID
      const response = await fetchViewDigitalCard(cardID);

      if (response && response.status === 200) {
        console.log(response.data.data);
        setCardDetails(response.data.data);
        const cardData = response.data.data;
        setCompID(response.data.data.company_id);

        // Set form fields data using form.setFieldsValue
        form.setFieldsValue({
          first_name: cardData.first_name,
          last_name: cardData.last_name,
          user_email: cardData.user_email,
          designation: cardData.designation,
          contact_number: cardData.contact_number,
          cover_pic: cardData.cover_pic,
          profile_picture: cardData.profile_picture,
          bio: cardData.bio,
          fb_link: cardData.facebook,
          insta_link: cardData.instagram,
          linkedin_link: cardData.linkedin_link,
          whatsapp: cardData.whatsapp_number,
          youtube: cardData.youtube,
          xiao_hong_shu: cardData.xiao_hong_shu,
          tiktok: cardData.tiktok,
          wechat: cardData.wechat,
          line: cardData.line,
          telegram: cardData.telegram,
          webio: cardData.webio,
          twitter: cardData.twitter,
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
      // Handle error, e.g., show error message
    }
  }, [cardID, form]);

  useEffect(() => {
    // Fetch user data when the component mounts
    fetchCardData();
  }, [fetchCardData]);

  return (
    <Card
      type="inner"
      title={<span className="fw-bold text-center">Edit Card</span>}
      className="view-profile-custom-card"
    >
      <div
        className="edit-card-form"
        style={{ overflowY: "auto", height: "500px" }}
      >
        {/* {console.log(businessCardData)} */}
        <Form
          form={form} // Pass the form instance to the Form component
          className="p-2"
          name="editUserForm"
          onFinish={onFinish}
          initialValues={businessCardData}
        >
          <Row>
            <Col lg={6} md={12} sm={12}>
              <label className="fw-bold my-1">Profile Picture</label>
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
                      src={profilePreview || businessCardData?.profile_picture}
                      alt="User Profile Picture"
                    />
                  </label>
                </Upload>
              </ImgCrop>
              <br />{" "}
            </Col>
            <Col lg={6} md={12} sm={12}>
              <label className="fw-bold my-1">Cover Picture</label>
              <br />
              <ImgCrop rotationSlider showReset>
                <Upload
                  accept="image/*"
                  onChange={onCoverChange}
                  onPreview={onCoverPreview}
                  showUploadList={false}
                  fileList={coverPicList} // Pass the fileList prop here
                  maxCount={1}
                  customRequest={({ file, onSuccess }) => {
                    setTimeout(() => {
                      onSuccess("ok");
                    }, 0);
                  }} // Use customRequest instead of action
                >
                  <label htmlFor="cover-upload">
                    <Avatar
                      id="cover-upload" // This id is used for associating the label with the upload input
                      size={120}
                      src={coverPreview || businessCardData?.cover_pic}
                      alt="User Profile Picture"
                    />
                  </label>
                </Upload>
              </ImgCrop>
              <br />{" "}
            </Col>
          </Row>
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
          </Row>

          <Col lg={12} md={12} sm={12}>
            <label className="fw-bold my-1">Bio</label>
            <Form.Item
              //   name="bio"
              className="quill-editor"
              //   rules={[{ required: true, message: "Please input your bio!" }]}
            >
              <Editor
                apiKey="wm5bqxko1kasuhyx26o0ax3jabo3kr7nj4gzhlm2oenw0ipn"
                initialValue={cardDetails?.bio || "Welcome to TinyMCE!"}
                init={{
                  plugins:
                    "anchor autolink charmap codesample emoticons image link searchreplace table visualblocks wordcount casechange formatpainter pageembed linkchecker tinymcespellchecker permanentpen powerpaste mentions tableofcontents footnotes mergetags autocorrect  inlinecss lists", // added 'lists' plugin for bullets
                  toolbar:
                    "undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table mergetags | addcomment showcomments | spellcheckdialog a11ycheck typography | align lineheight | checklist numlist bullist indent outdent | emoticons charmap | removeformat",
                  fontsize_formats: "12pt",
                  font_formats:
                    "Arial=arial,helvetica,sans-serif;Times New Roman=times new roman,times,serif;Verdana=verdana,geneva,sans-serif",
                  // tinycomments_mode: "embedded",
                  // tinycomments_author: "Author name",
                  mergetags_list: [
                    { value: "First.Name", title: "First Name" },
                    { value: "Email", title: "Email" },
                  ],
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
                  content_css: "tinymce-5",
                }}
                // initialValue="Welcome to TinyMCE!"
                onEditorChange={handleEditorChange} // Call handleEditorChange when the editor content changes
              />
            </Form.Item>
          </Col>

          <Row>
            <Col lg={6} md={12} sm={12}>
              <label className="fw-bold my-1">Facebook</label>
              <Form.Item name="fb_link">
                <Input placeholder="Enter Facebook Link" size="large" />
              </Form.Item>
            </Col>
            <Col lg={6} md={12} sm={12}>
              <label className="fw-bold my-1">Instagram</label>
              <Form.Item name="insta_link">
                <Input placeholder="Enter Instagram Link" size="large" />
              </Form.Item>
            </Col>
            <Col lg={6} md={12} sm={12}>
              <label className="fw-bold my-1">LinkedIn</label>
              <Form.Item name="linkedin_link">
                <Input placeholder="Enter LinkedIn Link" size="large" />
              </Form.Item>
            </Col>

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
                <Input placeholder="Enter Xiao Hong Shu Link" size="large" />
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
                <Input placeholder="Enter Telegram Link" size="large" />
              </Form.Item>
            </Col>
            <Col lg={6} md={12} sm={12}>
              <label className="fw-bold my-1">Webio</label>
              <Form.Item name="webio">
                <Input placeholder="Enter Webio Link" size="large" />
              </Form.Item>
            </Col>
            <Col lg={6} md={12} sm={12}>
              <label className="fw-bold my-1">Twitter</label>
              <Form.Item name="twitter">
                <Input placeholder="Enter Twitter Link" size="large" />
              </Form.Item>
            </Col>
          </Row>

          <Button type="primary" htmlType="submit" size="large">
            Edit Card Details
          </Button>
        </Form>
      </div>
    </Card>
  );
}

export default ViewEditCard;
