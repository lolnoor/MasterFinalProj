/** @format */

import React, { Component } from "react";
import { Keyboard, Text, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scrollview";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import AppButton from "../../../Components/AppButton/AppButton";
import AppText from "../../../Components/AppText/AppText";
import AppTextInput from "../../../Components/AppTextInput/AppTextInput";
import DropDownPickerWrapper from "../../../Components/DropDownPickerWrapper/DropDownPickerWrapper";
import firebase from "firebase";
import Styles from "./styles";
import { DATABASE_NODES } from "../../../Utils/Enums";

export default class Questionnaire extends Component {
  constructor(props) {
    super(props);

    this.state = {
      smoke: null,
      drink: null,
      diseases: null,
      lastBloodDonation: null,
      lastAbroadVisit: null,

      showBloodDatePicker: false,
      showLastVisitDatePicker: false,

      loading: false,
    };
  }

  onChangeSmoke = (item) => {
    this.setState({
      smoke: item.value,
    });
  };

  onChangeDrink = (item) => {
    this.setState({
      drink: item.value,
    });
  };

  onChangeDiseases = (item) => {
    this.setState({
      diseases: item.value,
    });
  };

  onBloodDonationDateChange = (date) => {
    this.setState({
      lastBloodDonation: date.toISOString().substring(0, 10),
      showBloodDatePicker: false,
    });
  };

  onLastVisitAbroadDateChange = (date) => {
    this.setState({
      lastAbroadVisit: date.toISOString().substring(0, 10),
      showLastVisitDatePicker: false,
    });
  };

  showBloodDonationPicker = () => {
    Keyboard.dismiss();
    this.setState({ showBloodDatePicker: true });
  };

  showLastVisitPicker = () => {
    Keyboard.dismiss();
    this.setState({ showLastVisitDatePicker: true });
  };

  hideDatePicker = () => {
    this.setState({
      showBloodDatePicker: true,
      showLastVisitDatePicker: false,
    });
  };

  validate = () => {
    const { smoke, drink, diseases, lastBloodDonation, lastAbroadVisit } =
      this.state;

    const { userId, onQuestionnaireCompleted } = this.props;

    if (!smoke || !drink || !diseases) {
      alert("Please answer all the mandatory questions");
      return;
    }

    this.setState({ loading: true });

    firebase
      .database()
      .ref(`${DATABASE_NODES.DONORS}/${userId}/${DATABASE_NODES.DONORINFO}`)
      .update({
        smoke,
        drink,
        diseases,
        lastBloodDonation,
        lastAbroadVisit,
      })
      .then(() => {
        onQuestionnaireCompleted?.();
      })
      .catch((error) => {
        alert(
          "Some error occured while saving data. Please try again" +
            error.message
        );
      })
      .finally(() => {
        this.setState({ loading: false });
      });
  };

  render() {
    const {
      loading,
      lastBloodDonation,
      lastAbroadVisit,
      showBloodDatePicker,
      showLastVisitDatePicker,
    } = this.state;

    return (
      <KeyboardAwareScrollView style={Styles.containerStyle}>
        <AppText>Few Questions</AppText>

        <AppText style={Styles.labelStyle} isMandatory>
          Do you smoke?
        </AppText>
        <View
          style={{
            ...(Platform.OS !== "android" && {
              zIndex: 10,
            }),
          }}
        >
          <DropDownPickerWrapper
            onChangeItem={this.onChangeSmoke}
            options={[
              {
                label: "Yes",
                value: "Yes",
              },
              {
                label: "No",
                value: "No",
              },
            ]}
          />
        </View>

        <AppText style={Styles.labelStyle} isMandatory>
          Do you drink?
        </AppText>
        <View
          style={{
            ...(Platform.OS !== "android" && {
              zIndex: 9,
            }),
          }}
        >
          <DropDownPickerWrapper
            onChangeItem={this.onChangeDrink}
            options={[
              {
                label: "Yes",
                value: "Yes",
              },
              {
                label: "No",
                value: "No",
              },
            ]}
          />
        </View>

        <AppText style={Styles.labelStyle} isMandatory>
          Do you have any diseases?
        </AppText>
        <View
          style={{
            ...(Platform.OS !== "android" && {
              zIndex: 8,
            }),
          }}
        >
          <DropDownPickerWrapper
            options={[
              {
                label: "Yes",
                value: "Yes",
              },
              {
                label: "No",
                value: "No",
              },
            ]}
            onChangeItem={this.onChangeDiseases}
          />
        </View>

        <AppText style={Styles.labelStyle}>
          When was your blood donation?
        </AppText>
        <AppTextInput
          placeholder="Pick a date if donated."
          style={Styles.inputStyle}
          onFocus={this.showBloodDonationPicker}
          value={lastBloodDonation}
          hideErrorLabel
        />
        <DateTimePickerModal
          isVisible={showBloodDatePicker}
          mode="date"
          onConfirm={this.onBloodDonationDateChange}
          onCancel={this.hideDatePicker}
        />

        <AppText style={Styles.labelStyle}>
          When was your last visit to abroad?
        </AppText>
        <AppTextInput
          placeholder="Pick a date if applicable"
          style={Styles.inputStyle}
          value={lastAbroadVisit}
          onFocus={this.showLastVisitPicker}
          hideErrorLabel
        />

        <DateTimePickerModal
          isVisible={showLastVisitDatePicker}
          mode="date"
          onConfirm={this.onLastVisitAbroadDateChange}
          onCancel={this.hideDatePicker}
        />

        <AppButton
          title="Save"
          style={Styles.buttonStyle}
          isLoading={loading}
          onPress={this.validate}
        />
      </KeyboardAwareScrollView>
    );
  }
}
