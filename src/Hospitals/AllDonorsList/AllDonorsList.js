/** @format */

import React, { Component } from "react";
import {
  Animated,
  FlatList,
  Image,
  SafeAreaView,
  Text,
  View,
} from "react-native";
import ScreenContainer from "../../Components/ScreenContainer/ScreenContainer";
import firebase from "firebase";
import AppText from "../../Components/AppText/AppText";
import { Value } from "react-native-reanimated";
import DonorDetailsCard from "../../Components/DonorDetailsCard/DonorDetailsCard";
import Styles from "./styles";
import { DATABASE_NODES, SortBy, SortType, USER_TYPE } from "../../Utils/Enums";
import R from "../../Utils/R";
import DonorFilter from "../../Components/DonorFilter/DonorFilter";
import { inject, observer } from "mobx-react";
import moment from "moment";
import { UserType } from "../../Utils/Images";
import NotificationSenderView from "../../Components/NotificationSenderView/NotificationSenderView";
import EmptyListComponent from "../../Components/EmptyListComponent/EmptyListComponent";

@inject("userStore")
@observer
export default class AllDonorsList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      donorsList: [],
      filteredList: [],
      multiSelectEnabled: false,
      selectedDonors: [],
      multiSelectionAnimated: new Animated.Value(0),
      loading: true,
    };
  }

  componentDidMount() {
    this.fetchDonorsList();
  }

  onItemLongPress = (donor) => {
    const { selectedDonors } = this.state;

    const isAlreadyPresent = selectedDonors.some((value) => {
      return value.uid === donor.uid;
    });

    let newDonorList = [];

    if (isAlreadyPresent) {
      newDonorList = selectedDonors.filter((value) => {
        return value.uid !== donor.uid;
      });
    } else {
      newDonorList = [...selectedDonors, donor];
    }

    const hasMultiSelectEnabled = newDonorList.length > 0;

    this.setState({
      multiSelectEnabled: hasMultiSelectEnabled,
      selectedDonors: newDonorList,
    });

    this.runAnimation(hasMultiSelectEnabled ? 1 : 0);
  };

  runAnimation = (toValue) => {
    const { multiSelectionAnimated } = this.state;

    Animated.timing(multiSelectionAnimated, {
      toValue,
      duration: 400,
      useNativeDriver: true,
    }).start();
  };

  onDonorClick = (donor) => {
    const { multiSelectEnabled } = this.state;

    if (multiSelectEnabled) {
      this.onItemLongPress(donor);
    } else {
    }
  };

  fetchDonorsList() {
    firebase
      .database()
      .ref(DATABASE_NODES.DONORS)
      .on("value", (snapshot) => {
        const response = snapshot.val();

        const donorsList = [];

        for (const userId in response) {
          const user = response[userId];

          const {emailVerified} = user;

          if(emailVerified) {
            donorsList.push(user);
          }
        }

        this.setState({ donorsList, filteredList: donorsList, loading: false });
      });
  }

  renderItem = ({ item, index }) => {
    const { multiSelectEnabled, selectedDonors } = this.state;
    const { userId, userType } = this.props.userStore;

    const isSelected = selectedDonors.some((value) => {
      console.log(value, item);
      return value.uid === item.uid;
    });

    return (
      <DonorDetailsCard
        donor={item}
        multiSelectEnabled={multiSelectEnabled}
        selectedDonors={selectedDonors}
        isSelected={isSelected}
        onLongPress={this.onItemLongPress}
        loginUserId={userId}
        isAdmin={userType === USER_TYPE.ADMIN}
      />
    );
  };

  renderItemSeparator = () => {
    return <View style={{ height: 10 }} />;
  };

  onUpdateFilters = (values) => {
    const {
      age: filterAge,
      gender: filterGender,
      bloodGroup: filterBloodGroups,
      searchText,
      sortType,
      sortBy,
    } = values;
    const { donorsList } = this.state;

    let newDonorList = [];

    // Applying age filter
    newDonorList = [...donorsList].filter((value) => {
      const { dob } = value;
      const age = moment().diff(moment(dob), "years");

      return filterAge <= age;
    });

    // Applying Gender filter
    if (filterGender?.length !== 0) {
      newDonorList = [...newDonorList].filter((value) => {
        const { gender } = value;

        console.log("Gender", gender, filterGender);

        return gender === filterGender[0];
      });
    }

    // Applying blood group filters
    if (filterBloodGroups?.length !== 0) {
      newDonorList = [...newDonorList].filter((value) => {
        const { bloodGroup } = value;

        return filterBloodGroups.includes(bloodGroup);
      });
    }


    if (searchText?.length !== 0) {
      newDonorList = [...newDonorList].filter((value) =>
        value.name?.toLowerCase().includes(searchText?.toLowerCase())
      );
    }

    if (sortBy) {
      newDonorList = [...newDonorList].sort((donor1, donor2) => {
        switch (sortBy) {
          case SortBy.DONOR_NAME:
            return donor1.name > donor2.name;

          case SortBy.LAST_DONATION:
            return (
              moment(donor1.donorInfo?.lastBloodDonation) >
              moment(donor2.donorInfo?.lastBloodDonation)
            );

          case SortBy.BLOOD_GROUP:
            return donor1.bloodGroup > donor2.bloodGroup;
        }
      });
    }

    if (sortType === SortType.DESCENDING) {
      newDonorList.reverse();
    }

    this.setState({ filteredList: newDonorList });
  };

  getNotificationComposerViewAnimatedStyle = () => {
    const { multiSelectionAnimated } = this.state;

    const translationInterpolation = multiSelectionAnimated.interpolate({
      inputRange: [0, 1],
      outputRange: [400, 0],
    });

    return {
      borderRadius: 10,
      overflow: "hidden",
      position: "absolute",
      bottom: 0,
      left: 10,
      right: 10,
      bottom: 10,
      transform: [
        {
          translateY: translationInterpolation,
        },
      ],
    };
  };

  render() {
    const {
      filteredList,
      multiSelectEnabled,
      selectedDonors,
      loading,
    } = this.state;
    const { userId } = this.props.userStore;
    const notificationComposerStyle = this.getNotificationComposerViewAnimatedStyle();

    return (
      <ScreenContainer loading={loading}>
        <View style={Styles.containerStyle}>
          <AppText
            type="heading"
            style={{ textAlign: "center", width: "100%", marginBottom: 10 }}
          >
            Find Donor
          </AppText>

          <DonorFilter onUpdateFilters={this.onUpdateFilters} />

          <FlatList
            showsVerticalScrollIndicator={false}
            style={{ marginTop: 20, flex: 1 }}
            contentContainerStyle={{
              paddingBottom: multiSelectEnabled ? 200 : 10,
              flex: filteredList.length > 0 ?  0 : 1,
            }}
            data={filteredList}
            renderItem={this.renderItem}
            ListEmptyComponent={() => {
              return <EmptyListComponent loading={loading} />;
            }}
            ItemSeparatorComponent={this.renderItemSeparator}
            keyExtractor={(value) => {
              return value.uid;
            }}
          />

          <Animated.View style={notificationComposerStyle}>
            <NotificationSenderView
              users={selectedDonors}
              userId={userId}
              onSuccess={() => {
                this.setState({ multiSelectEnabled: false });
                this.runAnimation(0);
              }}
            />
          </Animated.View>
        </View>
      </ScreenContainer>
    );
  }
}
