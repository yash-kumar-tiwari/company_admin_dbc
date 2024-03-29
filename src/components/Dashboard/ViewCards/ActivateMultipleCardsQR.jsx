import { Button, Modal, message } from "antd";
import { ExclamationCircleFilled } from "@ant-design/icons";
import React, { useState } from "react";
import { activateMultipleCardforQRCode } from "../../../services/apiServices";
import { handleAuthenticationError } from "../../../utils/authHelpers";
import { useNavigate } from "react-router-dom";

function ActivateMultipleCardsQR({ visible, onOk, onCancel, selectedRowKeys }) {
  const navigate = useNavigate();
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
      } else if (response.status === 401) {
        handleAuthenticationError(response.data.message, navigate);
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
          <div className="text-center">
            <Button
              key="cancel"
              onClick={onCancel}
              size="large"
              className="me-2"
            >
              Cancel
            </Button>
            <Button
              key="confirm"
              type="primary"
              onClick={handleConfirmActivateCardQR}
              loading={isActivatingMultipleCardQR}
              size="large"
              className="ms-2"
            >
              Confirm
            </Button>
          </div>,
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
