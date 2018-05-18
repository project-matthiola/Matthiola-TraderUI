<template>
  <div>
    <el-container>
      <el-header class="header">
        <Header></Header>
      </el-header>
      <el-container>
        <el-aside class="aside">
          <NavMenu></NavMenu>
        </el-aside>
        <el-container>
          <el-main v-bind:class="{'main-collapse': changeMainClass, 'main-notCollapse': true }">
            <template>
                <el-row>
                  <el-col :span="24">
                    <el-breadcrumb separator-class="el-icon-arrow-right">
                      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
                      <el-breadcrumb-item :to="{ path: '/catalog' }">期货目录</el-breadcrumb-item>
                      <el-breadcrumb-item>{{futureName}}</el-breadcrumb-item>
                      <el-breadcrumb-item>{{futurePeriod}}</el-breadcrumb-item>
                    </el-breadcrumb>
                  </el-col>
                </el-row>
              </template>
            <el-tabs type="card" v-model="activeBroker" style="padding-top: 10px" @tab-click="handleClick">
              <el-tab-pane label="Broker A" name="first"></el-tab-pane>
              <el-tab-pane label="Broker B" name="second"></el-tab-pane>
              <el-tab-pane label="Broker C" name="third"></el-tab-pane>
            </el-tabs>
            <div style="width: 25%; float: left">
              <el-table :data="sells" size="mini" highlight-current-row :default-sort = "{prop: 'price', order: 'descending'}" max-height="200"
                        id="sellsTable" tooltip-effect="light" v-loading="sellsLoading" element-loading-spinner="el-icon-loading">
                <el-table-column prop="0" label="价格" sortable width="120" show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="1" label="数量" width="120">
                </el-table-column>
              </el-table>
              <el-table :data="buys" size="mini" highlight-current-row :default-sort = "{prop: 'id', order: 'ascending'}" max-height="200"
                        id="buysTable" tooltip-effect="light" v-loading="sellsLoading" element-loading-spinner="el-icon-loading" :show-header="false">
                <el-table-column prop="0" label="价格" sortable width="120" show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="1" label="数量" width="120">
                </el-table-column>
              </el-table>
            </div>
            <template>
              <div id="chartdiv" style="width: 45%; height: 400px; float: left"></div>
            </template>
          </el-main>
        </el-container>
      </el-container>
      <el-footer class="footer2">
        <Footer></Footer>
      </el-footer>
    </el-container>
  </div>
</template>

