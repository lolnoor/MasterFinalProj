/** @format */

import React from "react";
import { View, Text, Image } from "react-native";
import R from "../../Utils/R";
import AppText from "../AppText/AppText";

/**
 * Component to show when a Flatlist is empty.
 * @param {string} label Text to show
 * @param {boolean} loading when loading = true and data is empty array, don't show this component.
 *                            Empty state is viible only after loading is done
 */
export default function EmptyListComponent({ label, loading }) {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {!loading && (
        <>
          <Image
            source={R.Images.EMPTY_COMPONENT}
            style={{ width: 100, height: 100, resizeMode: "contain" }}
          />
          <AppText style={{ marginTop: 20 }}>
            {label ?? "No record found"}
          </AppText>
        </>
      )}
    </View>
  );
}
