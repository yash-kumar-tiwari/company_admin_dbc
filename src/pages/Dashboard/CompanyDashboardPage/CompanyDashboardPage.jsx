import React, { useEffect, useState } from "react";
import { Button, Layout, Menu, Space, message, theme } from "antd";
import {
  UserOutlined,
  ProfileOutlined,
  CreditCardOutlined,
  LogoutOutlined,
  PlusOutlined,
  QrcodeOutlined,
  MenuFoldOutlined,
} from "@ant-design/icons";
import { MdOutlinePassword } from "react-icons/md";

import ViewProfile from "../../../components/Dashboard/ViewProfile/ViewProfile";
import ViewCompanyDetails from "../../../components/Dashboard/ViewCompanyDetails/ViewCompanyDetails";
import ViewCards from "../../../components/Dashboard/ViewCards/ViewCards";
import ViewChangePassword from "../../../components/Dashboard/ViewChangePassword/ViewChangePassword";
import ViewCreateCard from "../../../components/Dashboard/ViewCreateCard/ViewCreateCard";
import { logoutUser } from "../../../services/apiServices";
import { useNavigate } from "react-router-dom";
import "./CompanyDashboardPage.css";
import ViewCardsQR from "../../../components/Dashboard/ViewCardsQR/ViewCardsQR";
import ViewEditCard from "../../../components/Dashboard/ViewEditCard/ViewEditCard";

const { Header, Content, Footer, Sider } = Layout;

const CompanyDashboardPage = () => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const navigate = useNavigate();

  const [previousTab, setPreviousTab] = useState(null);
  const [selectedTab, setSelectedTab] = useState(previousTab || "1");
  const [collapsed, setCollapsed] = useState(false); // State to track sidebar collapsed status

  const [showEditCard, setShowEditCard] = useState(false);

  const items = [
    { key: "1", icon: <ProfileOutlined />, label: "Company Details" },
    { key: "2", icon: <PlusOutlined />, label: "Create Card" },
    { key: "3", icon: <CreditCardOutlined />, label: "Cards" },
    { key: "4", icon: <QrcodeOutlined />, label: "Cards QRs" },
    { key: "5", icon: <UserOutlined />, label: "Profile" },
    { key: "6", icon: <MdOutlinePassword />, label: "Change Password" },
  ];

  const handleMenuClick = (e) => {
    // Update the previousTab before updating the selectedTab
    setPreviousTab(selectedTab);
    setSelectedTab(e.key);
    setShowEditCard(false);
    if (window.innerWidth < 992) {
      // Check if screen size is less than 992px (antd's default breakpoint)
      setCollapsed(true); // Collapse the sidebar after selecting a menu item only on small screens
    }
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
            <ViewCards setShowEditCard={setShowEditCard} />
            {/* {showEditCard ? (
              <ViewEditCard setShowEditCard={setShowEditCard} />
            ) : (
              <ViewCards setShowEditCard={setShowEditCard} />
            )} */}
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

  useEffect(() => {
    // Retrieve the previousTab value from localStorage
    const previousTab = localStorage.getItem("previousTab");
    if (previousTab) {
      setSelectedTab(previousTab);
    }
  }, []);

  useEffect(() => {
    // Save the selectedTab value to localStorage
    localStorage.setItem("previousTab", selectedTab);
  }, [selectedTab]);

  return (
    <div className="MainBg">
      <Layout className="main-dashboard-layout">
        <Sider
          theme="light"
          breakpoint="lg"
          collapsedWidth="0"
          onBreakpoint={(broken) => {
            console.log(broken);
          }}
          collapsed={collapsed} // Set collapsed state of the Sider
          onCollapse={(collapsed, type) => {
            setCollapsed(collapsed);
            console.log(collapsed, type);
          }}
          style={{ backgroundColor: "aliceblue" }}
          // trigger={<MenuFoldOutlined />}
        >
          <div className="demo-logo-vertical" />
          <Space className="fw-bold text-center fs-4 px-5 pt-4 pb-2x">
            Dashboard
          </Space>
          <Menu
            theme="light"
            mode="inline"
            defaultSelectedKeys={[selectedTab]}
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
          <Content className="my-5">
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
        </Layout>
      </Layout>
    </div>
  );
};
export default CompanyDashboardPage;
