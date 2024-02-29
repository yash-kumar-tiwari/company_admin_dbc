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
} from "antd";
import { CheckCircleOutlined, CloseCircleOutlined } from "@ant-design/icons";
import "./ViewCards.css";
import { NavLink, useNavigate } from "react-router-dom";

import { Col, Row } from "react-bootstrap";
import { Card as CardRB } from "react-bootstrap";
import { fetchCardsList } from "../../../services/apiServices";

const { Text, Title, Paragraph } = Typography;
const { Item } = Form;

function ViewCards() {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [isFetchingCards, setIsFetchingCards] = useState(false);
  const [isUpdatingCards, setIsUpdatingCards] = useState(false);
  const [CardsData, setCardsData] = useState([]);
  const [ellipsis, setEllipsis] = useState(true);
  const [avatarPreview, setAvatarPreview] = useState("");
  const [selectedUser, setSelectedUser] = useState(null); // To store the selected user data

  const fetchViewCardsData = useCallback(async () => {
    setIsFetchingCards(true);
    try {
      const response = await fetchCardsList();
      if (response && response.status === 200) {
        setCardsData(response.data.data);
        setAvatarPreview(response.data.data.avatar); // Set avatar preview

        form.setFieldsValue(response.data.data);
        navigate("/dashboard");
      } else {
        message.error(response.data.message);
      }
    } catch (error) {
      console.error("API request failed:", error);
      message.error("Failed to Load Details. Please try again later.");
    } finally {
      setIsFetchingCards(false);
    }
  }, [navigate, form]);

  useEffect(() => {
    fetchViewCardsData();
  }, [navigate, fetchViewCardsData]);

  const handleNameClick = (record) => {
    setSelectedUser(record); // Set the selected user data when name is clicked
  };

  const columns = [
    {
      title: <div className="text-center fw-bold"></div>,
      dataIndex: "profile_picture",
      render: (text, record) => (
        <center>
          <Avatar src={record.profile_picture} />
        </center>
      ),
      width: "5%",
    },
    {
      title: <div className="text-center fw-bold">Name</div>,
      dataIndex: "first_name",
      render: (text, record) => (
        <Text
          strong
          // onClick={() => handleNameClick(record)}
          style={{ cursor: "pointer" }}
        >{`${record.first_name} ${record.last_name}`}</Text>
      ),
      sorter: (a, b) => a.first_name.localeCompare(b.first_name),
      width: "20%",
    },
    {
      title: <div className="text-center fw-bold">Email</div>,
      dataIndex: "user_email",
      width: "25%",
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
            shape="round"
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
      title: <div className="text-center fw-bold">Active</div>,
      dataIndex: "is_active_for_qr",
      render: (text, record) => (
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
      ),
      // width: "10%",
    },
  ];

  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      // Handle the selection changes if needed
      // console.log("Selected Row Keys:", selectedRowKeys);
      // console.log("Selected Rows:", selectedRows);
    },
    getCheckboxProps: (record) => ({
      // Disable checkbox for specific rows
      disabled: record.name === "Disabled User",
    }),
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
      <Spin spinning={isFetchingCards}>
        <Card
          type="inner"
          title={<span className="fw-bold text-center">Cards</span>}
          className="view-cards-custom-card"
        >
          <Card
            type="inner"
            className="view-cards-custom-card"
            style={{ overflow: "auto", maxHeight: "60vh" }}
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
              // title={() => (
              //   <div className="text-center fw-bold fs-3">
              //     Own Uploaded Items
              //   </div>
              // )}
              // showHeader={true}
              rowSelection={{
                type: "checkbox",
                ...rowSelection,
              }}
              pagination={{
                position: ["bottomRight"],
                defaultPageSize: 10,
              }}
              columns={columns}
              dataSource={CardsData}
              scroll={{
                y: 500,
                x: 1200,
              }}
              components={components}
            />
          </Card>
        </Card>
      </Spin>
    </>
  );
}

export default ViewCards;
