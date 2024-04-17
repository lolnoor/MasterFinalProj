/** @format */

import React, { Component } from "react";
import { Image, Text, TouchableOpacity, View, Slider } from "react-native";
import {
  BloodGroups,
  GenderData,
  SortByData,
  SortByDonors,
  SortTypeData,
} from "../../Utils/Constants/ChipsData";
import R from "../../Utils/R";
import lodash from "lodash";
import AppText from "../AppText/AppText";
import ChipGroup from "../ChipGroup/ChipGroup";
import Styles from "./styles";
import AppTextInput from "../AppTextInput/AppTextInput";

const MinimumAge = 18;
const MaxiumAge = MinimumAge + 50;

/**
 * Filter component which incapsulate basic filtering options for the donor
 *
 */
export default class DonorFilter extends Component {
  constructor(props) {
    super(props);

    this.state = {
      expandFilter: false,
      age: 21,
      gender: [],
      bloodGroup: [],
      searchText: "",
      sortBy: "",
      sortType: "",
    };
  }

  // When filter visiblity is toggle, run the animation
  toggleFilter = () => {
    const { expandFilter } = this.state;
    R.HelperFunctions.runAnimation();
    this.setState({ expandFilter: !expandFilter });
  };

  // Update the filter.
  updateFilters = () => {
    const { onUpdateFilters } = this.props;

    // debouncing the event so that there is a little delay between selection change and state update,
    // will prevent updating the ui too frequently
    const debounceFunction = lodash.debounce(() => {
      onUpdateFilters?.(this.state);
    }, 500);
    debounceFunction();
  };

  onAgeChange = (value) => {
    this.setState({ age: Math.round(value) });
    this.updateFilters();
  };

  onGenderChange = (gender) => {
    const { gender: selectedGender } = this.state;

    let newGenders = [];

    if (selectedGender.includes(gender)) {
      newGenders = selectedGender.filter((gen) => gen !== gender);
    } else {
      // ... => spread operator
      newGenders = [...selectedGender, gender];
    }

    this.setState({ gender: newGenders });
    this.updateFilters();
  };

  onBloodGroupChange = (bloodGroup) => {
    const { bloodGroup: selectedBloodGroup } = this.state;

    let newBloodGroup = [];

    if (selectedBloodGroup.includes(bloodGroup)) {
      newBloodGroup = selectedBloodGroup.filter((value) => {
        return value !== bloodGroup;
      });
    } else {
      newBloodGroup = [...selectedBloodGroup, bloodGroup];
    }

    this.setState({ bloodGroup: newBloodGroup });
    this.updateFilters();
  };

  onSortbyChange = (title) => {
    const { sortBy } = this.state;

    if (title === sortBy) {
      this.setState({ sortBy: "" });
      this.updateFilters();
    } else {
      this.setState({ sortBy: title });
      this.updateFilters();
    }
  };

  onSortTypeChange = (title) => {
    const { sortType } = this.state;

    if (title === sortType) {
      this.setState({ sortType: "" });
      this.updateFilters();
    } else {
      this.setState({ sortType: title });
      this.updateFilters();
    }
  };

  onSearchTextChange = (text) => {
    this.setState({ searchText: text });
    this.updateFilters();
  };

  render() {
    const {
      expandFilter,
      age,
      gender,
      bloodGroup,
      sortBy,
      sortType,
      searchText,
    } = this.state;

    return (
      <View style={Styles.containerStyle}>
        <TouchableOpacity
          style={Styles.filterHeaderStyle}
          onPress={this.toggleFilter}
        >
          <AppText>Apply Filters</AppText>
          <Image source={R.Images.FILTERS} style={{ width: 16, height: 16 }} />
        </TouchableOpacity>

        {expandFilter && (
          <View>
            <AppText style={{ marginTop: 4, marginBottom: 10 }}>Age</AppText>
            <Slider
              value={age}
              maximumValue={MaxiumAge}
              minimumValue={MinimumAge}
              onValueChange={this.onAgeChange}
            />

            <View
              style={{ flexDirection: "row", justifyContent: "space-between" }}
            >
              <AppText>{MinimumAge}</AppText>
              <AppText>Age: {age}</AppText>
              <AppText>{MaxiumAge}</AppText>
            </View>

            <AppText style={{ marginTop: 4, marginBottom: 10 }}>Gender</AppText>
            <ChipGroup
              data={GenderData}
              selectedChips={gender}
              onSelected={this.onGenderChange}
            />

            <AppText style={{ marginTop: 4, marginBottom: 10 }}>
              Blood Group
            </AppText>
            <ChipGroup
              scrollEnabled
              data={BloodGroups}
              selectedChips={bloodGroup}
              onSelected={this.onBloodGroupChange}
            />

            <AppText style={{ marginTop: 4, marginBottom: 10 }}>
              Sort by
            </AppText>
            <ChipGroup
              scrollEnabled
              data={SortByDonors}
              selectedChips={sortBy}
              onSelected={this.onSortbyChange}
            />

            <AppText style={{ marginTop: 4, marginBottom: 10 }}>
              Sort Type
            </AppText>
            <ChipGroup
              scrollEnabled
              data={SortTypeData}
              selectedChips={sortType}
              onSelected={this.onSortTypeChange}
            />

            <AppText style={{ marginTop: 4, marginBottom: 10 }}>Search</AppText>
            <AppTextInput
              placeholder="Search by name"
              onChangeText={this.onSearchTextChange}
              value={searchText}
            />
          </View>
        )}
      </View>
    );
  }
}
