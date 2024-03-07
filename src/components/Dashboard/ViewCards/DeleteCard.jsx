import React, { useState } from "react";
import { Modal, Button, message } from "antd";
import { ExclamationCircleFilled } from "@ant-design/icons";
import { deleteCard } from "../../../services/apiServices";

const DeleteCard = ({ visible, onOk, onCancel, record }) => {
  const [isDeletingCard, setIsDeletingCard] = useState(false);

  const handleConfirmDeletingCard = async () => {
    setIsDeletingCard(true);
    try {
      // Make the API call to activate the QR code
      const response = await deleteCard(record.id);
      if (response.status === 200) {
        message.success(response.data.message);
        onOk(response.data.success); // Close the modal
      } else {
        message.error(response.data.message);
      }
    } catch (error) {
      console.error("Error Deleting card:", error);
      message.error("Failed to Delete the Card. Please try again later.");
    } finally {
      setIsDeletingCard(false);
    }
  };

  return (
    <Modal
      centered
      title={
        <span className="fw-bold fs-5">
          <ExclamationCircleFilled className="mx-2 text-danger" />
          Delete Card
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
          danger
          key="submit"
          type="primary"
          onClick={handleConfirmDeletingCard}
          loading={isDeletingCard}
        >
          Delete
        </Button>,
      ]}
    >
      <p className="text-center my-4">
        Do you want to Delete{" "}
        <span className="fw-bold text-black">
          {record && `${record.first_name} ${record.last_name}`} 's
        </span>{" "}
        card?
      </p>{" "}
    </Modal>
  );
};

export default DeleteCard;
