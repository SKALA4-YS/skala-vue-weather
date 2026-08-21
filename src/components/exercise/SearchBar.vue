<script setup>
import { ref } from 'vue'
import { Search } from '@element-plus/icons-vue'

/* [3일차 요구사항 3]
   - 검색어를 props로 받아 표시하고
   - 입력이 생기면 update-query로 부모에게 올린다.

   7일차: el-input으로 바꿨지만 v-model은 여전히 쓰지 않는다.
   v-model을 걸면 1일차부터 처리해 온 한글 조합(IME)을 손댈 수 없기 때문이다. */

defineProps({
  query: {
    type: String,
    required: true,
  },
})

const emit = defineEmits(['update-query'])

// 조합 중인지 여부. 이 input 안에서만 쓰는 값이라 부모로 올리지 않는다.
const isComposing = ref(false)

const handleInput = (value) => {
  if (isComposing.value) return
  emit('update-query', value)
}

const handleCompositionStart = () => {
  isComposing.value = true
}

const handleCompositionEnd = (e) => {
  isComposing.value = false
  emit('update-query', e.target.value)
}
</script>

<template>
  <el-input :model-value="query" placeholder="도시 이름 검색" :prefix-icon="Search" clearable @input="handleInput" @compositionstart="handleCompositionStart" @compositionend="handleCompositionEnd" />
</template>
