import { Button, Modal, message } from "antd";
import { ExclamationCircleFilled } from "@ant-design/icons";
import React, { useState } from "react";
import { activateMultipleCardforQRCode } from "../../../services/apiServices";

function ActivateMultipleCardsQR({ visible, onOk, onCancel, selectedRowKeys }) {
  const [isActivatingMultipleCardQR, setIsActivatingMultipleCardQR] =
    useState(false);

  const handleConfirmActivateCardQR = async () => {
    setIsActivatingMultipleCardQR(true);
    try {
      // Make the API call to activate the QR code
      let cardIDs = {
        card_ids: selectedRowKeys,
      };
      const response = await activateMultipleCardforQRCode(cardIDs);
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
      setIsActivatingMultipleCardQR(false);
    }
  };

  console.log(selectedRowKeys);
  return (
    <>
      <Modal
        centered
        title={
          <span className="fw-bold fs-5">
            <ExclamationCircleFilled className="mx-2 text-warning" />
            Activate Multiple Card QR
          </span>
        }
        open={visible}
        onCancel={onCancel}
        footer={[
          <Button key="cancel" onClick={onCancel}>
            Cancel
          </Button>,
          <Button
            key="confirm"
            type="primary"
            onClick={handleConfirmActivateCardQR}
            loading={isActivatingMultipleCardQR}
          >
            Confirm
          </Button>,
        ]}
      >
        <p className="text-center my-4">
          Do you want to activate{" "}
          <span className="fw-bold text-black">Multiple's</span> card?
        </p>{" "}
      </Modal>
    </>
  );
}

export default ActivateMultipleCardsQR;
