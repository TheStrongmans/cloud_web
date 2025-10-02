<template>
    <div class="folder">
        <el-card>
            <div class="folder-header">
            <el-row  justify="space-between">
                <el-col :span="14">
                名称
                </el-col>
                <el-col :span="3">
                大小
                </el-col> 
                <el-col :span="7" v-if="$store.state.user.is_login">
                <el-button type="warning" plain @click="newDialogVisible = true;"><el-icon  class="el-icon--left"><FolderAdd /></el-icon>新建文件夹</el-button>
                <el-button type="success" plain @click="uploadFileVisible = true;"><el-icon  class="el-icon--left"><Upload /></el-icon>上传文件</el-button>
                </el-col>
            </el-row>
            </div>
            <hr>    
            <div class="folder-item" v-for="(folder, id) in folders" :key="id" @click="to_folder(folder)">
            <el-row justify="space-between">
                <el-col :span="14" class="folder-item-name svg_span_align">
                <div v-html="get_folder_svg(folder.type)" class="folder-item-name svg_span_align" style="margin-right: 0.3rem;">
                </div>
                <span v-if="(!folder.update_name)">{{folder.name}}</span>
                <el-input v-else v-model="folder.name" style="width: 80%;" @click.stop/>
                </el-col>
                <el-col :span="3" class="folder-item-size">
                {{folder.size}}
                </el-col>
                <el-col :span="7" v-if="$store.state.user.is_login">
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
                        <el-button type="danger" class="!ml-0" circle plain @click.stop="open_delete_dialog(folder)">
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
                        "&nbsp;<span class="svg_span_align" v-html="get_folder_svg(deleteFolder.type)"></span>&nbsp;{{deleteFolder.name}}&nbsp;"
                        吗</h2>
                <hr>
                <template #footer>
                    <div class="dialog-footer">
                        <el-button @click="deleteDialogVisible = false">关闭</el-button>
                        <el-button type="danger" @click="delete_folder()">
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
                    <el-upload
                        class="upload-demo"
                        drag
                        action="https://blog.superpea.top/cloud/file/upload/upload_file/" 
                        headers=""
                        multiple
                        :data="get_upload_data"
                        :on-success="upload_success"
                        :on-error="upload_error"
                    >
                        <el-icon class="el-icon--upload"><upload-filled /></el-icon>
                        <div class="el-upload__text">
                        将文件拖到此处或<em>点击上传</em>
                        </div>
                    </el-upload>
                    <p class="error_message">{{ error_message }}</p>
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
import { UploadFilled } from '@element-plus/icons-vue'
import file_type_svg from '@/assets/file_type_svg'

export default {
    name: "FolderView", // 文件夹
    components: {
        UploadFilled,
    },
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
        let uploadData = ref({"folder_id": currentFolderId.value});
        let error_message = ref("");
        let fileTypeMapping = file_type_svg.FILE_TYPE_MAPPING
        let fileTypeSvg = file_type_svg.FILE_TYPE_SVG

        const get_folder_svg = (type) => {
            return fileTypeSvg[fileTypeMapping[type] || 'unknown']
        }
        
        const to_folder = (folder) => {
            console.log("to_f", folder, folder.type_id,folder.type_id < 0)
            let name = folder.name
                let current_path = route.path == '/' ? '/home' : route.path;
                router.push(current_path + '/' + name).then(() => {context.emit("refresh_page");});

        }

        const delete_folder = () => {
            error_message.value = "";
            $.ajax({
                url: "https://blog.superpea.top/cloud/folder/delete_folder/",
                type: "get",
                data: {
                    "id": deleteFolder.value.id,
                    "type": deleteFolder.value.type,
                },
                success(resp) {
                    if (resp.result === "success") {
                        deleteDialogVisible.value = false;
                        deleteFolder.value = {};   
                        context.emit("refresh_page");
                    } else {
                        error_message.value = resp.result;
                    }
                }
            })
        }

        const open_delete_dialog = (folder) => {
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

        const get_upload_data = () => {
            return {"folder_id": currentFolderId.value}
        }

        const upload_error = (resp) => {
                console.log(resp);
            error_message.value = resp.result;
        }

        const upload_success = (resp) => {
                console.log(resp, uploadData.value, currentFolderId.value);
            error_message.value = "";
            if (resp.result === "success") {
                uploadFileVisible.value = false;
                context.emit("refresh_page");
            } else {
                error_message.value = resp.result;
            }
        }

        return {
            folders,
            deleteFolder,
            deleteDialogVisible,
            newFolderName,
            newDialogVisible,
            uploadFileVisible,
            uploadData,
            error_message,
            to_folder,
            open_delete_dialog,
            delete_folder,
            new_folder,
            update_folder_name,
            upload_error,
            upload_success,
            get_upload_data,
            get_folder_svg,
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
    width: 2rem !important;
    height: 2rem !important;
    margin-right: 0.5rem;
}

.error_message {
    color: red;
}
</style>