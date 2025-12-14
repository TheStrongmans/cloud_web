<template>
    <el-card class="list-mode">
    <div 
        :class="`list-mode-item list-mode-item-row ` 
            + (listModeSelect === 'row' ? ' list-mode-item-select': ' ')"
        @click="update_list_mode('row')"
        >
        <svg t="1765682359470" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1628" width="16" height="16"><path d="M96 128h832v192H96zM96 416h832v192H96zM96 704h832v192H96z" p-id="1629"></path></svg>
    </div>
    <div 
        :class="`list-mode-item list-mode-item-row-block`
            + (listModeSelect === 'block' ? ' list-mode-item-select': ' ')"
        @click="update_list_mode('block')"
        >
        <svg t="1765682888941" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1842" width="200" height="200"><path d="M448 544H96c-19.2 0-32 12.8-32 32v352c0 19.2 12.8 32 32 32h352c19.2 0 32-12.8 32-32V576c0-19.2-12.8-32-32-32z m0-480H96c-19.2 0-32 12.8-32 32v352c0 19.2 12.8 32 32 32h352c19.2 0 32-12.8 32-32V96c0-19.2-12.8-32-32-32z m480 0H576c-19.2 0-32 12.8-32 32v352c0 19.2 12.8 32 32 32h352c19.2 0 32-12.8 32-32V96c0-19.2-12.8-32-32-32z m0 480H576c-19.2 0-32 12.8-32 32v352c0 19.2 12.8 32 32 32h352c19.2 0 32-12.8 32-32V576c0-19.2-12.8-32-32-32z" fill="#333333" p-id="1843"></path></svg>
    </div>
    </el-card>
</template>

<script>
import {computed } from 'vue'

export default {
    name: "ListModeView",
    props: ['listModeSelectCountent'],
    setup(props, context) {
        let listModeSelect = computed(() => {return props.listModeSelectCountent});

        const update_list_mode = (listModeSelect) => {            
            context.emit("updateListModeSecect", listModeSelect)
        }

        return {
            listModeSelect,
            update_list_mode,
        }
    }
}
</script>


<style scoped>

.list-mode {
  padding: 0;
  background-color: #ddd;
}

.list-mode-item {
  width: 1.4rem;
  height: 1.4rem;
  padding: 4px;
  border-radius: 3px;
  background-color: #fff;
}

.list-mode-item-select {
  background-color: #ddd;
}
</style>

<style>

.list-mode > div{
  display: flex;
  padding: 6px;
}
</style>