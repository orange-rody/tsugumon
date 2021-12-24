import React from "react";
import styled from "styled-components";

const IconWrapper = styled.div`
  display: block;
  width: 42px;
  height: 42px;
  margin: 5px;
  text-align: center;
  color: #555;
  transition: all 0.3s ease-out;
  &:active {
    color: #ccc;
  }
`;

type Props = {
  children: React.ReactNode;
  onClick: (e: React.MouseEvent<HTMLElement>) => void;
  dataTestId: string;
  style?: React.CSSProperties | undefined;
};

const IconButton = (props: Props) => {
  return (
    <IconWrapper
      onClick={props.onClick}
      data-testid={props.dataTestId}
      style={props.style}
    >
      {props.children}
    </IconWrapper>
  );
};

export default IconButton;
