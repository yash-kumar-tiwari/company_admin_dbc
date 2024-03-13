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
import {
  Navigate,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from "react-router-dom";
import "./CompanyDashboardPage.css";
import ViewCardsQR from "../../../components/Dashboard/ViewCardsQR/ViewCardsQR";
import ViewEditCard from "../../../components/Dashboard/ViewEditCard/ViewEditCard";

const { Header, Content, Footer, Sider } = Layout;

const CompanyDashboardPage = () => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const location = useLocation();
  const navigate = useNavigate();

  const [selectedTab, setSelectedTab] = useState("1");

  const [showEditCard, setShowEditCard] = useState(false); // State to track whether Edit Card should be displayed

  const items = [
    {
      key: "1",
      icon: <ProfileOutlined />,
      label: "Company Details",
      url: "/company-details",
    },
    {
      key: "2",
      icon: <PlusOutlined />,
      label: "Create Card",
      url: "/create-card",
    },
    {
      key: "3",
      icon: <CreditCardOutlined />,
      label: "Cards",
      url: "/cards",
    },
    {
      key: "4",
      icon: <QrcodeOutlined />,
      label: "Cards QRs",
      url: "/cards-qrs",
    },
    {
      key: "5",
      icon: <UserOutlined />,
      label: "Profile",
      url: "/profile",
    },
    {
      key: "6",
      icon: <MdOutlinePassword />,
      label: "Change Password",
      url: "/change-password",
    },
  ];

  const handleMenuClick = (url) => {
    console.log(`/dashboard${url}`);
    navigate(`/dashboard${url}`);
  };

  let showContent = null;

  console.log(location.pathname);
  switch (location.pathname) {
    case "/dashboard/company-details":
      showContent = <ViewCompanyDetails />;
      break;
    case "/dashboard/create-card":
      showContent = <ViewCreateCard />;
      break;
    case "/dashboard/cards":
      showContent = (
        <ViewCards
          showEditCard={showEditCard}
          setShowEditCard={setShowEditCard}
        />
      );
      break;
    case "/dashboard/cards-qrs":
      showContent = <ViewCardsQR />;
      break;
    case "/dashboard/profile":
      showContent = <ViewProfile />;
      break;
    case "/dashboard/change-password":
      showContent = <ViewChangePassword />;
      break;
    default:
      // Redirect to default path if URL path does not match any route
      navigate("/dashboard/company-details");
  }

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
            // defaultSelectedKeys={["1"]}
            // onClick={handleMenuClick}
            style={{ backgroundColor: "aliceblue" }}
            className="mb-2"
          >
            {items.map((item) => (
              <Menu.Item
                key={item.key}
                icon={item.icon}
                style={{ borderRadius: "20px" }}
                className="sider-dashboard-menu-item my-2 fw-bold"
                onClick={() => handleMenuClick(item.url)}
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
              {/* {renderContent()} */}
              {/* {showContent} */}
              <Routes>
                <Route
                  path="/company-details"
                  element={<ViewCompanyDetails />}
                />
                <Route path="/create-card" element={<ViewCreateCard />} />
                <Route
                  path="/cards"
                  element={
                    <ViewCards
                      showEditCard={showEditCard}
                      setShowEditCard={setShowEditCard}
                    />
                  }
                />
                <Route path="/cards-qrs" element={<ViewCardsQR />} />
                <Route path="/profile" element={<ViewProfile />} />
                <Route
                  path="/change-password"
                  element={<ViewChangePassword />}
                />
              </Routes>
            </div>
          </Content>
        </Layout>
      </Layout>
    </div>
  );
};
export default CompanyDashboardPage;
