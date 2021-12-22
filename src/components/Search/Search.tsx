import React, { useState } from "react";
import { useSelector } from "react-redux";
import { selectUser } from "../../features/userSlice";
import Header from "../Parts/Header";
import ColorButton from "../Parts/Button";
import IconButton from "../Parts/IconButton";
import styled from "styled-components";
import mediaQuery from "styled-media-query";
import { makeStyles, createStyles, Theme } from "@material-ui/core";
import { SearchOutlined, SearchRounded } from "@material-ui/icons";
const mediaMobile = mediaQuery.lessThan("medium");

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    settingIcon: {
      width: "32px",
      height: "42px",
      borderRadius: "100%",
    },
    selected: {
      color: "#50a0d0",
      transitionProperty: "all",
      transitionDuration: "0.3s",
      transitionTimingFunction: "ease",
    },
    unselected: {
      color: "#ccc",
    },
  })
);

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
`;

const Main = styled.main`
  width: 30vw;
  ${mediaMobile`
    width: 100vw
  `};
`;

const Search: React.FC = () => {
  const classes = useStyles();
  return (
    <>
      <Wrapper>
        <Main>
          {/* <Header child="">
            <div style={{ width: "100vw", marginLeft: "20vw", padding: 0 }}>
              <IconButton
                onClick={(e: React.MouseEvent<HTMLElement>) =>
                  console.log("clicked")
                }
                dataTestId="search"
              >
                <SearchRounded className={classes.settingIcon}>
                </SearchRounded>
              </IconButton>
              
            </div>
          </Header> */}
        </Main>
      </Wrapper>
    </>
  );
};
export default Search;
