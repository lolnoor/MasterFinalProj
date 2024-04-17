/** @format */

import React, { Component } from "react";
import { Text, View } from "react-native";
import AppButton from "../../../Components/AppButton/AppButton";
import AppText from "../../../Components/AppText/AppText";
import ChipGroup from "../../../Components/ChipGroup/ChipGroup";
import { USER_TYPE } from "../../../Utils/Enums";
import R from "../../../Utils/R";
import Styles from "./styles";

const RegistrationChipData = [
  {
    id: 2,
    title: USER_TYPE.HOSPITAL,
    logo: R.Images.UserType.Hospital,
  },

  {
    id: 3,
    title: USER_TYPE.DONOR,
    logo: R.Images.UserType.Donor,
  },
];

export default class RegistrationType extends Component {
  onHospitalSelected = () => {
    const { onRegistrationTypeSelected } = this.props;
    onRegistrationTypeSelected?.(USER_TYPE.HOSPITAL);
  };

  onDonorSelected = () => {
    const { onRegistrationTypeSelected } = this.props;
    onRegistrationTypeSelected?.(USER_TYPE.DONOR);
  };

  onChipSelected = (type) => {
    if (type === USER_TYPE.DONOR) {
      this.onDonorSelected();
    } else {
      this.onHospitalSelected();
    }
  };

  render() {
    return (
      <View style={Styles.containerStyle}>
        <AppText type="heading">Register as</AppText>

        <ChipGroup
          style={{ marginTop: 20 }}
          horizontal
          data={RegistrationChipData}
          onSelected={this.onChipSelected}
        />
      </View>
    );
  }
}
