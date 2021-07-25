import React from "react";
import styled from "styled-components";

const Header = styled.div`
  display: flex;
  position: relative;
  width: 100%;
  height: 52px;
  margin: 0 auto;
  background-color: hsl(0, 0%, 100%);
  border-bottom: 1px solid hsla(26, 100%, 12%, 0.2);
  box-sizing: border-box;
`;

const Title = styled.h2`
  width: 100%;
  height: 52px;
  margin: 0 auto;
  font-size: 18px;
  line-height: 52px;
  text-align: center;
  color: hsl(0, 0%, 10%);
  font-weight: bold;
  letter-spacing: 2px;
`;

type Props = {
  child: string;
  children: JSX.Element;
};

const HeaderA = (props: Props) => {
  return (
    <Header data-testid="header">
      <div>
        {props.children}
      </div>
      <Title data-testid="title">{props.child}</Title>
    </Header>
  );
};

export default HeaderA;
