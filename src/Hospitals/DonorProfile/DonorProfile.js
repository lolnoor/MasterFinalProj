/** @format */

import React, { Component } from "react";
import {
  FlatList,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import firebase from "firebase";
import moment from "moment";
import AppText from "../../Components/AppText/AppText";
import Avatar from "../../Components/Avatar/Avatar";
import DonorDetailsCard from "../../Components/DonorDetailsCard/DonorDetailsCard";
import ScreenContainer from "../../Components/ScreenContainer/ScreenContainer";
import { DATABASE_NODES, REQUEST_STATUS } from "../../Utils/Enums";
import R from "../../Utils/R";
import NotificationCard from "../../Components/NotificationCard/NotificationCard";
import EmptyListComponent from "../../Components/EmptyListComponent/EmptyListComponent";
import Styles from "./styles";
export default class DonorProfile extends Component {
  constructor(props) {
    super(props);

    this.state = {
      completedNotification: [],
    };
  }

  componentDidMount() {
    const { route } = this.props;
    const donor = route?.params?.donor ?? {};
    const userId = donor?.uid;
    console.log(userId);

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

        const filterNotification = notifications
          .sort(R.HelperFunctions.CompoareNotificationBySendOn)
          .filter((notif) => {
            return notif.status === REQUEST_STATUS.COMPLETED;
          })
          .reverse();

        this.setState({ completedNotification: filterNotification });
      });
  }

  renderCard = (item) => {
    const { hospitalInfo } = item;

    console.log("hospital info", hospitalInfo);

    return (
      <View
        style={{
          marginTop: 10,
          backgroundColor: R.Colors.PrimaryColor,
          padding: 10,
          borderRadius: 10,
          elevation: 4,
        }}
      >
        <AppText>
          <AppText type="small">Name:</AppText> {hospitalInfo?.name}
        </AppText>

        <AppText>
          <AppText type="small">Email Id: </AppText>
          {hospitalInfo?.emailId}
        </AppText>

        <AppText style={{ marginTop: 5 }}>
          <AppText type="small">Phone number </AppText>
          {hospitalInfo?.phoneNumber}
        </AppText>

        {/* <AppText>
          <AppText type="small">Phone Number: </AppText>
          {hospitalInfo?.phoneNumber}
        </AppText> */}

        <AppText>
          <AppText type="small">Donation date: </AppText>
          {moment(item?.expireOn).format("DD-MM-YYYY")}
        </AppText>
      </View>
    );
  };

  render() {
    const { route } = this.props;
    const { completedNotification } = this.state;

    const donor = route?.params?.donor ?? {};

    return (
      <ScreenContainer>
        <ScrollView style={{ flex: 1 }} contentContainerStyle={{ flex: 1 }}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              paddingHorizontal: 20,
            }}
          >
            <TouchableOpacity onPress={this.props.navigation.goBack}>
              <Image source={R.Images.BACK} style={{ width: 16, height: 16 }} />
            </TouchableOpacity>
            <AppText
              style={{ width: "100%", textAlign: "center" }}
              type="heading"
            >
              Donor Profile
            </AppText>
          </View>

          <View style={{ flexDirection: "row" }}>
            <Avatar name={donor?.name} style={Styles.avatarStyle} />

            <View>
              <View style={{ flexDirection: "row", marginTop: 20 }}>
                <AppText type="small" style={Styles.labelStyle}>
                  Name:
                </AppText>
                <AppText>{donor?.name}</AppText>
              </View>

              <View style={{ flexDirection: "row" }}>
                <AppText type="small" style={Styles.labelStyle}>
                  Blood group:
                </AppText>
                <AppText>{donor?.bloodGroup}</AppText>
              </View>

              <View style={{ flexDirection: "row" }}>
                <AppText type="small" style={Styles.labelStyle}>
                  Email Id:
                </AppText>
                <AppText>{donor?.emailId}</AppText>
              </View>

              <View style={{ flexDirection: "row" }}>
                <AppText type="small" style={Styles.labelStyle}>
                  Phone No:
                </AppText>
                <AppText>{donor?.phoneNumber}</AppText>
              </View>
            </View>
          </View>

          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-evenly",
              marginTop: 20,
            }}
          >
            <View style={{ justifyContent: "center", alignItems: "center" }}>
              <AppText type="small">Smoking</AppText>
              <AppText>{donor?.donorInfo?.smoke}</AppText>
            </View>

            <View style={{ justifyContent: "center", alignItems: "center" }}>
              <AppText type="small">Drinking</AppText>
              <AppText>{donor?.donorInfo?.drink}</AppText>
            </View>

            <View style={{ justifyContent: "center", alignItems: "center" }}>
              <AppText type="small">Donation History</AppText>
              <AppText>{donor?.donorInfo?.lastBloodDonation}</AppText>
            </View>
          </View>

          <AppText
            type="heading"
            style={{ marginTop: 30, paddingHorizontal: 20 }}
          >
            Donation History
          </AppText>

          <View
            style={{
              padding: 10,
              paddingBottom: 20,
              flex: 1,
            }}
          >
            {completedNotification?.map(this.renderCard)}

            {completedNotification?.length === 0 && (
              <View
                style={{
                  flex: 1,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <EmptyListComponent />
              </View>
            )}
          </View>
        </ScrollView>
      </ScreenContainer>
    );
  }
}
