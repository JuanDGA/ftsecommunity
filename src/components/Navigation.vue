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
        <b-nav-item @click="to('/community')">Community Chat</b-nav-item>
      </b-navbar-nav>
    </b-collapse>
  </b-navbar>
</template>

<script>
  export default {
    methods: {
      to(path) {
        this.$router.push(path);
      }
    }
  }
</script>
