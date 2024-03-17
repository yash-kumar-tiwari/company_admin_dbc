import React, { useState } from "react";
import { Form, Input, Button, message } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { forgetPassword, loginUser } from "../../../services/apiServices";
import { validateEmail, validatePassword } from "../../../utils/formValidators";
import { useNavigate } from "react-router-dom";
import backgroundImg from "../../../assets/images/mainBgImgResize70.jpg";
import "./ForgetPasswordPage.css";

function ForgetPasswordPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const response = await forgetPassword(values);
      console.log(response);
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
      <div className="limiter">
        <div
          className="container-login100"
          style={{ backgroundImage: `url(${backgroundImg})` }}
        >
          <div className="wrap-login100 py-5 px-5">
            <div className="mb-5 fw-bold fs-3 text-center text-white">
              Forget Password
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

              <Form.Item>
                <Button
                  type="primary"
                  shape="round"
                  htmlType="submit"
                  className="w-100"
                  loading={loading}
                >
                  Forget Password
                </Button>
              </Form.Item>
            </Form>
          </div>
        </div>
      </div>
    </>
  );
}

export default ForgetPasswordPage;
