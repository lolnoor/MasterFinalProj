/** @format */

import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import {
  BloodGroups,
  GenderData,
  RequestTypeData,
  SortByData,
  SortTypeData,
} from "../../Utils/Constants/ChipsData";
import { GENDER } from "../../Utils/Enums";
import { runAnimation } from "../../Utils/HelperFunctions";
import { Gender } from "../../Utils/Images";
import R from "../../Utils/R";
import AppText from "../AppText/AppText";
import AppTextInput from "../AppTextInput/AppTextInput";
import ChipGroup from "../ChipGroup/ChipGroup";
import Styles from "./styles";

export default class HospitalFilter extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      filterVisible: false,
    };
  }

  toggleFilterVisibility = () => {
    const { filterVisible } = this.state;
    runAnimation();
    this.setState({ filterVisible: !filterVisible });
  };

  updateFilter = (type, value) => {
    this.props.onFilterUpdate?.({ ...this.props.filters, [type]: value });
  };

  render() {
    const { filterVisible } = this.state;
    const { filters } = this.props;

    return (
      <View style={Styles.containerStyle}>
        <TouchableOpacity
          onPress={this.toggleFilterVisibility}
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <AppText>Apply Filters</AppText>
          <Image source={R.Images.FILTERS} style={{ width: 16, height: 16 }} />
        </TouchableOpacity>

        {filterVisible && (
          <View style={{ marginTop: 10 }}>
            <AppText style={{ marginBottom: 4, marginLeft: 5 }}>
              Request Type
            </AppText>
            <ChipGroup
              scrollEnabled={true}
              data={RequestTypeData}
              selectedChips={filters.requestType}
              onSelected={(title) => {
                this.updateFilter("requestType", title);
              }}
            />

            <AppText style={{ marginBottom: 4, marginLeft: 5 }}>
              Blood Group
            </AppText>
            <ChipGroup
              scrollEnabled={true}
              data={BloodGroups}
              selectedChips={filters.bloodGroup}
              onSelected={(title) => {
                this.updateFilter("bloodGroup", title);
              }}
            />

            <AppText style={{ marginBottom: 4, marginLeft: 5 }}>
              Sort By
            </AppText>
            <ChipGroup
              scrollEnabled={true}
              data={SortByData}
              selectedChips={filters.sortBy}
              onSelected={(title) => {
                this.updateFilter("sortBy", title);
              }}
            />

            <AppText style={{ marginBottom: 4, marginLeft: 5 }}>
              Sort Type
            </AppText>
            <ChipGroup
              scrollEnabled={true}
              data={SortTypeData}
              selectedChips={filters.sortType}
              onSelected={(title) => {
                this.updateFilter("sortType", title);
              }}
            />

            <AppText style={{ marginBottom: 4, marginLeft: 5 }}>Search</AppText>
            <AppTextInput
              placeholder="Search by name"
              value={filters.searchText}
              onChangeText={(text) => {
                this.updateFilter("searchText", text);
              }}
            />
          </View>
        )}
      </View>
    );
  }
}
