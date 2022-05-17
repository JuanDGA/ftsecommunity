<template>
  <div v-if="userStore.loading" style="height: 100vh" class="bg-light d-flex align-items-center flex-column justify-content-center w-100">
    <b-spinner variant="success" type="grow"></b-spinner>
    <h1 class="h1">{{wakuStatus}}</h1>
  </div>
  <div v-else class="container py-5 bg-light">
    <b-container class="h-100 py-3">
      <b-row class="h-100 pb-2" align-content="end">
        <b-col>
          <div v-for="(item, index) in messages" :key="index"
               :class="['d-flex flex-row align-content-center', item.sender == userStore.sender || userStore.sender == null ? 'justify-content-end': '']">
            <b-card v-if="item.sender == userStore.sender || userStore.sender == null" class="mx-2 alert-success my-1">
              <div class="fw-bold">{{!item.sender ? "Anonymous sender" : item.sender}}</div>
              <div>{{ item.text }}</div>
              <div class="small fw-light">{{item.time}}</div>
            </b-card>
            <b-avatar :class="item.sender == userStore.sender || userStore.sender == null ? 'alert-info fw-bold' : 'alert-success fw-bold'" size="36">
              <b-icon-person></b-icon-person>
            </b-avatar>
            <b-card v-if="item.sender != userStore.sender && userStore.sender != null"  class="mx-2 alert-info my-1">
              <div class="fw-bold my-1">{{!item.sender ? "Anonymous sender" : item.sender}}</div>
              <div>{{ item.text }}</div>
              <div class="fw-light small">{{item.time}}</div>
            </b-card>
          </div>
          <div ref="chat"></div>
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
import {basic} from "@/messages";
import useUserStore from "@/store/userStore";
import {communityChat} from "@/helpers/contentTopics";
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
  setup() {
    const userStore = useUserStore();

    return {userStore};
  },
  methods: {
    send() {
      if (this.message.replaceAll(" ", "").length === 0) return;
      const payload = {version: 2, text: this.message, sender: this.userStore.sender, timestamp: Date.now()};
      const messagePayload = basic.create(payload);
      WakuMessage.fromBytes(basic.encode(messagePayload).finish(), communityChat).then(msg => {
        this.waku.relay.send(msg).then(() => {
          this.message = "";
          this.messages.push({...payload, time:  `${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`});
        });
      });
    },
    async sendMessage() {
      await this.send();
      setTimeout(() => this.$refs.chat.scrollIntoView(), 100);
    },
    decodeMessage(msg) {
      const {text, timestamp, version, sender} = basic.decode(msg.payload);

      if (!version) return;

      const date = new Date(parseInt(timestamp));

      const message = {
        time: `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`,
        timestamp,
        sender,
        text,
      }

      this.messages.push(message);
      this.messages.sort((e1, e2) => {
        if (e1.timestamp < e2.timestamp) return -1;
        return 1;
      });
    }
  },
  mounted() {
    this.userStore.loading = true;
    const messagesUri = communityChat;

    Waku.create({bootstrap: {default: true}}).then(async waku => {
      this.wakuStatus = "Connecting";
      this.waku = waku;
      this.waku.waitForRemotePeer().then(() => {
        this.wakuStatus = "Connected";

        this.waku.store.queryHistory([messagesUri], {
          callback: (retrievedMessages) => {
            retrievedMessages.map(this.decodeMessage).filter(Boolean);
          }
        });

        this.waku.relay.addObserver(this.decodeMessage, [messagesUri]);

        this.userStore.loading = false;
        this.wakuStatus = "Ready";
        setTimeout(() => this.$refs.chat.scrollIntoView(), 1000);
      }).catch(() => this.wakuStatus = "Error");
    }).catch(() => this.$router.push("/"));
  }
};
</script>