/** @format */

import React, { useEffect, useRef, useState } from "react";
import {
  View,
  TouchableOpacity,
  Animated,
  Platform,
  Linking,
} from "react-native";
import moment from "moment";
import { GENDER } from "../../Utils/Enums";
import { useNavigation } from "@react-navigation/native";
import R from "../../Utils/R";
import AppText from "../AppText/AppText";
import Avatar from "../Avatar/Avatar";
import Styles from "./styles";
import Checkbox from "../Checkbox/Checkbox";
import NotificationSenderView from "../NotificationSenderView/NotificationSenderView";

/**
 * Component to show Donor details
 */
export default function DonorDetailsCard(props) {
  const {
    donor,
    donor: {
      uid,
      name,
      bloodGroup,
      phoneNumber,
      emailId,
      gender,
      dob,
      token,
      donorInfo: { lastBloodDonation },
    } = {},
    multiSelectEnabled = false,
    isSelected = false,
    onLongPress,
    hideNotificationComposer = false,
    loginUserId,
    isAdmin,
  } = props;

  // hook
  const animation = useRef(new Animated.Value(0));
  const navigation = useNavigation();
  const notificationContainerAnimated = useRef(new Animated.Value(0));
  const [showNotificationContainer, setNotificationContainerVisiblity] =
    useState(false); // control whether to show notification composer or not.

  // Effect
  // when multiSelectEnabled is enabled hide the NotificationComposer
  useEffect(() => {
    Animated.timing(animation.current, {
      toValue: multiSelectEnabled ? 1 : 0,
      duration: 300,
      useNativeDriver: false,
    }).start();

    if (multiSelectEnabled) {
      setNotificationContainerVisiblity(false);
    }
  }, [multiSelectEnabled]);

  // Run the animation when notification composer visiblility is toggled.
  useEffect(() => {
    Animated.timing(notificationContainerAnimated.current, {
      toValue: showNotificationContainer ? 1 : 0,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [showNotificationContainer]);

  const yearDiff = moment().diff(moment(dob), "years");
  let genderLogo = R.Images.Gender.Male;

  switch (gender) {
    case GENDER.FEMALE:
      genderLogo = R.Images.Gender.Female;
      break;

    case GENDER.OTHER:
      genderLogo = R.Images.Gender.Other;
      break;
  }

  const checkboxWidthInterpolation = animation.current.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 20],
  });

  const notificationHeightInterpolation =
    notificationContainerAnimated.current.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 180],
    });

  // Callbacks...
  const onItemLongPress = () => {
    if (isAdmin) {
      return;
    }
    onLongPress?.(donor);
  };

  const onItemPress = () => {
    if (isAdmin) {
      return;
    }

    // if multiSelectEnabled is enabled, then treat the press event like long press and highlight it in selection
    if (multiSelectEnabled) {
      onItemLongPress();
    } else {
      if (hideNotificationComposer) {
        return;
      }
      setNotificationContainerVisiblity(!showNotificationContainer);
    }
  };

  // When number is clicked open the default dialer
  const dialCall = () => {
    let phoneNumber = "";

    if (Platform.OS === "android") {
      phoneNumber = `tel:${+phoneNumber}`;
    } else {
      phoneNumber = `telprompt:${+phoneNumber}`;
    }

    Linking.openURL(phoneNumber);
  };

  // Check whether donation is made within 15 days, If true don't allow to send notifcation of selection,
  // It is for controlling how frequently notification can be sent to the user
  const hasDonatedWithin15days =
    moment().diff(moment(lastBloodDonation), "days") < 15;

  return (
    <TouchableOpacity
      style={{
        flexDirection: "row",
        opacity: 1,
      }}
      onLongPress={onItemLongPress}
      onPress={onItemPress}
      activeOpacity={1}
      disabled={hasDonatedWithin15days || isAdmin}
    >
      {/* Selection checkbox, initally it is hidden and when multiple selection is enabled, it it animated to the position */}
      <Animated.View
        style={{
          width: checkboxWidthInterpolation,
          justifyContent: "center",
          overflow: "hidden",
        }}
      >
        <Checkbox selected={isSelected} />
      </Animated.View>

      <View
        style={{
          flex: 1,
          backgroundColor: R.Colors.PrimaryColor,
          borderRadius: 10,
          overflow: "hidden",
        }}
      >
        <View
          style={[
            Styles.containerStyle,
            {
              backgroundColor: hasDonatedWithin15days
                ? R.Colors.DisabledColor
                : R.Colors.PrimaryColor,
            },
          ]}
        >
          <Avatar name={name} style={{ alignSelf: "center" }} />

          <View style={{ flex: 1, paddingHorizontal: 10 }}>
            <AppText type="small" leftIcon={genderLogo}>
              {name}
            </AppText>

            <AppText type="small" leftIcon={R.Images.AGE}>
              Age: {yearDiff} years
            </AppText>

            <AppText
              onPress={dialCall}
              type="small"
              leftIcon={R.Images.Contact.Phone}
              containerStyle={{ marginTop: 2 }}
            >
              {phoneNumber}
            </AppText>

            <AppText
              type="small"
              containerStyle={{ marginTop: 2 }}
              leftIcon={R.Images.Contact.Mail}
            >
              {emailId}
            </AppText>

            <AppText type="small" leftIcon={R.Images.AGE}>
              Last donation: {lastBloodDonation}
            </AppText>

            {hasDonatedWithin15days && (
              <AppText type="small" style={{ marginTop: 10 }}>
                Donated within 15 days. Can't dontate again
              </AppText>
            )}
          </View>

          <View
            style={{
              justifyContent: "center",
              alignItems: "center",
              marginTop: 10,
              marginBottom: 10,
            }}
          >
            <View style={Styles.bloodGroupContainer}>
              <AppText style={Styles.bloodGroupTextStyle}>{bloodGroup}</AppText>
            </View>

            <TouchableOpacity
              hitSlop={{ top: 10, bottom: 10, right: 10, left: 10 }}
              onPress={() => {
                navigation.navigate("DonorProfile", {
                  donor,
                });
              }}
            >
              <AppText
                containerStyle={{
                  justifyContent: "center",
                  marginBottom: 5,
                  marginTop: 10,
                }}
                type="small"
              >
                {"View Profile >>>"}
              </AppText>
            </TouchableOpacity>
          </View>
        </View>

        {/* notification composer view, when card is clicked on, this view slide down which allows to sent notification to an individual user */}
        <Animated.View
          style={{
            height: notificationHeightInterpolation,
          }}
        >
          <NotificationSenderView
            userId={loginUserId}
            users={[donor]}
            onSuccess={() => {
              setNotificationContainerVisiblity(false);
            }}
          />
        </Animated.View>
      </View>
    </TouchableOpacity>
  );
}
