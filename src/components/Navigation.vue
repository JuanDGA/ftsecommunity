<template>
  <b-navbar toggleable="md" type="dark" variant="success" fixed="top">
    <b-navbar-brand class="mx-2">
      <router-link to="/" class="navbar-brand">
        <b>ECO</b>mmunity
      </router-link>
    </b-navbar-brand>
    <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>
    <b-collapse id="nav-collapse" is-nav>
      <b-navbar-nav>
        <b-nav-item to="/community">Community Chat</b-nav-item>
        <button class="btn text-light" @click="openModal">{{userStore.sender || "Anonymous"}}</button>
      </b-navbar-nav>
    </b-collapse>
  </b-navbar>
</template>

<script>
  import useUserStore from "@/store/userStore";

  export default {
    setup() {
      const userStore = useUserStore();

      return {userStore};
    },
    methods: {
      openModal() {
        this.userStore.selectSender = true;
      },
    }
  }
</script>
