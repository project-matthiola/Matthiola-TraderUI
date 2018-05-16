<template>
  <div>
    <el-row style="height: 60px">
      <el-col :span="24" style="height: 60px">
        <p class="text_center">Copyright © 2018 Matthiola Group</p>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  name: 'Footer'
}
</script>

<style scoped>
  .text_center {
    text-align: center;
    color: lightgray;
    font-size: small;
  }
</style>
