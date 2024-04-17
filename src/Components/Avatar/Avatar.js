/** @format */

import React from "react";
import { View, Text } from "react-native";
import AppText from "../AppText/AppText";
import Styles from "./styles";

/**
 * Component to show user avatar
 *
 * @param {name} name first two charactor will be show in avatar
 * @param {style} style style of the containg view
 * @param {style} textStyle style of the text
 */

export default function Avatar(props) {
  const { name, style, textStyle } = props;
  const initials = name?.substring(0, 2);

  return (
    <View style={[Styles.containerStyle, style]}>
      <AppText style={[Styles.textStyle, textStyle]}>{initials}</AppText>
    </View>
  );
}
