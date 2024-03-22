import React, { useCallback, useContext, useEffect, useState } from "react";
import "./ViewBusinessCardPreviewModal.css";

import { Container, Col, Image, Row } from "react-bootstrap";
import { Alert, Button, Modal, Space, message } from "antd";
import { FaMapLocationDot, FaUserPlus } from "react-icons/fa6";
import { FaShareAlt } from "react-icons/fa";
import StaticQR from "../../../assets/images/static/qr_img.png";
import DefaultUserAvatar from "../../../assets/images/static/default_user.png";

import {
  fetchCompanyDetails,
  getVCFCardforDigitalCard,
  uploadCardCoverPic,
} from "../../../services/apiServices";

import AppMapIcon from "../../../assets/images/static/map_icon.png";

import WhatsAppCustomIcon from "../../../assets/images/social/whatsapp.png";
import InstagramCustomIcon from "../../../assets/images/social/instagram.png";
import TelegramCustomIcon from "../../../assets/images/social/telegram.png";
import LinkedInCustomIcon from "../../../assets/images/social/linkedin.png";
import WeChatCustomIcon from "../../../assets/images/social/wechat.png";
import LineCustomIcon from "../../../assets/images/social/line.png";
import YouTubeCustomIcon from "../../../assets/images/social/youtube.png";
import TwitterCustomIcon from "../../../assets/images/social/twitter.png";
import TikTokCustomIcon from "../../../assets/images/social/tiktok.png";
import FacebookCustomIcon from "../../../assets/images/social/facebook.png";
import {
  createBusinessCard,
  uploadCardProfilePic,
} from "../../../services/apiServices";
import { ExclamationCircleFilled } from "@ant-design/icons";
import { handleAuthenticationError } from "../../../utils/authHelpers";
import { useNavigate } from "react-router-dom";
import { CompanyContext } from "../../../contexts/CompanyContext";

