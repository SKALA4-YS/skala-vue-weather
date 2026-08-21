<script setup>
import { useConfigStore } from '../../stores/configStore'
import { convertTemp } from '../../composables/useDisplayTemp'
import { iconUrl } from '../../services/weatherApi'

// OpenWeatherMap 5일/3시간 예보를 가로로 늘어놓는다
defineProps({
  items: {
    type: Array,
    required: true,
  },
})

const configStore = useConfigStore()

const tempText = (raw) => `${convertTemp(raw, configStore.unit)}${configStore.unitSymbol}`
</script>

<template>
  <div v-if="items.length > 0" class="strip">
    <div v-for="item in items" :key="item.time" class="slot-item">
      <p class="slot-time">{{ item.time.slice(-5) }}</p>
      <img class="slot-icon" :src="iconUrl(item.icon)" :alt="item.status" width="36" height="36" />
      <p class="slot-temp num">{{ tempText(item.temp) }}</p>
      <p class="slot-pop num">{{ item.rainProb }}%</p>
    </div>
  </div>

  <p v-else class="empty">예보 데이터가 없습니다.</p>
</template>

<style scoped>
.strip {
  display: flex;
  gap: 6px;
  padding-bottom: 4px;
  overflow-x: auto;
}

.slot-item {
  flex: 0 0 auto;
  width: 62px;
  padding: 8px 4px;
  background-color: var(--surface-2);
  border-radius: var(--radius-sm);
  text-align: center;
}

.slot-item p {
  margin: 0;
}

.slot-time {
  color: var(--text-faint);
  font-size: 10.5px;
}

.slot-icon {
  display: block;
  margin: 0 auto;
}

.slot-temp {
  font-size: 13px;
  font-weight: 600;
}

.slot-pop {
  color: var(--cyan);
  font-size: 10.5px;
}

.empty {
  margin: 0;
  padding: 12px 0;
  color: var(--text-faint);
  text-align: center;
  font-size: 12px;
}
</style>
