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
          <!-- <el-main v-bind:class="{'main-collapse': changeMainClass, 'main-notCollapse': true }"> -->
          <el-main v-bind:class="{'main-notCollapse': true }">
            <template>
              <el-row>
                <el-col :span="24">
                  <el-breadcrumb separator-class="el-icon-arrow-right">
                    <el-breadcrumb-item :to="{ path: '/home' }">Home</el-breadcrumb-item>
                    <el-breadcrumb-item :to="{ path: '/catalog' }">Futures Catalog</el-breadcrumb-item>
                    <el-breadcrumb-item>{{futureName}}</el-breadcrumb-item>
                    <el-breadcrumb-item>{{futurePeriod}}</el-breadcrumb-item>
                  </el-breadcrumb>
                </el-col>
              </el-row>
            </template>
            <el-row>
              <el-col :span="24">
                <el-tabs type="card" v-model="activeBroker"
                         style="padding-top: 10px" @tab-click="handleClick">
                  <el-tab-pane v-for="broker in brokers" v-bind:key="broker.broker_id" v-bind:label="broker.broker_name" v-bind:name="broker.broker_id"></el-tab-pane>
                </el-tabs>
              </el-col>
            </el-row>
            <el-card style="padding-top: 0px; width: 28%; height: 500px;float: left">
              <span style="float: left; margin-top: 0; width:45%; font-size: large">{{ activeTable }}</span>
              <div style="float: right">
                <el-button type="text" size="mini" v-bind:style="{color: btnOBColor}" @click="activeOrderBook"><u>OrderBook</u></el-button>
                <el-button type="text" size="mini" v-bind:style="{color: btnTHColor, marginLeft: 0 }" @click="activeTradeHistory"><u>TradeHistory</u></el-button>
              </div>
              <div v-show="activeOB">
                <el-table :data="sells" size="mini" highlight-current-row :default-sort = "{prop: 'price', order: 'descending'}" max-height="200"
                          id="sellsTable" tooltip-effect="light" v-loading="sellsLoading" element-loading-spinner="el-icon-loading">
                  <el-table-column prop="0" label="PRICE" sortable width="120" show-overflow-tooltip>
                  </el-table-column>
                  <el-table-column prop="1" label="AMOUNT" width="120">
                  </el-table-column>
                </el-table>
                <el-table :data="buys" size="mini" highlight-current-row :default-sort = "{prop: 'id', order: 'ascending'}" max-height="200"
                          id="buysTable" tooltip-effect="light" v-loading="sellsLoading" element-loading-spinner="el-icon-loading" :show-header="false">
                  <el-table-column prop="0" label="PRICE" sortable width="120" show-overflow-tooltip>
                  </el-table-column>
                  <el-table-column prop="1" label="AMOUNT" width="120">
                  </el-table-column>
                </el-table>
              </div>
              <div v-show="activeTH">
                <el-table :data="trades" size="mini" highlight-current-row max-height="400"
                          id="tradesTable" tooltip-effect="light" v-loading="tradesLoading" element-loading-spinner="el-icon-loading">
                  <el-table-column prop="0" label="PRICE" width="90" show-overflow-tooltip></el-table-column>
                  <el-table-column prop="1" label="AMOUNT" width="90" show-overflow-tooltip></el-table-column>
                  <el-table-column prop="2" label="TIME" width="120" show-overflow-tooltip></el-table-column>
                </el-table>
              </div>
            </el-card>
            <el-card style="padding-top: 0px; margin-left: 5px; width: 45%; height: 500px; float: left">
              <span style="float: left; margin-top: 0; width: 30%; font-size: large">{{ activeChart }}</span>
              <div style="float: right">
                <el-button type="text" size="mini" v-bind:style="{color: btnMDColor}" @click="activeMarketDepth"><u>Market Depth</u></el-button>
                <el-button type="text" size="mini" v-bind:style="{color: btnPCColor, marginLeft: 0 }" @click="activePriceChart"><u>Price Chart</u></el-button>
              </div>
              <div id="chartdiv" style="width: 100%; height: 400px; z-index: 100;"></div>
            </el-card>
            <el-card style="padding-top: 0px; margin-left: 5px; width: 25%; height: 500px; float: left">
              <span style="text-align: center; font-size: large">ORDER FORM</span>
              <el-tabs v-model="activeOrderType" style="width: 100%" @click="handleClick2">
                <el-tab-pane label="MARKET" name="market"></el-tab-pane>
                <el-tab-pane label="LIMIT" name="limit"></el-tab-pane>
                <el-tab-pane label="STOP" name="stop"></el-tab-pane>
              </el-tabs>
              <el-button size="mini" style="width: 40%" plain v-bind:type="btnBuy" @click="selectSideBuy">BUY</el-button>
              <el-button size="mini" style="width: 40%" plain v-bind:type="btnSell" @click="selectSideSell">SELL</el-button>
              <el-form :model="orderForm" status-icon :rules="orderRules" ref="orderForm">
                <el-form-item label="AMOUNT" prop="amount" style="margin-top: 0 !important; margin-bottom: 0 !important;">
                  <el-input v-model.number="orderForm.amount"></el-input>
                </el-form-item>
                <el-form-item v-if="activeOrderType==='limit'" label="LIMIT PRICE" prop="price" style="margin-top: 0 !important; margin-bottom: 0 !important;">
                  <el-input v-model.number="orderForm.price" style="margin-top: 0 !important;"></el-input>
                </el-form-item>
                <el-form-item v-else-if="activeOrderType==='stop'" label="STOP PRICE" prop="price" style="margin-top: 0 !important; margin-bottom: 0 !important;">
                  <el-input v-model.number="orderForm.price" style="margin-top: 0 !important;"></el-input>
                </el-form-item>
                <el-collapse v-model="activeNames" v-if="activeOrderType==='stop'" style="margin-top: 0 !important; margin-bottom: 0 !important;">
                  <el-collapse-item title="Advanced" name="advanced">
                    <el-form-item label="LIMIT PRICE" prop="price2" style="margin-top: 0 !important; margin-bottom: 0 !important;">
                      <el-input v-model.number="orderForm.price2"></el-input>
                    </el-form-item>
                  </el-collapse-item>
                </el-collapse>
                <el-form-item>
                  <el-button size="small" style="width: 80%; margin-top: 15px" plain v-bind:type="btnSubmit" @click="submitForm('orderForm')">PLACE ORDER</el-button>
                </el-form-item>
              </el-form>
            </el-card>
          </el-main>
        </el-container>
      </el-container>
      <el-footer class="footer">
        <Footer></Footer>
      </el-footer>
    </el-container>
  </div>
