import { Text, View } from "react-native";
import React, { Component } from "react";

import Styles from "./styles";
import ScreenContainer from "../../Components/ScreenContainer/ScreenContainer";
import AppText from "../../Components/AppText/AppText";
import CountrySelector from "../../Components/CountrySelector/CountrySelector";
import CitySelector from "../../Components/CitySelector/CitySelector";
import BroadcastDonorList from "./BroadcastDonorList";
import { inject, observer } from "mobx-react";
import { BloodGroups } from "../../Utils/Constants/ChipsData";
import ChipGroup from "../../Components/ChipGroup/ChipGroup";
import Spacer from "../../Components/Spacer/Spacer";
import { BLOOD_GROUP } from "../../Utils/Enums";

@inject("userStore")
@observer
export default class BroadcastRequest extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedCountry: "",
      selectedCity: "",
      donorList: "",
      bloodGroup: BLOOD_GROUP.APlus,
    };
  }

  onCountrySelected = (value) => {
    this.setState({ selectedCountry: value, selectedCity: "" });
  };

  onCitySelected = (value) => {
    this.setState({ selectedCity: value });
  };

  onBloodGroupChange = (value) => {
    this.setState({
      bloodGroup: value,
    });
  };

  render() {
    const { selectedCity, selectedCountry, bloodGroup } = this.state;

    return (
      <ScreenContainer>
        <View style={Styles.containerStyle}>
          <AppText
            type="heading"
            style={{ textAlign: "center", width: "100%", marginBottom: 10 }}
          >
            Broadcast Request
          </AppText>

          <CountrySelector onCountryChange={this.onCountrySelected} />

          <CitySelector
            country={selectedCountry}
            onCitySelected={this.onCitySelected}
          />

          <Spacer />

          <AppText>Select blood group</AppText>

          <Spacer />
          <ChipGroup
            scrollEnabled
            data={BloodGroups}
            selectedChips={bloodGroup}
            onSelected={this.onBloodGroupChange}
          />

          {!selectedCity && (
            <View style={Styles.emptyComponentStyle}>
              <AppText>Please select country and city to continue</AppText>
            </View>
          )}

          {!!selectedCity && (
            <BroadcastDonorList
              bloodGroup={bloodGroup}
              country={this.state.selectedCountry}
              city={this.state.selectedCity}
              userStore={this.props.userStore}
            />
          )}
        </View>
      </ScreenContainer>
    );
  }
}
