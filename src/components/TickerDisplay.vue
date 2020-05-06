<template>
    <div>
        <b-container class="w-50">
        <b-card >
            <template v-slot:header>
                <h4 class="mb-0">{{ tickerSymbol }} | {{ companyName }}</h4>
            </template>
            <b-row class="justify-content-start">
                <b-col cols="3">Last: </b-col>
                <b-col cols="3">{{ last }}</b-col>
            </b-row>
            <b-row>
                <b-col cols="3">Bid: </b-col>
                <b-col cols="3">{{ bid }}</b-col>
            </b-row>
            <b-row>
                <b-col cols="3">Ask: </b-col>
                <b-col cols="3">{{ ask }}</b-col>
            </b-row>
        </b-card>
        </b-container>
    </div>
</template>

<script>
  export default {
    name: 'TickerDisplay',
    props: {
      companyName: String,
      tickerSymbol: String,
      tickerData: Object
    },
    watch: {
      tickerData: {
        handler: function (val, oldVal) {
          if (val["1"]) {this.bid = val["1"]}
          if (val["2"]) {this.ask = val["2"]}
          if (val["3"]) {this.last = val["3"]}
        },
        deep: true
      }
    },
    data() {
      return {
        bid: '',
        ask: '',
        last: '',
      }
    }
  }
</script>
