import { View, Text, ActivityIndicator } from "react-native";
import React, { useEffect, useState } from "react";

import Styles from "./styles";
import AppText from "../AppText/AppText";
import firebase from "firebase";
import { DATABASE_NODES, REQUEST_STATUS } from "../../Utils/Enums";
import moment from "moment";
import { FormatDate } from "../../Utils/HelperFunctions";
import R from "../../Utils/R";
import AppButton from "../AppButton/AppButton";

function getMessage(status) {
  switch (status) {
    case REQUEST_STATUS.ACCEPTED:
      return "Donor Accepted Request";

    case REQUEST_STATUS.CANCELLED:
      return "You have cancelled request";

    case REQUEST_STATUS.COMPLETED:
      return "Donation completed successfully";

    case REQUEST_STATUS.EXPIRED:
      return "Request has expired";

    case REQUEST_STATUS.PENDING:
      return "Request is not accepted yet";
  }
}

export default function BroadcastMessageInfo({ broadcastId }) {
  const [notificationData, updateNotificationData] = useState({
    loading: true,
    data: {},
  });

  useEffect(() => {
    firebase
      .database()
      .ref(`${DATABASE_NODES.BROADCAST_NOTIFICATION}/${broadcastId}`)
      .on("value", (value) => {
        updateNotificationData({
          loading: false,
          data: value.val(),
        });
      });
  }, []);

  const status = notificationData.data.status;
  const isExpired = R.HelperFunctions.hasNotificationExpired(
    notificationData.data
  );
  const hasResponse = status !== REQUEST_STATUS.PENDING;
  const hasCompleted =
    status === REQUEST_STATUS.CANCELLED ||
    status === REQUEST_STATUS.COMPLETED ||
    status === REQUEST_STATUS.REJECTED;

  const updateStatus = (status) => {
    firebase
      .database()
      .ref(`${DATABASE_NODES.BROADCAST_NOTIFICATION}/${broadcastId}/status`)
      .set(status);

    firebase
    .database()
    .ref(`${DATABASE_NODES.REQUEST}/${notificationData.data.requestId}/status`)
    .set(status);
  };

  // Update the status to the cancelled
  const onCancelled = () => {
    updateStatus(REQUEST_STATUS.CANCELLED);
  };

  // Update ths status to the completed
  const onCompleted = () => {
    updateStatus(REQUEST_STATUS.COMPLETED);

    // In addition to udpateing the status, also update the lastBloodDonation in the donor info of the donor profile
    firebase
      .database()
      .ref(
        `${DATABASE_NODES.DONORS}/${notificationData.data.acceptedBy}/${DATABASE_NODES.DONORINFO}`
      )
      .update({ lastBloodDonation: R.HelperFunctions.FormatDate(moment()) });
  };

  return (
    <View style={Styles.containerStyle}>
      <View style={Styles.statusContainer}>
        <AppText type="small">{status}</AppText>
      </View>

      <View style={Styles.bloodGroupContainer}>
        <AppText style={Styles.statusText}>
          {notificationData.data.bloodGroup}
        </AppText>
      </View>

      {notificationData.loading && <ActivityIndicator />}

      {!notificationData.loading && (
        <View>
          <AppText>{`Donor Counts     : ${notificationData.data.donors?.length}`}</AppText>

          <AppText>{`Send On              : ${FormatDate(
            notificationData.data.sendOn
          )}`}</AppText>

          <AppText>{`Donation Date    : ${FormatDate(
            notificationData.data.expiryDate
          )}`}</AppText>
        </View>
      )}

      {hasResponse && !hasCompleted && (
        <View
          style={{ flexDirection: "row", paddingVertical: 10, marginTop: 20 }}
        >
          <View style={{ flex: 1, paddingHorizontal: 10 }}>
            <AppButton isSecondary title="Cancel" onPress={onCancelled} />
          </View>

          <View style={{ flex: 1, paddingHorizontal: 10 }}>
            <AppButton title="Mark Completed" onPress={onCompleted} />
          </View>
        </View>
      )}

      <AppText style={{ marginTop: 10 }}>{getMessage(status)}</AppText>
    </View>
  );
}
