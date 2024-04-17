/** @format */

import React, { Component } from "react";
import {
  Button,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import firebase from "firebase";
import ScreenContainer from "../../Components/ScreenContainer/ScreenContainer";
import { DATABASE_NODES, REQUEST_STATUS } from "../../Utils/Enums";
import { PieChart } from "react-native-chart-kit";
import R from "../../Utils/R";
import moment from "moment";

import Styles from "./styles";
import { GetStatusColor, runAnimation } from "../../Utils/HelperFunctions";
import AppText from "../../Components/AppText/AppText";
import CountrySelector from "../../Components/CountrySelector/CountrySelector";
import CitySelector from "../../Components/CitySelector/CitySelector";
import HospitalSelector from "../../Components/HospitalSelector/HospitalSelector";

export default class Stats extends Component {
  constructor(props) {
    super(props);

    this.state = {
      notificationData: [],
      filteredNotificationData: [],
      allHospitalsList: [],
      selectedCountry: "",
      selectedCity: "",
      selectedHospital: "",
      showFilters: false,
      pending: 0,
      accepted: 0,
      completed: 0,
      cancelled: 0,
      expired: 0,
      rejected: 0,
      loading: true,
    };
  }

  componentDidMount() {
    this.fetchAllNotification();
  }

  calculateStats = (data) => {
    let accepted = 0,
      cancelled = 0,
      completed = 0,
      pending = 0,
      rejected = 0,
      expired = 0;

    for (let requestId in data) {
      const notification = data[requestId];
      const { status } = notification;

      const hasExpired = R.HelperFunctions.hasNotificationExpired(notification);

      if (hasExpired) {
        expired += 1;
      } else {
        switch (status) {
          case REQUEST_STATUS.ACCEPTED:
            accepted += 1;
            break;
          case REQUEST_STATUS.CANCELLED:
            cancelled += 1;
            break;
          case REQUEST_STATUS.COMPLETED:
            completed += 1;
            break;
          case REQUEST_STATUS.PENDING:
            pending += 1;
            break;
          case REQUEST_STATUS.REJECTED:
            rejected += 1;
            break;
        }
      }
    }

    this.setState({
      accepted,
      cancelled,
      completed,
      pending,
      expired,
      rejected,
      loading: false,
    });
  };

  fetchAllNotification = () => {
    firebase
      .database()
      .ref(`${DATABASE_NODES.REQUEST}`)
      .on("value", (value) => {
        const data = value.val();

        this.setState({
          notificationData: data,
          filteredNotificationData: data,
        });
        this.calculateStats(data);
      });
  };

  onCountryChange = (country) => {
    this.setState({ selectedCountry: country });
  };

  applyFilter = () => {
    const { selectedCity: city, selectedHospital: hospital } = this.state;

    const filterData = {};
    const data = this.state.notificationData;

    for (let requestId in data) {
      const notification = data[requestId];
      const { city: notifCity, hospitalName } = notification;

      if (city === notifCity || hospitalName === hospital) {
        filterData[requestId] = notification;
      }
    }

    this.setState({
      filteredNotificationData: filterData,
    });

    this.calculateStats(filterData);
  };

  onCitySelected = (city) => {
    this.setState({ selectedCity: city }, () => {
      this.applyFilter();
    });
  };

  onToggleFilter = () => {
    this.setState({ showFilters: !this.state.showFilters });
    runAnimation();
  };

  onClearCity = () => {
    this.setState({
      showFilters: false,
      selectedCountry: "",
      selectedCity: "",
    });

    this.calculateStats(this.state.notificationData);
  };

  onHospitalChange = (hospital) => {
    this.setState({ selectedHospital: hospital }, () => {
      this.applyFilter();
    });
  };

  render() {
    const {
      selectedCountry,
      accepted,
      pending,
      completed,
      expired,
      rejected,
      cancelled,
      showFilters,
      loading,
    } = this.state;

    const data = [
      {
        count: accepted,
        color: GetStatusColor(REQUEST_STATUS.ACCEPTED),
      },
      {
        count: pending,
        color: GetStatusColor(REQUEST_STATUS.PENDING),
      },
      {
        count: completed,
        color: GetStatusColor(REQUEST_STATUS.COMPLETED),
      },
      {
        count: rejected,
        color: GetStatusColor(REQUEST_STATUS.REJECTED),
      },
      {
        count: expired,
        color: GetStatusColor(REQUEST_STATUS.EXPIRED),
      },

      {
        count: cancelled,
        color: GetStatusColor(REQUEST_STATUS.CANCELLED),
      },
    ];

    return (
      <ScreenContainer loading={loading}>
        <AppText type="heading" style={{ width: "100%", textAlign: "center" }}>
          Stats
        </AppText>

        <ScrollView>
          <View style={Styles.filterContainer}>
            <AppText>Apply Filters</AppText>

            <TouchableOpacity
              hitSlop={{ left: 10, right: 10, top: 10, bottom: 10 }}
              onPress={this.onToggleFilter}
            >
              <Image style={Styles.filterIconStyle} source={R.Images.FILTERS} />
            </TouchableOpacity>
          </View>

          {showFilters && (
            <View style={{ flex: 1, paddingHorizontal: 10, zIndex: 10 }}>
              <HospitalSelector onHospitalChange={this.onHospitalChange} />

              <CountrySelector onCountryChange={this.onCountryChange} />

              <CitySelector
                onCitySelected={this.onCitySelected}
                country={selectedCountry}
              />

              <AppText onPress={this.onClearCity} style={Styles.crossStyle}>
                Clear
              </AppText>
            </View>
          )}

          <View style={{ justifyContent: "center", alignItems: "center" }}>
            <PieChart
              hasLegend={false}
              data={data}
              width={400}
              height={400}
              chartConfig={{
                color: (opacity = 1) => `transparent`,
                labelColor: (opacity = 1) => `transparent`,
                propsForDots: {
                  r: "0",
                  strokeWidth: "2",
                  stroke: "transparent",
                },
              }}
              accessor={"count"}
              backgroundColor={"transparent"}
              center={[100, 0]}
            />
          </View>

          {!loading && (
            <View
              style={{
                flexWrap: "wrap",
                flexDirection: "row",
                justifyContent: "center",
              }}
            >
              <Legend
                color={GetStatusColor(REQUEST_STATUS.ACCEPTED)}
                label={`Accepted (${accepted})`}
              />
              <Legend
                color={GetStatusColor(REQUEST_STATUS.PENDING)}
                label={`Pending (${pending})`}
              />
              <Legend
                color={GetStatusColor(REQUEST_STATUS.COMPLETED)}
                label={`Completed (${completed})`}
              />
              <Legend
                color={GetStatusColor(REQUEST_STATUS.REJECTED)}
                label={`Rejected (${rejected})`}
              />
              <Legend
                color={GetStatusColor(REQUEST_STATUS.EXPIRED)}
                label={`Expired (${expired})`}
              />
              <Legend
                color={GetStatusColor(REQUEST_STATUS.CANCELLED)}
                label={`Cancelled (${cancelled})`}
              />
            </View>
          )}
        </ScrollView>
      </ScreenContainer>
    );
  }
}

const Legend = ({ color, label }) => {
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 10,
      }}
    >
      <View style={{ width: 10, height: 10, backgroundColor: color }} />
      <AppText style={{ marginLeft: 5 }}>{label}</AppText>
    </View>
  );
};
