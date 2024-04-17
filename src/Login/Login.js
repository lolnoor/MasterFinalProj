/** @format */

import React, { Component } from "react";
import { View, Text, Image, ScrollView, TextInput, Alert } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scrollview";
import { inject, observer } from "mobx-react";
import firebase from "firebase";
import AppButton from "../Components/AppButton/AppButton";
import AppText from "../Components/AppText/AppText";
import AppTextInput from "../Components/AppTextInput/AppTextInput";
import ScreenContainer from "../Components/ScreenContainer/ScreenContainer";
import { DATABASE_NODES, USER_TYPE } from "../Utils/Enums";
import R from "../Utils/R";
import Styles from "./styles";

@inject("userStore")
@observer
export default class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      emailId: "",
      password: "",
      loading: false,
    };
  }

  navigationToRegistration = () => {
    const { navigation } = this.props;
    navigation.navigate("Registration");
  };

  onUserTypeSelected = (userType) => {
    this.setState({ loginType: userType });
  };

  onEmailIdChange = (text) => {
    this.setState({ emailId: text?.trim() });
  };

  onPasswordChange = (text) => {
    this.setState({ password: text?.trim() });
  };

  onPress = () => {
    if (this.validate()) {
      this.signInUsingEmail();
    } else {
      Alert.alert("Error", "Please enter required fields");
    }
  };

  // Check whether all the input are valid or not
  validate = () => {
    const { emailId, password } = this.state;
    return emailId?.trim()?.length > 0 && password?.trim()?.length > 0;
  };

  signInUsingEmail = () => {
    const { emailId, password } = this.state;

    this.setState({ loading: true });

    firebase.auth().onAuthStateChanged((state) => {
      console.log("state is", state);
      const currentUser = firebase.auth().currentUser;

      console.log("current user is", currentUser);
    });

    console.log("sign in with email", emailId, password);

    firebase
      .auth()
      .signInWithEmailAndPassword(emailId.toLocaleLowerCase(), password)
      .then((data) => {
        console.log("login data is", data);

        const {
          user: { uid },
        } = data;

        this.fetchUserType(uid);
      })
      .catch((error) => {
        Alert.alert("Login Error", error.message);
        this.setState({ loading: false });
      });
  };

  // Once user is signed in using email and password, fetch user type,
  // once usertype is fetched fetch the data from specific node.
  fetchUserType = (uid) => {
    firebase
      .database()
      .ref(`${DATABASE_NODES.USERS}/${uid}`)
      .on("value", (data) => {
        const response = data.val();

        console.log("response is", `${DATABASE_NODES.USERS}/${uid}`, response);

        if (response) {
          const { uid, userType } = response;

          this.fetchCurrentUserRecord(uid, userType);
        } else {
          this.showUserRecordDeletedMessage();
        }
      });
  };

  fetchCurrentUserRecord = (uid, userType) => {
    const node = R.HelperFunctions.GetUserNodeFromUserType(userType);

    firebase
      .database()
      .ref(`${node}/${uid}`)
      .once("value", (data) => {
        const response = data.val();
        this.setState({ loading: false });

        const { emailVerified, userType } = response;
        const currentUser = firebase.auth().currentUser;  

        const isUserEmailVerified = currentUser.emailVerified;

        if (!isUserEmailVerified && userType !== USER_TYPE.ADMIN) {
          alert("Email id not verified. Please verify to continue using app");
          return;
        }

        if (!emailVerified && isUserEmailVerified) {
          firebase.database().ref(`${node}/${uid}`).update({
            emailVerified: true,
          });
        }

        if (response) {
          const { navigation, userStore } = this.props;
          userStore.setUser(response);

          if (userType === USER_TYPE.DONOR) {
            R.HelperFunctions.resetStack(navigation, "Donor");
          } else if (userType === USER_TYPE.HOSPITAL) {
            R.HelperFunctions.resetStack(navigation, "Hospital");
          } else if (userType === USER_TYPE.ADMIN) {
            R.HelperFunctions.resetStack(navigation, "Admin");
          }
        } else {
          this.showUserRecordDeletedMessage();
        }
      });
  };

  showUserRecordDeletedMessage = () => {
    Alert.alert(
      "Login Error",
      "No user data found. Seems like your record is deleted. Please register again"
    );
    // firebase.auth().signOut();
  };

  render() {
    const { emailId, password, loading } = this.state;

    return (
      <View style={{ flex: 1 }} pointerEvents={loading ? "none" : "auto"}>
        <ScreenContainer>
          <KeyboardAwareScrollView
            contentContainerStyle={Styles.containerStyle}
            keyboardShouldPersistTaps="handled"
            scrollEnabled={false}
          >
            <View style={{ flex: 1 }}>
              <Image
                source={R.Images.Logo}
                style={Styles.logoStyle}
                resizeMode="cover"
              />

              <AppTextInput
                placeholder="Enter email Id"
                value={emailId}
                onChangeText={this.onEmailIdChange}
                keyboardType="email-address"
                isNonEmpty
              />

              <AppTextInput
                style={{ marginTop: 5 }}
                placeholder="Enter password"
                value={password}
                onChangeText={this.onPasswordChange}
                secureTextEntry
                isNonEmpty
              />

              <AppButton
                title="Login"
                onPress={this.onPress}
                style={{ marginTop: 30 }}
                isLoading={loading}
              />
            </View>
          </KeyboardAwareScrollView>

          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              marginBottom: 20,
            }}
          >
            <AppText
              style={{ textAlign: "center", color: "black", fontWeight: "700" }}
              type="small"
            >
              Don't have an account?
            </AppText>

            <AppText
              onPress={this.navigationToRegistration}
              style={{ color: "blue", fontWeight: "bold" }}
            >
              {" "}
              Register
            </AppText>
          </View>
        </ScreenContainer>
      </View>
    );
  }
}
