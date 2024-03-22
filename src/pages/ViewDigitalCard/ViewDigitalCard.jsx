import React, { useEffect, useState } from "react";
import { Col, Container, Image, Row } from "react-bootstrap";
import { FaShareAlt } from "react-icons/fa";
import "./ViewDigitalCard.css";
import {
  fetchViewDigitalCardAll,
  getVCFCardforDigitalCard,
} from "../../services/apiServices";
import { useParams } from "react-router-dom";
import { Button, Spin, message } from "antd";
import { FaUserPlus } from "react-icons/fa6";

import AppMapIcon from "../../assets/images/static/map_icon.png";
import DefaultUserAvatar from "../../assets/images/static/default_user.png";

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
import XHSCustomIcon from "../../assets/images/social/xhs.png";
import WeiboCustomIcon from "../../assets/images/social/weibo.png";

function ViewDigitalCard() {
  const { companyName, cardReference } = useParams();

  const [isFetchingCard, setIsFetchingCard] = useState(true);
  const [cardDetails, setCardDetails] = useState({});
  const [imageUrl, setImageUrl] = useState("");

  useEffect(() => {
    async function fetchCard() {
      try {
        setIsFetchingCard(true);
        let queries = { companyName, cardReference };
        const response = await fetchViewDigitalCardAll(queries);
        setCardDetails(response.data.data);
        setImageUrl(response.data.data.profile_picture);
      } catch (error) {
        console.error("Error fetching card details:", error);
        // message.error("Something Went Wrong. Please try again");
      } finally {
        setIsFetchingCard(false);
      }
    }

    fetchCard();
  }, [companyName, cardReference]);

  const handleAddToContacts = async () => {
    try {
      // Run your API to fetch vCard data
      const response = await getVCFCardforDigitalCard(cardDetails.id);

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

  const handleShareButtonClick = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          url: window.location.href,
        });
      } else {
        throw new Error("Web Share API not supported.");
      }
    } catch (error) {
      console.error("Error sharing:", error.message);
    }
  };

  const openSocialLink = (link) => {
    console.log(link);
    const platformName = link.substring(link.lastIndexOf("/") + 1);
    console.log(platformName);
    window.open(link, "_blank");
  };

  return (
    <>
      <Container fluid className="viewDigitalBusinessCardContainer">
        <Spin
          spinning={isFetchingCard}
          size="large"
          style={{ background: "rgba(0, 0, 0, 0.5)" }}
        >
          <Row>
            <Col
              lg={6}
              md={6}
              sm={0}
              xs={0}
              className="viewDigitalCard_CompanyDetails d-none d-md-block"
            >
              <div className="viewDigitalCard_CompanyBrief">
                <Image
                  className="viewDigitalCard_CompanyLogo"
                  src={cardDetails?.company_logo}
                  height={150}
                  width={150}
                  rounded
                />

                <div className="viewDigitalCard_Vision">
                  <div className="viewDigitalCard_CompanyVision-1">
                    Tap, Connect, Cultivate
                  </div>
                  <div className="viewDigitalCard_CompanyVision-1">
                    Where Business Networking Blossoms{" "}
                  </div>
                </div>
              </div>
            </Col>
            <Col lg={4} md={4} sm={12} xs={12} className="">
              <div className="viewBusinessCardContainer">
                <div className="viewCardContainer">
                  <div
                    className="viewCardImagesSection"
                    style={{
                      backgroundImage: `url(${cardDetails?.cover_pic})`,
                    }}
                  >
                    <Image
                      className="viewCardImages_profileImage"
                      src={imageUrl || DefaultUserAvatar}
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
                          <div className="view_card_content_title">{`${cardDetails?.first_name} ${cardDetails?.last_name}`}</div>
                          <div className="view_card_content_sub_title">{`${cardDetails?.designation} at ${cardDetails?.company_name}`}</div>
                        </Col>
                        <Col lg={4} md={4} sm={4}>
                          {/* <span className="float-end">
                          <Image
                            src={cardDetails?.company_logo}
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
                        src={cardDetails?.company_logo}
                        rounded
                        height={"auto"}
                        width={"auto"}
                        style={{ maxHeight: "50px", maxWidth: "50px" }}
                      />
                    </div>
                    <div className="viewCardCompanyBioDetails">
                      <Row className="align-items-center">
                        <Col lg={8} md={8} sm={8} xs={8}>
                          <label className="fw-bold text-black">
                            Company Location
                          </label>
                          <div className="view_card_content_sub_title">
                            {cardDetails?.company_address}
                          </div>
                        </Col>
                        <Col lg={4} md={4} sm={4} xs={4}>
                          <a
                            href={cardDetails?.location}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <Image
                              src={AppMapIcon}
                              height={40}
                              width={40}
                              className="float-end"
                            />
                          </a>{" "}
                        </Col>
                      </Row>
                    </div>
                    {cardDetails && cardDetails.bio && (
                      <div className="viewCardAboutMe">
                        <Row className="my-3">
                          <label className="fw-bold text-black">About Me</label>
                          <div
                            className="html_text_render"
                            dangerouslySetInnerHTML={{
                              __html: cardDetails?.bio,
                            }}
                          />
                        </Row>
                      </div>
                    )}
                    {cardDetails && cardDetails.product_service && (
                      <div className="viewCardProductAndServices">
                        <Row className="my-3">
                          <label className="fw-bold text-black">
                            Product And Services
                          </label>
                          <div
                            className="html_text_render"
                            dangerouslySetInnerHTML={{
                              __html: cardDetails?.product_service,
                            }}
                          />
                        </Row>
                      </div>
                    )}
                    <div className="viewCardCompanyInfo">
                      <Row className="mt-1 align-items-center">
                        <Col lg={6} md={6} sm={6} xs={6} className="mb-3">
                          <label className="fw-bold">Email</label>
                          <div className="text-muted">
                            <a
                              href={`mailto:${cardDetails?.user_email}`}
                              className="html_link company-info-wrap"
                            >
                              {cardDetails?.user_email || "NA"}
                            </a>
                          </div>
                        </Col>
                        <Col lg={6} md={6} sm={6} xs={6} className="mb-3">
                          <label className="fw-bold">Contact No.</label>
                          <div className="text-muted">
                            <a
                              href={`tel:${cardDetails?.contact_number}`}
                              className="html_link company-info-wrap"
                            >
                              {cardDetails?.contact_number || "NA"}
                            </a>
                          </div>
                        </Col>
                        <Col lg={6} md={6} sm={6} xs={6} className="mb-3">
                          <label className="fw-bold">Company Email</label>
                          <div className="text-muted">
                            <a
                              href={`mailto:${cardDetails?.company_email}`}
                              className="html_link company-info-wrap"
                            >
                              {cardDetails?.company_email || "NA"}
                            </a>
                          </div>
                        </Col>
                        <Col lg={6} md={6} sm={6} xs={6} className="mb-3">
                          <label className="fw-bold">Company Website</label>
                          <div className="text-muted">
                            <a
                              href={cardDetails?.company_website}
                              target="_blank"
                              rel="noreferrer"
                              className="html_link company-info-wrap"
                            >
                              {cardDetails?.company_website || "NA"}
                            </a>
                          </div>
                        </Col>
                        <Col lg={6} md={6} sm={6} xs={6} className="mb-3">
                          <label className="fw-bold">Company Phone</label>
                          <div className="text-muted">
                            <a
                              href={`tel:${cardDetails?.company_phone}`}
                              className="html_link company-info-wrap"
                            >
                              {cardDetails?.company_phone || "NA"}
                            </a>
                          </div>
                        </Col>
                      </Row>
                    </div>
                    {cardDetails && (
                      <div className="viewCardSocialLinks">
                        <Row>
                          {cardDetails.facebook && (
                            <Col lg={6} md={6} sm={6} xs={6} className="my-2">
                              <Button
                                className="w-100 d-flex align-items-center"
                                size="large"
                                onClick={() =>
                                  openSocialLink(cardDetails.facebook)
                                }
                              >
                                <img
                                  className="social_custom_icon float-start"
                                  src={FacebookCustomIcon}
                                  alt="Facebook Icon"
                                  style={{
                                    maxHeight: "100%",
                                    maxWidth: "10%",
                                  }}
                                />
                                <span className="button-content float-start mx-2">
                                  Facebook
                                </span>
                              </Button>
                            </Col>
                          )}
                          {cardDetails.instagram && (
                            <Col lg={6} md={6} sm={6} xs={6} className="my-2">
                              <Button
                                className="w-100 d-flex align-items-center"
                                size="large"
                                onClick={() =>
                                  openSocialLink(cardDetails.instagram)
                                }
                              >
                                <img
                                  className="social_custom_icon float-start"
                                  src={InstagramCustomIcon}
                                  alt="Instagram Icon"
                                  style={{
                                    maxHeight: "100%",
                                    maxWidth: "10%",
                                  }}
                                />
                                <span className="button-content float-start mx-2">
                                  Instagram
                                </span>
                              </Button>
                            </Col>
                          )}
                          {cardDetails.linkedin && (
                            <Col lg={6} md={6} sm={6} xs={6} className="my-2">
                              <Button
                                className="w-100 d-flex align-items-center"
                                size="large"
                                onClick={() =>
                                  openSocialLink(cardDetails.linkedin)
                                }
                              >
                                <img
                                  className="social_custom_icon float-start"
                                  src={LinkedInCustomIcon}
                                  alt="LinkedIn Icon"
                                  style={{
                                    maxHeight: "100%",
                                    maxWidth: "10%",
                                  }}
                                />
                                <span className="button-content float-start mx-2">
                                  Linkedin
                                </span>
                              </Button>
                            </Col>
                          )}
                          {cardDetails.whatsapp && (
                            <Col lg={6} md={6} sm={6} xs={6} className="my-2">
                              <Button
                                className="w-100 d-flex align-items-center"
                                size="large"
                                onClick={() =>
                                  openSocialLink(cardDetails.whatsapp)
                                }
                              >
                                <img
                                  className="social_custom_icon float-start"
                                  src={WhatsAppCustomIcon}
                                  alt="WhatsApp Icon"
                                  style={{
                                    maxHeight: "100%",
                                    maxWidth: "10%",
                                  }}
                                />
                                <span className="button-content float-start mx-2">
                                  WhatsApp
                                </span>
                              </Button>
                            </Col>
                          )}
                          {cardDetails.youtube && (
                            <Col lg={6} md={6} sm={6} xs={6} className="my-2">
                              <Button
                                className="w-100 d-flex align-items-center"
                                size="large"
                                onClick={() =>
                                  openSocialLink(cardDetails.youtube)
                                }
                              >
                                <img
                                  className="social_custom_icon float-start"
                                  src={YouTubeCustomIcon}
                                  alt="YouTube Icon"
                                  style={{
                                    maxHeight: "100%",
                                    maxWidth: "10%",
                                  }}
                                />
                                <span className="button-content float-start mx-2">
                                  YouTube
                                </span>
                              </Button>
                            </Col>
                          )}
                          {cardDetails.tiktok && (
                            <Col lg={6} md={6} sm={6} xs={6} className="my-2">
                              <Button
                                className="w-100 d-flex align-items-center"
                                size="large"
                                onClick={() =>
                                  openSocialLink(cardDetails.tiktok)
                                }
                              >
                                <img
                                  className="social_custom_icon float-start"
                                  src={TikTokCustomIcon}
                                  alt="TikTok Icon"
                                  style={{
                                    maxHeight: "100%",
                                    maxWidth: "10%",
                                  }}
                                />
                                <span className="button-content float-start mx-2">
                                  TikTok
                                </span>
                              </Button>
                            </Col>
                          )}
                          {cardDetails.we_chat && (
                            <Col lg={6} md={6} sm={6} xs={6} className="my-2">
                              <Button
                                className="w-100 d-flex align-items-center"
                                size="large"
                                onClick={() =>
                                  openSocialLink(cardDetails.we_chat)
                                }
                              >
                                <img
                                  className="social_custom_icon float-start"
                                  src={WeChatCustomIcon}
                                  alt="WeChat Icon"
                                  style={{
                                    maxHeight: "100%",
                                    maxWidth: "10%",
                                  }}
                                />
                                <span className="button-content float-start mx-2">
                                  WeChat
                                </span>
                              </Button>
                            </Col>
                          )}
                          {cardDetails.line && (
                            <Col lg={6} md={6} sm={6} xs={6} className="my-2">
                              <Button
                                className="w-100 d-flex align-items-center"
                                size="large"
                                onClick={() => openSocialLink(cardDetails.line)}
                              >
                                <img
                                  className="social_custom_icon float-start"
                                  src={LineCustomIcon}
                                  alt="Line Icon"
                                  style={{
                                    maxHeight: "100%",
                                    maxWidth: "10%",
                                  }}
                                />
                                <span className="button-content float-start mx-2">
                                  Line
                                </span>
                              </Button>
                            </Col>
                          )}
                          {cardDetails.telegram && (
                            <Col lg={6} md={6} sm={6} xs={6} className="my-2">
                              <Button
                                className="w-100 d-flex align-items-center"
                                size="large"
                                onClick={() =>
                                  openSocialLink(cardDetails.telegram)
                                }
                              >
                                <img
                                  className="social_custom_icon float-start"
                                  src={TelegramCustomIcon}
                                  alt="Telegram Icon"
                                  style={{
                                    maxHeight: "100%",
                                    maxWidth: "10%",
                                  }}
                                />
                                <span className="button-content float-start mx-2">
                                  Telegram
                                </span>
                              </Button>
                            </Col>
                          )}
                          {cardDetails.xiao_hong_shu && (
                            <Col lg={6} md={6} sm={6} xs={6} className="my-2">
                              <Button
                                className="w-100 d-flex align-items-center"
                                size="large"
                                onClick={() =>
                                  openSocialLink(cardDetails.xiao_hong_shu)
                                }
                              >
                                <img
                                  className="social_custom_icon float-start"
                                  src={XHSCustomIcon}
                                  alt="XHS Icon"
                                  style={{
                                    maxHeight: "100%",
                                    maxWidth: "10%",
                                  }}
                                />
                                <span className="button-content float-start mx-2">
                                  Xiao Hong Shu
                                </span>
                              </Button>
                            </Col>
                          )}
                          {cardDetails.twitter && (
                            <Col lg={6} md={6} sm={6} xs={6} className="my-2">
                              <Button
                                className="w-100 d-flex align-items-center"
                                size="large"
                                onClick={() =>
                                  openSocialLink(cardDetails.twitter)
                                }
                              >
                                <img
                                  className="social_custom_icon float-start"
                                  src={TwitterCustomIcon}
                                  alt="Twitter Icon"
                                  style={{
                                    maxHeight: "100%",
                                    maxWidth: "10%",
                                  }}
                                />
                                <span className="button-content float-start mx-2">
                                  Twitter
                                </span>
                              </Button>
                            </Col>
                          )}
                          {cardDetails.weibo && (
                            <Col lg={6} md={6} sm={6} xs={6} className="my-2">
                              <Button
                                className="w-100 d-flex align-items-center"
                                size="large"
                                onClick={() =>
                                  openSocialLink(cardDetails.weibo)
                                }
                              >
                                <img
                                  className="social_custom_icon float-start"
                                  src={WeiboCustomIcon}
                                  alt="Weibo Icon"
                                  style={{
                                    maxHeight: "100%",
                                    maxWidth: "10%",
                                  }}
                                />
                                <span className="button-content float-start mx-2">
                                  Weibo
                                </span>
                              </Button>
                            </Col>
                          )}
                        </Row>
                      </div>
                    )}

                    <div className="viewCardShareLinks">
                      <Row className="my-3">
                        <Col lg={4} md={4} sm={4} xs={3}>
                          <Button
                            className="w-100"
                            size="large"
                            icon={<FaShareAlt />}
                            onClick={handleShareButtonClick}
                          ></Button>
                        </Col>
                        <Col lg={8} md={8} sm={8} xs={9} className="ps-0">
                          <Button
                            className="w-100 bg-black text-white"
                            size="large"
                            onClick={handleAddToContacts} // Call the function on button click
                          >
                            <FaUserPlus className="fs-5 me-2" /> Save To
                            Phonebook
                          </Button>
                        </Col>
                      </Row>
                    </div>

                    <div className="viewCardQRCode">
                      <center>
                        {cardDetails.qr_url && (
                          <Image
                            src={cardDetails.qr_url}
                            alt="QR Code"
                            style={{
                              width: "250px",
                              height: "250px",
                              maxWidth: "250px",
                              maxHeight: "250px",
                            }}
                          />
                        )}
                      </center>
                    </div>
                  </div>
                </div>
              </div>
            </Col>
            <Col lg={2} md={2} sm={0} xs={0}></Col>
          </Row>
        </Spin>
        <footer className="viewDigitalCard_Footer">
          <p className="text-center mt-2">
            {" "}
            © 2024 Powered by midin.app. All Rights Reserved.
          </p>
        </footer>
      </Container>
    </>
  );
}

export default ViewDigitalCard;
