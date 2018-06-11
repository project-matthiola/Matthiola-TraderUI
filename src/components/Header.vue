<template>
  <el-row style="height: 60px">
    <el-col :span="24" style="height: 60px">
      <el-col :span="19" style="height: 60px">
        <el-menu :default-active="activeIndex" class="el-menu" mode="horizontal" @select="handleSelect">
          <el-menu-item index="1"><i class="el-icon-menu"></i></el-menu-item>
          <el-submenu index="2">
            <template slot="title">{{username}}</template>
            <el-menu-item index="2-1"><i class="el-icon-setting"></i>Setting</el-menu-item>
            <el-menu-item index="2-2"><i class="el-icon-circle-close-outline"></i>Logout</el-menu-item>
          </el-submenu>
          <el-menu-item index="3">Service Center</el-menu-item>
        </el-menu>
      </el-col>
      <el-col :span="5" style="height: 60px">
        <img src="@/assets/logo.png" style="height: 60px; padding-top: 10px" />
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
