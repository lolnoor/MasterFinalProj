import {
  View,
  Text,
  FlatList,
  Alert,
  KeyboardAvoidingView,
} from "react-native";
import React, { useEffect, useState } from "react";
import { fetchFilteredDonorList } from "../../Utils/API";
import EmptyListComponent from "../../Components/EmptyListComponent/EmptyListComponent";
import DonorDetailsCard from "../../Components/DonorDetailsCard/DonorDetailsCard";
import { USER_TYPE } from "../../Utils/Enums";
import AppButton from "../../Components/AppButton/AppButton";
import Spacer from "../../Components/Spacer/Spacer";
import NotificationSenderView from "../../Components/NotificationSenderView/NotificationSenderView";
import moment from "moment";

const renderItemSeparator = () => {
  return <View style={{ height: 10 }} />;
};

export default function BroadcastDonorList({ bloodGroup, city, userStore }) {
  const { userId } = userStore;

  const [filteredDonorList, updateFilteredDonorList] = useState([]);
  const [donorList, updateDonorList] = useState([]);
  const [showNotificationComposer, updateShowNotificationComponser] =
    useState();

  const [eligleForDontationsDonorList, updateEligleDonorList] = useState([]);

  const fetchDonorList = async () => {
    try {
      let donors = await fetchFilteredDonorList(city);

      const filtered = donors.filter(
        (value) => value.bloodGroup === bloodGroup
      );

      updateFilteredDonorList(filtered);
      updateDonorList(donors);
    } catch (error) {
      console.log("error is", error);
    }
  };

  const renderItem = ({ item, index }) => {
    return (
      <DonorDetailsCard
        donor={item}
        multiSelectEnabled={false}
        selectedDonors={[]}
        isSelected={false}
        loginUserId={userId}
        isAdmin={true}
      />
    );
  };

  const onPressSend = () => {
    Alert.alert(
      "Attention!!!",
      "Are you sure you want to send notification to all the donors. \n\nNote. Notification will not be send to donors who have donated within 15 days",
      [
        {
          text: "Cancel",
        },
        {
          text: "Confirm",
          onPress: () => {

            const donorList = filteredDonorList.filter((value) => {
              console.log("value is", value);
              return moment().diff(moment(value.donorInfo?.lastBloodDonation), "days") > 15;
            })

            updateEligleDonorList(donorList);
            updateShowNotificationComponser(true);
          },
        },
      ]
    );
  };

  const onCancelSendNotification = () => {
    updateShowNotificationComponser(false);
  };

  useEffect(() => {
    fetchDonorList();
  }, [city]);

  useEffect(() => {
    const donors = donorList.filter((value) => value.bloodGroup === bloodGroup);

    updateFilteredDonorList(donors);
  }, [bloodGroup]);

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, marginBottom: 10 }}
      behavior="padding"
    >
      <FlatList
        showsVerticalScrollIndicator={false}
        style={{ marginTop: 20, flex: 1 }}
        contentContainerStyle={{
          flex: filteredDonorList.length > 0 ? 0 : 1,
        }}
        data={filteredDonorList}
        renderItem={renderItem}
        ListEmptyComponent={() => {
          return <EmptyListComponent loading={false} />;
        }}
        ItemSeparatorComponent={renderItemSeparator}
        keyExtractor={(value) => {
          return value.uid;
        }}
      />

      <Spacer />

      {filteredDonorList?.length > 0 && !showNotificationComposer && (
        <AppButton title="Send Notification to all" onPress={onPressSend} />
      )}

      {showNotificationComposer && (
        <NotificationSenderView
          isBroadcastMessage
          onCancel={onCancelSendNotification}
          userId={userId}
          users={eligleForDontationsDonorList}
          onSuccess={onCancelSendNotification}
        />
      )}
    </KeyboardAvoidingView>
  );
}
