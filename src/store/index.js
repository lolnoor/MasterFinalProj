/** @format */

import { create, persist } from "mobx-persist";
import { AsyncStorage } from "react-native";
import UserStore from "./UserStore";

const hydrate = create({
  storage: AsyncStorage,
  jsonify: true,
});

class RootStore {
  userStore = new UserStore();

  constructor() {
    //   read from the local database record for "userStore" and put it object userStore
    hydrate("userStore", this.userStore)
      .then((result) => {})
      .catch((error) => {});
  }
}

export const rootStore = new RootStore();
