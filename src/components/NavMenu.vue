<template>
  <el-row>
    <el-col :span="12">
      <el-menu default-active="1-4-1" class="el-menu-vertical-demo" @open="handleOpen"
               @close="handleClose" :collapse="Collapse" v-bind:router="true" style="text-align: left">
        <el-menu-item index="/catalog">
          <i class="el-icon-goods"></i>
          <span slot="title">Futures Catalog</span>
        </el-menu-item>
        <el-menu-item index="/myOrder">
          <i class="el-icon-document"></i>
          <span slot="title">My Order</span>
        </el-menu-item>
        <el-menu-item index="/trade">
          <i class="el-icon-edit-outline"></i>
          <span slot="title">Trade History</span>
        </el-menu-item>
        <el-menu-item index=""></el-menu-item>
        <el-menu-item index=""></el-menu-item>
        <el-menu-item index=""></el-menu-item>
        <el-menu-item index=""></el-menu-item>
        <el-menu-item index=""></el-menu-item>
        <el-menu-item index=""></el-menu-item>
      </el-menu>
    </el-col>
  </el-row>
</template>

<script>
export default {
  name: 'NavMenu',
  data () {
    return {
      isCollapse: false
    }
  },
  computed: {
    Collapse () {
      return this.$store.state.isCollapse;
    }
  },
  methods: {
    handleOpen (key, keyPath) {
      console.log(key, keyPath);
    },
    handleClose (key, keyPath) {
      console.log(key, keyPath);
    }
  }
}
</script>

<style scoped>
  .el-menu-vertical-demo:not(.el-menu--collapse) {
    width: 200px;
    min-height: 400px;
    text-align: center;
  }
</style>
