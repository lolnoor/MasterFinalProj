/** @format */

import React, { Component } from "react";
import { Alert, Image, Text, TextInput, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scrollview";
import AppButton from "../../../Components/AppButton/AppButton";
import AppTextInput from "../../../Components/AppTextInput/AppTextInput";
import Styles from "./styles";

import firebase from "firebase";
import R from "../../../Utils/R";
import { DATABASE_NODES, USER_TYPE } from "../../../Utils/Enums";

export default class RegistrationForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      emailId: "",
      password: "",
      confirmPassword: "",
      loading: false,
    };
  }

  onemailIdChange = (text) => {
    this.setState({ emailId: text.trim() });
  };

  onPasswordChange = (text) => {
    this.setState({ password: text });
  };

  onConfirmPasswordChange = (text) => {
    this.setState({ confirmPassword: text });
  };

  ValidateEmail = (mail) => {
    if (
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(
        mail
      )
    ) {
      return true;
    }

    return false;
  };

  validate = () => {
    const { emailId, password, confirmPassword } = this.state;

    if (!R.HelperFunctions.IsNonEmptyString(emailId)) {
      this.showAlert("Please enter email id");
      return;
    }

    if (!this.ValidateEmail(emailId)) {
      this.showAlert("Invalid email address. Please check it");
      return;
    }

    if (password?.length < 6) {
      this.showAlert("Password length should be atleast 6");
      return;
    }

    if (password !== confirmPassword) {
      this.showAlert(
        "Password donot match. Please enter your password correctly"
      );
      return;
    }

    this.onSubmit();
  };

  showAlert = (message, title = "Error") => {
    Alert.alert(title, message);
  };

  onSubmit = () => {
    const { emailId, password } = this.state;

    this.setState({
      loading: true,
    });

    // onAccountCreated?.();
    // return;

    firebase
      .auth()
      .createUserWithEmailAndPassword(emailId, password)
      .then((resposne) => {
        console.log("successfull", resposne);

        const {
          user: { uid, emailVerified },
        } = resposne;

        this.saveDetailsInDatabase(uid, emailVerified);
      })
      .catch((error) => {
        this.setState({ loading: false });
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        if (errorCode == "auth/weak-password") {
          alert("The password is too weak.");
        } else {
          alert(errorMessage);
        }
      });
  };

  saveDetailsInDatabase = (uid, emailVerified) => {
    const { onAccountCreated, isDonor } = this.props;
    const { emailId } = this.state;

    const userNode = isDonor ? DATABASE_NODES.DONORS : DATABASE_NODES.HOSPITAL;

    firebase
      .database()
      .ref(`${DATABASE_NODES.USERS}/${uid}`)
      .set({
        uid,
        userType: isDonor ? USER_TYPE.DONOR : USER_TYPE.HOSPITAL,
      });

    firebase
      .database()
      .ref(`${userNode}/${uid}/`)
      .set({
        userType: isDonor ? USER_TYPE.DONOR : USER_TYPE.HOSPITAL,
        uid,
        emailId,
        emailVerified,
        onboardingStep: 1,
      })
      .then(() => {
        onAccountCreated?.(emailId, uid);
        this.setState({ loading: false });
      });

    this.showAlert(
      "Account created successfully. Proceed to fill your details",
      "Success"
    );
  };

  render() {
    const { emailId, password, confirmPassword, loading } = this.state;

    return (
      <View style={Styles.containerStyle}>
        <KeyboardAwareScrollView
          contentContainerStyle={{
            height: R.Dimension.height,
            padding: 20,
          }}
        >
          {/* <AppTextInput
            value={emailId}
            onChangeText={this.onemailIdChange}
            placeholder="Enter email Id"
            keyboardType="email-address"
          /> */}
          <AppTextInput
                placeholder="Enter email Id"
                value={emailId}
                onChangeText={this.onemailIdChange}
                keyboardType="email-address"
                isNonEmpty
              />

          <AppTextInput
            value={password}
            onChangeText={this.onPasswordChange}
            placeholder="Enter Password"
            secureTextEntry
          />

          <AppTextInput
            value={confirmPassword}
            onChangeText={this.onConfirmPasswordChange}
            placeholder="Confirm Password"
            secureTextEntry
          />

          <AppButton
            onPress={this.validate}
            title="Submit"
            isLoading={loading}
          />
        </KeyboardAwareScrollView>
      </View>
    );
  }
}
