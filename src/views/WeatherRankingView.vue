<script setup>
import { computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import BaseDashboardCard from '../components/exercise/BaseDashboardCard.vue'
import TempBadge from '../components/exercise/TempBadge.vue'
import DustBadge from '../components/DustBadge.vue'
import { useWeatherStore } from '../stores/weatherStore'
import { useConfigStore } from '../stores/configStore'
import { convertTemp } from '../composables/useDisplayTemp'

/* ════════════════════════════════════════════════
   [요구사항 6] 추가 view ① — '/ranking'
   기온 / 미세먼지 순위를 보여 주는 화면.

   여기서 눈여겨볼 점은 '정렬 기준을 ref가 아니라 URL 쿼리에 두었다'는 것이다.
   - /ranking?by=temp  → 기온 순
   - /ranking?by=pm10  → 미세먼지 순
   상태를 URL에 두면 새로고침해도 유지되고, 그 상태 그대로 링크를 보낼 수 있다.
   ════════════════════════════════════════════════ */

const route = useRoute()
const router = useRouter()

/*
  [5일차 요구사항 3] 순위표의 기온에도 단위 설정을 적용한다.
  여기는 v-for로 도시마다 값을 보여 주는 곳이라 composable을 쓸 수 없어
  (composable은 setup에서 한 번만 호출해야 한다) 순수 변환 함수를 직접 쓴다.
*/
const configStore = useConfigStore()
const weatherStore = useWeatherStore()

onMounted(() => {
  weatherStore.loadOnce()
})

const tempText = (rawTemp) => `${convertTemp(rawTemp, configStore.unit)}${configStore.unitSymbol}`

// route.query는 반응형이다. 주소가 바뀌면 이 computed도 다시 계산된다.
const sortBy = computed(() => (route.query.by === 'pm10' ? 'pm10' : 'temp'))

const rankedList = computed(() => {
  // 원본 배열을 건드리지 않도록 복사한 뒤 정렬한다. (sort는 원본을 바꾼다)
  const copied = [...weatherStore.cities]

  if (sortBy.value === 'pm10') {
    // 미세먼지는 낮을수록 좋은 값이라 오름차순
    return copied.sort((a, b) => a.pm10 - b.pm10)
  }
  return copied.sort((a, b) => b.temp - a.temp)
})

// 정렬 기준 변경 = 화면 이동이 아니라 쿼리만 교체. replace라 뒤로 가기 기록이 쌓이지 않는다.
const changeSort = (by) => {
  router.replace({ query: { by } })
}

// 행을 누르면 그 도시의 상세 화면으로. (Programmatic Navigation)
const goDetail = (city) => {
  router.push({ name: 'weather-detail', params: { cityId: city.id } })
}
</script>

<template>
  <div class="ranking-view">
    <BaseDashboardCard>
      <template #title>도시 순위</template>

      <div class="sort-tabs">
        <button
          class="sort-tab"
          :class="sortBy === 'temp' ? 'sort-active' : ''"
          @click="changeSort('temp')"
        >
          기온 높은 순
        </button>
        <button
          class="sort-tab"
          :class="sortBy === 'pm10' ? 'sort-active' : ''"
          @click="changeSort('pm10')"
        >
          공기 좋은 순
        </button>
      </div>

      <ol class="rank-list">
        <li v-for="(city, index) in rankedList" :key="city.id" @click="goDetail(city)">
          <span class="rank-no">{{ index + 1 }}</span>
          <span class="rank-name">{{ city.name }}</span>

          <span v-if="sortBy === 'temp'" class="rank-value">
            {{ tempText(city.temp) }}
            <TempBadge :temp="city.temp" />
          </span>
          <span v-else class="rank-value">
            {{ city.pm10 }}㎍/㎥
            <DustBadge :pm10="city.pm10" />
          </span>
        </li>
      </ol>

      <template #footer>
        행을 클릭하면 해당 도시의 상세 관측 정보로 이동합니다. (현재 정렬: {{ sortBy }})
      </template>
    </BaseDashboardCard>
  </div>
</template>

<style scoped>
.sort-tabs {
  display: flex;
  gap: 6px;
  margin-bottom: 12px;
}

.sort-tab {
  padding: 5px 14px;
  background-color: var(--surface-2);
  border: 1px solid var(--line-soft);
  border-radius: 999px;
  color: var(--text-dim);
  font-size: 12.5px;
  cursor: pointer;
}

.sort-tab:hover {
  border-color: var(--line);
}

.sort-active {
  background-color: var(--accent);
  border-color: var(--accent);
  color: #10160a;
  font-weight: 600;
}

.rank-list {
  margin: 0;
  padding: 0;
  list-style: none;
}

.rank-list li {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 6px;
  padding: 11px 14px;
  background-color: var(--surface);
  border: 1px solid var(--line-soft);
  border-radius: var(--radius-sm);
  cursor: pointer;
}

.rank-list li:hover {
  border-color: var(--line);
  background-color: var(--surface-2);
}

.rank-no {
  flex-shrink: 0;
  width: 22px;
  color: var(--text-faint);
  font-size: 12px;
  font-variant-numeric: tabular-nums;
}

.rank-name {
  flex-grow: 1;
  font-weight: 600;
}

.rank-value {
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--text-dim);
  font-size: 13px;
  font-variant-numeric: tabular-nums;
}
</style>
