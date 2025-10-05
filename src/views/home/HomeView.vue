<template>
  <div class="home">
    <!-- <el-card >
      <h2 style="margin: 0%;">搜索框</h2>
    </el-card> -->
    <BreadcrumbView :breadcrumbsCountent="breadcrumbs"/>
    <FolderView v-if="currentFileTypeId < 0" :foldersCountent="folders" :currentFolderIdCountent="currentFolderId" @refresh_page="refresh_page"/>
    <FileView v-else :fileContent="file"/>
  </div>
</template>

<script>
import $ from 'jquery'
import { ref } from 'vue'
import { useStore } from 'vuex';
import { useRoute, useRouter } from 'vue-router'
import BreadcrumbView from '@/components/BreadcrumbView.vue';
import FolderView from '@/components/FolderView.vue'
import FileView from '@/components/FileView.vue';


export default {
  name: 'HomeView',
  components: {
    BreadcrumbView,
    FolderView,
    FileView,
  },
  setup() {
    let route = useRoute();
    let router = useRouter();
    let store = useStore();
    let paths = ref();
    let breadcrumbs = ref([]);
    let folders = ref([]);
    let currentFolderId = ref(-1);
    let currentFileTypeId = ref(-1);
    let file = ref();

    const get_paths = () => { 
      paths.value = ['home']
      if (route.params.path == null || route.params.path == "") return;
      else  paths.value = [...paths.value, ...route.params.path];
    };

    // 面包屑
    const get_breadcrumbs = () => {
      get_paths();
      let res = [];
      let path_content = ""
      for(let path of paths.value) {
        path_content += '/' + path;
        res = [...res, {name: path, path: path_content}];
      }
      breadcrumbs.value = res;
    }
    

    
    // let breadcrumb = ref([]);
    // // 模拟文件夹
    let Folders = ref([{
      id: 1,
      name: "豌豆1",
      tyle: "folder",
      children: [
        {
          id: 2,
          name: "pc",
          tyle: "folder",
          children: [
            {
              id: 3,
              name: "壁纸",
              tyle: "folder",
              children: [],
            },
            {
              id: 4,
              name: "文件",
              tyle: "folder",
              children: [],
            },
            {
              id: 5,
              name: "软件",
              tyle: "folder",
              children: [],
            },
            {
              id: 3,
              name: "壁纸",
              tyle: "folder",
              children: [],
            },
            {
              id: 4,
              name: "文件",
              tyle: "folder",
              children: [],
            },
            {
              id: 5,
              name: "软件",
              tyle: "folder",
              children: [],
            },
          ],
        },
        {
          id: 6,
          name: "安卓",
          tyle: "folder",
          children: [
            {
              id: 7,
              name: "壁纸",
              tyle: "folder",
              children: [],
            },
            {
              id: 8,
              name: "文件",
              tyle: "folder",
              children: [],
            },
            {
              id: 9,
              name: "app",
              tyle: "folder",
              children: [],
            },
          ],
        }
      ]
    }]);

    const get_folders = () => {
        let data = {
          "folder_paths": paths.value,
        };
      $.ajax({
        url: "https://blog.superpea.top/cloud/folder/get_folder_content",
        type: "get",
        traditional: true,  
        data: data,
        headers: {
          "Authorization": "Bearer " + store.state.user.access,
        },
        success(resp) {
          if (resp.result === "success") {
            currentFileTypeId.value = resp.current_file_type_id;
            if (currentFileTypeId.value < 0) {
              folders.value = resp.folders;
              currentFolderId.value = resp.current_folder_id;
            } else {
              file.value = resp.file;
            }
          } else {
            router.push({
              name: "404",
            })
          }
        },
        error () {
          router.push({
            name: "404",
          })
        }
      })
    }

    const refresh_page = () => {
      get_breadcrumbs();
      get_folders();
      
    }
    refresh_page();

    return {
      breadcrumbs,
      folders,
      Folders,
      currentFolderId,
      currentFileTypeId,
      file,
      refresh_page,
    }
  }
}
</script>

<style scoped>
.home {
  width: 100%;
  padding: 0 15%;
  box-sizing: border-box;
}
</style>
