<script setup>
/* [3일차 요구사항 7] 2일차 watch 결과를 보여 주는 패널.
   watch / watchEffect는 부모에 그대로 두고, 결과 문구와 로그 배열만 받아 뿌린다.
   감시(로직)는 부모, 표시(디자인)는 자식으로 나눈 셈이다. */

defineProps({
  effectMessage: {
    type: String,
    required: true,
  },
  logs: {
    type: Array,
    required: true,
  },
})
</script>

<template>
  <div class="monitor">
    <p class="effect-line">{{ effectMessage }}</p>

    <ul class="log-list">
      <li v-for="log in logs" :key="log.id">{{ log.text }}</li>
      <li v-if="logs.length === 0" class="log-empty">
        아직 감지된 변화가 없습니다. 카드를 클릭하거나 보기 설정을 바꿔 보세요.
      </li>
    </ul>

    <small class="hint">
      같은 내용이 브라우저 콘솔(F12)에도 출력됩니다.
      watchEffect는 최초 1회 즉시 실행되므로 새로고침 직후에도 초기값이 이미 덮어써져 있습니다.
    </small>
  </div>
</template>

<style scoped>
.effect-line {
  margin: 0 0 8px;
  padding: 7px 10px;
  background-color: var(--surface-2);
  border-left: 2px solid var(--warn);
  border-radius: 4px;
  color: var(--warn);
  font-size: 11px;
  word-break: break-all;
}

.log-list {
  max-height: 140px;
  margin: 0;
  padding: 0;
  list-style: none;
  overflow-y: auto;
}

.log-list li {
  padding: 4px 0;
  border-bottom: 1px solid var(--line-soft);
  color: var(--text-dim);
  font-size: 11px;
  word-break: break-all;
}

.log-list li:last-child {
  border-bottom: none;
}

.log-empty {
  color: var(--text-faint);
}

.hint {
  display: block;
  margin-top: 8px;
  color: var(--text-faint);
  font-size: 10.5px;
}
</style>
