import { StyleSheet } from "react-native";
import R from "../../Utils/R";

const styles = StyleSheet.create({
  containerStyle: {
    backgroundColor: R.Colors.PrimaryColor,
    borderRadius: 10,
    borderWidth: 1.5,
    overflow: "hidden",
    borderColor: R.Colors.PrimaryDark,
    padding: 8,
    paddingVertical: 10,
  },

  statusContainer: {
    position: "absolute",
    right: 0,
    padding: 2,
    paddingHorizontal: 10,
    top: 0,
    backgroundColor: R.Colors.PrimaryDark,
  },

  bloodGroupContainer: {
    height: 40,
    position: "absolute",
    right: 10,
    top: 25,
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

  statusText: {
    color: "#333",
    fontSize: 16,
  },
});

export default styles;
