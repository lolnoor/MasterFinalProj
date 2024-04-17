/** @format */

import React from "react";
import { View, Text, ScrollView } from "react-native";
import R from "../../Utils/R";
import Chip from "../Chip/Chip";
import Styles from "./styles";

/**
 *
 * @param {boolean} scrollEnabled whether chip group is scrollable or not. This options is useful when no of
 *                                 options are big. When it is false, chips are distributed evenly occupying 100% of
 *                                 of the width. When it is true, chips are rendered one after another with minimum
 *                                horizontal gap between them
 *
 * @param {Array} data array of object. Each object is an option and render a chip corresponding to it.
 * @param {func} onSelected callback when any chip is selected.
 * @param {Array} selectedChips array of the selected chips object
 * @param {style} style
 * @param {number} miniumHorizontalGap scrollEnabled is set to true, it specify horizontal gap between two adjacent chips
 */
export default function ChipGroup(props) {
  const {
    scrollEnabled = false,
    data,
    onSelected,
    selectedChips = [],
    style,
    miniumHorizontalGap = 15,
  } = props;

  return (
    <View style={{ width: "100%" }}>
      <ScrollView
        showsHorizontalScrollIndicator={false}
        scrollEnabled={scrollEnabled}
        style={[Styles.containerStyle, style]}
        horizontal={true}
        contentContainerStyle={{
          width: scrollEnabled ? null : "100%",
          justifyContent: "space-between",
          paddingLeft: 5,
        }}
      >
        {data.map((value, index) => {
          const { title } = value;
          const isSelected = selectedChips?.includes(title);

          return (
            <View
              key={value.title}
              style={{ marginLeft: index === 0 ? 0 : miniumHorizontalGap }}
            >
              <Chip
                {...value}
                onSelected={onSelected}
                isSelected={isSelected}
              />
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
}
