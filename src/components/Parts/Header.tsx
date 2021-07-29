import React from "react";
import styled from "styled-components";

const Wrapper = styled.div`
  display: flex;
  width: 100%;
  height: 52px;
  margin: 0 auto;
  background-color: hsl(0, 0%, 100%);
  box-sizing: border-box;
  border-bottom: 1px solid hsla(26, 100%, 12%, 0.2);
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

const Header = (props: Props) => {
  return (
    <Wrapper data-testid="header">
      <div>{props.children}</div>
      <Title data-testid="title">{props.child}</Title>
    </Wrapper>
  );
};

export default Header;
