import {defineStore} from "pinia";

const useUserStore = defineStore("userStore", {
    state: () => ({
        loading: false,
        sender: null,
        account: null,
        selectSender: false,
    }),
    actions: {
        connect() {

        }
    },
});

export default useUserStore;
