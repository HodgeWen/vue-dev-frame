<template>
  <div class="about">
    <h1>This is an about page</h1>
    <el-button>aaa</el-button>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { Button } from 'ball-python/components'
export default Vue.extend({
  components: {
    ElButton: Button
  }
})
</script>