</template>

<script>
import Header from '@/components/Header'
import NavMenu from '@/components/NavMenu'
import Footer from '@/components/Footer'
import { sendOrder, refreshToken, requestBrokers } from '@/common/api'
/* eslint-disable */
export default {
  name: 'Market',
  components: {
    Header, NavMenu, Footer
  },
  data () {
    let checkPrice = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('Please input price'));
      } else {
        let reg = /^[-+]?[0-9]*\.?[0-9]+$/;
        if (!reg.test(value)) {
          callback(new Error('Price format error'));
        }
      }
      callback();
    };
    let checkPrice2 = (rule, value, callback) => {
      if (value === '') {
        callback();
      } else {
        let reg = /^[-+]?[0-9]*\.?[0-9]+$/;
        if (!reg.test(value)) {
          callback(new Error('Price format error'));
        }
      }
      callback();
    };
    let checkAmount = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('Please input amount'));
      } else {
        let reg = /^[-+]?[0-9]*\.?[0-9]+$/;
        if (!reg.test(value)) {
          callback(new Error('Amount format error'));
        }
      }
      callback();
    };
    return {
      futureName: '',
      futurePeriod: '',
      futureID: '',
      activeTable: 'Order Book',
      activeOB: true,
      activeTH: false,
      activeChart: 'Market Depth',
      btnOBColor: '#409eff',
      btnTHColor: 'gray',
      btnMDColor: '#409eff',
      btnPCColor: 'gray',
      orderBook: {},
      buys: [],
      sells: [],
      trades: [],
      ws: null,
      sellsLoading: false,
      tradesLoading: false,
      brokers: [],
      activeBroker: 'brokerA',
      activeOrderType: 'market',
      activeOrderSide: 'buy',
      btnBuy: 'success',
      btnSell: 'info',
      btnSubmit: 'success',
      orderForm: {
        amount: 0.0,
        price: 0.0,
        price2: 0.0
      },
      orderRules: {
        amount: [
          { validator: checkAmount, trigger: 'blur' }
        ],
        price: [
          { validator: checkPrice, trigger: 'blur' }
        ],
        price2: [
          { validator: checkPrice2, trigger: 'blur' }
        ]
      },
      activeNames: ''
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
    orderBook: {
      handler: function () {
        this.drawCharts();
      },
      deep: true
    }
  },
  created () {
    document.title = 'Market';
    this.initWs();
    this.$store.state.isCollapse = true
  },
  mounted () {
    this.futureID = this.$route.params.Fid;
    this.futureName = this.$route.params.futureName;
    this.futurePeriod = this.$route.params.period;
    this.sellsLoading = true;
    this.tradesLoading = true;
    this.runWs();
    requestBrokers().then((res) => {
      if (res.status === 200 && res.data.status === 200) {
        this.brokers = res.data.data;
      }
    })
    /*
    refreshToken().then((res) => {
      let token = res.data.data;
      sessionStorage.setItem('token', token);
      console.log(sessionStorage.getItem('token'));
    });
    */
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
          'title': ''
        }],
        'categoryAxis': {
          'title': this.futureName + '-' + this.futurePeriod,
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
      this.$refs['orderForm'].resetFields();
    },
    handleClick2 (tab, event) {
      console.log(tab, event);
      console.log(this.activeOrderType);
      this.$refs['orderForm'].resetFields();
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
      let response = JSON.parse(e.data);
      if (response.type === 'orderBook') {
        this.sellsLoading = true;
        this.orderBook = response.data;
        this.sells = response.data.asks;
        this.buys = response.data.bids;
        this.sellsLoading = false;
        let content = 'orderBook,futures1,' + this.activeBroker;
        this.sendMessage(content);
      } else if (response.type === 'trade') {
        this.tradesLoading = true;
        this.trades = response.data;
        let content2 = 'trade,futures1,' + this.activeBroker;
        this.tradesLoading = false;
        this.sendMessage(content2);
      }

      // console.log(this.buys);
      // let content = 'orderBook,' + this.futureID + ',' + this.activeBroker;
      // let content = 'orderBook,futures1,' + this.activeBroker;
      // let content2 = 'trade,futures1,' + this.activeBroker;
      // this.sendMessage(content);
      // this.sendMessage(content2);
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
      // let content = 'orderBook,' + this.futureID + ',' + this.activeBroker;
      let content = 'orderBook,futures1,' + this.activeBroker;
      let content2 = 'trade,futures1,' + this.activeBroker;
      if (this.ws.readyState === this.ws.OPEN) {
        this.sendMessage(content);
        this.sendMessage(content2);
      } else if (this.ws.readyState === this.ws.CONNECTING) {
        let _self_ = this;
        setTimeout(function () {
          _self_.sendMessage(content);
          _self_.sendMessage(content2);
        }, 300)
      }
    },
    selectSideBuy () {
      this.activeOrderSide = 'buy';
      this.btnBuy = 'success';
      this.btnSell = 'info';
      this.btnSubmit = 'success';
      this.$refs['orderForm'].resetFields();
    },
    selectSideSell () {
      this.activeOrderSide = 'sell';
      this.btnBuy = 'info';
      this.btnSell = 'danger';
      this.btnSubmit = 'danger';
      this.$refs['orderForm'].resetFields();
    },
    submitForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$confirm('Are you sure to submit?', 'submit', {}).then(() => {
            let orderParams = Object.assign({}, this.orderForm);
            if (this.activeOrderType === 'market') orderParams.type = '1';
            else if (this.activeOrderType === 'limit') orderParams.type = '2';
            else if (this.activeOrderType === 'stop') orderParams.type = '3';

            if (this.activeOrderSide === 'buy') orderParams.side = '1';
            else if (this.activeOrderSide === 'sell') orderParams.side = '2';

            orderParams.brokerName = this.activeBroker;
            orderParams.futureID = this.futureID;
            console.log(orderParams);

            sendOrder(orderParams).then((res) => {
              if (res.status === 200 && res.data.status === 200) {
                this.$message({
                  message: 'Submit success',
                  type: 'success'
                });
                this.$refs[formName].resetFields();
              } else {
                this.$message.error('Submit fail');
              }
            }).catch((err) => {
              console.log(err);
            });
          });
        } else {
          this.$message({
            message: 'Please input price & amount!',
            type: 'warning'
          });
        }
      });
    },
    activeOrderBook () {
      this.btnOBColor = '#409eff';
      this.btnTHColor = 'gray';
      this.activeTable = 'Order Book';
      this.activeOB = true;
      this.activeTH = false;
    },
    activeTradeHistory () {
      this.btnOBColor = 'gray';
      this.btnTHColor = '#409eff';
      this.activeTable = 'Trade History';
      this.activeOB = false;
      this.activeTH = true;
    },
    activeMarketDepth () {
      this.btnMDColor = '#409eff';
      this.btnPCColor = 'gray';
      this.activeChart = 'Market Depth';
    },
    activePriceChart () {
      this.btnMDColor = 'gray';
      this.btnPCColor = '#409eff';
      this.activeChart = 'Price Chart';
    }
  }
}
</script>

<style>
  #sellsTable {
    width: 100%;
    margin-top: 0px;
    margin-left: 10px;
    color: red;
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
    color: green;
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
