import { defineStore } from "pinia";

export const useStore = defineStore("appstore", {
  state() {
    return {
      drawer: null,            
      loginUser: { user_level: '9', full_name: "Guest", projectName: "JTG" },
      userId: 0,
      userToken: "",
    };
  },
  actions: {
    clearText() {
      this.mytext = "";
    },
  },
});
