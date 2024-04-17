/** @format */

import React, { Component } from "react";
import { Alert, Keyboard, Text, TextInput, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scrollview";
import firebase from "firebase";
import AppButton from "../../../Components/AppButton/AppButton";
import AppText from "../../../Components/AppText/AppText";
import AppTextInput from "../../../Components/AppTextInput/AppTextInput";
import ChipGroup from "../../../Components/ChipGroup/ChipGroup";
import { DATABASE_NODES, GENDER } from "../../../Utils/Enums";
import { IsNonEmptyString } from "../../../Utils/HelperFunctions";
import R from "../../../Utils/R";
import Styles from "./styles";
import DateTimePicker from "react-native-modal-datetime-picker";
import DropDownPickerWrapper from "../../../Components/DropDownPickerWrapper/DropDownPickerWrapper";
import Spacer from "../../../Components/Spacer/Spacer";
import { fetchCities, fetchCountries } from "../../../Utils/API";
import CountrySelector from "../../../Components/CountrySelector/CountrySelector";
import CitySelector from "../../../Components/CitySelector/CitySelector";

export default class DonorInfo extends Component {
  constructor(props) {
    super(props);

    this.state = {
      name: "",
      phoneNumber: "",
      bloodGroup: "",
      gender: "",
      loading: false,
      dobPicker: false,
      dob: "",
      selectedCountry: "",
      selectedCity: "",
    };
  }

  onNameChange = (text) => {
    this.setState({ name: text });
  };

  onContactChange = (text) => {
    this.setState({ phoneNumber: text });
  };

  onBloodGroupChange = (group) => {
    this.setState({ bloodGroup: group });
  };

  onRhChange = (rh) => {
    this.setState({ rh });
  };

  onGenderChange = (gender) => {
    this.setState({ gender });
  };

  showDOBPicker = () => {
    this.setState({ dobPicker: true });
    Keyboard.dismiss();
  };

  hideDOBPicker = () => {
    this.setState({ dobPicker: false });
  };

  validate = () => {
    const {
      name,
      phoneNumber,
      bloodGroup,
      gender,
      dob,
      selectedCountry,
      selectedCity,
    } = this.state;

    if (!IsNonEmptyString(name)) {
      alert("Enter name");
      return;
    }

    if (!IsNonEmptyString(phoneNumber)) {
      alert("Enter Contact Number");
      return;
    }

    if (!IsNonEmptyString(dob)) {
      alert("Select age");
      return;
    }

    if (!IsNonEmptyString(bloodGroup)) {
      alert("Select Blood Group");
      return;
    }

    if (!IsNonEmptyString(gender)) {
      alert("Select Gender");
      return;
    }

    if (!IsNonEmptyString(selectedCountry)) {
      alert("Select Country");
      return;
    }

    if (!IsNonEmptyString(selectedCity)) {
      alert("Select City");
      return;
    }

    this.saveDataInDatabase();
  };

  onDobChange = (date) => {
    this.setState({
      dob: date.toISOString().substring(0, 10),
      dobPicker: false,
    });
  };

  saveDataInDatabase = () => {
    const { userId, onProfileCompleted } = this.props;
    const {
      name,
      city,
      phoneNumber,
      bloodGroup,
      gender,
      dob,
      selectedCountry,
      selectedCity,
    } = this.state;

    this.setState({ loading: true });

    firebase
      .database()
      .ref(`${DATABASE_NODES.DONORS}/${userId}`)
      .update({
        name,
        phoneNumber,
        city,
        bloodGroup,
        gender,
        onboardingStep: 2,
        dob,
        city: selectedCity,
        country: selectedCountry,
      })
      .finally(() => {
        this.setState({ loading: false });
        onProfileCompleted?.();
      });
  };

  onCountrySelect = (value) => {
    this.setState({ selectedCountry: value });
  };

  onCitySelected = (value) => {
    this.setState({ selectedCity: value });
  };

  render() {
    const {
      name,
      city,
      phoneNumber,
      bloodGroup,
      gender,
      loading,
      dobPicker,
      dob,
    } = this.state;

    return (
      <View style={Styles.containerStyle}>
        <KeyboardAwareScrollView
          contentContainerStyle={Styles.contentContainerStyle}
        >
          <AppTextInput
            value={name}
            onChangeText={this.onNameChange}
            placeholder="Enter Name"
            isNonEmpty
            style={Styles.textInputStyle}
          />

          <AppTextInput
            value={phoneNumber}
            onChangeText={this.onContactChange}
            placeholder="Contact Number"
            keyboardType="phone-pad"
            isNonEmpty
            style={Styles.textInputStyle}
          />

          <CountrySelector onCountryChange={this.onCountrySelect} />

          <Spacer space={12} />

          <CitySelector
            country={this.state.selectedCountry}
            onCitySelected={this.onCitySelected}
          />

          <Spacer />

          <AppTextInput
            placeholder="Date of birth"
            style={Styles.textInputStyle}
            value={dob}
            onFocus={this.showDOBPicker}
            hideErrorLabel
          />

          <DateTimePicker
            isVisible={dobPicker}
            mode="date"
            onConfirm={this.onDobChange}
            onCancel={this.hideDOBPicker}
          />

          <AppText style={Styles.textInputStyle} type="label">
            Blood Group
          </AppText>

          <ChipGroup
            style={{ marginTop: 4 }}
            onSelected={this.onBloodGroupChange}
            selectedChips={[bloodGroup]}
            scrollEnabled
            horizontal
            data={R.ChipsData.BloodGroups}
            miniumHorizontalGap={15}
          />

          <AppText style={{ marginTop: 20 }} type="label">
            Select Gender
          </AppText>

          <ChipGroup
            style={{ marginTop: 4 }}
            horizontal
            scrollEnabled={false}
            miniumHorizontalGap={0}
            data={R.ChipsData.GenderData}
            onSelected={this.onGenderChange}
            selectedChips={[gender]}
          />

          <AppButton
            style={Styles.buttonStyle}
            title="Save"
            onPress={this.validate}
            isLoading={loading}
          />
        </KeyboardAwareScrollView>
      </View>
    );
  }
}
