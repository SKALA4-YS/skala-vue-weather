<script setup>
/* [3일차 요구사항 7] 기온 하나만 있으면 되는 부분이라 떼어낸 컴포넌트.
   7일차: 직접 만든 배지를 el-tag로 바꿨다. */

defineProps({
  temp: {
    type: Number,
    required: true,
  },
})
</script>

<template>
  <!-- [1일차 요구사항 유지] 25도를 기준으로 라벨이 갈린다 (v-if / v-else) -->
  <el-tag v-if="temp >= 25" type="warning" size="small" effect="dark" round>더움</el-tag>
  <el-tag v-else type="info" size="small" effect="dark" round>선선함</el-tag>
</template>
