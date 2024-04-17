/** @format */

import React, { Component } from "react";
import { FlatList, Text, View } from "react-native";
import firebase from "firebase";
import moment from "moment";
import ScreenContainer from "../../Components/ScreenContainer/ScreenContainer";
import { DATABASE_NODES, SortBy, SortType } from "../../Utils/Enums";
import { inject, observer } from "mobx-react";
import NotificationCard from "../../Components/NotificationCard/NotificationCard";
import AppText from "../../Components/AppText/AppText";
import R from "../../Utils/R";
import EmptyListComponent from "../../Components/EmptyListComponent/EmptyListComponent";
import App from "../../../App";
import HospitalFilter from "../../Components/HospitalFilter/HospitalFilter";
import ViewPager from "@react-native-community/viewpager";
import BroadcastRequestDashboard from "../BroadcastRequestDashboard/BroadcastRequestDashboard";

@inject("userStore")
@observer
export default class Dashboard extends Component {
  pagerRef = null;

  constructor(props) {
    super(props);

    this.state = {
      allNotification: [],
      loading: true,
      filteredList: [],
      filters: {
        requestType: null,
        bloodGroup: null,
        sortBy: SortBy.SEND_ON,
        sortType: SortType.ASCENDING,
        searchText: "",
        currentPage: 0,
      },
    };
  }

  componentDidMount() {
    this.fetchAllNotification();
  }

  fetchAllNotification = () => {
    const { userId } = this.props.userStore;

    firebase
      .database()
      .ref(`${DATABASE_NODES.HOSPITAL_NOTIFICATION}/${userId}`)
      .on("value", (data) => {
        const allNotification = data.val();

        const notifications = [];

        for (var id in allNotification) {
          const notification = allNotification[id];
          notifications.push(notification);
        }
        this.setState({
          allNotification: notifications,
          loading: false,
        });

        console.log("all notifications are", notifications);

        this.onFilterUpdate(this.state.filters);
      });
  };

  categoriesNotification = (notification) => {
    const { status } = notification;
  };

  renderItems = ({ item }) => {
    return <NotificationCard item={item} />;
  };

  renderSeparator = () => {
    return <View style={{ height: 10 }} />;
  };

  onFilterUpdate = (newState) => {
    const { allNotification } = this.state;
    const { requestType, bloodGroup, sortBy, sortType, searchText } = newState;

    let filteredList = allNotification;

    if (requestType && requestType !== "All") {
      filteredList = filteredList.filter(
        (notification) => notification.status === requestType
      );
    }

    if (bloodGroup) {
      filteredList = filteredList.filter(
        (notification) => notification.donorInfo?.bloodGroup === bloodGroup
      );
    }

    if (searchText) {
      filteredList = filteredList.filter(
        (notification) =>
          notification.donorInfo?.name
            ?.toLowerCase()
            ?.includes(searchText.toLowerCase()) ||
          notification.hospitalInfo?.name
            ?.toLowerCase()
            ?.includes(searchText.toLowerCase())
      );
    }

    if (sortBy) {
      filteredList.sort((notif1, notif2) => {
        switch (sortBy) {
          case SortBy.DONOR_NAME:
            return notif1.donorInfo?.name > notif2.donorInfo?.name;

          case SortBy.HOSPITAL_NAME:
            return notif1.hospitalInfo?.name > notif2.hospitalInfo?.name;

          case SortBy.SEND_ON:
            return moment(notif1.sendOn) > moment(notif2.sendOn);

          case SortBy.EXPIRE_ON:
            return moment(notif1.expireOn) > moment(notif2.expireOn);
        }
      });
    }

    if (sortType === SortType.DESCENDING) {
      filteredList.reverse();
    }

    this.setState({
      filters: newState,
      filteredList,
    });
  };

  onPageIndexChange = ({ nativeEvent }) => {
    const { position } = nativeEvent;

    this.setState({ selectedIndex: position });
  };

  render() {
    const { filteredList, loading, filters, selectedIndex = 0 } = this.state;

    return (
      <ScreenContainer loading={loading}>
        <View style={{ flex: 1, padding: 10 }}>
          <View style={{ flexDirection: "row" }}>
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <AppText
                onPress={() => {
                  this.pagerRef.setPage(0);
                }}
                style={{
                  color:
                    selectedIndex === 0 ? R.Colors.TextRed : R.Colors.TextColor,
                }}
              >
                Direct Request
              </AppText>
            </View>

            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <AppText
                style={{
                  color:
                    selectedIndex === 1 ? R.Colors.TextRed : R.Colors.TextColor,
                }}
                onPress={() => {
                  this.pagerRef.setPage(1);
                }}
              >
                Broadcast Request
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
            <View key={"ref1"}>
              <HospitalFilter
                filters={filters}
                onFilterUpdate={this.onFilterUpdate}
              />

              <FlatList
                style={{ height: "100%", marginTop: 20 }}
                contentContainerStyle={{
                  flex: filteredList?.length > 0 ? 0 : 1,
                }}
                data={filteredList}
                ListEmptyComponent={() => {
                  return (
                    <EmptyListComponent
                      label="No request sent."
                      loading={loading}
                    />
                  );
                }}
                renderItem={this.renderItems}
                ItemSeparatorComponent={this.renderSeparator}
              />
            </View>

            <View key={"ref2"}>
              <BroadcastRequestDashboard userStore={this.props.userStore} />
            </View>
          </ViewPager>
        </View>
      </ScreenContainer>
    );
  }
}

// Tech stack is : React Native Framework (Managed Flow or using expo)
/**
 *    Managed Flow :- using expo
 *    Bare Flow :- using cli command
 *
 * For Navigation
 *    using library: react-native-navigation (most popular library)
 *
 *
 */
