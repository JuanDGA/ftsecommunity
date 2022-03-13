<template>
  <v-app>
    <v-main>
      <v-app-bar fixed color="green darken-2">
        <v-app-bar-title class="mr-3 white--text">ECOmmunity</v-app-bar-title>
        <v-btn color="green lighten-4" class="mx-1" to="/">Home</v-btn>
        <v-btn color="green lighten-4" class="mx-1" to="/chat/community">Community Chat</v-btn>
        <v-btn color="green lighten-4" class="mx-1" v-if="!account" @click="connect">Connect</v-btn>
        <v-btn color="green lighten-4" class="mx-1"  to="/proposals" v-if="account">Proposals</v-btn>
        <v-spacer></v-spacer>
        <span><small>{{account}}</small></span>
      </v-app-bar>
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
      web3: null,
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