import React from "react";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faQuestionCircle } from "@fortawesome/pro-light-svg-icons";
import logo from "../assets/logo.png";
// import { Color } from "../theme";

const HeaderWrapper = styled.div`
  display: flex;
  width: 100%;
  height: 76px;
  background-color: #fff;
  justify-content: space-between;
  align-items: center;
  padding: 0 12px;
  svg + svg {
    margin-left: 12px;
  }
`;

const Logo = styled.img`
  height: 44px;
  width: 140px;
`;

const Header = () => {
  return (
    <HeaderWrapper>
      <Logo src={logo} alt="Oregon State University" />
      <div>
        <FontAwesomeIcon icon={faSearch} size="2x" color="#777" />
        <FontAwesomeIcon icon={faQuestionCircle} size="2x" color="#777" />
      </div>
    </HeaderWrapper>
  );
};

export default Header;
