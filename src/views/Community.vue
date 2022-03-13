<template>
  <v-container>
    <v-list>
      <v-list-item v-for="(message, i) in messages" :key="i">
        <v-card :color="message.received ? 'green lighten-4' : 'blue lighten-4'" class="ma-1" :class="!message.received ? 'ml-10' : ''">
          <v-card-text>{{message.msg}}</v-card-text>
        </v-card>
      </v-list-item>
    </v-list>
    <div class="footer px-16 v-text-field--full-width">
      <v-text-field full-width outlined placeholder="Enter your message here" v-model="message" append-outer-icon="mdi-send" @click:append-outer="sendMessage" @keydown="(e) => checkSend(e)"></v-text-field>
    </div>
  </v-container>
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
    checkSend(e) {
      if (e.keyCode === 13) this.sendMessage();
    },
    async sendMessage() {
      if (this.message.replaceAll(" ", "").length === 0) return;
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