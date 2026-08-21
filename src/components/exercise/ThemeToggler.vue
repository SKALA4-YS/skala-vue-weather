<script setup>
import { Sunny, Moon } from '@element-plus/icons-vue'
import { useConfigStore } from '../../stores/configStore'

// 단위 토글과 같은 방식. props도 emits도 없이 스토어와 직접 이야기한다.
const configStore = useConfigStore()
</script>

<template>
  <el-button
    :icon="configStore.isDark ? Moon : Sunny"
    circle
    size="small"
    :title="configStore.isDark ? '라이트 모드로' : '다크 모드로'"
    @click="configStore.toggleTheme()"
  />
</template>
