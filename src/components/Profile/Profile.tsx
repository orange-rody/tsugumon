import React, { useState } from "react";
import { useSelector } from "react-redux";
import { selectUser } from "../../features/userSlice";
import { storage, db } from "../../firebase";
import firebase from "firebase/app";
import Header from "../Parts/Header";
import ArrowBackButton from "../Parts/ArrowBackButton";
import DefaultButton from "../Parts/DefaultButton";
import SecondaryButton from "../Parts/SecondaryButton";
import styled from "styled-components";

import {
  makeStyles,
  createStyles,
  Theme,
  Slide,
  IconBUtton,
} from "@material-ui/core";
import mediaQuery from "styled-media-query";

const mediaMobile = mediaQuery.lessThan("medium");

const Profile = () => {
  return <div></div>;
};

export default Profile;
