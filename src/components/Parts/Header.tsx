import React from "react";
import styled from "styled-components";
import mediaQuery from "styled-media-query";

const mediaMobile = mediaQuery.lessThan("medium");

const Wrapper = styled.div`
  display: flex;
  position: fixed;
  width: 30vw;
  ${mediaMobile`
width: 100vw`};
  height: 52px;
  margin: 0 auto;
  background-color: hsl(0, 0%, 100%);
  box-sizing: border-box;
  border-bottom: 1px solid hsla(26, 100%, 12%, 0.2);
`;

type Props = {
  children: React.ReactNode;
  style?: React.CSSProperties | undefined;
};

const Header = (props: Props) => {
  return (
    <>
      <Wrapper data-testid="header" style={props.style}>
        {props.children}
      </Wrapper>
    </>
  );
};

export default Header;
