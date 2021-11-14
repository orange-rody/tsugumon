import React, { useEffect } from "react";
import useStorage from "../../hooks/useStorage";
import styled from "styled-components";

const Bar = styled.div`
height: 5px;
background-color: "#50a0d0";
margin-top: 20px;
`;

type Props = {
  filename: string;
  setFilename: any;
  data: string;
  setData: any;
  caption: string;
  setCaption: any;
  setPreview: any;
};
const ProgressBar = ({
  filename,
  setFilename,
  data,
  setData,
  caption,
  setCaption,
  setPreview,
}: Props) => {
  const { url, progress } = useStorage(filename, data, caption);
  useEffect(() => {
    if (url) {
      setFilename("");
      setData("");
      setCaption("");
      setPreview(false);
    }
  },[url,setFilename]);
  return <Bar style={{width: progress + "%"}} />
};

export default ProgressBar;