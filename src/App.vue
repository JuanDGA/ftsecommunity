<template>
  <v-app>
    <v-main>
      <v-app-bar>
        <v-btn to="/home">Home</v-btn>
        <v-btn to="/chat/community">Community Chat</v-btn>
        <v-btn v-if="!account" @click="connect">Connect</v-btn>
        <span>{{account}}</span>
      </v-app-bar>
      <div v-if="account">
      </div>
      <router-view/>
    </v-main>
  </v-app>
</template>

<script>
import detectEth from "@metamask/detect-provider";

export default {
    data: () => ({
      provider: null,
      account: null,
    }),
    async mounted() {
      this.provider = await detectEth();
    },
    methods: {
      connect() {
        this.provider.request({method: "eth_requestAccounts"})
            .then(this.handleAccountsChanged)
            .catch((err) => {
              if (err.code === 4001) {
                console.log('Please connect to MetaMask.');
              } else {
                console.error(err);
              }
            });
      },
      handleAccountsChanged(accounts) {
        if (accounts.length === 0) {
          console.log('Please connect to MetaMask.');
        } else if (accounts[0] !== this.account) {
          this.account = accounts[0];
        }
      }
    },
  }
</script>