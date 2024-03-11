import React, { useCallback, useEffect, useState } from "react";
import {
  Avatar,
  Button,
  Card,
  Form,
  Typography,
  message,
  Spin,
  Table,
  Modal,
} from "antd";
import QRCode from "qrcode.react"; // Import QRCode library
import "./ViewCardsQR.css";
import { NavLink, useNavigate } from "react-router-dom";

import { Col, Row } from "react-bootstrap";
import { Card as CardRB } from "react-bootstrap";
import {
  fetchCardsList,
  fetchCardsUrlList,
} from "../../../services/apiServices";
import { ExclamationCircleFilled } from "@ant-design/icons";
import { handleAuthenticationError } from "../../../utils/authHelpers";

const { Text, Title, Paragraph } = Typography;
const { Item } = Form;

function ViewCardsQR() {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [isFetchingCardsUrl, setIsFetchingCardsUrl] = useState(false);
  const [CardsData, setCardsData] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [pageSize, setPageSize] = useState(10);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedUserData, setSelectedUserData] = useState(null);

  const fetchViewCardsData = useCallback(async () => {
    setIsFetchingCardsUrl(true);
    try {
      const response = await fetchCardsUrlList();
      console.log(response);
      if (response && response.status === 200) {
        setCardsData(response.data.data);
        form.setFieldsValue(response.data.data);
        navigate("/dashboard");
      } else if (response.status === 401) {
        handleAuthenticationError(response.data.message, navigate);
      } else {
        message.error(response.data.message);
      }
    } catch (error) {
      console.error("API request failed:", error);
      message.error("Failed to Load Details. Please try again later.");
    } finally {
      setIsFetchingCardsUrl(false);
    }
  }, [navigate, form]);

  useEffect(() => {
    fetchViewCardsData();
  }, [navigate, fetchViewCardsData]);

  const handleSelectionChange = (selectedRowKeys) => {
    setSelectedRowKeys(selectedRowKeys);
  };

  const handlePageSizeChange = (current, size) => {
    console.log("New page size:", size);
    setPageSize(size);
  };

  const handleViewQR = (record) => {
    setSelectedUserData(record);
    setModalVisible(true);
  };

  const handleModalClose = () => {
    setModalVisible(false);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: handleSelectionChange,
    selections: [Table.SELECTION_ALL, Table.SELECTION_NONE],
    columnWidth: "5%",
  };

  const columns = [
    {
      title: <div className="text-center fw-bold">S.No</div>,
      render: (text, record, index) => index + 1,
      align: "center",
      width: "5%",
    },
    {
      title: <div className="text-center fw-bold">Name</div>,
      dataIndex: "first_name",
      render: (text, record) => (
        <>
          <Text
            strong
            // onClick={() => handleNameClick(record)}
            style={{ cursor: "pointer" }}
          >{`${record.first_name} ${record.last_name}`}</Text>
        </>
      ),
      align: "center",
      width: "15%",
      ellipsis: true,
      sorter: (a, b) => a.first_name.localeCompare(b.first_name),
    },
    {
      title: <div className="text-center fw-bold">View QR</div>,
      dataIndex: "qr_url",
      render: (text, record) => (
        <center>
          <Button
            type="primary"
            size="small"
            onClick={() => handleViewQR(record)} // Open modal with user data and QR code
          >
            View QR
          </Button>
        </center>
      ),
      align: "center",
      width: "15%",
      ellipsis: true,
    },
    {
      title: <div className="text-center fw-bold">Card URL</div>,
      dataIndex: "card_url",
      render: (text, record) => (
        <center>
          <Button
            href={text}
            type="primary"
            size="small"
            target="_blank"
            rel="noopener noreferrer"
          >
            View Card
          </Button>
        </center>
      ),
      align: "center",
      width: "15%",
      ellipsis: true,
    },
  ];

  const components = {
    header: {
      cell: (props) => (
        <th {...props} style={{ backgroundColor: "-moz-initial" }} />
      ),
    },
  };

  return (
    <>
      <Spin spinning={isFetchingCardsUrl}>
        <Card
          type="inner"
          title={<span className="fw-bold text-center">Cards</span>}
          className="view-cards-qr-custom-card"
        >
          <Table
            rowKey={(record) => record.id}
            bordered
            loading={isFetchingCardsUrl}
            size="large"
            rowSelection={rowSelection}
            pagination={{
              position: ["bottomRight"],
              pageSize,
              pageSizeOptions: ["10", "20", "50"],
              showSizeChanger: true,
              onShowSizeChange: handlePageSizeChange,
            }}
            columns={columns}
            dataSource={CardsData}
            components={components}
          />
        </Card>
      </Spin>
      <Modal
        title=<span className="fw-bold">
          <ExclamationCircleFilled className="text-primary mx-2" /> QR Details
        </span>
        open={modalVisible}
        onCancel={handleModalClose}
        footer={[
          <Button key="close" onClick={handleModalClose} danger size="large"s>
            Close
          </Button>,
        ]}
      >
        {selectedUserData && (
          <div className="my-4 text-center">
            <p className="fw-bold my-4">
              Name:{" "}
              <span>{`${selectedUserData.first_name} ${selectedUserData.last_name}`}</span>
            </p>
            {/* <p className="fw-bold">Email: {selectedUserData.email}</p>
            <p className="fw-bold">Phone: {selectedUserData.phone}</p> */}
            <p className="fw-bold my-2">Card QR</p>
            <QRCode value={selectedUserData.qr_url} />
          </div>
        )}
      </Modal>
    </>
  );
}

export default ViewCardsQR;
