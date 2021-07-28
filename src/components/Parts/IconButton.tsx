import React from "react";
import styled from "styled-components";

const IconWrapper = styled.div`
  display: block;
  position: absolute;
  width: 42px;
  height: 42px;
  top: 5px;
  left: 5px;
  text-align: center;
  padding: 0;
  color: #555;
  background-color: #fff;
  border: none;
  transition: all 0.3s ease-out;
  &:active {
    color: #ccc;
  }
`;

type Props = {
  children: JSX.Element;
  onClick: (e: React.MouseEvent<HTMLElement>) => void;
  dataTestId: string;
};

const IconButton = (props: Props) => {
  return (
    <IconWrapper
      onClick={props.onClick}
      data-testid={props.dataTestId}
    >
      {props.children}
    </IconWrapper>
  );
};

export default IconButton;
