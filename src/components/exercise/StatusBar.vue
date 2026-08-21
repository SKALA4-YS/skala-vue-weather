<script setup>
/* [3일차 요구사항 7] 화면 아래 상태 문구. 부모의 computed 결과를 받아 표시만 한다. */

defineProps({
  message: {
    type: String,
    required: true,
  },
})
</script>

<template>
  <p class="status-bar">{{ message }}</p>
</template>

<style scoped>
.status-bar {
  margin: 0;
  padding: 11px 14px;
  background-color: var(--surface);
  border: 1px solid var(--line-soft);
  border-left: 3px solid var(--accent);
  border-radius: var(--radius-sm);
  color: var(--text-dim);
  font-size: 13px;
}
</style>
