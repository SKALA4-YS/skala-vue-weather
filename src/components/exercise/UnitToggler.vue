<script setup>
import { useConfigStore } from '../../stores/configStore'

/* [5일차 요구사항 1] 단위 설정을 바꾸는 UI.
   props도 emits도 없다. 부모는 자리만 내주고, 값은 스토어에서 직접 꺼내 쓴다.
   7일차: 교재가 강조한 el-switch로 바꿨다. 켜짐/꺼짐 두 상태라 토글에 그대로 맞는다. */

const configStore = useConfigStore()

const handleChange = (isFahrenheit) => {
  configStore.setUnit(isFahrenheit ? 'fahrenheit' : 'celsius')
}
</script>

<template>
  <div class="unit-toggler">
    <span class="label">{{ configStore.unitSymbol }}</span>
    <el-switch :model-value="configStore.unit === 'fahrenheit'" active-text="F" inactive-text="C" inline-prompt @change="handleChange" />
  </div>
</template>

<style scoped>
.unit-toggler {
  display: flex;
  align-items: center;
  gap: 6px;
}

.label {
  color: var(--text-dim);
  font-size: 12px;
  font-weight: 600;
}
</style>
