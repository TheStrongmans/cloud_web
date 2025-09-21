<template>
    <div class="folder">
        <el-card>
            <div class="folder-header">
            <el-row  justify="space-between">
                <el-col :span="14">
                名称
                </el-col>
                <el-col :span="4">
                大小
                </el-col> 
                <el-col :span="6" v-if="$store.state.user.is_login">
                <el-button type="warning" plain @click="newDialogVisible = true;"><el-icon  class="el-icon--left"><FolderAdd /></el-icon>新建文件夹</el-button>
                <el-button type="success" plain @click="uploadFileVisible = true;"><el-icon  class="el-icon--left"><Upload /></el-icon>上传文件</el-button>
                </el-col>
            </el-row>
            </div>
            <hr>    
            <div class="folder-item" v-for="(folder, id) in folders" :key="id" @click="to_folder(folder)">
            <el-row justify="space-between">
                <el-col :span="14" class="folder-item-name svg_span_align">
                <div v-html="file_type_svg[folder.type]" class="folder-item-name svg_span_align" style="margin-right: 0.3rem;">
                </div>
                <span v-if="(!folder.update_name)">{{folder.name}}</span>
                <el-input v-else v-model="folder.name" style="width: 80%;" @click.stop/>
                </el-col>
                <el-col :span="4" class="folder-item-size">
                {{folder.size}}
                </el-col>
                <el-col :span="6" v-if="$store.state.user.is_login">
                <el-row class="row-bg" justify="center">
                    <el-col :span="5">
                        <el-button type="primary"  circle v-if="!folder.update_name" @click.stop="update_folder_name(folder)">
                            <el-icon><Edit /></el-icon>
                        </el-button>
                        <el-button type="primary"  circle v-else @click.stop="update_folder_name(folder)">
                            <el-icon><Check /></el-icon>
                        </el-button>
                    </el-col>
                    <el-col :span="5">
                        <el-button type="danger" class="!ml-0" circle plain @click.stop="delete_folder(folder)">
                            <el-icon><Delete /></el-icon>
                        </el-button>
                    </el-col>




                </el-row>
                </el-col>
            </el-row>
            </div>
        </el-card>

        <!-- 删除文件弹窗 -->
        <div>
            <el-dialog v-model="deleteDialogVisible" title="删除文件夹" width="800"
                :before-close="handleClose" center>
                <template #header="{titleId, titleClass }">
                    <div class="my-header">
                        <h4 :id="titleId" :class="titleClass + ' svg_span_align'">
                            <el-icon  class="el-icon--left" color="#F36C6C" size="1.5rem"><Delete /></el-icon>删除文件
                        </h4>
                    </div>
                </template>
                <hr>
                    <h2 class="svg_span_align">确定删除
                        "&nbsp;<span class="svg_span_align" v-html="file_type_svg[deleteFolder.type]"></span>{{deleteFolder.name}}&nbsp;"
                        吗</h2>
                <hr>
                <template #footer>
                    <div class="dialog-footer">
                        <el-button @click="deleteDialogVisible = false">关闭</el-button>
                        <el-button type="danger" @click="deleteDialogVisible = false">
                        删除
                        </el-button>
                    </div>
                </template>
            </el-dialog>
        </div>
        <!-- 新建文件夹弹窗 -->
        <div>
            <el-dialog v-model="newDialogVisible" width="800"
                :before-close="handleClose" center>
                <template #header="{titleId, titleClass }">
                    <div class="my-header">
                        <h4 :id="titleId" :class="titleClass + ' svg_span_align'">
                            <el-icon  class="el-icon--left" color="#E6A23C" size="1.5rem"><FolderAdd /></el-icon>新建文件夹
                        </h4>
                    </div>
                </template>
                <hr>
                    <p>文件夹名：</p>
                    <el-input v-model="newFolderName" placeholder="" />
                    <p class="error_message">{{ error_message }}</p>
                <hr>
                <template #footer>
                    <div class="dialog-footer">
                        <el-button @click="newDialogVisible = false">关闭</el-button>
                        <el-button type="warning" @click="new_folder">
                        新建
                        </el-button>
                    </div>
                </template>
            </el-dialog>
        </div>

        <!-- 上传文件弹窗 -->
        <div>
            <el-dialog v-model="uploadFileVisible" width="800"
                :before-close="handleClose" center>
                <template #header="{titleId, titleClass }">
                    <div class="my-header">
                        <h4 :id="titleId" :class="titleClass + ' svg_span_align'">
                            <el-icon  class="el-icon--left" color="#67C23A" size="1.5rem"><Upload /></el-icon>上传文件
                        </h4>
                    </div>
                </template>
                <hr>
                    上传文件
                <hr>
                <template #footer>
                    <div class="dialog-footer">
                        <el-button @click="uploadFileVisible = false">关闭</el-button>
                        <!-- <el-button type="danger" @click="uploadFileVisible = false">
                        删除
                        </el-button> -->
                    </div>
                </template>
            </el-dialog>
        </div>

    </div>
