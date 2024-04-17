/** @format */

import React, { Component } from "react";
import { Text, View, TouchableOpacity, ActivityIndicator } from "react-native";
import Styles from "./styles";
import AppText from "../AppText/AppText";

/**
 * Common button for the whole app. It also includes loading indicator for the
 * saving actions.
 *
 * @param {boolean} isSecondary:- Apply style for secondary button, with a outline and a border
 * @param {text} title :- Text to be displayed on the button
 * @param {function} onPress :- callback when button is pressed
 * @param {boolean} isLoading :- when button is loading, show indicator
 */
export default class AppButton extends Component {
  render() {
    const {
      isSecondary = false,
      title,
      onPress,
      style,
      textStyle,
      isLoading = false,
    } = this.props;

    const primaryStyle = isSecondary
      ? Styles.secondaryStyle
      : Styles.primaryStyle;

    return (
      <TouchableOpacity
        onPress={onPress}
        style={[Styles.containerStyle, primaryStyle, style]}
      >
        <ActivityIndicator
          hidesWhenStopped
          style={Styles.loaderStyle}
          color={"white"}
          animating={isLoading}
        />

        <AppText style={textStyle}>{title}</AppText>
      </TouchableOpacity>
    );
  }
}
