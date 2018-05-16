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
                      <el-breadcrumb-item>{{futurePeriod}}期</el-breadcrumb-item>
                    </el-breadcrumb>
                  </el-col>
                </el-row>
              </template>
            <el-button type="primary" plain @click="scrollToBottom">Scroll</el-button>
            <template>
              <el-table :data="sells" size="mini" highlight-current-row :default-sort = "{prop: 'price', order: 'descending'}" max-height="400"
                        id="sellsTable" tooltip-effect="light">
                <el-table-column prop="id" label="ID" sortable width="120">
                </el-table-column>
                <el-table-column prop="price" label="价格" sortable width="120" show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="quantity" label="数量" width="180">
                </el-table-column>
              </el-table>
            </template>
            <template>
              <el-table :data="buys" size="mini" highlight-current-row :default-sort = "{prop: 'id', order: 'ascending'}" max-height="400"
                        style="width: 35%; color: red; margin-left: 20px; font-size: small" id="buysTable"
                        tooltip-effect="light" :show-header="false">
                <el-table-column prop="id" label="ID" sortable width="120">
                </el-table-column>
                <el-table-column prop="price" label="价格" sortable width="120" show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="quantity" label="数量" width="180">
                </el-table-column>
              </el-table>
            </template>
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
      buys: [],
      sells: [],
      scrollTop: 0,
      index: 0,
      ws: null
    }
  },
  computed: {
    changeMainClass () {
      return !this.$store.state.isCollapse;
    }
  },
  watch: {
    sells: function () {
      let tmp = this.$el.querySelector('.el-table__body-wrapper');
      console.log(tmp);
      console.log(tmp.scrollHeight);
      tmp.scrollTop = 999;
      console.log(tmp.scrollTop);
    }
  },
  created () {
    this.runWs();
  },
  mounted () {
    this.futureID = this.$route.params.Fid;
    this.futureName = this.$route.params.futureName;
    this.futurePeriod = this.$route.params.period;
    // console.log(futureID);
    for (let i = 1; i < 30; i++) {
      let obj = {id: i, price: (30 - i) * 0.9, quantity: i * 100};
      let obj2 = {id: i, price: i * 0.9, quantity: i * 100};
      this.buys.push(obj);
      this.sells.push(obj2);
    }
    this.index = 30;
  },
  methods: {
    initScroll () {
      return this.scrollTop;
    },
    scrollToBottom () {
      // let tmp = this.$el.querySelector('.el-table__body-wrapper');
      // let tmp = this.$el.querySelector('#sellsTable');
      // console.log(tmp);
      // console.log(tmp.scrollHeight);
      // tmp.scrollTop = tmp.scrollHeight;
      let obj = {id: this.index, price: this.index * 0.9, quantity: this.index * 100};
      this.sells.push(obj);
      this.index++;
    },
    initWs () {
      if ('WebSocket' in window) {
        this.ws = new WebSocket('ws://localhost:8888/websocket')
      } else {
        this.$message.error('Sorry, websocket not supported by your browser.');
      }
      this.ws.onmessage = this.onMessage;
      this.ws.onclose = this.onClose;
    },
    onMessage (e) {
      let response = JSON.parse(e.data);
      this.res = response.response;
    },
    sendMessage (msg) {
      this.ws.send(msg);
    },
    onClose () {
      console.log('ws closed');
    },
    runWs () {
      let content = this.futureID;
      if (this.ws.readyState === this.ws.OPEN) {
        this.sendMessage(content);
      } else if (this.ws.readyState === this.ws.CONNECTING) {
        let _self_ = this;
        setTimeout(function () {
          _self_.sendMessage(content);
        }, 300);
      } else {
        this.initWs();
        let _self_ = this;
        setTimeout(function () {
          _self_.sendMessage(content);
        }, 500);
      }
    }
  }
}
</script>

<style>
  #sellsTable {
    width: 35%;
    margin-top: 20px;
    margin-left: 20px;
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
    width: 35%;
    margin-left: 20px;
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
