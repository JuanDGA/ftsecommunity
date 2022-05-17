<template>
  <div>
      <navigation></navigation>
      <router-view/>
      <b-modal v-model="userStore.selectSender" title="Select name" @cancel="handleCancel" @ok="handleOk" hide-header-close cancel-title="Keep anonymous" :ok-disabled="nickname.length < 4 || nickname.length > 15">
        <p class="h1">Enter a nickname</p>
        <div class="small fw-bold">Your nickname will be stored in a local cookie, but will not stored in any other place.</div>
        <div v-if="nickname.length < 4 || nickname.length > 15" class="small text-danger fw-bold">Should be between 4 and 10 characters both included.</div>
        <b-input v-model="nickname" class="my-1" placeholder="Nickname here"></b-input>
      </b-modal>
      <b-button ref="modal" v-b-modal.modal class="d-none"></b-button>
  </div>
</template>

<script>
  import Navigation from "@/components/Navigation";
  import useUserStore from "@/store/userStore";

  export default {
    components: {Navigation},
    setup() {
      const userStore = useUserStore();

      return {userStore};
    },
    data: () => ({
      setName: null,
      nickname: "",
    }),
    methods: {
      handleOk() {
        this.$cookies.set("ecommunity-nickname", this.nickname, Infinity);
        this.userStore.sender = this.nickname;

      },
      handleCancel() {
        this.$cookies.remove("ecommunity-nickname");
        this.userStore.sender = null;
        this.userStore.selectSender = false;
      }
    },
    mounted() {
      const nick = this.$cookies.get("ecommunity-nickname");

      if (!nick) {
        this.userStore.selectSender = true;
      } else {
        this.userStore.sender = nick;
      }
    }
  }
</script>