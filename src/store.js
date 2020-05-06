import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
import qs from 'qs'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    tdAccessToken: '',
    tdRefreshToken: '',
    tdAccessTokenExpiration: null
  },
  getters: {
    tdAccessToken: state => {
      return state.tdAccessToken && state.tdAccessTokenExpiration < new Date() ? state.tdAccessToken : null;
    },
    tdRefreshToken: state => {
      let refreshToken;
      if (state.tdRefreshToken) {
        refreshToken = state.tdRefreshToken;
      } else {
        refreshToken = window.localStorage.getItem("TD_REFRESH_TOKEN");
        if (refreshToken) {
          let refreshTokenExp = window.localStorage.getItem("TD_REFRESH_TOKEN_EXPIRATION");
          if (new Date() > refreshTokenExp) {
            refreshToken = null;
          }
        }
      }
      return refreshToken;
    },
    tdAccessTokenExpiration: state => { return state.tdAccessTokenExpiration; },
  },
  mutations: {
    setTdAccessToken(state, accessToken, expiresIn) {
      console.log("Setting access token: ", accessToken);
      state.tdAccessToken = accessToken;
      let date = new Date();
      date.setSeconds(date.getSeconds() + expiresIn);
      state.tdAccessTokenExpiration = date;
    },
    setTdRefreshToken(state, refreshToken) {
      state.tdRefreshToken = refreshToken;

      window.localStorage.setItem("TD_REFRESH_TOKEN", refreshToken);

      //Refresh token valid for 90 days
      let d = new Date();
      d.setDate(d.getDate() + 89);
      window.localStorage.setItem("TD_REFRESH_TOKEN_EXPIRATION", d);
    },
  },
  actions: {
    getTdAccessToken({commit, state, getters, dispatch}, code) {
      if (code) {
        return dispatch("getTdAccessTokenFromCode", code);
      } else {
        return new Promise((resolve, reject) => {
          if (getters.tdAccessToken) {
            resolve(getters.tdAccessToken);
          } else {
            dispatch("refreshTdAccessToken")
              .then(result => {
                if (result) {
                  resolve(result);
                } else {
                  reject("Access token and refresh token do not exist. Log in.")
                }
              })
          }
        })
      }

    },
    getTdAccessTokenFromCode({commit, state}, code) {
      return new Promise(resolve => {

      console.log("Getting access token from code: ", code);
      const body = {
        "grant_type": "authorization_code",
        "refresh_token": "",
        "access_type": "offline",
        "code": code,
        "client_id": process.env.VUE_APP_TD_CONSUMER_KEY,
        "redirect_uri": process.env.VUE_APP_TD_LOGIN_REDIRECT_URL
      }
      axios.post(
        "https://api.tdameritrade.com/v1/oauth2/token",
        qs.stringify(body),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          }
        }
      )
        .then(response => {
          console.log(response);
          commit('setTdAccessToken', response.data.access_token, response.data.expires_in);
          commit('setTdRefreshToken', response.data.refresh_token);
          resolve(response.data.access_token);
        })
      })
    },
    refreshTdAccessToken({commit, getters, state}) {
      const refreshToken = getters.tdRefreshToken;
      console.log("Refresh token: ", refreshToken);
      if (!refreshToken) { return null; }
      const body = {
        "grant_type": "refresh_token",
        "refresh_token": refreshToken,
        "client_id": process.env.VUE_APP_TD_CONSUMER_KEY,
      }
      return axios.post(
        "https://api.tdameritrade.com/v1/oauth2/token",
        qs.stringify(body),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          }
        }
      )
        .then(response => {
          console.log(response);
          commit('setTdAccessToken', response.data.access_token, response.data.expires_in);
          return response.data.access_token;
        })
        .catch(error => {
          console.error("Error refreshing token");
        })
    }
  },
  modules: {
  }
})
