/** @format */

import React, { Component } from "react";
import { Alert, View, TouchableOpacity } from "react-native";
import { BloodRequirementUrgency } from "../../Utils/Constants/ChipsData";
import moment from "moment";
import firebase from "firebase";
import { DATABASE_NODES, REQUEST_STATUS } from "../../Utils/Enums";
import AppTextInput from "../AppTextInput/AppTextInput";
import ChipGroup from "../ChipGroup/ChipGroup";
import AppButton from "../AppButton/AppButton";
import AppText from "../AppText/AppText";
import R from "../../Utils/R";
import * as Random from "expo-random";
import { inject, observer } from "mobx-react";

import Styles from "./styles";
import Spacer from "../Spacer/Spacer";

/**
 * Notification composer view.
 * @param {array} users array of donor information
 * @param {boolean} isBroadcastMessage
 * @param {func} onSuccess
 * @param {func} onCancel on Cancel callback
 */

@inject("userStore")
@observer
export default class NotificationSenderView extends Component {
  constructor(props) {
    super(props);

    this.state = {
      message: "",
      loader: false,
      bloodUrgency: BloodRequirementUrgency[2].title,
    };
  }

  notificationSendSuccess = async () => {
    const {
      users,
      userStore: {
        userId,
        userName = "",
        phoneNumber = "",
        emailId = "",
        address = "",
      },
      onSuccess,

      isBroadcastMessage,
    } = this.props;
    const { bloodUrgency, message } = this.state;

    this.setLoader(false);
    this.setMessage("");

    const expireAfter =
      bloodUrgency === "Today" ? 0 : bloodUrgency === "Tomorrow" ? 1 : 7;
    const expiryDate = moment().add(expireAfter, "days").toString();

    const broadcastId = await Random.getRandomBytes(20).join("");
    const requestId = await Random.getRandomBytes(20).join("");

    // Composes message for each user
    users.forEach(async (user) => {
      const { uid, name } = user;
      const notificationUUID = await Random.getRandomBytes(20).join("");

      const notificaitonData = {
        requestId,
        isBroadcastMessage: isBroadcastMessage ?? false,
        broadcastId: isBroadcastMessage ? broadcastId : "",
        notificationId: notificationUUID,
        sendOn: moment().toString(),
        message,
        expireOn: expiryDate,
        status: REQUEST_STATUS.PENDING,
        hospitalInfo: {
          hospitalId: userId,
          name: userName,
          phoneNumber,
          emailId,
          address,
        },
        donorInfo: user,
      };

      firebase
        .database()
        .ref(`${DATABASE_NODES.DONOR_NOTIFICATION}/${uid}/${notificationUUID}`)
        .set(notificaitonData);

      if (!isBroadcastMessage) {
        firebase
          .database()
          .ref(
            `${DATABASE_NODES.HOSPITAL_NOTIFICATION}/${userId}/${notificationUUID}`
          )
          .set(notificaitonData);
      }
    });

    if (isBroadcastMessage) {
      const notificaitonData = {
        requestId,
        isBroadcastMessage: isBroadcastMessage ?? false,
        broadcastId: isBroadcastMessage ? broadcastId : "",
        sendOn: moment().toString(),
        message,
        expireOn: expiryDate,
        status: REQUEST_STATUS.PENDING,
        donors: users,
        bloodGroup: users[0]?.bloodGroup,
      };

      firebase
        .database()
        .ref(`${DATABASE_NODES.HOSPITAL_BROADCAST}/${userId}/${broadcastId}`)
        .set({ broadcastId, expireOn: expiryDate });

      firebase
        .database()
        .ref(`${DATABASE_NODES.BROADCAST_NOTIFICATION}/${broadcastId}`)
        .set(notificaitonData);

      firebase
        .database()
        .ref(`${DATABASE_NODES.REQUEST}/${requestId}`)
        .set({
          hospitalName: userName,
          ...notificaitonData,
        });
    }

    Alert.alert("Notification send successfully");
    onSuccess?.();
  };

  notificationSendFailure = () => {
    this.setLoader(false);

    Alert.alert(
      "Error has occured while sending notification. Please try again"
    );
  };

  sendNotification = () => {
    this.setLoader(true);
    const { users } = this.props;
    const { message } = this.state;

    R.HelperFunctions.sendPushNotification({
      tokens: users.map((user) => user.token),
      message: message,
      onSuccess: this.notificationSendSuccess,
      onFailure: this.notificationSendFailure,
    });
  };

  setMessage = (message) => {
    this.setState({ message });
  };

  setBloodUrgency = (data) => {
    this.setState({ bloodUrgency: data });
  };

  setLoader = (loader) => {
    this.setState({
      loader,
    });
  };

  render() {
    const { message, bloodUrgency, loader } = this.state;
    const { onCancel } = this.props;

    return (
      <TouchableOpacity
        activeOpacity={1}
        style={{
          backgroundColor: "#cfcfcf",
          paddingBottom: 10,
          paddingHorizontal: 10,
          overflow: "hidden",
        }}
      >
        <AppText style={{ paddingTop: 10, color: "black" }} type="small">
          Send Notifcation
        </AppText>
        <AppTextInput
          style={{ marginTop: 5 }}
          placeholder="Enter message (optional)"
          value={message}
          onChangeText={this.setMessage}
        />

        <ChipGroup
          selectedChips={[bloodUrgency]}
          onSelected={this.setBloodUrgency}
          data={BloodRequirementUrgency}
        />

        <View style={Styles.buttonContainer}>
          {onCancel && (
            <AppButton
              title="Cancel"
              onPress={onCancel}
              style={{ width: 150, marginTop: 5, alignSelf: "flex-end" }}
            />
          )}

          <Spacer />

          <AppButton
            isLoading={loader}
            title="Send"
            onPress={this.sendNotification}
            style={{ width: 150, marginTop: 5, alignSelf: "flex-end" }}
          />
        </View>
      </TouchableOpacity>
    );
  }
}
