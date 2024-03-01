import React, { useEffect, useState } from "react";
import { Col, Container, Image, Row } from "react-bootstrap";
import {
  FaInstagram,
  FaLine,
  FaLinkedin,
  FaShareAlt,
  FaTelegram,
  FaWhatsapp,
} from "react-icons/fa";
import { MdOutlineMail } from "react-icons/md";
import "./ViewDigitalCard.css";
import { fetchViewDigitalCardAll } from "../../services/apiServices";
import { useParams } from "react-router-dom";
import { Button } from "antd";
import { FaMapLocationDot, FaUserPlus } from "react-icons/fa6";
import { WhatsAppOutlined } from "@ant-design/icons";
import WhatsAppCustomIcon from "../../assets/images/social/whatsapp.png";
import InstagramCustomIcon from "../../assets/images/social/instagram.png";
import TelegramCustomIcon from "../../assets/images/social/telegram.png";
import LinkedInCustomIcon from "../../assets/images/social/linkedin.png";
import WeChatCustomIcon from "../../assets/images/social/wechat.png";
import LineCustomIcon from "../../assets/images/social/line.png";
import YouTubeCustomIcon from "../../assets/images/social/youtube.png";
import TwitterCustomIcon from "../../assets/images/social/twitter.png";
import TikTokCustomIcon from "../../assets/images/social/tiktok.png";
import FacebookCustomIcon from "../../assets/images/social/facebook.png";

function ViewDigitalCard() {
  const { companyName, cardReference } = useParams();

  const [cardDetails, setCardDetails] = useState({});
  const [imageUrl, setImageUrl] = useState("");
  const [bioHTML, setBioHTML] = useState(null);
  const [productServiceHTML, setProductServiceHTML] = useState(null);

  function extractMainContent(htmlString) {
    // Check if the HTML string is null or empty
    if (!htmlString) {
      return "";
    }

    // Remove single quotes from the HTML string
    const cleanHtmlString = htmlString.replace(/'/g, "");

    // Create a temporary div element to parse the HTML string
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = cleanHtmlString;

    // Find and extract the main content from the parsed HTML
    const mainContentElement = tempDiv.querySelector(".markdown.prose");
    const mainContent = mainContentElement ? mainContentElement.innerHTML : "";

    return mainContent;
  }

  useEffect(() => {
    async function fetchCard() {
      try {
        let queries = { companyName, cardReference };
        const response = await fetchViewDigitalCardAll(queries);
        console.log(response);
        setCardDetails(response.data.data);
        setImageUrl(response.data.data.profile_picture);
        setBioHTML(JSON.parse(response.data.data.bio));
        setProductServiceHTML(JSON.parse(response.data.data.product_service));
        console.log(response.data.data.bio, "bio");
        console.log(response.data.data.product_service, "pro");
      } catch (error) {
        console.error("Error fetching card details:", error);
      }
    }

    fetchCard();
  }, [companyName, cardReference]);

  const openLocationUrl = () => {
    // Open the location URL
    window.open(cardDetails.location, "_blank");
  };
  return (
    <>
      <Container fluid className="viewDigitalBusinessCardContainer">
        <Row>
          <Col lg={6} md={0} sm={0}>
            <h1 className="my-5 mx-5 text-center">
              Digital Business Card Details
            </h1>
          </Col>
          <Col lg={6} md={12} sm={12} className="my-5">
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
                        <div className="view_card_content_title">{`${cardDetails?.first_name} ${cardDetails?.last_name}`}</div>
                        <div>{`${cardDetails?.designation} at ${cardDetails?.company_name}`}</div>
                      </Col>
                      <Col lg={4} md={4} sm={4}>
                        <span className="float-end mt-4 mx-4">
                          <Image
                            src={cardDetails.company_logo}
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
                        <div className="mx-2">
                          {cardDetails.company_address}
                        </div>
                      </Col>
                      <Col lg={4} md={4} sm={4}>
                        <FaMapLocationDot className="float-end text-black fs-2 mt-3 mx-4" />
                      </Col>
                    </Row>
                  </span>
                  <span className="viewCardAboutMe">
                    <Row className="my-3">
                      <label className="fw-bold text-black">About Me</label>
                      <div
                        dangerouslySetInnerHTML={{
                          __html: extractMainContent(bioHTML),
                        }}
                      />
                    </Row>
                  </span>
                  <span className="viewCardProductAndServices">
                    <Row className="my-3">
                      <label className="fw-bold text-black">
                        Product And Services
                      </label>
                      <div
                        dangerouslySetInnerHTML={{
                          __html: extractMainContent(productServiceHTML),
                        }}
                      />
                      <div>Hello</div>
                    </Row>
                  </span>
                  <span className="viewCardCompanyInfo">
                    <Row className="mt-5">
                      <Col lg={6} md={6} sm={6} className="mb-3">
                        <label className="fw-bold text-black">Email</label>
                        <div>{cardDetails.user_email}</div>
                      </Col>
                      <Col lg={6} md={6} sm={6} className="mb-3">
                        <label className="fw-bold text-black">
                          Contact No.
                        </label>
                        <div>{cardDetails.contact_number}</div>
                      </Col>
                      <Col lg={6} md={6} sm={6} className="mb-3">
                        <label className="fw-bold text-black">
                          Company Email
                        </label>
                        <div>{cardDetails.company_email}</div>
                      </Col>
                      <Col lg={6} md={6} sm={6} className="mb-3">
                        <label className="fw-bold text-black">
                          Company Website
                        </label>
                        <div>{cardDetails.company_website_url}</div>
                      </Col>
                      <Col lg={6} md={6} sm={6} className="mb-3">
                        <label className="fw-bold text-black">
                          Company Phone
                        </label>
                        <div>{cardDetails.company_email}</div>
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
                        >
                          <FaUserPlus className="fs-3 me-3" /> Add Me To Your
                          Contact
                        </Button>
                      </Col>
                    </Row>
                  </span>

                  <span className="viewCardQRCode">
                    <center>
                      <img
                        src="https://api.byebug.io/rails/active_storage/blobs/redirect/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaHBBc0R0IiwiZXhwIjpudWxsLCJwdXIiOiJibG9iX2lkIn19--90ce01c4066d912c4524be593ebf7faed1262824/92d7671f-000e-4005-94ce-095c1ae1e34f.png"
                        alt="QR Code"
                      />
                    </center>
                  </span>
                </div>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default ViewDigitalCard;
