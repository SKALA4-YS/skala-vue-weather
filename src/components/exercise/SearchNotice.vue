<script setup>
/* [3일차 요구사항 7] 검색 결과 안내.
   'empty / found / none' 판단은 부모 computed가 하고,
   이 컴포넌트는 받은 상태를 어떻게 보여줄지만 책임진다. */

defineProps({
  state: {
    type: String,
    required: true, // 'empty' | 'found' | 'none'
  },
  query: {
    type: String,
    required: true,
  },
  count: {
    type: Number,
    default: 0,
  },
})
</script>

<template>
  <p v-if="state === 'empty'" class="notice">전체 {{ count }}개 도시</p>
  <p v-else-if="state === 'found'" class="notice found">'{{ query }}' 검색 결과 {{ count }}건</p>
  <p v-else class="notice none">'{{ query }}' 와(과) 일치하는 도시가 없습니다</p>
</template>

<style scoped>
.notice {
  margin: 0 0 10px;
  color: var(--text-faint);
  font-size: 11.5px;
}

.found {
  color: var(--accent);
}

.none {
  color: var(--danger);
}
</style>
