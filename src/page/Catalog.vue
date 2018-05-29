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
                    <el-breadcrumb-item :to="{ path: '/home' }">Home</el-breadcrumb-item>
                    <el-breadcrumb-item :to="{ path: '/catalog' }">Futures Catalog</el-breadcrumb-item>
                  </el-breadcrumb>
                </el-col>
              </el-row>
            </template>
            <template>
              <el-row style="padding-top: 20px">
                <el-col :span="5" v-for="(future, index) in futures" :key="future.futureName" :offset="1" style="padding-top: 20px">
                  <el-card :body-style="{ padding: '0px' }">
                    <img src="../assets/icon.jpg" class="image">
                    <div style="padding: 14px;">
                      <span>{{future.futureName}}</span>
                      <div class="bottom clearfix">
                        <el-select v-model="future.selectID" clearable placeholder="Selet period">
                          <el-option v-for="item in future.futureInfo" :key="item.value" :label="item.period" :value="item.value">
                          </el-option>
                        </el-select>
                        <el-button type="primary" plain size="small" @click="selectFuture(index)" style="margin-top: 5px">View Market</el-button>
                      </div>
                    </div>
                  </el-card>
                </el-col>
              </el-row>
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
import { requestFuturesList, refreshToken } from '@/common/api'
export default {
  name: 'Catalog',
  components: {
    Header, NavMenu, Footer
  },
  data () {
    return {
      futures: []
    }
  },
  created () {
    document.title = 'Futures Catalog'
  },
  mounted () {
    let requestFuturesListParams = {};
    requestFuturesList(requestFuturesListParams).then((res) => {
      if (res.status === 200 && res.data.status === 200) {
        this.futures = res.data.data;
        // console.log(this.futures);
      }
    });
    /*
    refreshToken().then((res) => {
      let token = res.data.data;
      sessionStorage.setItem('token', token);
      console.log(sessionStorage.getItem('token'));
    });
    */
  },
  computed: {
    changeMainClass () {
      return !this.$store.state.isCollapse;
    }
  },
  methods: {
    selectFuture (index) {
      let selectID = this.futures[index].selectID;
      let futureName = this.futures[index].futureName;
      let futureInfo = this.futures[index].futureInfo;
      let period = '';
      for (let i = 0; i < futureInfo.length; i++) {
        if (futureInfo[i].value === selectID) {
          period = futureInfo[i].period;
        }
      }
      if (selectID === undefined || selectID === '') {
        this.$message.warning('Please select period！');
      } else {
        this.$router.push({name: 'market', params: {Fid: selectID, futureName: futureName, period: period}});
      }
    }
  }
}
</script>

<style scoped>
  .bottom {
    margin-top: 13px;
    line-height: 12px;
  }
  .image {
    width: 100%;
    height: 100%;
    display: block;
  }
  .clearfix:before,
  .clearfix:after {
    display: table;
    content: "";
  }
  .clearfix:after {
    clear: both
  }
</style>
