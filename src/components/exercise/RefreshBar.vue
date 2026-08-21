<script setup>
import { ElMessage } from 'element-plus'
import { Refresh } from '@element-plus/icons-vue'
import { useWeatherStore } from '../../stores/weatherStore'

const weatherStore = useWeatherStore()

// 교재가 소개한 ElMessage. 컴포넌트를 심지 않고 함수 호출만으로 토스트를 띄운다.
const handleRefresh = async () => {
  await weatherStore.loadAll()

  if (weatherStore.errorMessage !== '') {
    ElMessage.error(weatherStore.errorMessage)
    return
  }
  ElMessage.success(`${weatherStore.cities.length}개 지역을 새로 불러왔습니다.`)
}
</script>

<template>
  <div class="refresh-bar">
    <el-tag v-if="weatherStore.loading" type="info" size="small" effect="plain"> 불러오는 중 </el-tag>
    <el-tag v-else-if="!weatherStore.loaded" type="warning" size="small" effect="plain"> 대기 중 </el-tag>
    <el-tag v-else type="success" size="small" effect="plain"> {{ weatherStore.cities.length }}곳 · {{ weatherStore.updatedAt }} </el-tag>

    <el-button :icon="Refresh" :loading="weatherStore.loading" size="small" text @click="handleRefresh"> 새로고침 </el-button>
  </div>
</template>

<style scoped>
.refresh-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}
</style>
