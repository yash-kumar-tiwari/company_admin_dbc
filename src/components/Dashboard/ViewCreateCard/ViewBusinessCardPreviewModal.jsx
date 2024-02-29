import React, { useState } from "react";
import "./ViewBusinessCardPreviewModal.css";
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
import { Button, Modal, Space, message } from "antd";
import { MdOutlineMail } from "react-icons/md";
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
          </div>
          <div className="cardBioSection my-3 mx-1 p-4">
            <div className="cardBioTitle fs-5 fw-bold mx-2 my-2">About Me</div>
            {/* <div className="contentParagraph">{`${data?.bio}`}</div> */}
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
      </div>
    </Modal>
  );
};

export default ViewBusinessCardPreviewModal;
