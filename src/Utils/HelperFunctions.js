/** @format */

import { LayoutAnimation, Platform, UIManager } from "react-native";
import { DATABASE_NODES, REQUEST_STATUS, USER_TYPE } from "./Enums";
import R from "./R";
import moment from "moment";
import { CommonActions } from "@react-navigation/native";
import firebase from "firebase";

export const IsNonEmptyString = (string) => {
  return string?.trim()?.length > 0;
};

export const runAnimation = () => {
  if (Platform.OS === "android") {
    if (UIManager.setLayoutAnimationEnabledExperimental) {
      UIManager.setLayoutAnimationEnabledExperimental(true);
    }
  }

  if (Platform.OS === "ios") {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
  } else {
    //   Removing animation from delete as it is buggy. No this no real solution
    // for it but to remove deleting. Problem can also be found on below link.
    // https://github.com/facebook/react-native/issues/13207#issuecomment-290853976
    LayoutAnimation.configureNext({
      duration: 300,
      create: {
        type: LayoutAnimation.Types.easeInEaseOut,
        property: LayoutAnimation.Properties.opacity,
      },
      update: { type: LayoutAnimation.Types.easeInEaseOut },
    });
  }
};

export const sendPushNotification = ({
  tokens = [],
  title = "Blood dontation request",
  message = "",
  onSuccess,
  onFailure,
}) => {
  const body = tokens
    ?.map((token) => {
      if (!token) {
        return;
      }
      return {
        to: token,
        title,
        body: message,
        priority: "high",
        sound: "default",
        channelId: "default",
      };
    })
    .filter(Boolean);
  fetch("https://exp.host/--/api/v2/push/send", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      "accept-encoding": "gzip, deflate",
      host: "exp.host",
    },
    body: JSON.stringify(body),
  })
    .then((response) => response.json())
    .then((responseJson) => {
      console.log("success", responseJson);
      onSuccess?.(responseJson);
    })
    .catch((error) => {
      console.log("error", error);
      onFailure?.(error);
    });
};

// This function will return color used for border/background based on the status of the
// notification
export const GetStatusColor = (status, hasExpired) => {
  switch (status) {
    case REQUEST_STATUS.PENDING:
      return R.Colors.PrimaryDark;

    case REQUEST_STATUS.ACCEPTED:
      return "darkseagreen";

    case REQUEST_STATUS.CANCELLED:
      return R.Colors.SelectedBlue;

    case REQUEST_STATUS.REJECTED:
      return "red";

    case REQUEST_STATUS.COMPLETED:
      return "green";

    case REQUEST_STATUS.EXPIRED:
      return "gray";

    default:
      return "yellow";
  }
};

export const CompoareNotificationBySendOn = (notification1, notification2) => {
  return moment(notification1.sendOn) > moment(notification2.sendOn);
};

export const FormatDate = (date) => {
  return moment(date).format("DD-MMM-YYYY");
};

export const Humanize = (date) => {
  return moment(date).endOf("day").fromNow();
};

export const GetUserNodeFromUserType = (userType) => {
  switch (userType) {
    case USER_TYPE.ADMIN:
      return DATABASE_NODES.ADMIN;

    case USER_TYPE.HOSPITAL:
      return DATABASE_NODES.HOSPITAL;

    default:
      return DATABASE_NODES.DONORS;
  }
};


export const resetStack = (navigation, route) => {
  navigation.dispatch(
    CommonActions.reset({
      index: 1,
      routes: [{ name: route }],
    })
  );
};

export const hasNotificationExpired = (notification) => {
  const { expireOn, status } = notification;
  const hasExpired =
    moment(expireOn).endOf("day").diff(moment().endOf("day"), "hour") < 0;

  if (hasExpired && status !== REQUEST_STATUS.COMPLETED) {
    return true;
  }

  return false;
};
