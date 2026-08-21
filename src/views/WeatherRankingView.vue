<script setup>
import { computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import BaseDashboardCard from '../components/exercise/BaseDashboardCard.vue'
import TempBadge from '../components/exercise/TempBadge.vue'
import DustBadge from '../components/DustBadge.vue'
import { useWeatherStore } from '../stores/weatherStore'
import { useConfigStore } from '../stores/configStore'
import { convertTemp } from '../composables/useDisplayTemp'
import { calcRunningIndex } from '../composables/useRunningIndex'

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
const TABS = [
  { key: 'running', label: '뛰기 좋은 순' },
  { key: 'temp', label: '기온 높은 순' },
  { key: 'pm10', label: '공기 좋은 순' },
]

const sortBy = computed(() => {
  const by = route.query.by
  return TABS.some((tab) => tab.key === by) ? by : 'running'
})

const scoreOf = (city) =>
  calcRunningIndex({
    temp: city.temp,
    humidity: city.humidity,
    pm10: city.pm10,
    wind: city.wind,
    rainProb: city.rainProb,
  })

const rankedList = computed(() => {
  // 원본 배열을 건드리지 않도록 복사한 뒤 정렬한다. (sort는 원본을 바꾼다)
  const copied = [...weatherStore.cities]

  if (sortBy.value === 'pm10') {
    // 미세먼지는 낮을수록 좋은 값이라 오름차순
    return copied.sort((a, b) => a.pm10 - b.pm10)
  }
  if (sortBy.value === 'temp') {
    return copied.sort((a, b) => b.temp - a.temp)
  }
  return copied.sort((a, b) => scoreOf(b).score - scoreOf(a).score)
})

const colorOf = (score) => {
  if (score >= 70) return 'var(--accent)'
  if (score >= 55) return 'var(--cyan)'
  if (score >= 40) return 'var(--warn)'
  return 'var(--danger)'
}

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
          v-for="tab in TABS"
          :key="tab.key"
          class="sort-tab"
          :class="sortBy === tab.key ? 'sort-active' : ''"
          @click="changeSort(tab.key)"
        >
          {{ tab.label }}
        </button>
      </div>

      <ol class="rank-list">
        <li v-for="(city, index) in rankedList" :key="city.id" @click="goDetail(city)">
          <span class="rank-no">{{ index + 1 }}</span>
          <span class="rank-name">{{ city.name }}<em>{{ city.area }}</em></span>

          <span v-if="sortBy === 'running'" class="rank-value">
            <span class="run-sub num">{{ tempText(city.temp) }}</span>
            <span class="run-score num" :style="{ color: colorOf(scoreOf(city).score) }">
              {{ scoreOf(city).score }}
            </span>
            <span class="run-grade">{{ scoreOf(city).grade.label }}</span>
          </span>
          <span v-else-if="sortBy === 'temp'" class="rank-value">
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
        행을 클릭하면 해당 지역의 상세 관측 정보로 이동합니다.
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
  padding: 6px 15px;
  background-color: var(--surface-2);
  border: 1px solid var(--line-soft);
  border-radius: 999px;
  color: var(--text-dim);
  font-size: 13.5px;
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
  width: 24px;
  color: var(--text-faint);
  font-size: 13px;
  font-variant-numeric: tabular-nums;
}

.rank-name {
  flex-grow: 1;
  font-size: 15px;
  font-weight: 600;
}

.rank-name em {
  margin-left: 6px;
  color: var(--text-faint);
  font-size: 11.5px;
  font-style: normal;
  font-weight: 400;
}

.rank-value {
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--text-dim);
  font-size: 14px;
  font-variant-numeric: tabular-nums;
}

.run-sub {
  color: var(--text-faint);
  font-size: 12.5px;
}

.run-score {
  min-width: 30px;
  font-size: 19px;
  font-weight: 800;
  text-align: right;
}

.run-grade {
  min-width: 30px;
  color: var(--text-faint);
  font-size: 11.5px;
}
</style>
