import Vue from 'vue';
import Vuex from "vuex"

Vue.use(Vuex);

const store = new Vuex.Store({
    state: {
        account: null,
        provider: null,
    },
    mutations: {
        setProvider(state, provider) {
            state.provider = provider;
        }
    },
    actions: {
        connect(context) {
            context.state.provider.request({method: "eth_requestAccounts"})
                .then(context.dispatch("handleAccountsChanged"))
                .catch((err) => {
                    if (err.code === 4001) {
                        console.log('Please connect to MetaMask.');
                    } else {
                        console.error(err);
                    }
                });
        },
        handleAccountsChanged(context, accounts) {
            if (accounts.length === 0) {
                console.log('Please connect to MetaMask.');
            } else if (accounts[0] !== this.account) {
                context.state.account = accounts[0];
            }
        }
    }
});

export default store;
