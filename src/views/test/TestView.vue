<template>
  <!-- 
    action=""  // 请求链接
    headers=""  // 请求头
    method=""   // 上传方法 默认:post
    multiple= ""  // 是否多选文件 默认: false
    data="" // 参数
    on-preview	点击文件列表中已上传的文件时的钩子
    on-remove	文件列表移除文件时的钩子
    on-success	文件上传成功时的钩子
    on-error	文件上传失败时的钩子
    on-progress	文件上传时的钩子
    on-change	文件状态改变时的钩子，添加文件、上传成功和上传失败时都会被调用
    on-exceed	当超出限制时，执行的钩子函数
    before-upload	上传文件之前的钩子，参数为上传的文件， 若返回false或者返回 Promise 且被 reject，则停止上传。
    before-remove	删除文件之前的钩子，参数为上传的文件和文件列表， 若返回 false 或者返回 Promise 且被 reject，则停止删除。
    auto-upload	是否自动上传文件 默认：true
  -->
  <el-upload
    class="upload-demo"
    drag
    action="" 
    headers=""
    multiple
    :on-error="upload_error1()"
  >
    <el-icon class="el-icon--upload"><upload-filled /></el-icon>
    <div class="el-upload__text">
      将文件拖到此处或<em>点击上传</em>
    </div>
    <template #tip>
      <div class="el-upload__tip">
        jpg/png files with a size less than 500kb
      </div>    
    </template>
  </el-upload>
</template>

<script>
import { UploadFilled } from '@element-plus/icons-vue'

export default {
    components: {
        UploadFilled,
    },
    setup() {
        const upload_error1 = () => {
            console.log("上传失败");
            
        }

        return {
            upload_error1
        }
    }
}
</script>