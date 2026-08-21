<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useWeatherStore } from '../stores/weatherStore'
import { useConfigStore } from '../stores/configStore'
import { convertTemp } from '../composables/useDisplayTemp'
import { calcRunningIndex } from '../composables/useRunningIndex'
import { iconUrl, hasApiKey } from '../services/weatherApi'

// 5일 예보로 '이번 주 언제 뛸까'를 정하는 화면.
// 일별 예보는 OpenWeatherMap 3시간 예보를 날짜별로 묶어 만든 것이라 추가 호출이 없다.
const route = useRoute()
const router = useRouter()
const weatherStore = useWeatherStore()
const configStore = useConfigStore()

const selectedId = ref(typeof route.query.city === 'string' ? route.query.city : 'city_01')
const loadingDetail = ref(false)

const city = computed(() => weatherStore.findCity(selectedId.value) ?? weatherStore.cities[0])
const daily = computed(() => weatherStore.dailyOf(selectedId.value))

const load = async () => {
  loadingDetail.value = true
  await weatherStore.loadCityDetail(selectedId.value)
  loadingDetail.value = false
}

onMounted(async () => {
  await weatherStore.loadOnce()
  load()
})

watch(selectedId, (newId) => {
  router.replace({ query: { city: newId } })
  load()
})

const tempText = (raw) => `${convertTemp(raw, configStore.unit)}${configStore.unitSymbol}`

// 하루 점수는 최고기온·강수확률로만 어림잡는다.
// 일별 예보에는 습도·바람이 없어서 현재 값을 대신 쓴다는 점을 화면에 적어 둔다.
const dayScores = computed(() =>
  daily.value.map((day) => {
    const { score, grade } = calcRunningIndex({
      temp: day.max,
      humidity: city.value.humidity,
      pm10: city.value.pm10,
      wind: city.value.wind,
      rainProb: day.rainProb,
    })

    return { ...day, score, grade }
  }),
)

const bestDay = computed(() => {
  if (dayScores.value.length === 0) return null
  return [...dayScores.value].sort((a, b) => b.score - a.score)[0]
})

const barColor = (score) => {
  if (score >= 70) return 'var(--accent)'
  if (score >= 55) return 'var(--cyan)'
  if (score >= 40) return 'var(--warn)'
  return 'var(--danger)'
}

const weekdayOf = (dateText) => {
  const names = ['일', '월', '화', '수', '목', '금', '토']
  return names[new Date(dateText).getDay()]
}
</script>

<template>
  <div class="week">
    <section class="surface head-box">
      <div class="head">
        <div>
          <p class="section-label">주간 러닝 계획</p>
          <p class="head-title">
            {{ city.name }} · 앞으로 5일
          </p>
        </div>

        <el-select v-model="selectedId" size="small" class="city-select" filterable>
          <el-option
            v-for="item in weatherStore.cities"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </div>

      <el-alert v-if="!hasApiKey" type="warning" :closable="false">
        일별 예보는 OpenWeatherMap 키가 있어야 표시됩니다.
      </el-alert>

      <p v-else-if="bestDay !== null" class="best">
        가장 좋은 날은 <strong>{{ bestDay.label }} ({{ weekdayOf(bestDay.date) }})</strong>,
        {{ bestDay.score }}점 · {{ bestDay.grade.label }}입니다.
      </p>
    </section>

    <el-skeleton v-if="loadingDetail && dayScores.length === 0" :rows="4" animated />

    <section v-else-if="dayScores.length > 0" class="day-grid">
      <article
        v-for="day in dayScores"
        :key="day.date"
        class="day"
        :class="bestDay !== null && day.date === bestDay.date ? 'is-best' : ''"
      >
        <p class="day-label">
          {{ day.label }}
          <span class="weekday">{{ weekdayOf(day.date) }}</span>
        </p>

        <img :src="iconUrl(day.icon)" :alt="`${day.label} 날씨`" width="48" height="48" />

        <p class="day-temp num">
          {{ tempText(day.max) }}
          <span class="min">{{ tempText(day.min) }}</span>
        </p>

        <p class="day-pop num">강수 {{ day.rainProb }}%</p>

        <div class="bar">
          <div
            class="bar-fill"
            :style="{ width: `${day.score}%`, backgroundColor: barColor(day.score) }"
          />
        </div>

        <p class="day-score num" :style="{ color: barColor(day.score) }">
          {{ day.score }}<span class="grade">{{ day.grade.label }}</span>
        </p>
      </article>
    </section>

    <p v-else class="empty">예보 데이터를 불러오는 중입니다.</p>

    <el-alert type="info" :closable="false" class="note">
      일별 점수는 그날 최고기온과 강수확률로 계산했습니다. 일별 예보에는 습도·바람이 없어
      현재 값을 대신 적용했으므로, 정확한 시간대별 점수는 러닝 지수 화면에서 확인해 주세요.
    </el-alert>

    <div class="actions">
      <el-button type="primary" size="small" @click="router.push(`/running?city=${city.id}`)">
        {{ city.name }} 시간대별 분석
      </el-button>
      <el-button size="small" @click="router.push(`/weather/${city.id}`)">상세 관측</el-button>
    </div>
  </div>
</template>

<style scoped>
.week {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.head-box {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 10px;
}

.head p {
  margin: 0;
}

.head-title {
  font-size: 17px;
  font-weight: 700;
}

.city-select {
  width: 120px;
}

.best {
  margin: 0;
  color: var(--text-dim);
  font-size: 13px;
}

.best strong {
  color: var(--accent);
}

.day-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 10px;
}

.day {
  padding: 14px 12px;
  background-color: var(--surface);
  border: 1px solid var(--line-soft);
  border-radius: var(--radius-sm);
  box-shadow: var(--shadow);
  text-align: center;
}

.is-best {
  border-color: var(--accent);
  background:
    radial-gradient(120% 100% at 50% 0%, var(--accent-soft) 0%, transparent 60%),
    var(--surface);
}

.day p {
  margin: 0;
}

.day-label {
  font-size: 13px;
  font-weight: 700;
}

.weekday {
  margin-left: 3px;
  color: var(--text-faint);
  font-size: 11px;
  font-weight: 400;
}

.day-temp {
  font-size: 19px;
  font-weight: 700;
}

.min {
  margin-left: 4px;
  color: var(--text-faint);
  font-size: 12px;
  font-weight: 400;
}

.day-pop {
  color: var(--text-dim);
  font-size: 11px;
}

.bar {
  height: 6px;
  margin: 10px 0 6px;
  background-color: var(--surface-2);
  border-radius: 3px;
  overflow: hidden;
}

.bar-fill {
  height: 100%;
  border-radius: 3px;
  transition: width 0.3s ease;
}

.day-score {
  font-size: 17px;
  font-weight: 800;
}

.grade {
  margin-left: 4px;
  color: var(--text-faint);
  font-size: 10.5px;
  font-weight: 400;
}

.empty {
  margin: 0;
  padding: 40px 0;
  color: var(--text-faint);
  text-align: center;
}

.note {
  font-size: 11.5px;
}

.actions {
  display: flex;
  gap: 8px;
}
</style>
