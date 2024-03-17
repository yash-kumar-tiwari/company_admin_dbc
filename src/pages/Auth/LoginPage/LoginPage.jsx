import React, { useState } from "react";
import "./LoginPage.css";
import { Form, Input, Button, message } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { loginUser } from "../../../services/apiServices";
import { validateEmail, validatePassword } from "../../../utils/formValidators";
import { NavLink, useNavigate } from "react-router-dom";
import backgroundImg from "../../../assets/images/mainBgImgResize70.jpg";

function Login() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const response = await loginUser(values);
      console.log(response);
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
      <div className="limiter">
        <div
          className="container-login100"
          style={{ backgroundImage: `url(${backgroundImg})` }}
        >
          <div className="wrap-login100 py-5 px-5">
            <div className="mb-5 fw-bold fs-3 text-center text-white">
              Company Admin Login
            </div>

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

              <Form.Item name="remember" valuePropName="checked">
                <NavLink to={"/forget-password"}>
                  <Button type="link">Forgot password?</Button>
                </NavLink>
              </Form.Item>

              <Form.Item>
                <Button
                  type="primary"
                  shape="round"
                  htmlType="submit"
                  className="w-100"
                  loading={loading}
                >
                  Login
                </Button>
              </Form.Item>
            </Form>
          </div>
        </div>
      </div>
    </>
  );
}

export default Login;
