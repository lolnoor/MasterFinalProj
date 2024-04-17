/** @format */

import { StyleSheet } from "react-native";
import R from "../../Utils/R";

const styles = StyleSheet.create({
  containerStyle: {
    flexDirection: "row",
    alignItems: "center",
  },

  normalTextStyle: {
    fontSize: 16,
    letterSpacing: 0.5,
    color: R.Colors.TextColor,
  },

  small: {
    fontSize: 14,
    color: R.Colors.TextColor,
  },

  lable: {
    fontSize: 14,
    color: "#555555",
  },

  errorLabel: {
    fontSize: 10,
    color: "red",
  },

  heading: {
    fontSize: 24,
    fontWeight: "bold",
    color: R.Colors.TextColor,
  },

  mandatorySign: {
    color: "red",
    fontSize: 16,
    height: 16,
  },

  iconStyle: {
    width: 16,
    height: 16,
    marginRight: 5,
  },
});

export default styles;
