<script setup>
import { computed } from 'vue'

// 미세먼지 농도를 등급 배지로 보여주는 컴포넌트
const props = defineProps({
  pm10: {
    type: Number,
    required: true,
  },
})

// 2일차에 일반 함수 → computed로 바꿨다.
// 일반 함수는 카드가 다시 그려질 때마다 재실행되지만,
// computed는 props.pm10이 그대로면 이전 결과를 재사용한다.
const gradeText = computed(() => {
  if (props.pm10 <= 30) return '좋음'
  if (props.pm10 <= 80) return '보통'
  if (props.pm10 <= 150) return '나쁨'
  return '매우나쁨'
})

// 7일차: 직접 칠하던 색 대신 el-tag의 type으로 넘긴다
const tagType = computed(() => {
  if (props.pm10 <= 30) return 'success'
  if (props.pm10 <= 80) return 'info'
  if (props.pm10 <= 150) return 'warning'
  return 'danger'
})
</script>

<template>
  <el-tag :type="tagType" size="small" effect="dark" round> 미세먼지 {{ gradeText }} </el-tag>
</template>
