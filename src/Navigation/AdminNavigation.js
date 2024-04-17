/** @format */

import React from "react";
import { Image, View } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import Dashboard from "../Hospitals/Dashboard/Dashboard";
import Stats from "../Admin/Stats/Stats";
import AllHospitals from "../Admin/AllHospitals/AllHospitals";
import DonorProfile from "../Hospitals/DonorProfile/DonorProfile";
import Profile from "../Donors/Profile/Profile";
import AllDonorsList from "../Hospitals/AllDonorsList/AllDonorsList";
import R from "../Utils/R";
import AppText from "../Components/AppText/AppText";

const Tabs = createBottomTabNavigator();
const Stack = createStackNavigator();

const BottomTab = () => {
  return (
    <Tabs.Navigator headerMode={"none"}>
      <Tabs.Screen
        name="HospitalDashboard"
        component={AllHospitals}
        options={{
          title: "All Hospitals",
          tabBarIcon: () => {
            return (
              <Image
                source={R.Images.UserType.Hospital}
                style={{ width: 16, height: 16, resizeMode: "contain" }}
              />
            );
          },
        }}
      />

      <Tabs.Screen
        name="All Donors"
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
        name="Stats"
        component={Stats}
        options={{
          title: "Statics",
          tabBarIcon: () => {
            return (
              <Image
                source={R.Images.PIE_CHART}
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

const AdminNavigation = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Tabs"
        component={BottomTab}
        options={{
          header: () => {
            return null;
          },
        }}
      />

      <Stack.Screen
        name="DonorProfile"
        component={DonorProfile}
        options={{ headerBackTitleVisible: false }}
      />
    </Stack.Navigator>
  );
};

export default AdminNavigation;
