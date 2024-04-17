/** @format */

import React from "react";
import { View, TouchableOpacity } from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import AppText from "../AppText/AppText";
import Styles from "./styles";

/**
 * Wrapper for the DropDownPicker from react-native-dropdown-picker library.
 * Applies common styles
 */

export default function DropDownPickerWrapper(props) {
  const {
    emptyLabel,
    options = [],
    onChangeItem,
    loading,
    onClickToLoad,
    placeholder,
    zIndex,
    disabled,
    ...rest
  } = props;

  if (loading || options?.length === 0) {
    return (
      <TouchableOpacity
        disabled={disabled}
        style={Styles.emptyListStyle}
        onPress={onClickToLoad}
      >
        <AppText style={{ color: "black" }}>{`${
          loading ? "Loading" : emptyLabel ?? "Click to select"
        }`}</AppText>
      </TouchableOpacity>
    );
  }

  return (
    <View
      style={{
        ...(Platform.OS !== "android" && {
          zIndex: zIndex,
        }),
      }}
    >
      <DropDownPicker
        {...rest}
        disabled={disabled}
        items={options}
        placeholder={placeholder ?? "Select an option?"}
        defaultIndex={0}
        onChangeItem={onChangeItem}
        dropDownStyle={Styles.dropDownStyle}
        containerStyle={Styles.containerStyle}
        activeItemStyle={Styles.activeItemStyle}
        activeLabelStyle={Styles.activeLabelStyle}
        labelStyle={Styles.labelStyle}
        style={Styles.style}
      />
    </View>
  );
}
