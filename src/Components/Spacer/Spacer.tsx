import { View, Text } from "react-native";
import React from "react";

export default function Spacer({ space }) {
  return <View style={{ marginTop: space ?? 8, marginLeft: space ?? 8 }} />;
}
