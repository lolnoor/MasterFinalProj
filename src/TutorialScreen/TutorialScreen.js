/** @format */

import React, { Component } from "react";
import { Image, Text, View } from "react-native";
import ScreenContainer from "../Components/ScreenContainer/ScreenContainer";
import ViewPager from "@react-native-community/viewpager";
import AppText from "../Components/AppText/AppText";
import R from "../Utils/R";
import AppButton from "../Components/AppButton/AppButton";
import { inject, observer } from "mobx-react";

@inject("userStore")
@observer
export default class TutorialScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      currentPage: 0,
    };

    // Once on this screen, update the userStore, so that screen is not visbile again
    props.userStore.firstTimeInstall = false;
  }

  onPageScroll = ({ nativeEvent }) => {
    const { position } = nativeEvent;

    this.setState({
      currentPage: position,
    });
  };

  render() {
    const { currentPage } = this.state;
    const { navigation, route } = this.props;

    const isFromApp = route?.params?.isFromApp ?? false;

    return (
      <ScreenContainer>
        <ViewPager
          style={{ flex: 1 }}
          showPageIndicator
          onPageScroll={this.onPageScroll}
        >
          <View key={"1"}>
            <Tutorial
              label="Page 1"
              logo={R.Images.EMPTY_COMPONENT}
              description="Pariatur ullamco amet aliqua minim nisi Lorem occaecat occaecat aute Lorem. Dolor ipsum sunt officia est consequat labore minim pariatur. Commodo eiusmod aliqua dolore do officia enim nostrud cillum Lorem qui eu. Sint nulla qui ullamco incididunt consectetur nulla veniam excepteur laborum reprehenderit."
            />
          </View>

          <View key={"2"}>
            <Tutorial
              label="Page 1"
              logo={R.Images.EMPTY_COMPONENT}
              description="Ut veniam pariatur occaecat id exercitation dolore non excepteur veniam commodo ex voluptate velit exercitation. Adipisicing do proident non do. Ad esse nostrud aliqua commodo do ex velit elit magna cupidatat ut aliquip nisi nostrud. Quis duis qui laboris culpa enim ipsum ex ullamco nostrud. Et culpa dolor nostrud elit anim non. Aute excepteur fugiat esse laborum deserunt id est pariatur culpa."
            />
          </View>

          <View key={"3"}>
            <Tutorial
              label="Page 1"
              logo={R.Images.EMPTY_COMPONENT}
              description="Description 1"
            />
          </View>
          
        </ViewPager>

        <View
          style={{
            height: 50,
            alignItems: "flex-end",
            paddingHorizontal: 20,
          }}
        >
          <AppText
            onPress={() => {
              if (isFromApp) {
                navigation.goBack();
              } else {
                R.HelperFunctions.resetStack(navigation, "Login");
              }
            }}
          >
            {/* Show login button when we are on last page. */}
            {currentPage == 2 ? (isFromApp ? "Continue" : "Login") : "Skip"}
          </AppText>
        </View>
      </ScreenContainer>
    );
  }
}

const Tutorial = ({ label, logo, description }) => {
  return (
    <View
      style={{
        marginTop: 100,
        alignItems: "center",
        flex: 1,
        paddingHorizontal: 20,
      }}
    >
      <Image
        style={{ height: 250, width: 250, resizeMode: "contain" }}
        source={logo}
      />
      <AppText
        type="heading"
        style={{ marginTop: 10, color: R.Colors.SelectedBlue }}
      >
        {label}
      </AppText>

      <AppText style={{ marginTop: 5 }}>{description}</AppText>
    </View>
  );
};
