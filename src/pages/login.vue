<template>
  <v-app>
    <v-main>
      <v-container class="fill-height" fluid>
        <v-row align="center" justify="center">
          <v-col cols="12" sm="8" md="4">
            <v-card class="elevation-6">
              <v-toolbar color="green" align="center" dark flat>
                <v-toolbar-title class="fontPrompt"
                  >ChomThong Gold Business</v-toolbar-title
                >
              </v-toolbar>
              <v-card-text class="mt-5">
                <v-form ref="form" @submit.prevent="login()">
                  <v-text-field
                    v-model="userName"
                    label="User Name"
                    ref="userNameField"
                    prepend-icon="mdi-account"
                    type="text"
                    variant="outlined"
                    :rules="[(v) => !!v || 'กรุณาป้อน User Name']"
                  ></v-text-field>
                  <v-text-field
                    v-model="password"
                    :append-inner-icon="showPass ? 'mdi-eye' : 'mdi-eye-off'"
                    label="Password"
                    prepend-icon="mdi-lock"
                    variant="outlined"
                    :rules="[
                      (v) => !!v || 'กรุณาป้อนรหัสผ่าน',
                      (v) =>
                        (v && v.length >= 6) ||
                        'รหัสผ่านต้องไม่ต่ำกว่า 6 ตัวอักษร',
                    ]"
                    :type="showPass ? 'text' : 'password'"
                    @click:append-inner="showPass = !showPass"
                    class="mt-2"
                  ></v-text-field>
                  <br />
                  <v-btn
                    block
                    color="grey-lighten-1"
                    size="large"
                    type="submit"
                    variant="elevated"
                  >
                    LOG IN
                  </v-btn>
                </v-form>
              </v-card-text>
              <v-snackbar
                v-model="showError"
                timeout="2000"
                color="text-white bg-red"
                >{{ errorText }}</v-snackbar
              >
              <!-- <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="primary" variant="tonal" @click="login()">Login</v-btn>
              </v-card-actions> -->
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import { useStore } from "../stores/appstore";
import { isDev, apiUrl, lsTokenName, lsUserId } from "../constants.js";
import axios from "axios";

export default {
  name: "LoginPage",
  mounted() {
    this.$nextTick(() => {
      this.$refs.userNameField.focus();
    });
  },
  data: () => ({
    appStore: useStore(),
    userName: isDev ? "theone" : null,
    password: isDev ? "123456" : null,
    showPass: false,
    showError: false,
    errorText: "",
  }),
  methods: {
    async login() {
      const { valid } = await this.$refs.form.validate();
      if (!valid) {
        return;
      }
      try {
        const response = await axios.post(apiUrl + "/login", {
          loginName: this.userName,
          password: this.password,
        });
        console.log("Login successful:");
        // save to local storage
        localStorage.setItem(lsUserId, response.data.data.userId);
        localStorage.setItem(lsTokenName, response.data.data.token);
        // assign to gloal store
        this.appStore.userId = response.data.data.userId;
        this.appStore.userToken = response.data.data.token;
        // navigate to home
        this.$router.push({ path: "/home" });
      } catch (error) {
        console.log("Error during login:", error.response.data);
        this.errorText = error.response.data.error || "Login failed";
        this.showError = true;
        console.error("Login failed:", error);
      }
    },
  },
};
</script>

<style></style>
