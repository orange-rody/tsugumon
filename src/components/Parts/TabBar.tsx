import React from "react";
import styled from "styled-components";

const TabWrapper = styled.div`
  position: absolute;
  botom: 0;
  width: 100%;
  height: 49px;
  border-top: hsl(0, 0, 80%);
`;

const Label = styled.label`
  display: flex;
  width: 100%;
  height: 100%;
  flex-flow: row;
  cursor: pointer;
`;

const Tab = styled.span`
  display: block;
  width: 20%;
  height: 100%;
`;

const Icon = styled.p`
  color: hsl(0, 0, 20%);
  transition: all 100ms;
`;

const IconTitle = styled.p`
  width: 100%;
  height: 20px;
  font-size: 12px;
  color: hsl(0, 0, 20%);
  transition: all 100ms;
`;

const Input = styled.input`
  visibility: hidden;
  &:checked + ${Icon} {
    color: #4fc0ad;
  }
  + ${IconTitle} {
    color: #4fc0ad;
  }
`;

type Props = {
  children: JSX.Element;
  title: string;
};

const TabBar = (props: Props) => {
  // const [active, setActive] = useState("home");
  return (
    <TabWrapper>
      <Label>
        <Input type="radio">
          <Tab>
            <Icon>{props.children}</Icon>
            <IconTitle>{props.title}</IconTitle>
          </Tab>
        </Input>
      </Label>
    </TabWrapper>
  );
};

export default TabBar;
