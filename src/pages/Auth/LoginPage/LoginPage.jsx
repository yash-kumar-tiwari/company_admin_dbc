import React, { useState } from "react";
import "./LoginPage.css";

import { Form, Input, Button, message } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { loginUser } from "../../../services/apiServices";
import { validateEmail, validatePassword } from "../../../utils/formValidators";
import { NavLink, useNavigate } from "react-router-dom";
import AppBgImage from "../../../assets/images/static/app_background_image.jpg";
import AppLogoLight from "../../../assets/images/static/app_logo_light.png";
import { FaFacebookSquare } from "react-icons/fa";
import { CiInstagram } from "react-icons/ci";

function Login() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const onFinish = async (values) => {
    setLoading(true);
    try {
      const response = await loginUser(values);
      if (response && response.status === 200) {
        // Login successful
        message.success(response.data.message);
        // Redirect user to dashboard or desired page
        navigate("/dashboard");
      } else {
        // Handle login error
        message.error(response.data.message);
      }
    } catch (error) {
      // Handle API request error
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
            <img src={AppLogoLight} alt="Logo" className="logoimg" />
            <div className="position-absolute bottom-0 start-50 translate-middle-x mb-5">
              <FaFacebookSquare className="fs-1 fw-bold text-white me-2" />
              <CiInstagram className="fs-1 fw-bold text-white me-2 " />
            </div>
          </div>
          <div className="col-sm-12 col-md-6 bg-dark d-flex align-items-center justify-content-center">
            <div className="card border-0 bg-dark w-50">
              <img
                src={AppLogoLight}
                className="mx-auto mt-4 mb-3"
                alt="LogoImgSize"
                style={{ width: "200px" }}
              />

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
                <Form.Item
                  name="password"
                  hasFeedback
                  rules={[
                    { required: true, message: "Please input your password!" },
                    { validator: validatePassword },
                  ]}
                >
                  <Input.Password
                    prefix={<LockOutlined className="site-form-item-icon" />}
                    placeholder="Password"
                  />
                </Form.Item>
                <Form.Item
                  name="remember"
                  valuePropName="checked"
                  className="text-center"
                >
                  <NavLink to={"/forget-password"}>
                    <Button type="link" className="text-secondary fs-6">
                      Forgot password?
                    </Button>
                  </NavLink>
                </Form.Item>
                <Form.Item>
                  <Button
                    type="primary"
                    shape="round"
                    htmlType="submit"
                    className="btn-login w-100"
                    loading={loading}
                  >
                    Login
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
export default Login;
