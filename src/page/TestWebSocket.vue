<template>
   <div>
     <h1>当前在线人数：{{ onlineCount }}</h1>
     <h1>发送期货ID：{{futureID}}</h1>
     <h1>收到信息：{{ res }}</h1>
     <el-button type="primary" plain @click="gotoLogin">登录</el-button>
     <div id="chartdiv" style="width: 50%; height: 400px;"></div>
   </div>
</template>

<script>
import Highcharts from 'highcharts/highstock'
import HighchartsMore from 'highcharts/highcharts-more'
import HighchartsDrilldown from 'highcharts/modules/drilldown'
import Highcharts3D from 'highcharts/highcharts-3d';
import Highmaps from 'highcharts/modules/map';

HighchartsMore(Highcharts);
HighchartsDrilldown(Highcharts);
Highcharts3D(Highcharts);
Highmaps(Highcharts);
export default {
  name: 'TestWebSocket',
  data () {
    return {
      onlineCount: 0,
      res: '',
      ws: null,
      heartBeat: '000',
      futureID: 'au1806'
    }
  },
  created () {
    this.initWs();
  },
  mounted () {
    this.runWs();
    this.drawChart();
  },
  methods: {
    drawChart () {
      let options = {
        chart: {
          type: 'bar'
        },
        title: {
          text: '我的第一个图表'
        },
        xAxis: {
          categories: ['苹果', '香蕉', '橙子']
        },
        yAxis: {
          title: {
            text: '吃水果个数'
          }
        },
        series: [{
          name: '小明',
          data: [1, 0, 4]
        }, {
          name: '小红',
          data: [5, 7, 3]
        }]
      };
      let chart = Highcharts.chart('chartdiv', options);
    },
    initWs () {
      if ('WebSocket' in window) {
        this.ws = new WebSocket('ws://localhost:8080/websocket')
      } else {
        this.$message.error('Sorry, websocket not supported by your browser.');
      }
      this.ws.onmessage = this.onMessage;
      this.ws.onclose = this.onClose;
    },
    onMessage (e) {
      let response = JSON.parse(e.data);
      this.onlineCount = response.onlineCount;
      this.res = response.response;
    },
    sendMessage (msg) {
      this.ws.send(msg);
    },
    onClose () {
      console.log('ws closed');
    },
    runWs () {
      let content = 'source=client&futureId=' + this.futureID;
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
    },
    gotoLogin () {
      this.ws.close();
      this.$router.push('/login');
    }
  }
}
</script>

<style scoped>

</style>
