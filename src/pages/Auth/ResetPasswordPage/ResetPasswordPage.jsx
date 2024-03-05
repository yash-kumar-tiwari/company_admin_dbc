import React, { useState } from "react";
import { Form, Input, Button, message } from "antd";
import { LockOutlined } from "@ant-design/icons";
import { resetPassword } from "../../../services/apiServices"; // Assuming there's an API service function for resetting password
import { validatePassword } from "../../../utils/formValidators";
import { useNavigate, useParams } from "react-router-dom";
import backgroundImg from "../../../assets/images/mainBgImg.jpg";
import "./ResetPasswordPage.css";

function ResetPasswordPage() {
  const navigate = useNavigate();
  const { resetToken } = useParams();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {
    console.log(values);
    setLoading(true);
    try {
      const { password } = values;
      const response = await resetPassword({ password, resetToken });
      console.log(response);
      if (response && response.status === 200) {
        message.success(response.data.message);
      } else {
        message.error(response.data.message);
      }
    } catch (error) {
      console.error("API request failed:", error);
      message.error("Failed to reset password. Please try again later.");
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
              Reset Password
            </div>

            <Form name="basic" onFinish={onFinish}>
              <Form.Item
                name="password"
                hasFeedback
                rules={[
                  {
                    required: true,
                    message: "Please input your new password!",
                  },
                  { validator: validatePassword },
                ]}
              >
                <Input.Password
                  prefix={<LockOutlined className="site-form-item-icon" />}
                  placeholder="New Password"
                />
              </Form.Item>

              <Form.Item
                name="confirmPassword"
                dependencies={["password"]}
                hasFeedback
                rules={[
                  {
                    required: true,
                    message: "Please confirm your new password!",
                  },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue("password") === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(
                        new Error("The two passwords do not match!")
                      );
                    },
                  }),
                ]}
              >
                <Input.Password
                  prefix={<LockOutlined className="site-form-item-icon" />}
                  placeholder="Confirm Password"
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
                  Reset Password
                </Button>
              </Form.Item>
            </Form>
          </div>
        </div>
      </div>
    </>
  );
}

export default ResetPasswordPage;
