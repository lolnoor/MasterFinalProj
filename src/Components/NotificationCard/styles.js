/** @format */

import { StyleSheet } from "react-native";
import R from "../../Utils/R";

const styles = StyleSheet.create({
  containerStyle: {
    backgroundColor: R.Colors.PrimaryColor,
    borderRadius: 10,
    borderWidth: 1.5,
    overflow: "hidden",
  },

  statusTextContainerStyle: {
    right: 0,
    top: -3,
    paddingBottom: 3,
    position: "absolute",
    zIndex: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,

    elevation: 6,
  },

  statusTextStyle: {
    paddingHorizontal: 10,
    textTransform: "capitalize",
  },

  messageContainerStyle: {
    backgroundColor: "#cfcfcf",
    paddingBottom: 10,
    padding: 10,
  },
});

export default styles;
