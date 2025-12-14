<template>
    <div class="breadcrumb"  style="display: flex;align-items: center; /* 垂直居中 */">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item v-for="(breadcrumb, id) in breadcrumbs" :key="id">
            <a :href="breadcrumb.path">
                {{ breadcrumb.name }}   
            </a>
        </el-breadcrumb-item>
        <!-- <el-breadcrumb-item :to="{ path: '/' }">home</el-breadcrumb-item>
        <el-breadcrumb-item>
          <a href="/">promotion management</a>
        </el-breadcrumb-item>
        <el-breadcrumb-item>promotion list</el-breadcrumb-item>
        <el-breadcrumb-item>promotion detail</el-breadcrumb-item> -->
      </el-breadcrumb>
    </div>
</template>

<script>
import {computed } from 'vue'
export default {
    name: "BreadcrumbView", // 面包屑
    props: ['breadcrumbsCountent'],
    setup(props) {
        let breadcrumbs = computed(() => {return props.breadcrumbsCountent;});
        
        return {
            breadcrumbs
        }
    }
}
</script>

<style scoped>
.breadcrumb a{
  font-size: 1rem;
}
</style>