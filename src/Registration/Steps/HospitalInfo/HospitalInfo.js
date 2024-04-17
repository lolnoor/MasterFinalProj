/** @format */

import React, { Component } from "react";
import { Text, TextInput, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scrollview";
import firebase from "firebase";
import AppButton from "../../../Components/AppButton/AppButton";
import AppTextInput from "../../../Components/AppTextInput/AppTextInput";
import { IsNonEmptyString } from "../../../Utils/HelperFunctions";
import Styles from "./styles";
import { DATABASE_NODES } from "../../../Utils/Enums";
import CountrySelector from "../../../Components/CountrySelector/CountrySelector";
import CitySelector from "../../../Components/CitySelector/CitySelector";
import Spacer from "../../../Components/Spacer/Spacer";

export default class HospitalInfo extends Component {
  constructor(props) {
    super(props);

    this.state = {
      name: "",
      country: "",
      city: "",
      phoneNumber: "",
      completeAddress: "",
      licenseNo: "",
      loading: false,
    };
  }

  onChangeName = (text) => {
    this.setState({ name: text });
  };

  onPhoneNumberChange = (text) => {
    this.setState({ phoneNumber: text });
  };

  onChangeCountry = (text) => {
    this.setState({ country: text });
  };

  onChangeCity = (text) => {
    this.setState({ city: text });
  };

  onChangeAddress = (text) => {
    this.setState({ completeAddress: text });
  };

  onChangeLicenseNo = (text) => {
    this.setState({ licenseNo: text });
  };

  validate = () => {
    const { name, phoneNumber, country, city, completeAddress, licenseNo } =
      this.state;

    if (
      !(
        IsNonEmptyString(name) ||
        IsNonEmptyString(country) ||
        IsNonEmptyString(city) ||
        IsNonEmptyString(completeAddress) ||
        IsNonEmptyString(licenseNo) ||
        IsNonEmptyString(phoneNumber)
      )
    ) {
      alert("All fields are required");
      return;
    }

    this.saveRecordInDatabase();
  };

  saveRecordInDatabase = () => {
    const { name, country, city, completeAddress, licenseNo, phoneNumber } =
      this.state;
    const { onProfileCompleted } = this.props;

    const { userId } = this.props;

    this.setState({ loading: true });

    firebase
      .database()
      .ref(`${DATABASE_NODES.HOSPITAL}/${userId}`)
      .update({
        name,
        country,
        city,
        completeAddress,
        licenseNo,
        phoneNumber,
      })
      .then(() => {
        onProfileCompleted?.();
      })
      .catch(() => {
        alert("An error has occured while saving data. Please try again");
      })
      .finally(() => {
        this.setState({ loading: false });
      });
  };

  render() {
    const {
      name,
      country,
      city,
      completeAddress,
      licenseNo,
      loading,
      phoneNumber,
    } = this.state;

    return (
      <View style={Styles.containerStyle}>
        <KeyboardAwareScrollView>
          <AppTextInput
            placeholder="Enter Name"
            isNonEmpty
            style={Styles.inputStyle}
            value={name}
            onChangeText={this.onChangeName}
          />

          <AppTextInput
            placeholder="Enter Contact Number"
            isNonEmpty
            style={Styles.inputStyle}
            value={phoneNumber}
            onChangeText={this.onPhoneNumberChange}
          />

          <CountrySelector onCountryChange={this.onChangeCountry} />

          <Spacer space={10} />

          <CitySelector country={country} onCitySelected={this.onChangeCity} />

          <Spacer space={5} />

          <AppTextInput
            placeholder="Complete Address"
            isNonEmpty
            style={Styles.inputStyle}
            value={completeAddress}
            onChangeText={this.onChangeAddress}
          />

          <AppTextInput
            placeholder="License No."
            isNonEmpty
            style={Styles.inputStyle}
            value={licenseNo}
            onChangeText={this.onChangeLicenseNo}
          />

          <AppButton
            style={Styles.inputStyle}
            title="Save"
            isLoading={loading}
            onPress={this.validate}
          />
        </KeyboardAwareScrollView>
      </View>
    );
  }
}
