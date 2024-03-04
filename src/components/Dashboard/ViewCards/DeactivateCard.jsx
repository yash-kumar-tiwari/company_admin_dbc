import React, { useState } from "react";
import { Modal, Button, message } from "antd";
import { ExclamationCircleFilled } from "@ant-design/icons";
import { deactivateCard } from "../../../services/apiServices";

const DeactivateCard = ({ visible, onOk, onCancel, record }) => {
  const [isDeactivatingCard, setIsDeactivatingCard] = useState(false);

  const handleConfirmDeactivateCard = async () => {
    setIsDeactivatingCard(true);
    try {
      // Make the API call to activate the QR code
      const response = await deactivateCard(record.id);
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
      setIsDeactivatingCard(false);
    }
  };
  return (
    <Modal
      centered
      title={
        <span className="fw-bold fs-5">
          <ExclamationCircleFilled className="mx-2 text-danger" />
          Deactivate Card
        </span>
      }
      open={visible}
      //   onOk={onOk}
      onCancel={onCancel}
      footer={[
        <Button key="back" onClick={onCancel}>
          Cancel
        </Button>,
        <Button
          key="submit"
          type="primary"
          onClick={handleConfirmDeactivateCard}
          loading={isDeactivatingCard}
        >
          Deactivate
        </Button>,
      ]}
    >
      <p className="text-center my-4">
        Do you want to Deactivate{" "}
        <span className="fw-bold text-black">
          {record && record.first_name}'s
        </span>{" "}
        card?
      </p>{" "}
    </Modal>
  );
};

export default DeactivateCard;