</template>

<script>
import $ from 'jquery'
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'

export default {
    name: "FolderView", // 文件夹
    props: ["foldersCountent", "currentFolderIdCountent"],
    setup(props, context) {
        let route = useRoute();
        let router = useRouter();
        let folders = computed(() => { return props.foldersCountent; });
        let currentFolderId = computed(() => { return props.currentFolderIdCountent });
        let deleteFolder = ref();
        let deleteDialogVisible = ref(false);
        let newFolderName = ref("");
        let newDialogVisible = ref(false);
        let uploadFileVisible = ref(false);
        let error_message = ref("");

        let file_type_svg = {
            "文件夹": `<svg t="1758330810559" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="5900" width="2rem" height="2rem"><path d="M918.673 883H104.327C82.578 883 65 867.368 65 848.027V276.973C65 257.632 82.578 242 104.327 242h814.346C940.422 242 958 257.632 958 276.973v571.054C958 867.28 940.323 883 918.673 883z" fill="#FFE9B4" p-id="5901"></path><path d="M512 411H65V210.37C65 188.597 82.598 171 104.371 171h305.92c17.4 0 32.71 11.334 37.681 28.036L512 411z" fill="#FFB02C" p-id="5902"></path><path d="M918.673 883H104.327C82.578 883 65 865.42 65 843.668V335.332C65 313.58 82.578 296 104.327 296h814.346C940.422 296 958 313.58 958 335.332v508.336C958 865.32 940.323 883 918.673 883z" fill="#FFCA28" p-id="5903"></path></svg>`,
            "文档": `<svg t="1758363320440" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4904" width="2rem" height="2rem"><path d="M654.826667 117.333333l209.173333 209.173334V928h-704v-810.666667h494.826667zM586.666667 181.312h-362.666667V864h576v-469.333333h-213.333333V181.333333zM704 672v64H320v-64h384z m0-170.666667v64H320v-64h384z m-203.264-170.666666v64H320v-64h180.736z m276.928 0L650.666667 203.669333V330.666667h126.997333z" fill="#2c2c2c" p-id="4905"></path></svg>`,
            "图片": `<svg t="1758363487806" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="15033" width="2rem" height="2rem"><path d="M829.64898 849.502041H194.35102c-43.885714 0-79.412245-35.526531-79.412244-79.412245V253.910204c0-43.885714 35.526531-79.412245 79.412244-79.412245h635.29796c43.885714 0 79.412245 35.526531 79.412244 79.412245v516.179592c0 43.885714-35.526531 79.412245-79.412244 79.412245z" fill="#D2F4FF" p-id="15034"></path><path d="M909.061224 656.195918l-39.706122-48.065306L626.416327 365.714286c-19.330612-19.330612-50.677551-19.330612-70.008164 0L419.526531 502.073469c-2.612245 2.612245-5.22449 3.134694-6.791837 3.134694-1.567347 0-4.702041-0.522449-6.791837-3.134694L368.326531 464.979592c-19.330612-19.330612-50.677551-19.330612-70.008164 0l-143.673469 143.673469-39.706122 48.065306v113.893878c0 43.885714 35.526531 79.412245 79.412244 79.412245h635.29796c43.885714 0 79.412245-35.526531 79.412244-79.412245v-114.416327" fill="#16C4AF" p-id="15035"></path><path d="M273.763265 313.469388m-49.632653 0a49.632653 49.632653 0 1 0 99.265306 0 49.632653 49.632653 0 1 0-99.265306 0Z" fill="#E5404F" p-id="15036"></path><path d="M644.179592 768h-365.714286c-11.493878 0-20.897959-9.404082-20.897959-20.897959s9.404082-20.897959 20.897959-20.897959h365.714286c11.493878 0 20.897959 9.404082 20.897959 20.897959s-9.404082 20.897959-20.897959 20.897959zM461.322449 670.82449h-182.857143c-11.493878 0-20.897959-9.404082-20.897959-20.897959s9.404082-20.897959 20.897959-20.89796h182.857143c11.493878 0 20.897959 9.404082 20.897959 20.89796s-9.404082 20.897959-20.897959 20.897959z" fill="#0B9682" p-id="15037"></path></svg>`,
            "APK": `<svg t="1758363741814" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="20652" width="2rem" height="2rem"><path d="M112 16h736v992H112z" fill="#F48284" p-id="20653"></path><path d="M480 608c-123.712 0-224 100.288-224 224h448c0-123.712-100.288-224-224-224z" fill="#AED796" p-id="20654"></path><path d="M568 736a24 24 0 1 0-0.016-48.016A24 24 0 0 0 568 736z m-176 0a24 24 0 1 0-0.016-48.016A24 24 0 0 0 392 736zM240 832a16 16 0 0 0 16 16h448a16 16 0 0 0 16-16c0-76.56-35.984-144.592-91.808-188.544l55.184-55.168a16.752 16.752 0 0 0-23.664-23.664L600 624.352a238.752 238.752 0 0 0-240 0l-59.728-59.728a16.752 16.752 0 0 0-23.664 23.664l55.184 55.168C275.984 687.408 240 755.44 240 832z m240-208c109.472 0 199.008 84.624 207.184 192H272.816c8.176-107.376 97.712-192 207.184-192zM896 128h-32V32a32 32 0 0 0-32-32H128a32 32 0 0 0-32 32v960a32 32 0 0 0 32 32h704a32 32 0 0 0 32-32V416h32a32 32 0 0 0 32-32V160a32 32 0 0 0-32-32z m-64 0H448a32 32 0 0 0-32 32v224a32 32 0 0 0 32 32h384v576H128V32h704v96z" fill="#2B3139" p-id="20655"></path><path d="M448 160h448v224H448z" fill="#FFFFFF" p-id="20656"></path><path d="M531.12 213.824h34.384l41.584 114.176h-36.464l-4.8-16.32h-36.304l-5.104 16.32h-35.344l42.048-114.176z m27.68 73.392l-10.24-35.168h-0.336l-11.024 35.168h21.6zM614.992 213.824h58.848c31.024 0 41.904 22.704 41.904 39.008 0 27.664-18.544 40.608-44.784 40.608h-20.784v34.56h-35.184v-114.176z m35.184 52.464h13.6c9.104 0 18.704-0.64 18.704-12.16 0-10.4-8-11.024-16.624-11.024h-15.664v23.184zM728.576 213.824h35.184v39.328h0.32l31.344-39.328h43.344l-41.424 44.608 48.144 69.568h-43.808l-28.16-44.448-9.744 10.72V328h-35.184v-114.176z" fill="#2B3139" p-id="20657"></path></svg>`,
            "WIN": `<svg t="1758363817283" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="22690" width="2rem" height="2rem"><path d="M450.56 922.86976V532.48h552.96v471.04l-552.96-80.65024z m0-821.76L1003.52 20.48v471.04H450.56V101.10976zM409.6 491.52H20.48V163.84l389.12-56.75008V491.52z m0 425.39008L20.48 860.16V532.48h389.12v384.43008z" fill="#3799FF" p-id="22691"></path></svg>`,
            "": ``,
        }
        
        const to_folder = (folder) => {
            console.log("to_f", folder, folder.type_id,folder.type_id < 0)
            let name = folder.name
                let current_path = route.path == '/' ? '/home' : route.path;
                router.push(current_path + '/' + name).then(() => {context.emit("refresh_page");});

        }

        const delete_folder = (folder) => {
            deleteFolder.value = folder;
            deleteDialogVisible.value = true;
        }

        const new_folder = () => {
            error_message.value = "";
            $.ajax({
                url: "https://blog.superpea.top/cloud/folder/new_folder/",
                type: "get",
                data: {
                    "current_folder_id": currentFolderId.value,
                    "name": newFolderName.value,
                },
                success(resp) {
                    if (resp.result === "success") {
                        newDialogVisible.value = false;
                        newFolderName.value = "";   
                        context.emit("refresh_page");
                    } else {
                        error_message.value = resp.result;
                    }
                }
            })
        }

        const open_message = (type, message) => {
            ElMessage({
                message: message,
                type: type,
            })
        }

        const update_folder_name = (folder) => {
            if (! folder.update_name) {
                for (let temp of folders.value) {
                    temp.update_name = false;
                }
                folder.update_name = true;
                return ;
            }
            let data = {
                    "type_id": folder.type_id,
                    "id": folder.id,
                    "name": folder.name,
                }
            $.ajax({
                url: "https://blog.superpea.top/cloud/folder/update_folder_name/",
                type: "get",
                data: data,
                success(resp) {
            console.log("update_folder_name", data,resp)
                    if (resp.result === "success") {
                        context.emit("refresh_page");
                        open_message("success", resp.result);
                    } else {
                        error_message.value = resp.result;
                        open_message("warning", resp.result);
                    }
                }
            })
        }

        return {
            folders,
            deleteFolder,
            deleteDialogVisible,
            newFolderName,
            newDialogVisible,
            uploadFileVisible,
            file_type_svg,
            error_message,
            to_folder,
            delete_folder,
            new_folder,
            update_folder_name,
        }
    }
}
</script>

<style scoped>
.folder-item {
  margin: 0.6rem 0;
}

.folder-item:hover {
  background-color: #ddd;
}

/* .folder-item-name {
  display: inline-flex; 
  align-items: center;  
} */

.svg_span_align {
  display: inline-flex; 
  align-items: center;  
}

.folder-item-name > svg {
  margin-right: 0.5rem;
}

.error_message {
    color: red;
}
</style>