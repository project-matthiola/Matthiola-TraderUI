<template>
  <!--
  <div class="header-wrapper">
    <el-container>
      <el-header class="header">
      -->
        <el-row style="height: 60px">
          <el-col :span="24" style="height: 60px">
            <el-col :span="20" style="height: 60px">
              <el-menu :default-active="activeIndex" class="el-menu" mode="horizontal" @select="handleSelect">
                <el-menu-item index="1"><i class="el-icon-menu"></i></el-menu-item>
                <el-submenu index="2">
                  <template slot="title">John Doe</template>
                  <el-menu-item index="2-1"><i class="el-icon-setting"></i>设置</el-menu-item>
                  <el-menu-item index="2-2"><i class="el-icon-circle-close-outline"></i>登出</el-menu-item>
                </el-submenu>
                <el-menu-item index="3">处理中心</el-menu-item>
              </el-menu>
            </el-col>
            <el-col :span="4" style="font-size: x-large; text-align: left">
              <span>Matthiola-Trader</span>
            </el-col>
          </el-col>
        </el-row>
  <!--
      </el-header>
      <el-container>
        <el-aside width="220px">
          <el-row>
            <el-col :span="12">
              <el-menu default-active="1-4-1" class="el-menu-vertical-demo" @open="handleOpen" @close="handleClose" :collapse="isCollapse">
                <el-menu-item index="1">
                  <i class="el-icon-goods"></i>
                  <span slot="title">期货目录</span>
                </el-menu-item>
                <el-menu-item index="2">
                  <i class="el-icon-document"></i>
                  <span slot="title">我的订单</span>
                </el-menu-item>
              </el-menu>
            </el-col>
          </el-row>
        </el-aside>
        <el-container>
          <el-main></el-main>
        </el-container>
      </el-container>
      <el-footer></el-footer>
    </el-container>
  </div>
  -->
</template>

<script>
export default {
  name: 'Header',
  data () {
    return {
      activeIndex: '1',
      isCollapse: false
    }
  },
  methods: {
    handleSelect (key, keyPath) {
      console.log(key, keyPath);
      if (key === '1') {
        this.triggerCollapse();
      } else {
        this.isCollapse = true;
        this.$store.state.isCollapse = true;
      }
    },
    handleOpen (key, keyPath) {
      console.log(key, keyPath);
    },
    handleClose (key, keyPath) {
      console.log(key, keyPath);
    },
    triggerCollapse () {
      if (!this.isCollapse) this.isCollapse = true;
      else this.isCollapse = false;

      if (!this.$store.state.isCollapse) this.$store.state.isCollapse = true;
      else this.$store.state.isCollapse = false;
    }
  }
}
</script>

<style lang="less" scoped>
.header-wrapper {
  position: fixed;
  width: 100%;
  top: 0;
  left: 0;
  z-index: 1500;
  .header {
    height: 60px;
    background-color: white;
    top: 0;
    left: 0;
    width: 100%;
    line-height: 80px;
    z-index: 100;
    position: relative;
  }
}
.header.h1 {
  margin: 0;
  float: left;
  font-size: 32px;
  font-weight: 400;
}
.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 200px;
  min-height: 400px;
  text-align: center;
}
</style>
