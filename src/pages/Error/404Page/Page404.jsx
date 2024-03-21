import React from "react";
import { Container, Image } from "react-bootstrap";
import "./Page404.css";
import AppPageNotFoundImage from "../../../assets/images/static/app_page_not_found.png";
import AppLogoLight from "../../../assets/images/static/app_logo_light.png";
import { Button } from "antd";
import { NavLink } from "react-router-dom";

function Page404() {
  return (
    <>
      <div className="Page404_Container">
        <Image src={AppLogoLight} width={150} className="m-2" />
        <Container fluid className="contentCenter">
          <div className="py-5">
            <h2 className="text-white fw-bold text-center p-2">
              Page Not Found
            </h2>
            <center>
              <Image
                src={AppPageNotFoundImage}
                className="Page404_PNF_logo p-2"
              />
              <h4 className="text-white text-center p-2">
                Well... This is Awkward...
              </h4>
              <NavLink to={"/"}>
                <Button
                  shape="round"
                  htmlType="submit"
                  className="btn-login m-2"
                >
                  Back to Home
                </Button>
              </NavLink>
            </center>
          </div>
        </Container>
      </div>
    </>
  );
}

export default Page404;
