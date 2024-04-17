/** @format */

import React, { Component } from "react";
import { FlatList, Text, View } from "react-native";
import firebase from "firebase";
import ScreenContainer from "../../Components/ScreenContainer/ScreenContainer";
import { DATABASE_NODES } from "../../Utils/Enums";
import HospitalDetailsCard from "../../Components/HospitalDetailsCard/HospitalDetailsCard";
import R from "../../Utils/R";
import EmptyListComponent from "../../Components/EmptyListComponent/EmptyListComponent";
import AppButton from "../../Components/AppButton/AppButton";
import AppText from "../../Components/AppText/AppText";

export default class AllHospitals extends Component {
  constructor(props) {
    super(props);

    this.state = {
      hospitalList: [],
      loading: true,
    };
  }

  componentDidMount() {
    this.fetchAllHospitals();
  }

  fetchAllHospitals = () => {
    firebase
      .database()
      .ref(DATABASE_NODES.HOSPITAL)
      .on("value", (snapshot) => {
        const response = snapshot.val();

        const hospitalList = [];

        for (const userId in response) {
          const user = response[userId];
          hospitalList.push(user);
        }

        this.setState({ hospitalList: hospitalList, loading: false });
      });
  };

  renderItem = ({ item }) => {
    return (
      <View
        style={{
          padding: 5,
          borderRadius: 10,
          backgroundColor: R.Colors.PrimaryColor,
        }}
      >
        <HospitalDetailsCard hospitalInfo={item} />
      </View>
    );
  };

  render() {
    const { hospitalList, loading } = this.state;

    return (
      <ScreenContainer loading={loading}>
        <View style={{ padding: 10, flex: 1 }}>
          <AppText
            type="heading"
            style={{ textAlign: "center", width: "100%", marginBottom: 20 }}
          >
            All Hospitals
          </AppText>

          <FlatList
            contentContainerStyle={{
              flex: hospitalList.length > 0 ?  0 : 1,
            }}
            ListEmptyComponent={() => {
              return <EmptyListComponent loading={loading} />;
            }}
            ItemSeparatorComponent={() => {
              return <View style={{ marginTop: 10 }} />;
            }}
            data={hospitalList}
            renderItem={this.renderItem}
          />
        </View>
      </ScreenContainer>
    );
  }
}
