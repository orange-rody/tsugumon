import React, { useState } from "react";
import Header from "../Parts/Header";
import Button from "../Parts/Button";
import IconButton from "../Parts/IconButton";
import styled from "styled-components";
import mediaQuery from "styled-media-query";
import { makeStyles, createStyles, Theme} from "@material-ui/core";
import { SearchRounded } from "@material-ui/icons";
const mediaMobile = mediaQuery.lessThan("medium");

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    searchIcon: {
      left: "5px",
      width: "30px",
      height: "42px",
      marginLeft: "35%",
      marginRight: "3%",
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

const Input = styled.input`
 width: 70%;
 height: 35px;
 margin:3px;
 border-radius: 5%;
 border: 1px solid  #555;
`;

const Search: React.FC = () => {
  const [searchInput, setSearchInput] = useState(false);
  const classes = useStyles();
  return (
    <>
      <Wrapper>
        <Main>
          <Header style={{ display: "flex", zIndex: 3 }}>
            {searchInput ? (
              <Input type="text" />
            ) : (
              <IconButton
                onClick={() => {
                  setSearchInput(true);
                }}
                dataTestId="searching"
                style={{
                  display: "flex",
                  width: "80%",
                  lineHeight: "100%",
                  fontSize: "1rem",
                  fontWeight: "bold",
                  textAlign: "center",
                }}
              >
                <SearchRounded className={classes.searchIcon} />
                <p
                  style={{
                    margin: 0,
                    lineHeight: "42px",
                    letterSpacing: "2px",
                  }}
                >
                  検索する
                </p>
              </IconButton>
            )}
          </Header>
        </Main>
      </Wrapper>
    </>
  );
};
export default Search;
