/** @format */

import React, { Component } from "react";
import { FlatList, Image, TouchableOpacity, View } from "react-native";
import { inject, observer } from "mobx-react";
import firebase from "firebase";
import ScreenContainer from "../../Components/ScreenContainer/ScreenContainer";
import R from "../../Utils/R";
import AppText from "../../Components/AppText/AppText";
import { DATABASE_NODES, REQUEST_STATUS, SortType } from "../../Utils/Enums";
import NotificationCard from "../../Components/NotificationCard/NotificationCard";
import ViewPager from "@react-native-community/viewpager";
import EmptyListComponent from "../../Components/EmptyListComponent/EmptyListComponent";

@inject("userStore")
@observer
export default class Dashboard extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedIndex: 0,
      upcomingNotification: [],
      pendingNotification: [],
      loading: true,
    };
  }

  async componentDidMount() {
    // await Location.requestPermissionsAsync();
    // let location = await Location.getCurrentPositionAsync({});

    // console.log("Location is", location);

    const {
      userStore: { userId },
    } = this.props;

    console.log(userId);

    firebase
      .database()
      .ref(`${DATABASE_NODES.DONOR_NOTIFICATION}/${userId}`)
      .on("value", (snapshot) => {
        const data = snapshot.val() ?? {};

        console.log("value is", data);

        const notifications = [];

        for (let key in data) {
          const notification = data[key];
          notifications.push(notification);
        }

        const filterNotification = notifications
          .sort(R.HelperFunctions.CompoareNotificationBySendOn)
          .filter((notif) => {
            const hasExpired = R.HelperFunctions.hasNotificationExpired(notif);
            return notif.status === REQUEST_STATUS.ACCEPTED && !hasExpired;
          });

        const pendingNotification = notifications
          .sort(R.HelperFunctions.CompoareNotificationBySendOn)
          .filter((notif) => {
            const hasExpired = R.HelperFunctions.hasNotificationExpired(notif);
            return notif.status === REQUEST_STATUS.PENDING && !hasExpired;
          });

        this.setState({
          upcomingNotification: filterNotification,
          pendingNotification,
          loading: false,
        });
      });
  }

  onPageIndexChange = ({ nativeEvent }) => {
    const { position } = nativeEvent;

    this.setState({ selectedIndex: position });
  };

  render() {
    const {
      upcomingNotification = [],
      pendingNotification = [],
      selectedIndex,
      loading,
    } = this.state;

    return (
      <ScreenContainer loading={loading}>
        <TouchableOpacity
          onPress={() => {
            this.props.navigation.navigate("TutorialScreen", {
              isFromApp: true,
            });
          }}
        >
          <Image
            source={R.Images.INFO}
            style={{
              width: 16,
              height: 16,
              alignSelf: "flex-end",
              paddingHorizontal: 20,
            }}
            resizeMode="contain"
          />
        </TouchableOpacity>

        <View style={{ flexDirection: "row" }}>
          <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
          >
            <AppText
              onPress={() => {
                this.pagerRef.setPage(0);
              }}
              style={{ color: selectedIndex === 0 ? R.Colors.TextRed : R.Colors.TextColor }}
            >
              Upcoming
            </AppText>
          </View>

          <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
          >
            <AppText
               style={{ color: selectedIndex === 1 ? R.Colors.TextRed : R.Colors.TextColor }}
              onPress={() => {
                this.pagerRef.setPage(1);
              }}
            >
              Pending
            </AppText>
          </View>
        </View>

        <ViewPager
          ref={(ref) => {
            this.pagerRef = ref;
          }}
          style={{ flex: 1 }}
          initialPage={0}
          onPageSelected={this.onPageIndexChange}
        >
          <View key="1" style={{ padding: 10 }}>
            <FlatList
              contentContainerStyle={{
                flex: upcomingNotification?.length > 0 ? 0 : 1,
              }}
              data={upcomingNotification}
              ListEmptyComponent={() => {
                return (
                  <EmptyListComponent
                    label="No Upcoming notification"
                    loading={loading}
                  />
                );
              }}
              renderItem={({ item }) => {
                return (
                  <View style={{ marginTop: 10 }}>
                    <NotificationCard item={item} isDonor />
                  </View>
                );
              }}
            />
          </View>

          <View key="2" style={{ padding: 10 }}>
            <FlatList
              contentContainerStyle={{
                flex: pendingNotification?.length > 0 ? 0 : 1,
              }}
              data={pendingNotification}
              ListEmptyComponent={() => {
                return (
                  <EmptyListComponent
                    label="No Pending notification"
                    loading={loading}
                  />
                );
              }}
              renderItem={({ item }) => {
                return (
                  <View style={{ marginTop: 10 }}>
                    <NotificationCard item={item} isDonor />
                  </View>
                );
              }}
            />
          </View>
        </ViewPager>
      </ScreenContainer>
    );
  }
}
