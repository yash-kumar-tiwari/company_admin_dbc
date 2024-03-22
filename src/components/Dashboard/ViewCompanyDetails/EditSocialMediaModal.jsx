import React, { useCallback, useEffect, useState } from "react";
import { Modal, Button, Form, Input, message } from "antd";
import { ExclamationCircleFilled } from "@ant-design/icons";
import { Col, Row } from "react-bootstrap";
import {
  editSocialMediaDetails,
  fetchSocialMediaDetails,
} from "../../../services/apiServices";
import { handleAuthenticationError } from "../../../utils/authHelpers";
import { useNavigate } from "react-router-dom";
import { capitalizeFirstLetter } from "../../../utils/helpers";

const EditSocialMediaModal = ({ visible, onCancel, onSave, companyID }) => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [socialMediaData, setSocialMediaData] = useState({});

  const fetchSocialMediaData = useCallback(async () => {
    try {
      const response = await fetchSocialMediaDetails(companyID);
      console.log(response);
      if (response && response.status === 200) {
        // message.success(response.data.message);

        const dataWithoutCompanyId = { ...response.data.data[0] };
        delete dataWithoutCompanyId.company_id;

        setSocialMediaData(dataWithoutCompanyId);
        form.setFieldsValue(dataWithoutCompanyId);
      } else if (response.status === 401) {
        handleAuthenticationError(response.data.message, navigate);
      } else {
        message.error(response.data.message);
      }
    } catch (error) {
      console.error("Error fetching social media data:", error);
      message.error("Error Fetching Social Media Data");
    }
  }, [form, companyID, navigate]);

  useEffect(() => {
    if (visible) {
      // Run API call to fetch social media data
      fetchSocialMediaData();
    }
  }, [visible, fetchSocialMediaData]);

  const onFinish = async (values) => {
    try {
      const updatedValues = {
        ...values,
        company_id: companyID,
      };

      const response = await editSocialMediaDetails(updatedValues);
      if (response && response.status === 200) {
        message.success(response.data.message);
        // fetchSocialMediaData();
        onSave(updatedValues);
      } else if (response.status === 401) {
        handleAuthenticationError(response.data.message, navigate);
      } else {
        message.error(response.data.message);
      }
    } catch (error) {
      console.error("API request failed:", error);
      message.error("Failed to Update Company. Please try again later.");
    } finally {
    }
  };

  return (
    <Modal
      centered
      open={visible}
      title={
        <span className="fw-bold fs-5">
          <ExclamationCircleFilled className="mx-2 text-primary" />
          Edit Social Media
        </span>
      }
      onCancel={onCancel}
      footer={[
        <Button key="cancel" onClick={onCancel} size="large" danger>
          Cancel
        </Button>,
        <Button
          key="save"
          type="primary"
          htmlType="submit"
          form="editSocialMediaDetailForm"
          size="large"
        >
          Save
        </Button>,
      ]}
    >
      <div className="editCompanySocialMediaForm">
        <Form
          form={form}
          layout="vertical"
          name="editSocialMediaDetailForm"
          onFinish={onFinish}
        >
          <Row>
            {Object.entries(socialMediaData).map(([key, value]) => (
              <Col lg={12} md={12} sm={12} key={key}>
                <label className="fw-bold my-1 w-100">
                  {capitalizeFirstLetter(key)}
                </label>
                <Form.Item
                  name={key}
                  rules={[
                    {
                      type: "url",
                      message: `Please enter a valid URL e.g. www.${key}.com`,
                    },
                  ]}
                >
                  <Input
                    placeholder={`Enter ${capitalizeFirstLetter(key)} URL`}
                  />
                </Form.Item>
              </Col>
            ))}
          </Row>
        </Form>
      </div>
    </Modal>
  );
};

export default EditSocialMediaModal;
