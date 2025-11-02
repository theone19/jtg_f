<template>
  <v-app>
    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script setup>
  //
</script>

<style>
@font-face {
  font-family: "Prompt";
  src: url("./assets/fonts/prompt/Prompt-Regular.ttf") format("truetype");
  font-style: normal;
}

@font-face {
  font-family: "PromptBold";
  src: url("./assets/fonts/prompt/Prompt-Bold.ttf") format("truetype");
  font-style: bold;
}

@font-face {
  font-family: "Sarabun";
  src: url("./assets/fonts/sarabun/Sarabun-Regular.ttf") format("truetype");
  font-style: normal;
}

@font-face {
  font-family: "BebasNeue";
  src: url("./assets/fonts/bebas_neue/BebasNeue-Regular.ttf") format("truetype");
  font-style: normal;
}

.fontPrompt {
  font-family: "Prompt", sans-serif;
}

.fontPromptBold {
  font-family: "PromptBold", sans-serif;
}

.fontSarabun {
  font-family: "Sarabun", sans-serif;
}

.fontBebaNeue {
  font-family: "BebasNeue";
}

.fontPrompt20 {
  font-family: "Prompt", sans-serif;
  font-size: 20px;
}

.fontPrompt12 {
  font-family: "Prompt", sans-serif;
  font-size: 12px;
}

.fontSize10 {
  font-size: 10px;
}

.fontSize12 {
  font-size: 12px;
}

.fontSize13 {
  font-size: 13px;
}

.fontSize14 {
  font-size: 14px;
}

.fontSize16 {
  font-size: 16px;
}

.fontSize18 {
  font-size: 18px;
}

.fontSize20 {
  font-size: 20px;
}

.fontSize24 {
  font-size: 24x;
}

.fontSize30 {
  font-size: 30px;
}
</style>
