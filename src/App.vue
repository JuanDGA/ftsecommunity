<template>
  <v-app>
    <v-layout fill-height></v-layout>
    <v-list>
      <v-list-item v-for="(message, i) in messages" :key="i">
        <v-card :color="message.received ? 'green lighten-4' : 'blue lighten-4'" class="ma-1" :class="!message.received ? 'ml-10' : ''">
          <v-card-text>{{message.msg}}</v-card-text>
        </v-card>
      </v-list-item>
    </v-list>
    <v-text-field full-width outlined placeholder="Enter your message here" v-model="message" append-outer-icon="mdi-send" class="mx-16" @click:append-outer="sendMessage"></v-text-field>
  </v-app>
</template>

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
      const messagePayload = {msg: this.message, received: true, date: new Date()};

      const msg = await WakuMessage.fromUtf8String(
        JSON.stringify(messagePayload),
        "/eco/1/ecommunity/proto",
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
      }, ["/eco/1/ecommunity/proto"]);
    });
  }
};
</script>
