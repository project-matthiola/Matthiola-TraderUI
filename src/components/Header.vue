<template>
  <el-row style="height: 60px">
    <el-col :span="24" style="height: 60px">
      <el-col :span="19" style="height: 60px">
        <el-menu :default-active="activeIndex" class="el-menu" mode="horizontal" @select="handleSelect">
          <el-menu-item index="1"><i class="el-icon-menu"></i></el-menu-item>
          <el-submenu index="2">
            <template slot="title">{{username}}</template>
            <el-menu-item index="2-1"><i class="el-icon-setting"></i>设置</el-menu-item>
            <el-menu-item index="2-2"><i class="el-icon-circle-close-outline"></i>登出</el-menu-item>
          </el-submenu>
          <el-menu-item index="3">客服中心</el-menu-item>
        </el-menu>
      </el-col>
      <el-col :span="1" style="height: 60px">
        <img src="@/assets/icon.jpg" style="width: 90%; height: 80%; padding-top: 10px" />
      </el-col>
      <el-col :span="4" style="font-size: larger; text-align: left; height: 60px">
        <p>Matthiola-Trader</p>
      </el-col>
    </el-col>
  </el-row>
</template>

<script>
export default {
  name: 'Header',
  data () {
    return {
      activeIndex: '1',
      username: ''
    }
  },
  mounted () {
    this.username = sessionStorage.getItem('username');
  },
  methods: {
    handleSelect (key, keyPath) {
      console.log(key, keyPath);
      if (key === '1') {
        this.triggerCollapse();
      } else {
        this.$store.state.isCollapse = true;
        if (key === '2-2') {
          sessionStorage.clear();
          this.$router.push('/login');
        }
      }
    },
    handleOpen (key, keyPath) {
      console.log(key, keyPath);
    },
    handleClose (key, keyPath) {
      console.log(key, keyPath);
    },
    triggerCollapse () {
      if (!this.$store.state.isCollapse) this.$store.state.isCollapse = true;
      else this.$store.state.isCollapse = false;
    }
  }
}
</script>

<style lang="less" scoped>

</style>
