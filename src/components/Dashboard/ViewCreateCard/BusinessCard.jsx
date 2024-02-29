import React from "react";
import "./BusinessCard.css";
import { Col, Image, Row } from "react-bootstrap";
import {
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

import { createFromIconfontCN } from "@ant-design/icons";
import { Space } from "antd";
import { MdOutlineMail } from "react-icons/md";
const IconFont = createFromIconfontCN({
  scriptUrl: "//at.alicdn.com/t/font_8d5l8fzk5b87iudi.js",
});

function BusinessCard({ data, imageUrl }) {
  console.log(data, imageUrl);
  return (
    <div className="businessCardContainer">
      {" "}
      {/* Wrap with a container div */}
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
          <div className="profile_website fs-6">{`${data?.website_url}`}</div>
        </div>
        <div className="cardBioSection my-3 mx-1 p-4">
          <div className="cardBioTitle fs-5 fw-bold mx-2 my-2">About Me</div>
          {/* <div className="contentParagraph">{`${data?.bio}`}</div> */}
          <p className="cardBioParagraph mx-2">
            Lorem Ipsum is simply dummy text of the printing and typesetting
            industry. Lorem Ipsum has been the industry's standard dummy text
            ever since the 1500s, when an unknown printer took a galley of type
            and scrambled it to make a type specimen book. It has survived not
            only five centuries, but also the leap into electronic typesetting,
            remaining essentially unchanged. It was popularised in the 1960s
            with the release of Letraset sheets containing Lorem Ipsum passages,
            and more recently with desktop publishing software like Aldus
            PageMaker including versions of Lorem Ipsum.
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
    </div>
  );
}

export default BusinessCard;
