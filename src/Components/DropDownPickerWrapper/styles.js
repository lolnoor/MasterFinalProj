import { StyleSheet } from "react-native";
import R from "../../Utils/R";

const styles = StyleSheet.create({
  style: {
    backgroundColor: "transparent",
    borderColor: R.Colors.PrimaryDark,
  },
  dropDownStyle: {
    backgroundColor: "white",
  },
  containerStyle: {
    height: 40,
    marginTop: 5,
  },
  activeItemStyle: {
    alignItems: "center",
  },
  activeLabelStyle: {
    color: "blue",
  },
  labelStyle: {
    fontSize: 14,
    color: "black",
  },

  emptyListStyle: {
    marginTop: 5,
    borderColor: R.Colors.PrimaryDark,
    borderRadius: 4,
    borderWidth: 1,
    paddingVertical: 10,
    paddingHorizontal: 10,
    flexDirection: "row",
  },
});

export default styles;
