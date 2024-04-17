/** @format */

import { StyleSheet } from "react-native";
import R from "../../Utils/R";

const styles = StyleSheet.create({
  containerStyle: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,

    backgroundColor: R.Colors.PrimaryColor,
    padding: 10,
    flexDirection: "row",
    flex: 1,
    overflow: "hidden",
  },

  bloodGroupContainer: {
    height: 40,
    justifyContent: "center",
    alignSelf: "center",
    alignItems: "center",
    backgroundColor: "#FFFAFAfa",
    padding: 10,
    borderRadius: 10,
    shadowColor: "#000",
    shadowColor: "#000",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    minWidth: 44,
    elevation: 8,
  },

  bloodGroupTextStyle: {
    fontSize: 16,
    color: "#333",
  },
});

export default styles;
