import React, { useCallback, useEffect, useState } from "react";
import {
  Avatar,
  Button,
  Card,
  Form,
  Typography,
  message,
  Spin,
  Tag,
  Table,
  Descriptions,
  Dropdown,
  Menu,
  Tooltip,
} from "antd";
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  EllipsisOutlined,
} from "@ant-design/icons";
import "./ViewCards.css";
import { NavLink, useNavigate } from "react-router-dom";

import { Col, Row } from "react-bootstrap";
import { Card as CardRB } from "react-bootstrap";
import { fetchCardsList } from "../../../services/apiServices";
import ActivateCardQR from "./ActivateCardQR";
import DeactivateCard from "./DeactivateCard";
import ActivateMultipleCardsQR from "./ActivateMultipleCardsQR";
import DeleteCard from "./DeleteCard";
import { handleAuthenticationError } from "../../../utils/authHelpers";

const { Text, Title, Paragraph } = Typography;
const { Item } = Form;

function ViewCards({ setShowEditCard }) {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [isFetchingCards, setIsFetchingCards] = useState(false);
  const [isUpdatingCards, setIsUpdatingCards] = useState(false);
  const [CardsData, setCardsData] = useState([]);
  const [ellipsis, setEllipsis] = useState(true);
  const [avatarPreview, setAvatarPreview] = useState("");
  const [selectedUser, setSelectedUser] = useState(null); // To store the selected user data
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [showActivateCardQRModal, setShowActivateCardQRModal] = useState(false);
  const [showDeactivateCardModal, setShowDeactivateCardModal] = useState(false);
  const [showActivateMultipleModal, setShowActivateMultipleModal] =
    useState(false);
  const [showDeleteCardModal, setShowDeleteCardModal] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [pageSize, setPageSize] = useState(5);

  const fetchViewCardsData = useCallback(async () => {
    try {
      setIsFetchingCards(true);
      const response = await fetchCardsList();
      if (response && response.status === 200) {
        setCardsData(response.data.data);
        setAvatarPreview(response.data.data.avatar); // Set avatar preview

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
      setIsFetchingCards(false);
    } finally {
      setIsFetchingCards(false);
    }
  }, [navigate, form]);

  useEffect(() => {
    fetchViewCardsData();
  }, [navigate, fetchViewCardsData]);

  const handleSelectionChange = (selectedRowKeys) => {
    setSelectedRowKeys(selectedRowKeys);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: handleSelectionChange,
    selections: [
      // Table.SELECTION_ALL,
      // Table.SELECTION_NONE,
      {
        key: "activate",
        text: "Activate Cards",
        onSelect: () => {
          handleActivateMultipleCardModalOpen();
          // Implement logic to activate selected cards
          // message.success("Activated selected cards");
        },
      },
      // {
      //   key: "deactivate",
      //   text: "Deactivate Cards",
      //   onSelect: () => {
      //     // Implement logic to deactivate selected cards
      //     message.success("Deactivated selected cards");
      //   },
      // },
    ],
  };

  const columns = [
    // {
    //   title: <div className="text-center fw-bold"></div>,
    //   dataIndex: "profile_picture",
    //   render: (text, record) => (
    //     <center>
    //       <Avatar src={record.profile_picture} />
    //     </center>
    //   ),
    //   width: "5%",
    // },
    {
      title: <div className="text-center fw-bold">Name</div>,
      dataIndex: "first_name",
      render: (text, record) => (
        <>
          <Avatar src={record.profile_picture} className="me-2" />
          <Text
            strong
            // onClick={() => handleNameClick(record)}
            style={{ cursor: "pointer" }}
          >{`${record.first_name} ${record.last_name}`}</Text>
        </>
      ),
      sorter: (a, b) => a.first_name.localeCompare(b.first_name),
      width: "20%",
    },
    {
      title: <div className="text-center fw-bold">Email</div>,
      dataIndex: "user_email",
      width: "20%",
    },
    {
      title: <div className="text-center fw-bold">Designation</div>,
      dataIndex: "designation",
      // width: "15%",
    },
    {
      title: <div className="text-center fw-bold">Contact Number</div>,
      dataIndex: "contact_number",
      // width: "15%",
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
      // width: "10%",
    },
    {
      title: <div className="text-center fw-bold">QR</div>,
      dataIndex: "is_active_for_qr",
      render: (text, record) => (
        <center>
          <Tooltip
            title={record.is_active_for_qr ? "Activated" : "Deactivated"}
            color={record.is_active_for_qr ? "green" : "red"}
            trigger="click" // Show tooltip on click
            // mouseEnterDelay={0.5} // Optional: Adjust delay if needed
            autoAdjustOverflow={true} // Enable autoshift
          >
            <center>
              {record.is_active_for_qr ? (
                <Tag color="green">
                  <CheckCircleOutlined />
                </Tag>
              ) : (
                <Tag color="red">
                  <CloseCircleOutlined />
                </Tag>
              )}
            </center>
          </Tooltip>
        </center>
      ),
      width: "5%",
    },
    {
      title: "Actions",
      key: "actions",
      render: (text, record) => (
        <Dropdown
          overlay={
            <Menu>
              <Menu.Item
                key="1"
                onClick={() => handleActivateCardQRModalOpen(record)}
              >
                Activate Card QR
              </Menu.Item>
              <Menu.Item
                key="2"
                onClick={() => handleDeactivateCardModalOpen(record)}
              >
                Deactivate Card
              </Menu.Item>
              <Menu.Item
                key="3"
                onClick={() => handleDeleteCardModalOpen(record)}
              >
                Delete Card
              </Menu.Item>
              <Menu.Item key="4">
                <NavLink
                  className="text-decoration-none"
                  to={{
                    pathname: `/dashboard/edit-card/${record.id}`,
                    state: { cardId: record.id },
                  }}
                  onClick={() => handleEditCard(record.id)}
                >
                  Edit Card
                </NavLink>
              </Menu.Item>
            </Menu>
          }
          trigger={["click"]}
        >
          <span>
            <Button type="link" icon={<EllipsisOutlined />} />
          </span>
        </Dropdown>
      ),
      width: "10%",
    },
  ];

  const handleActivateCardQRModalOpen = (record) => {
    setSelectedRecord(record);
    setShowActivateCardQRModal(true);
  };

  const handleDeactivateCardModalOpen = (record) => {
    setSelectedRecord(record);
    setShowDeactivateCardModal(true);
  };

  const handleActivateMultipleCardModalOpen = (record) => {
    setShowActivateMultipleModal(true);
  };

  const handleDeleteCardModalOpen = (record) => {
    setSelectedRecord(record);
    setShowDeleteCardModal(true);
  };

  const handleActivateCardQRModalClose = () => {
    // message.success(`Activated ${selectedRecord.first_name}'s card`);
    setShowActivateCardQRModal(false);
  };

  const handleDeactivateCardModalClose = () => {
    // message.success(`Deactivated ${selectedRecord.first_name}'s card`);
    setShowDeactivateCardModal(false);
  };

  const handleActivateMultipleCardModalClose = () => {
    setShowActivateMultipleModal(false);
  };

  const handleDeleteCardModalClose = () => {
    setShowDeleteCardModal(false);
  };

  const [selectedCardId, setSelectedCardId] = useState(null);

  const handlePageSizeChange = (current, size) => {
    console.log("New page size:", size);
    setPageSize(size);
  };

  const handleEditCard = (cardId) => {
    setSelectedCardId(cardId);
    setShowEditCard(true);
  };

  const components = {
    header: {
      cell: (props) => (
        <th {...props} style={{ backgroundColor: "-moz-initial" }} />
      ),
    },
  };

  return (
    <>
      <Card
        type="inner"
        title={<span className="fw-bold text-center">Cards</span>}
        className="view-cards-custom-card"
      >
        {selectedUser && (
          <div className="selected-user-description-section my-2">
            <Typography.Title level={4} className="mx-2">
              User Details
            </Typography.Title>
            <Descriptions bordered size="small" column={1}>
              <Descriptions.Item label="Name">{`${selectedUser.first_name} ${selectedUser.last_name}`}</Descriptions.Item>
              <Descriptions.Item label="Email">
                {selectedUser.user_email}
              </Descriptions.Item>
              <Descriptions.Item label="Designation">
                {selectedUser.designation}
              </Descriptions.Item>
              <Descriptions.Item label="Contact Number">
                {selectedUser.contact_number}
              </Descriptions.Item>
            </Descriptions>
            <Button
              className="my-2 mx-2"
              type="primary"
              shape="round"
              size="small"
              onClick={() => setSelectedUser(null)}
            >
              Close
            </Button>
          </div>
        )}
        <Table
          rowKey={(record) => record.id} // or the key you are using
          bordered
          loading={isFetchingCards}
          size="large"
          rowSelection={rowSelection}
          pagination={{
            position: ["bottomRight"],
            pageSize,
            pageSizeOptions: ["5", "10", "20", "50"],
            showSizeChanger: true,
            onShowSizeChange: handlePageSizeChange,
          }}
          columns={columns}
          dataSource={CardsData}
          scroll={{
            x: 1200,
          }}
          components={components}
        />
      </Card>

      <ActivateCardQR
        visible={showActivateCardQRModal}
        onOk={(status) => {
          handleActivateCardQRModalClose();
          fetchViewCardsData();
          // console.log(status);
        }}
        onCancel={() => setShowActivateCardQRModal(false)}
        record={selectedRecord}
      />

      <DeactivateCard
        visible={showDeactivateCardModal}
        onOk={(status) => {
          handleDeactivateCardModalClose();
          fetchViewCardsData();
          // console.log(status);
        }}
        onCancel={() => setShowDeactivateCardModal(false)}
        record={selectedRecord}
      />

      <ActivateMultipleCardsQR
        visible={showActivateMultipleModal}
        onOk={(status) => {
          handleActivateMultipleCardModalClose();
          fetchViewCardsData();
          // console.log(status);
        }}
        onCancel={() => setShowActivateMultipleModal(false)}
        selectedRowKeys={selectedRowKeys} // Pass the selectedRowKeys to the modal
      />

      <DeleteCard
        visible={showDeleteCardModal}
        onOk={(status) => {
          handleDeleteCardModalClose();
          fetchViewCardsData();
          // console.log(status);
        }}
        onCancel={() => setShowDeleteCardModal(false)}
        record={selectedRecord} // Pass the selectedRowKeys to the modal
      />
    </>
  );
}

export default ViewCards;
