/** @format */

import React from "react";
import { View, Text } from "react-native";
import AppText from "../AppText/AppText";
import Styles from "./styles";

/**
 * Holds the basic information about the card.
 * @param {*} param0
 */
export default function HospitalDetailsCard({ hospitalInfo }) {
  console.log("hospital info", hospitalInfo);

  const { name, phoneNumber, emailId } = hospitalInfo;

  return (
    <View style={Styles.containerStyle}>
      <AppText>Name: {name ?? "No name"}</AppText>
      <AppText>Phone No: {phoneNumber}</AppText>
      <AppText>Email Id: {emailId}</AppText>

      <AppText></AppText>
    </View>
  );
}
