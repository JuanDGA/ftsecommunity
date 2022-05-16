<template>
  <div class="container py-5">
    <b-container class="h-100 py-3" ref="chat">
      <b-row class="h-100 pb-2" align-content="end">
        <b-col>
          <div v-for="(item, index) in messages" :key="index"
               :class="['d-flex flex-row align-content-center', !item.received ? 'justify-content-end': '']">
            <b-card v-if="!item.received" class="mx-2 alert-success my-1">
              <b-card-body>{{ item.msg }}</b-card-body>
            </b-card>
            <b-avatar :class="item.received ? 'alert-success fw-bold': 'alert-info fw-bold'" size="36">
              <b-icon-person></b-icon-person>
            </b-avatar>
            <b-card v-if="item.received" class="mx-2 p-1 alert-info my-1">
              <b-card-body>{{ item.msg }}</b-card-body>
            </b-card>
          </div>
        </b-col>
      </b-row>
    </b-container>
    <div class="fixed-bottom">
      <b-container class="p-2">
        <b-row no-gutters>
          <b-col>
            <div class="d-flex flex-row align-content-center">
              <b-input v-model="message" placeholder="Type Something" @keypress.enter="sendMessage"></b-input>
              <b-button  class="mx-2" @click="sendMessage">SEND</b-button>
            </div>
          </b-col>
        </b-row>
      </b-container>
    </div>
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
    loading: false,
  }),
  methods: {
    async sendMessage() {
      if (this.message.replaceAll(" ", "").length === 0) return;
      const messagePayload = {msg: this.message, received: true, date: new Date()};
      const msg = await WakuMessage.fromUtf8String(
          JSON.stringify(messagePayload),
          "/ecommunity/2/community/proto",
      );
      this.waku.relay.send(msg).then(() => {
        this.message = "";
        this.messages.push({...messagePayload, received: false});
      });

      this.$refs.chat.scrollTop = this.$refs.chat.scrollHeight;
    },
    decodeMessage(msg) {
      const messagePayload = JSON.parse(msg.payloadAsUtf8);
      this.messages.push(messagePayload);
      this.messages.sort((e1, e2) => {
        if (e1.date > e2.date) {
          return 1;
        } else if (e1.date < e2.date) {
          return -1;
        } else {
          return 1;
        }
      })
    }
  },
  mounted() {
    const messagesUri = "/ecommunity/2/community/proto";

    Waku.create({bootstrap: {default: true}}).then(async waku => {
      this.loading = true;
      this.wakuStatus = "Created";
      this.waku = waku;
      await this.waku.waitForRemotePeer();

      this.waku.store.queryHistory([messagesUri], {
        callback: (retrievedMessages) => {
          retrievedMessages.map(this.decodeMessage).filter(Boolean);
        }
      });

      this.waku.relay.addObserver(this.decodeMessage, [messagesUri]);

      this.loading = false;
    }).catch(() => this.$router.push("/"));
  }
};
</script>