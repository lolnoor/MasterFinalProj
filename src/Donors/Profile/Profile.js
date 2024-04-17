/** @format */

import React, { Component } from "react";
import { Alert, ScrollView, View } from "react-native";
import AppButton from "../../Components/AppButton/AppButton";
import ScreenContainer from "../../Components/ScreenContainer/ScreenContainer";
import firebase from "firebase";
import { inject, observer } from "mobx-react";
import Avatar from "../../Components/Avatar/Avatar";
import AppText from "../../Components/AppText/AppText";
import AppTextInput from "../../Components/AppTextInput/AppTextInput";
import { DATABASE_NODES, USER_TYPE } from "../../Utils/Enums";
import Styles from "./styles";
import R from "../../Utils/R";
import { runAnimation } from "../../Utils/HelperFunctions";
import Spacer from "../../Components/Spacer/Spacer";
import CountrySelector from "../../Components/CountrySelector/CountrySelector";
import CitySelector from "../../Components/CitySelector/CitySelector";

@inject("userStore")
@observer
export default class Profile extends Component {
  constructor(props) {
    super(props);

    const {
      userStore: {
        userName,
        emailId,
        userId,
        userType,
        bloodGroup,
        phoneNumber,
        gender,
        city,
        country,
      },
    } = props;

    this.state = {
      isEditing: false,
      userName,
      emailId,
      bloodGroup,
      phoneNumber,
      gender,
      userType,
      userId,
      selectedCountry: country,
      selectedCity: city,
    };
  }

  onSignout = () => {
    const { userStore, navigation } = this.props;

    firebase
      .auth()
      .signOut()
      .then(() => {
        userStore.clearData();
        R.HelperFunctions.resetStack(navigation, "Login");
      });
  };

  toggleEdit = () => {
    const { isEditing } = this.state;

    runAnimation();

    // cancel all the edits
    if (isEditing) {
      const {
        userStore: { userName, phoneNumber },
      } = this.props;

      this.setState(
        {
          userName,
          phoneNumber,
        },
        () => {
          console.log("status is", this.state);
        }
      );
    }

    this.setState({
      isEditing: !isEditing,
    });
  };

  onNameChange = (text) => {
    this.setState({ userName: text });
  };

  onPhoneNumberChange = (text) => {
    this.setState({ phoneNumber: text });
  };

  onSave = () => {
    const {
      userName,
      phoneNumber,
      userType,
      userId,
      selectedCountry,
      selectedCity,
    } = this.state;

    const userNode =
      userType === USER_TYPE.DONOR
        ? DATABASE_NODES.DONORS
        : DATABASE_NODES.HOSPITAL;

    firebase
      .database()
      .ref(`${userNode}/${userId}`)
      .update(
        {
          name: userName,
          phoneNumber,
          country: selectedCountry,
          city: selectedCity,
        },
        () => {
          this.props.userStore.userName = userName;
          this.props.userStore.country = selectedCountry;
          this.props.userStore.city = selectedCity;
          Alert.alert("Success", "Record updated successfully");
        }
      );

    this.setState({
      isEditing: false,
    });
  };

  onChangePassword = () => {
    const { emailId } = this.state;
    firebase.auth().sendPasswordResetEmail(emailId);

    Alert.alert(
      "Success",
      "A password reset email has been sent to your email address"
    );
  };

  onCountrySelect = (value) => {
    this.setState({ selectedCountry: value?.value ?? value });
  };

  onCitySelected = (value) => {
    this.setState({ selectedCity: value?.value?? value });
  };

  render() {
    const {
      userStore: { emailId, userId, userType, bloodGroup, gender },
    } = this.props;

    const { userName, phoneNumber } = this.state;
    const { isEditing } = this.state;
    const isDonor = userType === USER_TYPE.DONOR;

    return (
      <ScreenContainer>
        <ScrollView>
        <View style={Styles.containerStyle}>
          <View style={{ alignItems: "flex-end" }}>
            <AppText
              style={{ color: R.Colors.PrimaryDark }}
              onPress={this.toggleEdit}
            >
              {isEditing ? "Cancel" : "Edit"}
            </AppText>
          </View>

          <Avatar
            name={userName}
            style={{
              width: 100,
              height: 100,
              borderRadius: 200,
              alignSelf: "center",
            }}
            textStyle={{ fontSize: 30 }}
          />

          <AppText>Name</AppText>
          <AppTextInput
            style={{ borderBottomWidth: 1, marginTop: 5 }}
            value={userName}
            editable={isEditing}
            onChangeText={this.onNameChange}
          />

          <AppText>Phone Number</AppText>
          <AppTextInput
            style={{ borderBottomWidth: 1, marginTop: 5 }}
            value={phoneNumber}
            editable={isEditing}
            onChangeText={this.onPhoneNumberChange}
          />

          <AppText>Email Id</AppText>
          <AppTextInput
            style={{ borderBottomWidth: 1, marginTop: 5 }}
            value={emailId}
            editable={false}
          />

          {isDonor && (
            <>
              <AppText>Gender: {gender}</AppText>

              <Spacer space={12} />

              <AppText>Blood group: {bloodGroup}</AppText>

              <Spacer space={12} />

              <CountrySelector
                selectedCountry={this.state.selectedCountry}
                onCountryChange={this.onCountrySelect}
              />

              <Spacer space={12} />

              <CitySelector
                selectedCity={this.state.selectedCity}
                onCitySelected={this.onCitySelected}
                country={this.state.selectedCountry}
              />
            </>
          )}

          {!isEditing && (
            <View>
              <AppButton
                style={{ marginTop: 20 }}
                title="Change Password"
                onPress={this.onChangePassword}
              />
              <AppButton
                style={{ marginTop: 20 }}
                title="Signout"
                onPress={this.onSignout}
              />
            </View>
          )}

          {isEditing && (
            <AppButton
              style={{ marginTop: 20 }}
              title="Save"
              onPress={this.onSave}
            />
          )}
        </View>
        </ScrollView>
      </ScreenContainer>
    );
  }
}
