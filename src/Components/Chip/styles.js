/** @format */

import { StyleSheet } from "react-native";
import R from "../../Utils/R";

const { CHIP_HEIGHT } = R.Constants;

const styles = StyleSheet.create({
  shadowContainer: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
  },

  containerStyle: {
    height: CHIP_HEIGHT,
    borderRadius: 5,
    minWidth: 30,
    justifyContent: "center",
    flexDirection: "row",
    alignItems: "center",
    overflow: "hidden",
  },

  contentContainerStyle: {
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: 5,
    paddingRight: 15,
  },

  selectedBackgroundContainerStyle: {
    backgroundColor: R.Colors.SelectedGreen,
    position: "absolute",
    height: 34,
    width: "100%",
  },

  unselectedBackgroundContainerStyle: {
    backgroundColor: "white",
    position: "absolute",
    width: "100%",
    height: "100%",
  },

  logoStyle: {
    width: 20,
    height: 20,
    borderRadius: 9,
    resizeMode: "contain",
    marginRight: -5,
  },

  titleStyle: {
    fontSize: 16,
    marginLeft: 10,
    textTransform: "capitalize",
  },
});

export default styles;
