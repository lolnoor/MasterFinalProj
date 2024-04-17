/** @format */

import { inject, observer } from "mobx-react";
import React, { Component } from "react";
import { FlatList, SafeAreaView, Text, View } from "react-native";
import ScreenContainer from "../../Components/ScreenContainer/ScreenContainer";
import firebase from "firebase";
import { DATABASE_NODES, REQUEST_STATUS } from "../../Utils/Enums";
import NotificationCard from "../../Components/NotificationCard/NotificationCard";
import R from "../../Utils/R";
import EmptyListComponent from "../../Components/EmptyListComponent/EmptyListComponent";

@inject("userStore")
@observer
export default class AllBloodRequest extends Component {
  constructor(props) {
    super(props);

    this.state = {
      allNotifications: [],
      loading: true,
    };
  }

  componentDidMount() {
    this.fetchAllRequest();
  }

  fetchAllRequest = () => {
    const {
      userStore: { userId },
    } = this.props;

    firebase
      .database()
      .ref(`${DATABASE_NODES.DONOR_NOTIFICATION}/${userId}`)
      .on("value", (snapshot) => {
        const data = snapshot.val() ?? {};

        const notifications = [];

        for (let key in data) {
          const notification = data[key];
          notifications.push(notification);
        }

        const filterData = notifications
          .filter((item) => {
            return item.status === REQUEST_STATUS.COMPLETED;
          })
          .sort(R.HelperFunctions.CompoareNotificationBySendOn);

        this.setState({ allNotifications: filterData, loading: false });
      });
  };

  renderItem = ({ item }) => {
    return <NotificationCard item={item} isDonor />;
  };

  renderItemSeparator = () => {
    return <View style={{ height: 10 }} />;
  };

  render() {
    const { allNotifications, loading } = this.state;

    return (
      <ScreenContainer>
        <View style={{ padding: 10, flex: 1 }}>
          <FlatList
            contentContainerStyle={{ flex: 1 }}
            keyExtractor={(item) => {
              return `${item.notificationId}`;
            }}
            data={allNotifications}
            renderItem={this.renderItem}
            ItemSeparatorComponent={this.renderItemSeparator}
            ListEmptyComponent={() => {
              return <EmptyListComponent loading={loading} />;
            }}
          />
        </View>
      </ScreenContainer>
    );
  }
}
