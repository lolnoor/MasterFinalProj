import { StyleSheet } from "react-native";
import R from "../Utils/R";

const styles = StyleSheet.create({
  containerStyle: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  logoStyle: {
    width: 200,
    height: 200,
  },

  donateBloodTextStyle: {
    fontSize: 24,
    color: "#3D550C",
    fontWeight: "900",
  },

  requestBloodTextStyle: {
    fontSize: 24,
    color: R.Colors.PrimaryColor,
    marginTop: 10,
    fontWeight: "900",
  },
});

export default styles;
