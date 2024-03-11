import React, { useState } from "react";
import "./ViewBusinessCardPreviewModal.css";

import { Container, Col, Image, Row } from "react-bootstrap";
import { Button, Modal, Space, message } from "antd";
import { FaMapLocationDot, FaUserPlus } from "react-icons/fa6";
import { FaShareAlt } from "react-icons/fa";

import {
  fetchViewDigitalCardAll,
  getVCFCardforDigitalCard,
  uploadCardCoverPic,
} from "../../../services/apiServices";

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

const ViewBusinessCardPreviewModal = ({
  isVisible,
  onClose,
  data,
  imageUrl,
  fileList,
  coverPicFileList,
  onSuccess,
  bioHtml,
}) => {
  console.log(data);
  console.log(bioHtml);
  const navigate = useNavigate();
  const [isCreatingCard, setIsCreatingCard] = useState(false);

  const handleSubmitCreateCard = async () => {
    setIsCreatingCard(true);
    try {
      const uploadedPhotoPath = await uploadCardProfilePhoto(
        fileList[0]?.originFileObj
      );

      const uploadedCoverPath = await uploadCardCoverPhoto(
        coverPicFileList[0]?.originFileObj
      );

      let bio_content = bioHtml;

      const cardDetails = {
        ...data,
        profile_picture: uploadedPhotoPath || "",
        cover_pic: uploadedCoverPath || "",
        bio: bioHtml || null,
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

  // const createBusinessCard = async (cardData) => {
  //   console.log("Card data:", cardData);
  // };

  return (
    <Modal
      title={
        <span className="fw-bold fs-5">
          <ExclamationCircleFilled className="mx-2 text-primary text-center" />
          Business Card Preview
        </span>
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
      <Container fluid className="viewPreviewDigitalBusinessCardContainer">
        <Row>
          <Col lg={12} md={12} sm={12} className="my-5">
            <div className="viewBusinessCardContainer">
              <div className="viewCardContainer">
                <div className="viewCardImagesSection">
                  <Image
                    className="viewCardImages_profileImage"
                    src={
                      imageUrl ||
                      "https://cf.shopee.ph/file/13ac71187230bae1b72226fa0cd962b1"
                    }
                    roundedCircle
                    alt="Profile"
                    height={150}
                    width={150}
                  />
                </div>
                <div className="viewCardDetails p-4">
                  <div className="viewCardProfileBioDetails">
                    <Row className="align-items-center">
                      <Col lg={8} md={8} sm={8}>
                        <div className="view_card_content_title">{`${data?.first_name} ${data?.last_name}`}</div>
                        <div className="view_card_content_sub_title">{`${data?.designation} at ${data?.company_name}`}</div>
                      </Col>
                      <Col lg={4} md={4} sm={4}>
                        <span className="float-end">
                          <Image
                            src={data.company_logo}
                            roundedCircle
                            height={50}
                            width={50}
                          />
                        </span>
                      </Col>
                    </Row>
                  </div>
                  <div className="viewCardCompanyBioDetails">
                    <Row className="align-items-center">
                      <Col lg={8} md={8} sm={8}>
                        <label className="fw-bold text-black">
                          Company Location
                        </label>
                        <div className="view_card_content_sub_title">
                          {data.company_address}
                        </div>
                      </Col>
                      <Col lg={4} md={4} sm={4}>
                        <FaMapLocationDot className="float-end text-black fs-2" />
                        {/* <Image src="../../assets/images/icons/destination.png" /> */}
                      </Col>
                    </Row>
                  </div>
                  <div className="viewCardAboutMe">
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
                  <div className="viewCardProductAndServices">
                    <Row className="my-3">
                      <label className="fw-bold text-black">
                        Product And Services
                      </label>
                      {/* <div
                        dangerouslySetInnerHTML={{
                          __html: productServiceHTML,
                        }}
                      /> */}
                      <p>Product And Services Content</p>
                    </Row>
                  </div>
                  <div className="viewCardCompanyInfo">
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
                        <div>{data.company_email}</div>
                      </Col>
                      <Col lg={6} md={6} sm={6} xs={6} className="mb-3">
                        <label className="fw-bold text-black">
                          Company Website
                        </label>
                        <div>{data.company_website_url}</div>
                      </Col>
                      <Col lg={6} md={6} sm={6} xs={6} className="mb-3">
                        <label className="fw-bold text-black">
                          Company Phone
                        </label>
                        <div>{data.company_email}</div>
                      </Col>
                    </Row>
                  </div>
                  <div className="viewCardSocialLinks">
                    <Row className="my-3">
                      <Col lg={6} md={6} sm={6} xs={6}>
                        <Button
                          className="w-100 d-flex align-items-center"
                          size="large"
                        >
                          <img
                            className="social_custom_icon float-start"
                            src={FacebookCustomIcon}
                            alt="WhatsApp Icon"
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
                            alt="WhatsApp Icon"
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
                            alt="WhatsApp Icon"
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
                            alt="WhatsApp Icon"
                            style={{ maxHeight: "100%", maxWidth: "10%" }}
                          />
                          <span className="button-content float-start mx-2">
                            Youtube
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
                            alt="WhatsApp Icon"
                            style={{ maxHeight: "100%", maxWidth: "10%" }}
                          />
                          <span className="button-content float-start mx-2">
                            Tiktok
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
                            alt="WhatsApp Icon"
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
                            src={WeChatCustomIcon}
                            alt="WhatsApp Icon"
                            style={{ maxHeight: "100%", maxWidth: "10%" }}
                          />
                          <span className="button-content float-start mx-2">
                            Wechat
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
                            src={LineCustomIcon}
                            alt="WhatsApp Icon"
                            style={{ maxHeight: "100%", maxWidth: "10%" }}
                          />
                          <span className="button-content float-start mx-2">
                            Line
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
                            src={TelegramCustomIcon}
                            alt="WhatsApp Icon"
                            style={{ maxHeight: "100%", maxWidth: "10%" }}
                          />
                          <span className="button-content float-start mx-2">
                            Telegram
                          </span>
                        </Button>
                      </Col>
                    </Row>
                  </div>
                  <div className="viewCardShareLinks">
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
                          <FaUserPlus className="fs-3 me-3" /> Add Me To Your
                          Contact
                        </Button>
                      </Col>
                    </Row>
                  </div>

                  <div className="viewCardQRCode">
                    <center>
                      <Image
                        src={"../../../assets/images/static/qr_img.png"}
                        alt="QR Code"
                        height={150}
                        width={150}
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