<script>
import Header from '@/components/Header'
import NavMenu from '@/components/NavMenu'
import Footer from '@/components/Footer'
/* eslint-disable */
export default {
  name: 'Market',
  components: {
    Header, NavMenu, Footer
  },
  data () {
    return {
      futureName: '',
      futurePeriod: '',
      futureID: '',
      orderBook: {},
      buys: [],
      sells: [],
      ws: null,
      sellsLoading: false,
      activeBroker: 'first',
      dataProvider: [],
      dataProvider2: []
    }
  },
  computed: {
    changeMainClass () {
      return !this.$store.state.isCollapse
    }
  },
  watch: {
    sells: function () {
      this.$nextTick(function () {
        let tmp = this.$el.querySelector('.el-table__body-wrapper');
        // console.log(tmp.scrollHeight);
        tmp.scrollTop = 999;
        // console.log(tmp.scrollTop)
      })
    },
    dataProvider2: {
      handler: function () {
        this.drawCharts();
      },
      deep: true
    },
    orderBook: {
      handler: function () {
        this.drawCharts();
      },
      deep: true
    }
  },
  created () {
    document.title = '市场行情';
    this.initWs()
  },
  mounted () {
    this.futureID = this.$route.params.Fid;
    this.futureName = this.$route.params.futureName;
    this.futurePeriod = this.$route.params.period;
    this.sellsLoading = true;
    this.runWs();
    // this.dataProvider2 = {'bids': [[295.96, 10.34], [295.95, 5.67], [295.93, 3.46], [295.92, 4.62], [295.9, 5.17]],
    //  'asks': [[295.89, 2.41], [295.88, 3.45], [295.87, 1.56], [295.86, 7.23], [295.85, 3.41]]};
  },
  beforeDestroy () {
    this.closeSocket()
  },
  methods: {
    processData (list, type, desc, res) {
      for (let i = 0; i < list.length; i++) {
        list[i] = {
          value: Number(list[i][0]),
          volume: Number(list[i][1])
        }
      }
      list.sort(function (a, b) {
        if (a.value > b.value) {
          return 1
        } else if (a.value < b.value) {
          return -1
        } else {
          return 0
        }
      });
      if (desc) {
        for (let i = list.length - 1; i >= 0; i--) {
          if (i < (list.length - 1)) {
            list[i].totalvolume = list[i + 1].totalvolume + list[i].volume
          } else {
            list[i].totalvolume = list[i].volume
          }
          let dp = {};
          dp['value'] = list[i].value;
          dp[type + 'volume'] = list[i].volume;
          dp[type + 'totalvolume'] = list[i].totalvolume;
          res.unshift(dp)
        }
      } else {
        for (let i = 0; i < list.length; i++) {
          if (i > 0) {
            list[i].totalvolume = list[i - 1].totalvolume + list[i].volume
          } else {
            list[i].totalvolume = list[i].volume
          }
          let dp = {};
          dp['value'] = list[i].value;
          dp[type + 'volume'] = list[i].volume;
          dp[type + 'totalvolume'] = list[i].totalvolume;
          res.push(dp)
        }
      }
      return res
    },
    drawCharts () {
      let res = [];
      let bids = [].concat(this.orderBook.bids);
      let asks = [].concat(this.orderBook.asks);
      res = this.processData(bids, 'bids', true, res);
      res = this.processData(asks, 'asks', false, res);

      let config = {
        'type': 'serial',
        'theme': 'light',
        'graphs': [{
          'id': 'bids',
          'fillAlphas': 0.1,
          'lineAlpha': 1,
          'lineThickness': 2,
          'lineColor': '#0f0',
          'type': 'step',
          'valueField': 'bidstotalvolume',
          'balloonFunction': balloon
        }, {
          'id': 'asks',
          'fillAlphas': 0.1,
          'lineAlpha': 1,
          'lineThickness': 2,
          'lineColor': '#f00',
          'type': 'step',
          'valueField': 'askstotalvolume',
          'balloonFunction': balloon
        }, {
          'lineAlpha': 0,
          'fillAlphas': 0.2,
          'lineColor': '#000',
          'type': 'column',
          'clustered': false,
          'valueField': 'bidsvolume',
          'showBalloon': false
        }, {
          'lineAlpha': 0,
          'fillAlphas': 0.2,
          'lineColor': '#000',
          'type': 'column',
          'clustered': false,
          'valueField': 'asksvolume',
          'showBalloon': false
        }],
        'categoryField': 'value',
        'chartCursor': {},
        'balloon': {
          'textAlign': 'left'
        },
        'valueAxes': [{
          'title': 'Volume'
        }],
        'categoryAxis': {
          'title': this.futureName + this.futurePeriod,
          'minHorizontalGap': 100,
          'startOnAxis': true,
          'showFirstLabel': false,
          'showLastLabel': false
        },
        'export': {
          'enabled': true
        },
        'dataProvider': res
      };
      function balloon (item, graph) {
        let txt;
        if (graph.id === 'asks') {
          txt = 'Ask: <strong>' + formatNumber(item.dataContext.value, graph.chart, 4) + '</strong><br />' +
            'Total volume: <strong>' + formatNumber(item.dataContext.askstotalvolume, graph.chart, 4) + '</strong><br />' +
            'Volume: <strong>' + formatNumber(item.dataContext.asksvolume, graph.chart, 4) + '</strong>'
        } else {
          txt = 'Bid: <strong>' + formatNumber(item.dataContext.value, graph.chart, 4) + '</strong><br />' +
            'Total volume: <strong>' + formatNumber(item.dataContext.bidstotalvolume, graph.chart, 4) + '</strong><br />' +
            'Volume: <strong>' + formatNumber(item.dataContext.bidsvolume, graph.chart, 4) + '</strong>'
        }
        return txt
      }
      function formatNumber (val, chart, precision) {
        return AmCharts.formatNumber(
          val,
          {
            precision: precision || chart.precision,
            decimalSeparator: chart.decimalSeparator,
            thousandsSeparator: chart.thousandsSeparator
          }
        )
      }
      let chart = AmCharts.makeChart('chartdiv', config)
    },
    handleClick (tab, event) {
      console.log(tab, event);
      console.log(this.activeBroker);

      let obj1 = [Math.random() * 100, Math.random() * 10];
      let obj2 = [Math.random() * 100, Math.random() * 10];
      this.dataProvider2.bids.push(obj1);
      this.dataProvider2.asks.push(obj2);
      this.sells.push(obj1);
      console.log(this.dataProvider2);
    },
    initWs () {
      if ('WebSocket' in window) {
        this.ws = new WebSocket('ws://localhost:8888/websocket')
      } else {
        this.$message.error('Sorry, websocket not supported by your browser.')
      }
      this.ws.onmessage = this.onMessage;
      this.ws.onclose = this.onClose;
    },
    onMessage (e) {
      this.sellsLoading = true;
      let response = JSON.parse(e.data);
      this.orderBook = response;
      this.sells = response.asks;
      this.buys = response.bids;
      this.sellsLoading = false;
      // console.log(this.buys);
      let content = this.futureID + "," + this.activeBroker;
      this.sendMessage(content);
      // console.log(this.sells);
    },
    sendMessage (msg) {
      this.ws.send(msg)
    },
    closeSocket () {
      this.ws.close()
    },
    onClose () {
      console.log('ws closed')
    },
    runWs () {
      let content = this.futureID + "," + this.activeBroker;
      if (this.ws.readyState === this.ws.OPEN) {
        this.sendMessage(content)
      } else if (this.ws.readyState === this.ws.CONNECTING) {
        let _self_ = this;
        setTimeout(function () {
          _self_.sendMessage(content)
        }, 300)
      }
    }
  }
}
</script>

<style>
  #sellsTable {
    width: 100%;
    margin-top: 0px;
    margin-left: 10px;
    color: green;
    font-size: small;
    line-height: 15px !important;
  }
  #sellsTable table thead tr {
    text-align: center !important;
  }
  #sellsTable table thead tr th {
    text-align: center !important;
  }
  #sellsTable table thead tr th div {
    text-align: center !important;
  }
  #sellsTable table tbody tr {
    height: 15px !important;
  }
  #sellsTable table tbody tr td {
    height: 15px !important;
  }
  #sellsTable table tbody tr td div{
    height: 10px !important;
    line-height: 10px !important;
  }
  #buysTable {
    width: 100%;
    margin-left: 10px;
    color: red;
    font-size: small;
    line-height: 15px !important;
  }
  #buysTable table tbody tr {
    height: 15px !important;
  }
  #buysTable table tbody tr td {
    height: 15px !important;
  }
  #buysTable table tbody tr td div{
    height: 10px !important;
    line-height: 10px !important;
  }
</style>
