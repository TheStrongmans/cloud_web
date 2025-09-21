<template>
  <div class="common-layout">
    <el-container>
      <el-header>
        <NavView />
      </el-header>
      <el-main>
        <router-view/>
      </el-main>
      <el-footer>
        
      </el-footer>
    </el-container>
  </div>
</template>


<script>
import NavView from './components/NavView.vue';

export default {
  components: {
    NavView,
  }
}

</script>

<style>
</style>
