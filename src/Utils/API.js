import firebase from "firebase";
import moment from "moment";
import { DATABASE_NODES } from "./Enums";

export function fetchCountries() {
  return new Promise((resolve) => {
    firebase
      .database()
      .ref(`${DATABASE_NODES.COUNTRIES}`)
      .once("value", (snapshot) => {
        const countries = snapshot
          .val()
          ?.map((value) => ({ label: value, value }));

        resolve(countries);
      });
  });
}

export function fetchCities(country) {
  return new Promise((resolve) => {
    firebase
      .database()
      .ref(`${DATABASE_NODES.CITIES}/${country}`)
      .once("value", (snapshot) => {
        const cities = snapshot
          .val()
          ?.map((value) => ({ label: value, value }));

        resolve(cities);
      });
  });
}

export function fetchHospitalList() {
  return new Promise((resolve) => {
    firebase
      .database()
      .ref(`${DATABASE_NODES.HOSPITAL}`)
      .once("value", (snapshot) => {
        const data = snapshot.val();
        const list = [];

        for (const hospitalId in data) {
          const { name } = data[hospitalId];
          list.push({ label: name, value: name });
        }

        resolve(list);
      });
  });
}

export function fetchFilteredDonorList(city) {
  return new Promise((resolve) => {
    firebase
      .database()
      .ref(`${DATABASE_NODES.DONORS}`)
      .orderByChild("city")
      .equalTo(city)
      .once("value", (snapshot) => {
        const values = snapshot.val();

        const allDonors = [];

        for (const key in values) {
          const element = values[key];
          allDonors.push(element);
        }

        resolve(allDonors);
      });
  });
}

export function fetchHospitalBroadcast(id) {
  return new Promise((resolve) => {
    firebase
      .database()
      .ref(`${DATABASE_NODES.HOSPITAL_BROADCAST}/${id}`)
      .orderByChild("expireOn")
      // .startAt(moment().toString())
      .once("value", (snapshot) => {
        const values = snapshot.val();

        const allRequest = [];

        for (const key in values) {
          const element = values[key];
          allRequest.push(element);
        }

        resolve(allRequest);
      });
  });
}
