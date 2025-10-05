<template>
    <div class="file">
        <el-card style="margin-top: 2rem;">
            <div class="file-svg-body" v-html="get_folder_svg(file.type)"></div>
            <p class="file-name">{{ file.name }}</p>
            <p class="file-size">{{ file.size }}&nbsp;&nbsp;&nbsp;{{ file.upload_time }}</p>
            <p>
                <!-- <el-button size="large" link><el-icon><Share /></el-icon></el-button>
                &nbsp;&nbsp; -->
                <a :href="file.download_url"><el-button type="success" size="large"><el-icon class="el-icon--left"><Download /></el-icon>下载</el-button></a>
            </p>
        </el-card>
    </div>
</template>

<script>
import {computed} from 'vue'
import file_type_svg from '@/assets/file_type_svg'

export default {
    name: "FileView",
    props: ['fileContent'],
    setup(props) {
        let file = computed(() => { return props.fileContent });
        let fileTypeMapping = file_type_svg.FILE_TYPE_MAPPING
        let fileTypeSvg = file_type_svg.FILE_TYPE_SVG

        const get_folder_svg = (type) => {
            return fileTypeSvg[fileTypeMapping[type] || 'unknown']
        }

        return {
            file,
            get_folder_svg,
        }
    }
}
</script>

<style scoped>
.file {
    width: 100%;
    box-sizing: border-box;
}

.file * {
    text-align: center;
}

.file-svg-body {
    width: 5rem;
    margin: auto;
}

.file-name {
    font-size: 1.4rem;
}

.file-size {
    color: #888;
}
</style>

<style>
svg {
    width: 100% !important;
    height: auto !important;
}
</style>