/** @format */

import React from "react";
import { Image } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import Dashboard from "../Hospitals/Dashboard/Dashboard";
import DonorProfile from "../Hospitals/DonorProfile/DonorProfile";
import Profile from "../Donors/Profile/Profile";
import AllDonorsList from "../Hospitals/AllDonorsList/AllDonorsList";
import R from "../Utils/R";
import BroadcastRequest from "../Hospitals/BroadcastRequest/BroadcastRequest";

const Tabs = createBottomTabNavigator();
const Stack = createStackNavigator();

const BottomTab = () => {
  return (
    <Tabs.Navigator headerMode={"none"}>
      <Tabs.Screen
        name="HospitalDashboard"
        component={Dashboard}
        options={{
          title: "Dashboard",
          tabBarIcon: () => {
            return (
              <Image
                source={R.Images.UserType.Donor}
                style={{ width: 16, height: 16, resizeMode: "contain" }}
              />
            );
          },
        }}
      />

      <Tabs.Screen
        name="AllDonorsList"
        component={AllDonorsList}
        options={{
          title: "All Donors",
          tabBarIcon: () => {
            return (
              <Image
                source={R.Images.UserType.Donor}
                style={{ width: 16, height: 16, resizeMode: "contain" }}
              />
            );
          },
        }}
      />

      <Tabs.Screen
        name="Broadcast"
        component={BroadcastRequest}
        options={{
          title: "Broadcast",
          tabBarIcon: () => {
            return (
              <Image
                source={R.Images.BROADCAST}
                style={{ width: 16, height: 16, resizeMode: "contain" }}
              />
            );
          },
        }}
      />

      <Tabs.Screen
        name="Profile"
        component={Profile}
        options={{
          tabBarIcon: () => {
            return (
              <Image
                source={R.Images.PROFILE}
                style={{ width: 16, height: 16, resizeMode: "contain" }}
              />
            );
          },
        }}
      />
    </Tabs.Navigator>
  );
};

const HospitalNavigation = () => {
  return (
    <Stack.Navigator headerMode="none">
      <Stack.Screen name="Tabs" component={BottomTab} />

      <Stack.Screen name="DonorProfile" component={DonorProfile} />
    </Stack.Navigator>
  );
};

export default HospitalNavigation;
