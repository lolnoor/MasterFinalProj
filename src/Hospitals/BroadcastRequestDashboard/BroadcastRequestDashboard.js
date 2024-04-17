import { View, Text, FlatList } from "react-native";
import React, { useEffect, useState } from "react";

import Styles from "./styles";
import { fetchHospitalBroadcast } from "../../Utils/API";
import EmptyListComponent from "../../Components/EmptyListComponent/EmptyListComponent";
import AppText from "../../Components/AppText/AppText";
import BroadcastMessageInfo from "../../Components/BroadcastMessageInfo/BroadcastMessageInfo";
import firebase from "firebase";
import { DATABASE_NODES } from "../../Utils/Enums";
import moment from "moment";

const renderSeparator = () => {
  return <View style={{ height: 10 }} />;
};

export default function BroadcastRequestDashboard({ userStore }) {
  const [loading, updateLoading] = useState(false);
  const [allRequests, updateAllRequest] = useState([]);

  const loadBroadcastMessage = async () => {
    updateLoading(true);
    
    firebase
      .database()
      .ref(`${DATABASE_NODES.HOSPITAL_BROADCAST}/${userStore.userId}`)
      .orderByChild("expireOn")
      // .startAt(moment().toString())
      .on("value", (snapshot) => {
        const values = snapshot.val();

        const allRequest = [];

        for (const key in values) {
          const element = values[key];
          allRequest.push(element);
        }

        updateLoading(false);
        updateAllRequest(allRequest);
      });
  };

  const renderItem = ({ item, index }) => {
    const { broadcastId, expireOn } = item;

    return <BroadcastMessageInfo broadcastId={broadcastId} />;
  };

  useEffect(() => {
    loadBroadcastMessage();
  }, [userStore.userId]);

  return (
    <View style={Styles.containerStyle}>
      <FlatList
        style={{ height: "100%", marginTop: 20 }}
        contentContainerStyle={{
          flex: allRequests?.length > 0 ? 0 : 1,
        }}
        extraData={JSON.stringify(allRequests)}
        data={allRequests}
        ListEmptyComponent={() => {
          return (
            <EmptyListComponent label="No request sent." loading={loading} />
          );
        }}
        renderItem={renderItem}
        ItemSeparatorComponent={renderSeparator}
      />
    </View>
  );
}
