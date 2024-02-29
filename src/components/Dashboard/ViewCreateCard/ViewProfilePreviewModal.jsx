import { Button, Modal } from "antd";
import React from "react";

function ViewProfilePreviewModal({ isVisible, imageUrl, onClose }) {
  return (
    <>
      <Modal
        open={isVisible}
        onCancel={onClose}
        footer={
          <>
            <Button danger type="primary" shape="round" onClick={onClose}>
              {" "}
              Close{" "}
            </Button>
          </>
        }
        title={"Profile Picture Preview"}
        closable
        destroyOnClose
        centered
        foot
      >
        {imageUrl && (
          <img
            src={imageUrl}
            alt="Preview"
            style={{ maxWidth: "100%", maxHeight: "100%" }}
          />
        )}
      </Modal>
    </>
  );
}

export default ViewProfilePreviewModal;
