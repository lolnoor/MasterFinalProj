/** @format */

import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import Login from "../Login/Login";
import SplashScreen from "../SplashScreen/SplashScreen";
import Registration from "../Registration/Registration";
import DonorNavigation from "./DonorNavigation";
import HospitalNavigation from "./HospitalNavigation";
import AdminNavigation from "./AdminNavigation";
import TutorialScreen from "../TutorialScreen/TutorialScreen";

const Stack = createStackNavigator();

const AppNavigation = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator headerMode={"none"}>
        <Stack.Screen name="SplashScreen" component={SplashScreen} />
        <Stack.Screen name="TutorialScreen" component={TutorialScreen} />
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Registration" component={Registration} />
        <Stack.Screen name="Donor" component={DonorNavigation} />
        <Stack.Screen name="Hospital" component={HospitalNavigation} />
        <Stack.Screen name="Admin" component={AdminNavigation} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigation;
