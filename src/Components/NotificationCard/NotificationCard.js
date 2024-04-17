/** @format */

import React, { useEffect, useState } from "react";
import { View, Text, Linking } from "react-native";
import R from "../../Utils/R";
import AppButton from "../AppButton/AppButton";
import firebase from "firebase";
import AppText from "../AppText/AppText";
import moment from "moment";
import DonorDetailsCard from "../DonorDetailsCard/DonorDetailsCard";
import HospitalDetailsCard from "../HospitalDetailsCard/HospitalDetailsCard";
import Styles from "./styles";
import { DATABASE_NODES, REQUEST_STATUS } from "../../Utils/Enums";
import { useNavigation } from "@react-navigation/native";
import BroadcastMessageInfo from "../BroadcastMessageInfo/BroadcastMessageInfo";

/**
 * Notication card to the blood donation request
 * This component holds all the options like accepting, cancelling, rejecting request
 *
 * @param {*} param0
 */

export default function NotificationCard({ item, isDonor }) {
  const {
    donorInfo,
    notificationId,
    expireOn,
    message,
    hospitalInfo,
    isBroadcastMessage,
    broadcastId,
    requestId
  } = item; // notification node from firebase

  const [broadcastData, updateBroadcastData] = useState({});

  const status = broadcastData?.status ?? item.status;

  const borderColor = R.HelperFunctions.GetStatusColor(status);
  const { hospitalId, address } = hospitalInfo;
  const { uid, city } = donorInfo;

  const hasResponse =
    status !== REQUEST_STATUS.PENDING ||
    (isBroadcastMessage && broadcastData?.status != REQUEST_STATUS.PENDING);
  const hasCompleted =
    status === REQUEST_STATUS.CANCELLED ||
    status === REQUEST_STATUS.COMPLETED ||
    status === REQUEST_STATUS.REJECTED;

  // update the status of the notification in donorNotification as well as hospital nofication
  const updateStatus = (status) => {
    firebase
      .database()
      .ref(
        `${DATABASE_NODES.DONOR_NOTIFICATION}/${uid}/${notificationId}/status`
      )
      .set(status);


      firebase.database()
      .ref(`${DATABASE_NODES.REQUEST}/${requestId}/status`)
      .set(status)

      firebase.database()
      .ref(`${DATABASE_NODES.REQUEST}/${requestId}/city`)
      .set(city)

    if (isBroadcastMessage) {
      firebase
        .database()
        .ref(`${DATABASE_NODES.BROADCAST_NOTIFICATION}/${broadcastId}`)
        .update({
          status: REQUEST_STATUS.ACCEPTED,
          acceptedBy: uid,
          notificationId,
        });
    } else {
      firebase
        .database()
        .ref(
          `${DATABASE_NODES.HOSPITAL_NOTIFICATION}/${hospitalId}/${notificationId}/status`
        )
        .set(status);
    }
  };

  // Update the status of the request to accpeted
  const onAccept = () => {
    updateStatus(REQUEST_STATUS.ACCEPTED);
  };

  // Update the status to the rejected
  const onReject = () => {
    updateStatus(REQUEST_STATUS.REJECTED);
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
        `${DATABASE_NODES.DONORS}/${donorInfo.uid}/${DATABASE_NODES.DONORINFO}`
      )
      .update({ lastBloodDonation: R.HelperFunctions.FormatDate(moment()) });
  };

  const isExpired = R.HelperFunctions.hasNotificationExpired(item);

  useEffect(() => {
    if (!isBroadcastMessage) {
      return;
    }

    firebase
      .database()
      .ref(`${DATABASE_NODES.BROADCAST_NOTIFICATION}/${broadcastId}`)
      .on("value", (value) => {
        const data = value.val();
        updateBroadcastData(data);
      });
  }, []);

  return (
    <View style={[Styles.containerStyle, { borderColor: borderColor }]}>
      <View
        style={[
          Styles.statusTextContainerStyle,
          { backgroundColor: borderColor },
        ]}
      >
        <AppText type="small" style={Styles.statusTextStyle}>
          {isExpired ? "Expired" : status}
        </AppText>
      </View>

      {/* Is logged in user is donor, show hospital card */}
      {isDonor && <HospitalDetailsCard hospitalInfo={hospitalInfo} />}

      {/* If logged is user is not donor, show donor information card  */}
      {!isDonor && (
        <DonorDetailsCard donor={donorInfo} hideNotificationComposer />
      )}

      <AppText style={{ paddingHorizontal: 10, marginTop: -10 }}>
        Expire: {R.HelperFunctions.Humanize(expireOn)}
      </AppText>

      <AppText style={{ paddingHorizontal: 10 }}>
        Dontation date: {R.HelperFunctions.FormatDate(expireOn)}
      </AppText>

      {/* If notification status is accpeted, then show link to open google map with hospital name */}
      {(status === REQUEST_STATUS.ACCEPTED ||
        status === REQUEST_STATUS.PENDING) &&
        isDonor && (
          <AppText
            style={{ padding: 10, color: "blue" }}
            onPress={() => {
              Linking.openURL(
                `https://www.google.co.in/maps/search/${encodeURIComponent(
                  address
                )}`
              );
            }}
          >
            Open Direction
          </AppText>
        )}

      {message.length > 0 && !isExpired && (
        <View style={Styles.messageContainerStyle}>
          <AppText type="small" style={{ color: "#888" }}>
            Message
          </AppText>
          <AppText type="small" style={{ color: "#888" }}>
            {message}
          </AppText>
        </View>
      )}

      {/* {isBroadcastMessage && <BroadcastMessageInfo broadcastId={broadcastId} />} */}

      {!hasResponse && isDonor && !isExpired && (
        <View style={{ flexDirection: "row", paddingVertical: 10 }}>
          <View style={{ flex: 1, paddingHorizontal: 10 }}>
            <AppButton isSecondary title="Reject" onPress={onReject} />
          </View>

          <View style={{ flex: 1, paddingHorizontal: 10 }}>
            <AppButton title="Accept" onPress={onAccept} />
          </View>
        </View>
      )}

      {isDonor && hasResponse && broadcastData?.acceptedBy !== uid && (
        <View style={{ padding: 10 }}>
          {broadcastData?.acceptedBy !== uid && (
            <AppText>This request is already accepted by someone else.</AppText>
          )}
        </View>
      )}

      {hasResponse && !hasCompleted && !isDonor && !isExpired && (
        <View
          style={{ flexDirection: "row", paddingTop: 10, paddingBottom: 10 }}
        >
          <View style={{ flex: 1, paddingHorizontal: 10 }}>
            <AppButton isSecondary title="Cancel" onPress={onCancelled} />
          </View>

          <View style={{ flex: 1, paddingHorizontal: 10 }}>
            <AppButton title="Mark Completed" onPress={onCompleted} />
          </View>
        </View>
      )}
    </View>
  );
}
