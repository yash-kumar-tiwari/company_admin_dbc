import React, { useState } from "react";
import { Card, Form, Input, Button, message, Modal } from "antd";
import "./ViewChangePassword.css";
import { Col, Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { changePassword } from "../../../services/apiServices";
import { ExclamationCircleFilled } from "@ant-design/icons";
import { handleAuthenticationError } from "../../../utils/authHelpers";
import MidinFooter from "../../MidinFooter/MidinFooter";

const { Item } = Form;

function ViewChangePassword() {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [isModalVisible, setIsModalVisible] = useState(false);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const onFinishSubmit = async (values) => {
    console.log("Form values:", values);
    try {
      const response = await changePassword(values);
      console.log(response);
      if (response && response.status === 200) {
        message.success(response.data.message);
        form.resetFields();
      } else if (response.status === 401) {
        handleAuthenticationError(response.data.message, navigate);
      } else {
        message.error(response.data.message);
      }
    } catch (error) {
      console.error("API request failed:", error);
      message.error("Failed to Change Password. Please try again later.");
    }
  };

  const confirmChangePassword = () => {
    setIsModalVisible(false);
    form.submit();
  };

  return (
    <>
      <div>
        <Card
          type="inner"
          title={<span className="fw-bold text-center">Change Password</span>}
          className="view-change-pass-custom-card "
        >
          <div className="viewChangePasswordContainer">
            <Form
              form={form}
              layout="vertical"
              onFinish={onFinishSubmit}
              name="changePasswordForm"
            >
              <Col>
                <label className="fw-bold mb-1">Old Password</label>
                <Item
                  name="old_password"
                  rules={[
                    {
                      required: true,
                      message: "Please enter your old password",
                    },
                  ]}
                  hasFeedback
                >
                  <Input.Password
                    placeholder="Enter Old Password"
                    size="large"
                  />
                </Item>
              </Col>
              <Col>
                <label className="fw-bold mb-1">New Password</label>
                <Item
                  name="new_password"
                  rules={[
                    {
                      required: true,
                      message: "Please enter your new password",
                    },
                  ]}
                  hasFeedback
                >
                  <Input.Password
                    placeholder="Enter New Password"
                    size="large"
                  />
                </Item>
              </Col>
              <Col>
                <label className="fw-bold mb-1">Confirm Password</label>
                <Item
                  name="confirm_password"
                  dependencies={["new_password"]}
                  hasFeedback
                  rules={[
                    {
                      required: true,
                      message: "Please confirm your new password",
                    },
                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        if (!value || getFieldValue("new_password") === value) {
                          return Promise.resolve();
                        }
                        return Promise.reject(
                          new Error(
                            "The two passwords that you entered do not match!"
                          )
                        );
                      },
                    }),
                  ]}
                >
                  <Input.Password
                    placeholder="Confirm Your New Password"
                    size="large"
                  />
                </Item>
              </Col>
              <Row>
                <Col lg={4} md={4} sm={3}></Col>
                <Col lg={4} md={4} sm={6}>
                  <Item>
                    <Button
                      type="primary"
                      className="w-100"
                      size="large"
                      onClick={showModal}
                    >
                      Change Password
                    </Button>
                  </Item>
                </Col>
                <Col lg={4} md={4} sm={3}></Col>
              </Row>
            </Form>
          </div>
        </Card>

        <MidinFooter />

        <Modal
          centered
          title={
            <span className="fw-bold fs-5">
              <ExclamationCircleFilled className="mx-2 text-warning text-center" />
              Do you want to Save Changes?
            </span>
          }
          open={isModalVisible}
          onCancel={handleCancel}
          footer={[
            <div className="text-center">
              <Button
                key="cancel"
                onClick={handleCancel}
                size="large"
                danger
                className="me-2"
              >
                Cancel
              </Button>

              <Button
                key="confirm"
                type="primary"
                onClick={confirmChangePassword}
                size="large"
                className="ms-2"
              >
                Confirm
              </Button>
            </div>,
          ]}
        ></Modal>
      </div>
    </>
  );
}

export default ViewChangePassword;
