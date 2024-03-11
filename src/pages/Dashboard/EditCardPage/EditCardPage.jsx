import React, { useState } from "react";
import { Button, Layout, Menu, Space, message, theme } from "antd";
import {
  UserOutlined,
  ProfileOutlined,
  CreditCardOutlined,
  LogoutOutlined,
  PlusOutlined,
  QrcodeOutlined,
} from "@ant-design/icons";
import { MdOutlinePassword } from "react-icons/md";

import ViewProfile from "../../../components/Dashboard/ViewProfile/ViewProfile";
import ViewCompanyDetails from "../../../components/Dashboard/ViewCompanyDetails/ViewCompanyDetails";
import ViewCards from "../../../components/Dashboard/ViewCards/ViewCards";
import ViewChangePassword from "../../../components/Dashboard/ViewChangePassword/ViewChangePassword";
import ViewCreateCard from "../../../components/Dashboard/ViewCreateCard/ViewCreateCard";
import { logoutUser } from "../../../services/apiServices";
import { useNavigate } from "react-router-dom";
// import "./CompanyDashboardPage.css";
import ViewCardsQR from "../../../components/Dashboard/ViewCardsQR/ViewCardsQR";
import ViewEditCard from "../../../components/Dashboard/ViewEditCard/ViewEditCard";

const { Header, Content, Footer, Sider } = Layout;

const EditCardPage = () => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const navigate = useNavigate();

  const [selectedTab, setSelectedTab] = useState("3");

  const [showEditCard, setShowEditCard] = useState(false); // State to track whether Edit Card should be displayed

  const items = [
    { key: "1", icon: <ProfileOutlined />, label: "Company Details" },
    { key: "2", icon: <PlusOutlined />, label: "Create Card" },
    { key: "3", icon: <CreditCardOutlined />, label: "Cards" },
    { key: "4", icon: <QrcodeOutlined />, label: "Cards QRs" },
    { key: "5", icon: <UserOutlined />, label: "Profile" },
    { key: "6", icon: <MdOutlinePassword />, label: "Change Password" },
    // { key: "4", icon: <LogoutOutlined />, label: "Logout" },
  ];

  const handleMenuClick = (e) => {
    setSelectedTab(e.key);
    setShowEditCard(false); // Close ViewEditCard component when clicking a menu item
  };

  const renderContent = () => {
    switch (selectedTab) {
      case "1":
        return (
          <>
            <ViewCompanyDetails />
          </>
        );
      case "2":
        return (
          <>
            <ViewCreateCard />
          </>
        );
      case "3":
        return (
          <>
            {showEditCard ? (
              <ViewEditCard setShowEditCard={setShowEditCard} /> // Render EditCard component if showEditCard is true
            ) : (
              <ViewCards setShowEditCard={setShowEditCard} />
            )}
          </>
        );
      case "4":
        return (
          <>
            <ViewCardsQR />
          </>
        );
      case "5":
        return (
          <>
            <ViewProfile />
          </>
        );
      case "6":
        return (
          <>
            <ViewChangePassword />
          </>
        );
      default:
        return <div>No Content</div>;
    }
  };

  const handleLogout = async () => {
    let isLoggedOut = await logoutUser();

    if (isLoggedOut) {
      navigate("/");
    } else {
      message.error("Logged Out Successfully");
    }
  };

  return (
    <div className="MainBg">
      {/* <Header
        style={{
          position: "sticky",
          top: 0,
          zIndex: 1,
          width: "100%",
          display: "flex",
          alignItems: "center",
        }}
      >
        <div className="demo-logo" />
        <Menu
          theme="dark"
          mode="horizontal"
          defaultSelectedKeys={["1"]}
          onClick={handleMenuClick}
          style={{ flex: 1, minWidth: 0 }}
        >
          {items.map((item) => (
            <Menu.Item key={item.key} icon={item.icon}>
              {item.label}
            </Menu.Item>
          ))}
        </Menu>
      </Header> */}
      <Layout className="main-dashboard-layout">
        <Sider
          theme="light"
          breakpoint="lg"
          collapsedWidth="0"
          onBreakpoint={(broken) => {
            console.log(broken);
          }}
          onCollapse={(collapsed, type) => {
            console.log(collapsed, type);
          }}
          style={{ backgroundColor: "aliceblue" }}
        >
          <div className="demo-logo-vertical" />
          <Space className="fw-bold text-center fs-4 px-5 pt-4 pb-2x">
            Dashboard
          </Space>
          <Menu
            theme="light"
            mode="inline"
            defaultSelectedKeys={["1"]}
            onClick={handleMenuClick}
            style={{ backgroundColor: "aliceblue" }}
            className="mb-2"
          >
            {items.map((item) => (
              <Menu.Item
                key={item.key}
                icon={item.icon}
                style={{ borderRadius: "20px" }}
                className="sider-dashboard-menu-item my-2 fw-bold"
              >
                {item.label}
              </Menu.Item>
            ))}
            <Button
              danger
              type="primary"
              className="w-100"
              shape="round"
              onClick={handleLogout}
              icon={<LogoutOutlined />}
            >
              Logout
            </Button>
          </Menu>
        </Sider>
        <Layout style={{ backgroundColor: "aliceblue" }}>
          {/* <Header
            style={{
              padding: 0,
              background: colorBgContainer,
            }}
          >
            Hello
          </Header> */}
          <Content
            // style={{
            //   margin: "24px 16px 0",
            // }}
            className="my-5"
          >
            <div
              style={{
                padding: 24,
                // minHeight: 360,
                // background: colorBgContainer,
                borderRadius: borderRadiusLG,
              }}
              className="dashboard-container"
            >
              {renderContent()}
            </div>
          </Content>
          {/* <Footer
            style={{
              textAlign: "center",
            }}
          >
            Ant Design ©{new Date().getFullYear()} Created by Ant UED
          </Footer> */}
        </Layout>
      </Layout>
    </div>
  );
};
export default EditCardPage;