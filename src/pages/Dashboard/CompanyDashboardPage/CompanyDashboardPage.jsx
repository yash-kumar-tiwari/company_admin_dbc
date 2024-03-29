import React, { useEffect, useState } from "react";
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
import "./CompanyDashboardPage.css";
import ViewCardsQR from "../../../components/Dashboard/ViewCardsQR/ViewCardsQR";
import { Image } from "react-bootstrap";
import AppLogoDark from "../../../assets/images/static/app_logo_dark.png";
import AppLogoLight from "../../../assets/images/static/app_logo_light.png";

const { Content, Sider } = Layout;

const CompanyDashboardPage = () => {
  const {
    token: { borderRadiusLG },
  } = theme.useToken();

  const navigate = useNavigate();

  const [previousTab, setPreviousTab] = useState(null);
  const [selectedTab, setSelectedTab] = useState(previousTab || "1");
  const [collapsed, setCollapsed] = useState(false);

  const items = [
    { key: "1", icon: <ProfileOutlined />, label: "Company Details" },
    { key: "2", icon: <PlusOutlined />, label: "Create Card" },
    { key: "3", icon: <CreditCardOutlined />, label: "Cards" },
    { key: "4", icon: <QrcodeOutlined />, label: "Cards QRs" },
    { key: "5", icon: <UserOutlined />, label: "Profile" },
    { key: "6", icon: <MdOutlinePassword />, label: "Change Password" },
  ];

  const handleMenuClick = (e) => {
    setPreviousTab(selectedTab);
    setSelectedTab(e.key);
    if (window.innerWidth < 992) {
      setCollapsed(true);
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
            <ViewCards />
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
    <>
      <div className="MainBg">
        <Layout className="main-dashboard-layout">
          <Sider
            theme="dark"
            breakpoint="lg"
            collapsedWidth="0"
            onBreakpoint={(broken) => {
              // console.log(broken);
            }}
            collapsed={collapsed} // Set collapsed state of the Sider
            onCollapse={(collapsed, type) => {
              setCollapsed(collapsed);
              // console.log(collapsed, type);
            }}
            style={{
              backgroundColor: "#272C3B",
              position: "fixed",
              left: 0,
              top: 0,
              bottom: 0,
              zIndex: 1,
            }}

            // trigger={<MenuFoldOutlined />}
          >
            <div className="demo-logo-vertical" />
            <Space className="app-logo-desktop-view p-2">
              <Image src={AppLogoLight} width={150} className="text-center" />
            </Space>
            <Menu
              theme="dark"
              mode="inline"
              defaultSelectedKeys={[selectedTab]}
              onClick={handleMenuClick}
              style={{ backgroundColor: "#272C3B" }}
              className="mb-2"
            >
              {items.map((item) => (
                <Menu.Item
                  key={item.key}
                  icon={item.icon}
                  // style={{ borderRadius: "20px" }}
                  className="sider-dashboard-menu-item my-2 fw-semibold"
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
          <Layout
            style={{
              backgroundColor: "#F5F4F8",
              // marginLeft: collapsed ? 0 : 200,
              // transition: "margin-left 0.3s",
            }}
          >
            {/* <center
              className="mt-2"
              style={{ backgroundColor: "#F5F4F8", padding: 0 }}
            > */}
            <Space className="app-logo-mobile-view">
              <Image src={AppLogoDark} width={150} className="text-center" />
            </Space>
            {/* </center> */}
            <Content
              style={{
                backgroundColor: "#F5F4F8",
                // padding: "5px",
                minHeight: "100vh",
                overflowY: "auto",
                marginLeft: collapsed ? 0 : 200,
                transition: "margin-left 0.3s",
              }}
            >
              <div
                style={{
                  padding: 16,
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
    </>
  );
};
export default CompanyDashboardPage;
