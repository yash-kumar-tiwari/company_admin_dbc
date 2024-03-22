import React, { useState } from "react";
import { Form, Input, Button, message } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { forgetPassword } from "../../../services/apiServices";
import { validateEmail } from "../../../utils/formValidators";
import { NavLink, useNavigate } from "react-router-dom";
import AppBgImage from "../../../assets/images/static/app_background_image.jpg";
import AppLogoLight from "../../../assets/images/static/app_logo_light.png";
import "./ForgetPasswordPage.css";
import { FaFacebookSquare } from "react-icons/fa";
import { CiInstagram } from "react-icons/ci";
import { Image } from "react-bootstrap";
import { app_facebook_url, app_instagram_url } from "../../../utils/constants";

function ForgetPasswordPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const response = await forgetPassword(values);
      if (response && response.status === 200) {
        message.success(response.data.message);
        navigate("/");
      } else {
        message.error(response.data.message);
      }
    } catch (error) {
      console.error("API request failed:", error);
      message.error("Failed to login. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div
        className="container-fluid d-flex flex-column"
        style={{ height: "100vh" }}
      >
        <div className="row flex-grow-1">
          <div className="col-md-6 col-sm-12 p-0 position-relative">
            <img src={AppBgImage} alt="Background" className="bgImg" />
            <div className="position-absolute top-50 start-0 translate-middle-y text-white mb-5 p-4 ">
              <h2 className="textsize">
                <b>Tap, Connect, Cultivate</b>
                <br />
                Where Business Networking Blossoms
              </h2>
            </div>
            <NavLink to={"/"}>
              <Image src={AppLogoLight} alt="Logo" className="logoimg" />
            </NavLink>
            <div className="position-absolute bottom-0 start-50 translate-middle-x mb-5">
              <a
                href={app_facebook_url}
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaFacebookSquare className="fs-1 fw-bold text-white me-2" />
              </a>

              <a
                href={app_instagram_url}
                target="_blank"
                rel="noopener noreferrer"
              >
                <CiInstagram className="fs-1 fw-bold text-white me-2" />
              </a>
            </div>
          </div>
          <div className="col-sm-12 col-md-6 bg-dark d-flex align-items-center justify-content-center">
            <div className="card border-0 bg-dark w-50">
              <NavLink to={"/"}>
                <Image
                  src={AppLogoLight}
                  className="mx-auto mt-4 mb-3"
                  alt="LogoImgSize"
                  style={{ width: "200px" }}
                />
              </NavLink>

              <Form name="basic" onFinish={onFinish}>
                <Form.Item
                  name="email"
                  hasFeedback
                  rules={[
                    {
                      type: "email",
                      required: true,
                    },
                    { validator: validateEmail },
                  ]}
                >
                  <Input
                    prefix={<UserOutlined className="site-form-item-icon" />}
                    placeholder="Enter Your Email"
                  />
                </Form.Item>

                <Form.Item>
                  <Button
                    type="primary"
                    shape="round"
                    htmlType="submit"
                    className="btn-forget-pass w-100"
                    loading={loading}
                  >
                    Forget Password
                  </Button>
                </Form.Item>
              </Form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ForgetPasswordPage;
