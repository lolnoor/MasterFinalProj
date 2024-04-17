/** @format */

import React from "react";
import { View, Text, Image } from "react-native";
import Styles from "./styles";

/**
 * Common Text component wrapper.
 *
 * @param {string} type:- Applies common style based on type, different styles are:-
 *                        normal, small,  errorLabel, heading, label
 *  @param {boolean} isMandatory :- When true, it will show a astrik next to text to indicate the field is mandatory
 * @param  {object} containerStyle :- Style of the container
 * @param {icon} leftIcon :- Icon path to show on the left of the text
 * @param {object} leftIconStyle :- style of the leftIcon
 */

/**
 * Different Text Type:
 *
 * 1. normal
 * 2. small
 * 3. errorLabel
 * 4. heading
 * 5. label
 */

function getStyleFromType(type) {
  switch (type) {
    case "normal":
      return Styles.normalTextStyle;

    case "small":
      return Styles.small;

    case "errorLabel":
      return Styles.errorLabel;

    case "heading":
      return Styles.heading;

    case "label":
      return Styles.lable;

    default:
      return Styles.normalTextStyle;
  }
}

export default function AppText(props) {
  const {
    type,
    style,
    isMandatory,
    containerStyle,
    leftIcon,
    leftIconStyle,
    ...rest
  } = props;

  let textStyle = getStyleFromType(type);

  return (
    <View style={[Styles.containerStyle, containerStyle]}>
      {leftIcon && (
        <Image style={[Styles.iconStyle, leftIconStyle]} source={leftIcon} />
      )}

      <Text style={[textStyle, style]} {...rest}>
        {props.children}
        {isMandatory && <Text style={Styles.mandatorySign}>*</Text>}
      </Text>
    </View>
  );
}
