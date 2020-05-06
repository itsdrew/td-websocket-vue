# TD Ameritrade Auth and Websocket

#### What is this?
Auth with the TD Ameritrade API is a bit of a pain.
This is a web app that allows you to authorize and authenticate yourself to use the TD Websocket API.
A TD trading account is required.

#### Instructions
1. Go to https://developer.tdameritrade.com and register an app. Use 'https://localhost:8080/td-login-redirect' as your redirect url.
1. Copy your consumer key into the `VUE_APP_TD_CONSUMER_KEY` var in the .env.local file.
1. `npm install`
1. `npm run serve`
1. Navigate to https://localhost:8080 (Yes, we are running https locally. The TD redirect requires https.)
1. Click the td auth link at the top of the page and go through the log in process.

After logging in, a refresh token is stored locally for 90 days, so next time you run the app you won't have to log in again.

---

#### High level overview of the code
1. A link is created allowing you to log in to your td account. After logging in, it returns an OAuth code to the redirect url.
   - If a refresh token exists in local storage, we use that to get an access token.
1. Using the code, we retrieve an access token and store it in vuex. We also store the refresh token in local storage.
1. Using the access token, we authenticate and connect to the websocket api.
1. Requests are made to set the QOS to retrieve real time data and quotes on hot stock picks.

#### Notes

- This was created with vue cli
- We need to use history mode for the router instead of hash mode because td won't accept a redirect url with a hash. Since the redirect is a deep link back to localhost, historyApiFallback has to be set to true in vue.config.js

#### TD docs for the websocket api
https://developer.tdameritrade.com/content/streaming-data

---

If you find yourself making an abundance of money (or are planning on making an abundance of money) using this code, please show your support to a fellow dev.

[![paypal](https://www.paypalobjects.com/en_US/i/btn/btn_donateCC_LG.gif)](https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=HJAFUFTAEY6C4)

