import React, { useState } from "react";
import { Card, Form, Input, Button, Typography, message, Modal } from "antd";
import "./ViewChangePassword.css";
import { Col, Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { changePassword } from "../../../services/apiServices";
import { ExclamationCircleFilled } from "@ant-design/icons";

const { Text, Title } = Typography;
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
          <Form form={form} layout="vertical" onFinish={onFinishSubmit}>
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
                <Input.Password placeholder="Enter Old Password" />
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
                <Input.Password placeholder="Enter New Password" />
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
                <Input.Password placeholder="Confirm Your New Password" />
              </Item>
            </Col>
            <Row>
              <Col lg={3} md={6} sm={6}></Col>
              <Col lg={6} md={6} sm={6}>
                <Item>
                  <Button
                    type="primary"
                    className="w-100"
                    shape="round"
                    onClick={showModal}
                  >
                    Change Password
                  </Button>
                </Item>
              </Col>
              <Col lg={3} md={6} sm={6}></Col>
            </Row>
          </Form>
        </Card>
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
            <Button key="cancel" onClick={handleCancel} shape="round" danger>
              Cancel
            </Button>,
            <Button
              key="confirm"
              type="primary"
              onClick={confirmChangePassword}
              shape="round"
            >
              Confirm
            </Button>,
          ]}
        ></Modal>
      </div>
    </>
  );
}

export default ViewChangePassword;
