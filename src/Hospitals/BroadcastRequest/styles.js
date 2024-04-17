import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  containerStyle: {
    flex: 1,
    paddingHorizontal: 10,
  },

  filterContainer: {
    zIndex: 100,
    flexDirection: "row",
  },

  countryDropDown: {
    zIndex: 100,
    marginRight: 4,
  },

  cityDropdownStyle: {
    zIndex: 99,
    marginLeft: 4,
  },

  emptyComponentStyle: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    alignContent: "center",
  },
});

export default styles;
