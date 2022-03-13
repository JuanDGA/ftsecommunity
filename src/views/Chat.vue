<template>
  <div>
    <v-container class="fill-height pt-16">
      <v-row class="fill-height pb-14" align="end">
        <v-col>
          <div v-for="(item, index) in messages" :key="index"
               :class="['d-flex flex-row align-center my-2', !item.received ? 'justify-end': null]">
            <v-card v-if="!item.received" class="mr-3 pa-2 blue lighten-5">
              <v-card-text>{{ item.msg }}</v-card-text>
            </v-card>
            <v-avatar :color="item.received ? 'green lighten-4': 'green darken-4'" size="36">
              <v-icon class="white--text">{{item.received ? 'mdi-account-arrow-right-outline' : 'mdi-account-arrow-left'}}</v-icon>
            </v-avatar>
            <v-card v-if="item.received" class="mr-3 pa-1 blue lighten-5">
              <v-card-text>{{ item.msg }}</v-card-text>
            </v-card>
          </div>
        </v-col>
      </v-row>
    </v-container>
    <v-footer fixed>
      <v-container class="ma-0 pa-0">
        <v-row no-gutters>
          <v-col>
            <div class="d-flex flex-row align-center">
              <v-text-field v-model="message" placeholder="Type Something" @keypress.enter="sendMessage"></v-text-field>
              <v-btn icon class="ml-4" @click="sendMessage"><v-icon>mdi-send</v-icon></v-btn>
            </div>
          </v-col>
        </v-row>
      </v-container>
    </v-footer>
  </div>
</template>

<style scoped>
  .footer {
    position: fixed;
    bottom: 0;
  }
</style>

<script>
import {Waku, WakuMessage} from "js-waku";
export default {
  name: 'App',
  data: () => ({
    waku: null,
    wakuStatus: "None",
    observing: false,
    message: "",
    messages: [],
  }),
  methods: {
    async sendMessage() {
      if (this.message.replaceAll(" ", "").length === 0) return;
      const messagePayload = {msg: this.message, received: true, date: new Date()};
      const msg = await WakuMessage.fromUtf8String(
          JSON.stringify(messagePayload),
          `/eco/1/${this.$route.params.chat}/proto`,
      );
      this.waku.relay.send(msg).then(() => {
        this.message = "";
        this.messages.push({...messagePayload, received: false});
      });
    }
  },
  async mounted() {
    Waku.create({bootstrap: {default: true}}).then(waku => {
      this.wakuStatus = "Created"
      this.waku = waku;
      this.waku.relay.addObserver((msg) => {
        const messagePayload = JSON.parse(msg.payloadAsUtf8);
        this.messages.push(messagePayload)
      }, [`/eco/1/${this.$route.params.chat}/proto`]);
    });
  }
};
</script>