<template>
  <div id="app">
    <b-navbar toggleable="lg" type="dark" variant="dark">
      <b-navbar-nav class="m-auto">
        <a :href=getTdAuthUrl()>TD Auth</a>
      </b-navbar-nav>
    </b-navbar>
    <router-view/>
  </div>
</template>

<style>


#nav a {
  font-weight: bold;
  color: #2c3e50;
}

</style>

<script>

  export default {
    name: 'App',
    components: {
    },
    methods: {
      getTdAuthUrl() {
        const redirectUri= encodeURI(process.env.VUE_APP_TD_LOGIN_REDIRECT_URL);
        const clientId = process.env.VUE_APP_TD_CONSUMER_KEY + "%40AMER.OAUTHAP";
        return "https://auth.tdameritrade.com/auth?response_type=code&redirect_uri=" + redirectUri + "&client_id=" + clientId;
      },
    }
  }
</script>
