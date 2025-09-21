<template>
  <el-menu
    :default-active="activeIndex"
    class="el-menu"
    mode="horizontal"
    :ellipsis="false"
    @select="handleSelect"
  >
    <el-menu-item index="/">
      <img
        style="width: 3.6rem"
        src="https://cdn.superpea.top/superpea.png"
        alt="Element logo"
      />
      <span class="title">豌豆云</span>
    </el-menu-item>
    <el-menu-item>
        <el-avatar :size="50" :src="$store.state.user.photo" style="margin-right: 0.5rem;" />
        <span>{{$store.state.user.username}}</span>
    </el-menu-item>
    <el-menu-item>
        退出
    </el-menu-item>
  </el-menu>
</template>

<script>
import { ref } from 'vue'
import { useRouter } from 'vue-router';

export default {
    setup(){
        let router = useRouter();
        const activeIndex = ref('1');
        const handleSelect = (key, keyPath) => {
            console.log(key, keyPath)
            if (key !== "") {
                router.push(key);
            }
        }

        return {
            activeIndex,
            handleSelect,
        }
    }
}
</script>

<style scoped>
.el-menu {
    padding: 0 4rem;
}
.el-menu--horizontal > .el-menu-item:nth-child(1) {
  margin-right: auto;
}

.title {
    font-size: 1.4rem;
    font-weight: 600;
}
</style>
