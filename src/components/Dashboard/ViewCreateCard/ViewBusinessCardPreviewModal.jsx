import React, { useState } from "react";
import "./ViewBusinessCardPreviewModal.css";

import { Container, Col, Image, Row } from "react-bootstrap";
import { Button, Modal, Space, message } from "antd";
import { FaMapLocationDot, FaUserPlus } from "react-icons/fa6";
import { FaShareAlt } from "react-icons/fa";

import {
  fetchViewDigitalCardAll,
  getVCFCardforDigitalCard,
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

const ViewBusinessCardPreviewModal = ({
  isVisible,
  onClose,
  data,
  imageUrl,
  fileList,
  onSuccess,
}) => {
  const [isCreatingCard, setIsCreatingCard] = useState(false);

  const handleSubmitCreateCard = async () => {
    setIsCreatingCard(true);
    try {
      const uploadedPhotoPath = await uploadCardProfilePhoto(
        fileList[0]?.originFileObj
      );

      const cardDetails = {
        ...data,
        profile_picture: uploadedPhotoPath || "",
      };

      const response = await createBusinessCard(cardDetails);
      if (response.status === 201) {
        message.success(response.data.message);
        onSuccess(cardDetails);
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
      title="Business Card Preview"
      open={isVisible}
      onCancel={onClose}
      footer={[
        <Button
          danger
          type="primary"
          key="close"
          shape="round"
          onClick={onClose}
        >
          Cancel
        </Button>,
        <Button
          type="primary"
          key="close"
          shape="round"
          onClick={handleSubmitCreateCard}
          loading={isCreatingCard}
        >
          Create Card
        </Button>,
      ]}
      centered
      destroyOnClose
      closable
    >
      <Container fluid className="viewDigitalBusinessCardContainer">
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
                  <span className="viewCardProfileBioDetails">
                    <Row>
                      <Col lg={8} md={8} sm={8}>
                        <div className="view_card_content_title">{`${data?.first_name} ${data?.last_name}`}</div>
                        <div>{`${data?.designation} at ${data?.company_name}`}</div>
                      </Col>
                      <Col lg={4} md={4} sm={4}>
                        <span className="float-end mt-4 mx-4">
                          <Image
                            src={data.company_logo}
                            roundedCircle
                            height={50}
                            width={50}
                          />
                        </span>
                      </Col>
                    </Row>
                  </span>
                  <span className="viewCardCompanyBioDetails">
                    <Row>
                      <Col lg={8} md={8} sm={8}>
                        <label className="fw-bold text-black">
                          Company Location
                        </label>
                        <div className="mx-2">{data.company_address}</div>
                      </Col>
                      <Col lg={4} md={4} sm={4}>
                        <FaMapLocationDot className="float-end text-black fs-2 mt-3 mx-4" />
                      </Col>
                    </Row>
                  </span>
                  <span className="viewCardAboutMe">
                    <Row className="my-3">
                      <label className="fw-bold text-black">About Me</label>
                      {/* <div
                        dangerouslySetInnerHTML={{
                          __html: extractMainContent(bioHTML),
                        }}
                      /> */}
                    </Row>
                  </span>
                  <span className="viewCardProductAndServices">
                    <Row className="my-3">
                      <label className="fw-bold text-black">
                        Product And Services
                      </label>
                      {/* <div
                        dangerouslySetInnerHTML={{
                          __html: productServiceHTML,
                        }}
                      /> */}
                      <div>Hello</div>
                    </Row>
                  </span>
                  <span className="viewCardCompanyInfo">
                    <Row className="mt-5">
                      <Col lg={6} md={6} sm={6} className="mb-3">
                        <label className="fw-bold text-black">Email</label>
                        <div>{data.user_email}</div>
                      </Col>
                      <Col lg={6} md={6} sm={6} className="mb-3">
                        <label className="fw-bold text-black">
                          Contact No.
                        </label>
                        <div>{data.contact_number}</div>
                      </Col>
                      <Col lg={6} md={6} sm={6} className="mb-3">
                        <label className="fw-bold text-black">
                          Company Email
                        </label>
                        <div>{"company@gmail.com"}</div>
                      </Col>
                      <Col lg={6} md={6} sm={6} className="mb-3">
                        <label className="fw-bold text-black">
                          Company Website
                        </label>
                        <div>{"www.company.com"}</div>
                      </Col>
                      <Col lg={6} md={6} sm={6} className="mb-3">
                        <label className="fw-bold text-black">
                          Company Phone
                        </label>
                        <div>{"1234567890"}</div>
                      </Col>
                    </Row>
                  </span>
                  <span className="viewCardSocialLinks">
                    <Row className="my-3">
                      <Col lg={6} md={6} sm={6}>
                        <Button className="w-100" size="large">
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
                      <Col lg={6} md={6} sm={6}>
                        <Button className="w-100" size="large">
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
                      <Col lg={6} md={6} sm={6}>
                        <Button className="w-100" size="large">
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
                      <Col lg={6} md={6} sm={6}>
                        <Button className="w-100" size="large">
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
                      <Col lg={6} md={6} sm={6}>
                        <Button className="w-100" size="large">
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
                      <Col lg={6} md={6} sm={6}>
                        <Button className="w-100" size="large">
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
                      <Col lg={6} md={6} sm={6}>
                        <Button className="w-100" size="large">
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
                      <Col lg={6} md={6} sm={6}>
                        <Button className="w-100" size="large">
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
                      <Col lg={6} md={6} sm={6}>
                        <Button className="w-100" size="large">
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
                      <Col lg={6} md={6} sm={6}>
                        <Button className="w-100" size="large">
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
                  </span>
                  <span className="viewCardShareLinks">
                    <Row className="my-3">
                      <Col lg={4} md={4} sm={4}>
                        <Button
                          className="w-100"
                          size="large"
                          icon={<FaShareAlt />}
                        ></Button>
                      </Col>
                      <Col lg={8} md={8} sm={8}>
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
                  </span>

                  <span className="viewCardQRCode">
                    <center>
                      {/* <img src={cardDetails.qr_url} alt="QR Code" /> */}
                    </center>
                  </span>
                </div>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
      {/* <div className="businessCardContainer">
        {" "}
        <div className="cardContainer">
          <div className="cardProfileSection my-2 mx-1 p-2 ">
            <Image
              className="profile_image"
              src={
                imageUrl ||
                "https://cf.shopee.ph/file/13ac71187230bae1b72226fa0cd962b1"
              }
              roundedCircle
              alt="Profile"
            />
            <div className="profile_name fs-3 fw-bold">{`${data?.first_name} ${data?.last_name}`}</div>
            <div className="profile_designation fs-5 fw-bold">{`${data?.designation}`}</div>
          </div>
          <div className="cardBioSection my-3 mx-1 p-4">
            <div className="cardBioTitle fs-5 fw-bold mx-2 my-2">About Me</div>
            <p className="cardBioParagraph mx-2">
              Lorem Ipsum is simply dummy text of the printing and typesetting
              industry. Lorem Ipsum has been the industry's standard dummy text
              ever since the 1500s, when an unknown printer took a galley of
              type and scrambled it to make a type specimen book. It has
              survived not only five centuries, but also the leap into
              electronic typesetting, remaining essentially unchanged. It was
              popularised in the 1960s with the release of Letraset sheets
              containing Lorem Ipsum passages, and more recently with desktop
              publishing software like Aldus PageMaker including versions of
              Lorem Ipsum.
            </p>
          </div>
          <div className="cardCompanySection my-3 mx-1 p-4">
            <div className="cardCompanyTitle fs-5 fw-bold mx-2 my-2">
              Company Details
            </div>

            <Row className=" d-flex flex-col m-1">
              <Col>
                <label className="fw-bold">Name : </label>
                <span> Walking Dreamz</span>
              </Col>
              <Col>
                <label className="fw-bold">Email : </label>
                <span> yashtiwariwd@gmail.com</span>
              </Col>
              <Col>
                <label className="fw-bold">Phone : </label>
                <span> 7778889990</span>
              </Col>
              <Col>
                <label className="fw-bold">Website : </label>
                <span> www.walkingdreamz.com</span>
              </Col>
            </Row>
          </div>
          <div className="cardSocialSection my-3 mx-1 p-4">
            <Row>
              <Col lg={12} md={12} sm={12} className="cardSocialItem mb-1">
                <FacebookOutlined className="fs-4" />
                <FaInstagram className="fs-4" />
                <FaWhatsapp className="fs-4" />
                <FaLinkedin className="fs-4" />
                <YoutubeOutlined className="fs-4" />
                <MdOutlineMail className="fs-4" />
              </Col>
              <Col lg={12} md={12} sm={12} className="cardSocialItem mt-2">
                <WechatOutlined className="fs-4" />
                <TwitterOutlined className="fs-4" />
                <TikTokOutlined className="fs-4" />
                <FaTelegram className="fs-4" />
                <WeiboOutlined className="fs-4" />
                <FaLine className="fs-4" />
              </Col>
            </Row>
          </div>
          <div className="cardQrSection my-3 mx-1 p-4"></div>
        </div>{" "}
      </div> */}
    </Modal>
  );
};

export default ViewBusinessCardPreviewModal;
