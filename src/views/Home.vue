<template>
  <div>
    <b-container fluid>
      <b-row>
        <b-col>
          <ticker-display company-name="Elastic"
                          ticker-symbol="ESTC"
                          :ticker-data=ESTC>
          </ticker-display>
        </b-col>
      </b-row>
      <b-row>
        <b-col>
          <ticker-display company-name="Datadog"
                          ticker-symbol="DDOG"
                          :ticker-data=DDOG>
          </ticker-display>
        </b-col>
      </b-row>
      <b-row>
        <b-col>
          <ticker-display company-name="Microsoft"
                          ticker-symbol="MSFT"
                          :ticker-data=MSFT>
          </ticker-display>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>

import TickerDisplay from '@/components/TickerDisplay.vue'
import connect from "@/assets/js/td";


export default {
  name: 'Home',
  components: {
    TickerDisplay
  },
  mounted() {
    let code = this.$route.query.code;
    this.$store.dispatch("getTdAccessToken", code)
            .then(accessToken => {
              return connect(accessToken, this.socketMessageHandler)
            })
            .then(socket => {
              this.setQos(socket, 1);
              this.subscribeToQuotes(socket, "ESTC", "DDOG", "MSFT", "TSLA")
            })
            .catch(error => {
              console.log(error);
            })
  },
  methods: {
    setQos(socket, qosLevel) {
      socket.send({
        "service": "ADMIN",
        "command": "QOS",
        "parameters": {
          "qoslevel": qosLevel //0-5, 1 is 750ms which is supposedly real time. 0 is 'express', supposedly 500ms.

        }
      })
    },

    subscribeToQuotes(socket, ...symbols) {
      let keys = "";
      symbols.forEach(s => {
        keys += s + ","
      })

      socket.send({
        "service": "QUOTE",
        "command": "SUBS",
        "parameters": {
          "keys": keys,
          "fields": "0,1,2,3,4,5,8,9,10,11"
        }
      })
    },

    socketMessageHandler(evt) {
      let data = JSON.parse(evt.data);
      if (data.notify) {
        console.log(data.notify[0])
      } else if (data.response) {
        console.log(data.response[0]);
      } else if (data.data) {
        data.data[0].content.forEach(stockData => {
            this[stockData.key] = stockData;
        });
      }
    }
  },
  data: function() {
    return {
      ESTC: {},
      DDOG: {},
      MSFT: {},
    }
  }
}
</script>
