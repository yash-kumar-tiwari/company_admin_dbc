import React, { useState } from "react";
import { Modal, Button, message } from "antd";
import { ExclamationCircleFilled } from "@ant-design/icons";
import { activateCardforQRCode } from "../../../services/apiServices";

const ActivateCardQR = ({ visible, onOk, onCancel, record }) => {
  const [isActivatingCardQR, setIsActivatingCardQR] = useState(false);

  const handleConfirmActivateCardQR = async () => {
    setIsActivatingCardQR(true);
    try {
      // Make the API call to activate the QR code
      const response = await activateCardforQRCode(record.id);
      if (response.status === 200) {
        message.success(response.data.message);
        onOk(response.data.success); // Close the modal
      } else {
        message.error(response.data.message);
      }
    } catch (error) {
      console.error("Error activating card:", error);
      message.error("Failed to activate the card. Please try again later.");
    } finally {
      setIsActivatingCardQR(false);
    }
  };

  return (
    <Modal
      centered
      title={
        <span className="fw-bold fs-5">
          <ExclamationCircleFilled className="mx-2 text-primary" />
          Activate Card QR
        </span>
      }
      open={visible}
      //   onOk={handleConfirmActivateCardQR}
      onCancel={onCancel}
      //   confirmLoading={isActivatingCardQR}
      footer={[
        <Button key="back" onClick={onCancel}>
          Cancel
        </Button>,
        <Button
          key="submit"
          type="primary"
          onClick={handleConfirmActivateCardQR}
          loading={isActivatingCardQR}
        >
          Activate
        </Button>,
      ]}
    >
      <p className="text-center my-4">
        Do you want to activate{" "}
        <span className="fw-bold text-black">
          {record && record.first_name}'s
        </span>{" "}
        card?
      </p>
    </Modal>
  );
};

export default ActivateCardQR;
