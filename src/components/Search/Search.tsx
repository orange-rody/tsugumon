import React, { useState } from "react";
import Header from "../Parts/Header";
import Button from "../Parts/Button";
import IconButton from "../Parts/IconButton";
import styled from "styled-components";
import mediaQuery from "styled-media-query";
import { makeStyles, createStyles, Theme } from "@material-ui/core";
import { SearchRounded, Close } from "@material-ui/icons";
const mediaMobile = mediaQuery.lessThan("medium");

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    icon: {
      left: "5px",
      width: "30px",
      height: "51px",
      marginRight: "10%"
    },
    innerIcon: {
      position: "absolute",
      width: "30px",
      height: "30px",
      left: "3%",
      top: "55%",
      transform: "translateY(-50%)",
      color: "#aaa",
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
  width: 80%;
  height: 34px;
  margin: 8px;
  padding-left: 2rem;
  border-radius: 20px;
  border: none;
`;

const Search: React.FC = () => {
  const [searchInput, setSearchInput] = useState(false);
  const classes = useStyles();
  return (
    <>
      <Wrapper>
        <Main>
          <Header
            style={
              searchInput
                ? {
                    display: "flex",
                    zIndex: 3,
                    backgroundColor: "#ccc",
                    transition: "all 0.5s",
                  }
                : { display: "flex", zIndex: 3 }
            }
          >
            {searchInput ? (
              <>
                <Input type="text" placeholder="キーワードを入力" />
                <SearchRounded className={classes.innerIcon} />
                <IconButton
                  onClick={() => {
                    setSearchInput(false);
                  }}
                  dataTestId="cancel"
                  style={{margin: "0 auto"}}
                >
                  <Close className={classes.icon}/>
                </IconButton>
              </>
            ) : (
              <IconButton
                onClick={() => {
                  setSearchInput(true);
                }}
                dataTestId="searching"
                style={{
                  width: "100%",
                  height: "51px",
                  margin: "0 auto",
                  fontSize: "1rem",
                  fontWeight: "bold",
                }}
              >
                <div
                  style={{ display: "flex", width: "40%", margin: "0 auto" }}
                >
                  <SearchRounded className={classes.icon} />
                  <p
                    style={{
                      margin: 0,
                      lineHeight: "51px",
                      letterSpacing: "2px",
                    }}
                  >
                    検索する
                  </p>
                </div>
              </IconButton>
            )}
          </Header>
        </Main>
      </Wrapper>
    </>
  );
};
export default Search;
