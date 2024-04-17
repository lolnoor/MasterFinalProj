/** @format */

import React, { Component } from "react";
import { View, Text, Image, TouchableOpacity, Animated } from "react-native";
import R from "../../Utils/R";
import Styles from "./styles";

const { CHIP_HEIGHT } = R.Constants;

/**
 * Component used by ChipGroup to show selection button from an array of options.
 * Chips control the animation and selection of the view.
 *
 * @param {boolean} isSelected control the selection state of the chips. when is changes, it trigger the animation.
 * @param {string} title title of the chip
 * @param {string} logo Logo to show on the chip
 * @param {func} onSelected Callback when chip is selected
 */
export default class Chip extends Component {
  constructor(props) {
    super(props);

    const { isSelected } = props;

    this.state = {
      animatedValue: new Animated.Value(isSelected ? 1 : 0),
    };
  }

  onPress = () => {
    const { onSelected, title } = this.props;

    onSelected?.(title);
  };

  componentDidUpdate(prevProps) {
    const { isSelected: prevIsSelected } = prevProps;
    const { isSelected } = this.props;

    if (prevIsSelected !== isSelected) {
      this.runAnimation(isSelected ? 1 : 0);
    }
  }

  runAnimation = (toValue) => {
    const { animatedValue } = this.state;

    Animated.timing(animatedValue, {
      toValue,
      duration: 200,
      useNativeDriver: true,
    }).start();
  };

  selectedContainerStyle = () => {
    const { animatedValue } = this.state;

    const translationInterpolation = animatedValue.interpolate({
      inputRange: [0, 1],
      outputRange: [-CHIP_HEIGHT, 0],
    });

    return {
      ...Styles.selectedBackgroundContainerStyle,
      transform: [{ translateY: translationInterpolation }],
    };
  };

  unselectedContainerStyle = () => {
    const { animatedValue } = this.state;

    const translationInterpolation = animatedValue.interpolate({
      inputRange: [0, 1],
      outputRange: [0, CHIP_HEIGHT],
    });

    return {
      ...Styles.unselectedBackgroundContainerStyle,
      transform: [{ translateY: translationInterpolation }],
    };
  };

  render() {
    const { title, logo, onSelected } = this.props;
    const hasLogo = !!logo;

    const selectedContainerStyle = this.selectedContainerStyle();
    const unselectedContainerStyle = this.unselectedContainerStyle();

    return (
      <View style={Styles.shadowContainer}>
        <View style={Styles.containerStyle}>
          <Animated.View style={selectedContainerStyle} />

          <Animated.View style={unselectedContainerStyle} />

          <TouchableOpacity
            onPress={this.onPress}
            style={Styles.contentContainerStyle}
            activeOpacity={0.5}
          >
            {hasLogo && (
              <Image
                source={logo}
                style={Styles.logoStyle}
                resizeMode="center"
              />
            )}
            <Text style={Styles.titleStyle}>{title}</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}
