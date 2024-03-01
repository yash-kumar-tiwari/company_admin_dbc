import React, { useEffect, useState } from "react";
import { Col, Container, Image, Row } from "react-bootstrap";
import {
  EnvironmentOutlined,
  FacebookOutlined,
  InstagramOutlined,
  LineOutlined,
  LinkedinOutlined,
  TikTokOutlined,
  TwitterOutlined,
  WechatOutlined,
  WeiboOutlined,
  WhatsAppOutlined,
  YoutubeOutlined,
} from "@ant-design/icons";
import {
  FaInstagram,
  FaLine,
  FaLinkedin,
  FaTelegram,
  FaWhatsapp,
} from "react-icons/fa";

import { MdOutlineMail } from "react-icons/md";
import "./ViewDigitalCard.css";
import { fetchViewDigitalCardAll } from "../../services/apiServices";
import { useParams } from "react-router-dom";
import { Button } from "antd";
import { FaMapLocationDot } from "react-icons/fa6";

function ViewDigitalCard() {
  const { companyName, cardReference } = useParams();

  const [cardDetails, setCardDetails] = useState({});
  const [imageUrl, setImageUrl] = useState("");

  useEffect(() => {
    async function fetchCard() {
      try {
        let queries = { companyName, cardReference };
        const response = await fetchViewDigitalCardAll(queries);
        console.log(response);
        setCardDetails(response.data.data);
        setImageUrl(response.data.data.profile_picture);
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
          <Col lg={6} md={12} sm={12}>
            <div className="viewBusinessCardContainer my-5 mx-5">
              {" "}
              <div className="viewCardContainer">
                <div className="viewCardProfileSection">
                  <div className="viewCardImagesSection">
                    <Image
                      className="view_card_profile_image"
                      src={
                        imageUrl ||
                        "https://cf.shopee.ph/file/13ac71187230bae1b72226fa0cd962b1"
                      }
                      roundedCircle
                      alt="Profile"
                    />
                  </div>
                </div>
                <div className="viewCardProfileBioDetails">
                  <div className="view_card_profile_name fs-3 fw-bold">{`${cardDetails?.first_name} ${cardDetails?.last_name}`}</div>
                  <div className="view_card_profile_designation fs-5 fw-bold">{`${cardDetails?.designation}`}</div>
                </div>
                <div className="viewCardBioSection my-3 mx-1 p-4">
                  <div className="viewCardBioTitle fs-5 fw-bold mx-2 my-2">
                    About Me
                  </div>
                  <div className="viewCardBioParagraph">{`${cardDetails?.bio}`}</div>
                  {/* <p className="viewCardBioParagraph mx-2">
                    Lorem Ipsum is simply dummy text of the printing and
                    typesetting industry. Lorem Ipsum has been the industry's
                    standard dummy text ever since the 1500s, when an unknown
                    printer took a galley of type and scrambled it to make a
                    type specimen book. It has survived not only five centuries,
                    but also the leap into electronic typesetting, remaining
                    essentially unchanged. It was popularised in the 1960s with
                    the release of Letraset sheets containing Lorem Ipsum
                    passages, and more recently with desktop publishing software
                    like Aldus PageMaker including versions of Lorem Ipsum.
                  </p> */}
                </div>
                <div className="viewCardCompanySection my-3 mx-1 p-4">
                  <div className="viewCardCompanyTitle fs-5 fw-bold mx-2 my-2">
                    Company Details
                  </div>

                  <Row className=" d-flex flex-col m-1">
                    <Col>
                      <label className="fw-bold">Name : </label>
                      <span> {cardDetails.company_name} </span>
                    </Col>
                    <Col>
                      <label className="fw-bold">Email : </label>
                      <span> {cardDetails.company_email} </span>
                    </Col>
                    <Col>
                      <label className="fw-bold">Phone : </label>
                      <span> {cardDetails.company_contact_number} </span>
                    </Col>
                    <Col>
                      <label className="fw-bold">Website : </label>
                      <span> {cardDetails.website_url} </span>
                    </Col>
                    <div className="mt-4">
                      {/* <Button
                        className="m-2 float-start"
                        onClick={openLocationUrl}
                      >
                        <FaMapLocationDot
                          className="m-2 fs-3"
                          onClick={openLocationUrl}
                        />
                      </Button>{" "} */}
                      <FaMapLocationDot
                        className="m-2 fs-3"
                        onClick={openLocationUrl}
                      />
                      <Image
                        className="float-end"
                        src={cardDetails.company_logo}
                        alt="Company Logo"
                        fluid
                        height={100}
                        width={100}
                        roundedCircle
                      />
                    </div>
                  </Row>
                </div>
                <div className="viewCardSocialSection my-3 mx-1 p-4">
                  <Row>
                    <Col
                      lg={12}
                      md={12}
                      sm={12}
                      className="viewCardSocialItem mb-1"
                    >
                      <FacebookOutlined className="fs-4" />
                      <FaInstagram className="fs-4" />
                      <FaWhatsapp className="fs-4" />
                      <FaLinkedin className="fs-4" />
                      <YoutubeOutlined className="fs-4" />
                      <MdOutlineMail className="fs-4" />
                    </Col>
                    <Col
                      lg={12}
                      md={12}
                      sm={12}
                      className="viewCardSocialItem mt-2"
                    >
                      <WechatOutlined className="fs-4" />
                      <TwitterOutlined className="fs-4" />
                      <TikTokOutlined className="fs-4" />
                      <FaTelegram className="fs-4" />
                      <WeiboOutlined className="fs-4" />
                      <FaLine className="fs-4" />
                    </Col>
                  </Row>
                </div>
                <div className="viewCardQrSection my-3 mx-1 p-4"></div>
              </div>{" "}
            </div>
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default ViewDigitalCard;
