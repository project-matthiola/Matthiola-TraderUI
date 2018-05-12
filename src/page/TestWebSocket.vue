<template>
   <div>
     <h1>当前在线人数：{{ onlineCount }}</h1>
     <h1>发送期货ID：{{futureID}}</h1>
     <h1>收到信息：{{ res }}</h1>
     <el-button type="primary" plain @click="gotoLogin">登录</el-button>
   </div>
</template>

<script>
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
  },
  methods: {
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