const ViewBusinessCardPreviewModal = ({
  isVisible,
  onClose,
  data,
  imageUrl,
  coverImageUrl,
  fileList,
  coverPicFileList,
  onSuccess,
  bioHtml,
  bioTxtQuill,
}) => {
  console.log(data);
  console.log(fileList);
  console.log(bioHtml);

  const navigate = useNavigate();

  const { companyIdCtx, setCompanyIdCtx } = useContext(CompanyContext);
  console.log(companyIdCtx);

  const [companyDetails, setCompanyDetails] = useState(null);
  const [isCreatingCard, setIsCreatingCard] = useState(false);

  const handleSubmitCreateCard = async () => {
    setIsCreatingCard(true);
    try {
      let uploadedPhotoPath, uploadedCoverPath;

      if (fileList && fileList.length > 0) {
        uploadedPhotoPath = await uploadCardProfilePhoto(
          fileList[0]?.originFileObj
        );
      }

      if (coverPicFileList && coverPicFileList.length > 0) {
        uploadedCoverPath = await uploadCardCoverPhoto(
          coverPicFileList[0]?.originFileObj
        );
      }

      let bio_content = bioHtml;

      const cardDetails = {
        ...data,
        profile_picture: uploadedPhotoPath || "",
        cover_pic: uploadedCoverPath || "",
        bio: bioHtml || null,
        // bio: bioTxtQuill || null,
      };

      const response = await createBusinessCard(cardDetails);
      if (response.status === 201) {
        message.success(response.data.message);
        onSuccess(cardDetails);
      } else if (response.status === 401) {
        handleAuthenticationError(response.data.message, navigate);
      } else {
        message.error(response.data.message);
      }
    } catch (error) {
      console.error("Error While Creating Card:", error);
      message.error("Failed to Create Card. Please try again.");
    } finally {
      setIsCreatingCard(false);
      onClose();
    }
  };

  const uploadCardProfilePhoto = async (photoFile) => {
    console.log(photoFile);
    try {
      const response = await uploadCardProfilePic(photoFile);
      console.log(response);
      if (response.status === 201) {
        let imagePath = response.data.data;
        return imagePath;
      } else {
        message.error(response.data.message);
      }
    } catch (error) {
      message.error(error);
    }
  };

  const uploadCardCoverPhoto = async (photoFile) => {
    console.log(photoFile);
    try {
      const response = await uploadCardCoverPic(photoFile);
      console.log(response);
      if (response.status === 201) {
        let imagePath = response.data.data;
        return imagePath;
      } else {
        message.error(response.data.message);
      }
    } catch (error) {
      message.error(error);
    }
  };

  const handleAddToContacts = async () => {
    try {
      // Run your API to fetch vCard data
      const response = await getVCFCardforDigitalCard("cardDetails.id");
      console.log(response);

      // Create a Blob with the vCard data
      const blob = new Blob([response.data], { type: "text/vcard" });

      // Create a link element
      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.setAttribute("download", "contact.vcf"); // Set the filename for the vCard file

      // Programmatically click the link to trigger download
      link.click();
    } catch (error) {
      console.error("Error generating vCard:", error);
      message.error(error);
    }
  };

  const fetchViewCompanyData = useCallback(async () => {
    try {
      const response = await fetchCompanyDetails();
      console.log(response);
      if (response && response.status === 200) {
        // message.success(response.data.message);
        if (!response.data.data[0]) {
          return message.error("Error While Fetching Company Details");
        } else {
          setCompanyDetails(response.data.data[0]);
        }
      } else if (response.status === 401) {
        handleAuthenticationError(response.data.message, navigate);
      } else {
        message.error(response.data.message);
      }
    } catch (error) {
      console.error("API request failed:", error);
      message.error("Failed to Load Details. Please try again later.");
    } finally {
    }
  }, [navigate, companyIdCtx]);

  useEffect(() => {
    if (isVisible) {
      fetchViewCompanyData();
    }
  }, [isVisible, companyIdCtx, fetchViewCompanyData]); // Add dependencies as needed

  return (
    <Modal
      title={
        <>
          <div className="fw-bold fs-5">
            <ExclamationCircleFilled className="mx-2 text-primary text-center" />
            Business Card Preview
          </div>
          <div>
            <Alert
              message="This is Preview of Card to Be Generated. Some Info is Static for View."
              type="warning"
            />
          </div>
        </>
      }
      open={isVisible}
      onCancel={onClose}
      footer={[
        <Button
          danger
          type="primary"
          key="close"
          onClick={onClose}
          size="large"
        >
          Cancel
        </Button>,
        <Button
          type="primary"
          key="close"
          onClick={handleSubmitCreateCard}
          loading={isCreatingCard}
          size="large"
        >
          Create Card
        </Button>,
      ]}
      centered
      destroyOnClose
      closable
      width={650}
    >
      <Container fluid className="previewDigitalBusinessCardContainer">
        <Row>
          <Col lg={12} md={12} sm={12} className="my-5">
            <div className="previewBusinessCardContainer">
              <div className="previewCardContainer">
                <div
                  className="previewCardImagesSection"
                  style={{
                    backgroundImage: `url(${companyDetails?.cover_pic})`,
                  }}
                >
                  <Image
                    className="previewCardImages_profileImage"
                    src={imageUrl || DefaultUserAvatar}
                    roundedCircle
                    alt="Profile"
                    height={150}
                    width={150}
                  />
                </div>
                <div className="previewCardDetails p-4">
                  <div className="previewCardProfileBioDetails">
                    <Row className="align-items-center">
                      <Col lg={8} md={8} sm={8}>
                        <div className="preview_card_content_title">{`${data?.first_name} ${data?.last_name}`}</div>
                        <div className="preview_card_content_sub_title">{`${data?.designation} at ${companyDetails?.company_name}`}</div>
                      </Col>
                      <Col lg={4} md={4} sm={4}>
                        {/* <span className="float-end">
                          <Image
                            src={data.company_logo}
                            roundedCircle
                            height={50}
                            width={50}
                          />
                        </span> */}
                      </Col>
                    </Row>
                  </div>
                  <div className="viewCardCompanyLogo mb-2">
                    <Image
                      src={companyDetails?.company_logo}
                      rounded
                      height={"auto"}
                      width={"auto"}
                      style={{ maxHeight: "50px", maxWidth: "50px" }}
                    />
                  </div>
                  <div className="previewCardCompanyBioDetails">
                    <Row className="align-items-center">
                      <Col lg={8} md={8} sm={8}>
                        <label className="fw-bold text-black">
                          Company Location
                        </label>
                        <div className="preview_card_content_sub_title">
                          {companyDetails?.company_address}
                        </div>
                      </Col>
                      <Col lg={4} md={4} sm={4}>
                        {/* <FaMapLocationDot className="float-end text-black fs-2" /> */}
                        <Image
                          src={AppMapIcon}
                          height={40}
                          width={40}
                          className="float-end"
                        />
                      </Col>
                    </Row>
                  </div>
                  {bioHtml && (
                    <div className="previewCardAboutMe">
                      <Row className="my-3">
                        <label className="fw-bold text-black">About Me</label>
                        <div
                          dangerouslySetInnerHTML={{
                            __html: bioHtml,
                          }}
                        />
                        <p>About Content</p>
                      </Row>
                    </div>
                  )}
                  {companyDetails && companyDetails.product_service && (
                    <div className="previewCardProductAndServices">
                      <Row className="my-3">
                        <label className="fw-bold text-black">
                          Product And Services
                        </label>
                        <div
                          dangerouslySetInnerHTML={{
                            __html: companyDetails?.product_service,
                          }}
                        />
                        {/* <p>Product And Services Content</p> */}
                      </Row>
                    </div>
                  )}
                  <div className="previewCardCompanyInfo">
                    <Row className="mt-1 align-items-center">
                      <Col lg={6} md={6} sm={6} xs={6} className="mb-3">
                        <label className="fw-bold text-black">Email</label>
                        <div>{data.user_email}</div>
                      </Col>
                      <Col lg={6} md={6} sm={6} xs={6} className="mb-3">
                        <label className="fw-bold text-black">
                          Contact No.
                        </label>
                        <div>{data.contact_number}</div>
                      </Col>
                      <Col lg={6} md={6} sm={6} xs={6} className="mb-3">
                        <label className="fw-bold text-black">
                          Company Email
                        </label>
                        <div>{companyDetails?.company_email || "NA"}</div>
                      </Col>
                      <Col lg={6} md={6} sm={6} xs={6} className="mb-3">
                        <label className="fw-bold text-black">
                          Company Website
                        </label>
                        <div>{companyDetails?.company_website_url || "NA"}</div>
                      </Col>
                      <Col lg={6} md={6} sm={6} xs={6} className="mb-3">
                        <label className="fw-bold text-black">
                          Company Phone
                        </label>
                        <div>{companyDetails?.company_email || "NA"}</div>
                      </Col>
                    </Row>
                  </div>

                  <div className="previewCardSocialLinks">
                    <Row className="my-3">
                      <Col lg={6} md={6} sm={6} xs={6}>
                        <Button
                          className="w-100 d-flex align-items-center"
                          size="large"
                        >
                          <img
                            className="social_custom_icon float-start"
                            src={FacebookCustomIcon}
                            alt="Facebook Icon"
                            style={{ maxHeight: "100%", maxWidth: "10%" }}
                          />
                          <span className="button-content float-start mx-2">
                            Facebook
                          </span>
                        </Button>
                      </Col>

                      <Col lg={6} md={6} sm={6} xs={6}>
                        <Button
                          className="w-100 d-flex align-items-center"
                          size="large"
                        >
                          <img
                            className="social_custom_icon float-start"
                            src={InstagramCustomIcon}
                            alt="Instagram Icon"
                            style={{ maxHeight: "100%", maxWidth: "10%" }}
                          />
                          <span className="button-content float-start mx-2">
                            Instagram
                          </span>
                        </Button>
                      </Col>
                    </Row>
                    <Row className="my-3">
                      <Col lg={6} md={6} sm={6} xs={6}>
                        <Button
                          className="w-100 d-flex align-items-center"
                          size="large"
                        >
                          <img
                            className="social_custom_icon float-start"
                            src={LinkedInCustomIcon}
                            alt="LinkedIn Icon"
                            style={{ maxHeight: "100%", maxWidth: "10%" }}
                          />
                          <span className="button-content float-start mx-2">
                            Linkedin
                          </span>
                        </Button>
                      </Col>
                      <Col lg={6} md={6} sm={6} xs={6}>
                        <Button
                          className="w-100 d-flex align-items-center"
                          size="large"
                        >
                          <img
                            className="social_custom_icon float-start"
                            src={WhatsAppCustomIcon}
                            alt="WhatsApp Icon"
                            style={{ maxHeight: "100%", maxWidth: "10%" }}
                          />
                          <span className="button-content float-start mx-2">
                            WhatsApp
                          </span>
                        </Button>
                      </Col>
                    </Row>
                    <Row className="my-3">
                      <Col lg={6} md={6} sm={6} xs={6}>
                        <Button
                          className="w-100 d-flex align-items-center"
                          size="large"
                        >
                          <img
                            className="social_custom_icon float-start"
                            src={YouTubeCustomIcon}
                            alt="YouTube Icon"
                            style={{ maxHeight: "100%", maxWidth: "10%" }}
                          />
                          <span className="button-content float-start mx-2">
                            YouTube
                          </span>
                        </Button>
                      </Col>
                      <Col lg={6} md={6} sm={6} xs={6}>
                        <Button
                          className="w-100 d-flex align-items-center"
                          size="large"
                        >
                          <img
                            className="social_custom_icon float-start"
                            src={TikTokCustomIcon}
                            alt="TikTok Icon"
                            style={{ maxHeight: "100%", maxWidth: "10%" }}
                          />
                          <span className="button-content float-start mx-2">
                            TikTok
                          </span>
                        </Button>
                      </Col>
                    </Row>
                    <Row className="my-3">
                      <Col lg={6} md={6} sm={6} xs={6}>
                        <Button
                          className="w-100 d-flex align-items-center"
                          size="large"
                        >
                          <img
                            className="social_custom_icon float-start"
                            src={WeChatCustomIcon}
                            alt="WeChat Icon"
                            style={{ maxHeight: "100%", maxWidth: "10%" }}
                          />
                          <span className="button-content float-start mx-2">
                            WeChat
                          </span>
                        </Button>
                      </Col>
                      <Col lg={6} md={6} sm={6} xs={6}>
                        <Button
                          className="w-100 d-flex align-items-center"
                          size="large"
                        >
                          <img
                            className="social_custom_icon float-start"
                            src={LineCustomIcon}
                            alt="Line Icon"
                            style={{ maxHeight: "100%", maxWidth: "10%" }}
                          />
                          <span className="button-content float-start mx-2">
                            Line
                          </span>
                        </Button>
                      </Col>
                    </Row>
                    <Row className="my-3">
                      <Col lg={6} md={6} sm={6} xs={6}>
                        <Button
                          className="w-100 d-flex align-items-center"
                          size="large"
                        >
                          <img
                            className="social_custom_icon float-start"
                            src={TelegramCustomIcon}
                            alt="Telegram Icon"
                            style={{ maxHeight: "100%", maxWidth: "10%" }}
                          />
                          <span className="button-content float-start mx-2">
                            Telegram
                          </span>
                        </Button>
                      </Col>
                      <Col lg={6} md={6} sm={6} xs={6}>
                        <Button
                          className="w-100 d-flex align-items-center"
                          size="large"
                        >
                          <img
                            className="social_custom_icon float-start"
                            src={WhatsAppCustomIcon}
                            alt="WhatsApp Icon"
                            style={{ maxHeight: "100%", maxWidth: "10%" }}
                          />
                          <span className="button-content float-start mx-2">
                            WhatsApp
                          </span>
                        </Button>
                      </Col>
                    </Row>
                  </div>

                  <div className="previewCardShareLinks">
                    <Row className="my-3">
                      <Col lg={4} md={4} sm={4} xs={3}>
                        <Button
                          className="w-100"
                          size="large"
                          icon={<FaShareAlt />}
                        ></Button>
                      </Col>
                      <Col lg={8} md={8} sm={8} xs={9} className="ps-0">
                        <Button
                          className="w-100 bg-black text-white"
                          size="large"
                          onClick={handleAddToContacts} // Call the function on button click
                        >
                          <FaUserPlus className="fs-3 me-3" /> Save To Phonebook
                        </Button>
                      </Col>
                    </Row>
                  </div>

                  <div className="previewCardQRCode">
                    <center>
                      <Image
                        src={StaticQR}
                        alt="QR Code"
                        style={{
                          width: "250px",
                          height: "250px",
                          maxWidth: "250px",
                          maxHeight: "250px",
                        }}
                      />
                    </center>
                  </div>
                </div>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </Modal>
  );
};

export default ViewBusinessCardPreviewModal;
