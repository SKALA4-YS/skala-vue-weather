<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessageBox, ElMessage } from 'element-plus'
import LineChart from '../components/exercise/LineChart.vue'
import { useWeatherStore } from '../stores/weatherStore'
import { useFavoriteStore } from '../stores/favoriteStore'
import { useConfigStore } from '../stores/configStore'
import { fetchSunAndUv } from '../services/openMeteoApi'
import { calcRunningIndex, calcHydration, buildHourlyIndex, pickBestWorst } from '../composables/useRunningIndex'

const route = useRoute()
const router = useRouter()
const weatherStore = useWeatherStore()
const favoriteStore = useFavoriteStore()
const configStore = useConfigStore()

const sunUv = ref(null)

// 어느 도시를 보는지는 URL에 둔다. /running?city=city_03 형태로 공유할 수 있다.
const selectedId = ref(typeof route.query.city === 'string' ? route.query.city : 'city_01')

const city = computed(() => weatherStore.findCity(selectedId.value) ?? weatherStore.cities[0])

const uvIndex = computed(() => (sunUv.value === null ? null : sunUv.value.uvIndex))

const index = computed(() =>
  calcRunningIndex({
    temp: city.value.temp,
    humidity: city.value.humidity,
    pm10: city.value.pm10,
    wind: city.value.wind,
    rainProb: city.value.rainProb,
    uvIndex: uvIndex.value,
  }),
)

const hydration = computed(() => calcHydration(city.value.temp, city.value.humidity))

// el-progress는 CSS 변수를 못 받아서 실제 색값을 따로 넘긴다
const scoreColorHex = computed(() => {
  const score = index.value.score
  if (score >= 70) return configStore.isDark ? '#35a0ff' : '#0a84ff'
  if (score >= 55) return configStore.isDark ? '#35d6ee' : '#00b8d4'
  if (score >= 40) return configStore.isDark ? '#ffb020' : '#f08c00'
  return configStore.isDark ? '#ff5470' : '#e5484d'
})

const hourly = computed(() => buildHourlyIndex(weatherStore.forecastOf(city.value.id), city.value.pm10, uvIndex.value))

const bestWorst = computed(() => pickBestWorst(hourly.value))

const penalties = computed(() => index.value.factors.filter((factor) => factor.delta < 0))
const goodFactors = computed(() => index.value.factors.filter((factor) => factor.delta === 0))

const scoreColor = computed(() => {
  const score = index.value.score
  if (score >= 70) return 'var(--accent)'
  if (score >= 55) return 'var(--cyan)'
  if (score >= 40) return 'var(--warn)'
  return 'var(--danger)'
})

const loadSunUv = async () => {
  try {
    sunUv.value = await fetchSunAndUv(city.value.lat, city.value.lon)
  } catch {
    sunUv.value = null
  }
}

onMounted(async () => {
  await weatherStore.loadOnce()
  // 시간대별 점수를 내려면 OpenWeatherMap 3시간 예보가 필요하다
  weatherStore.loadCityDetail(selectedId.value)
  loadSunUv()
})

// 도시를 바꾸면 주소도 같이 바꾸고 자외선 정보를 다시 받는다
watch(selectedId, (newId) => {
  router.replace({ query: { city: newId } })
  weatherStore.loadCityDetail(newId)
  loadSunUv()
})

// 교재가 소개한 ElMessageBox. 되돌릴 수 없는 동작이라 확인을 받는다.
const handleClearFavorites = () => {
  ElMessageBox.confirm('즐겨찾기한 도시를 모두 지울까요?', '확인', {
    confirmButtonText: '지우기',
    cancelButtonText: '취소',
    type: 'warning',
  })
    .then(() => {
      favoriteStore.clearFavorites()
      ElMessage.success('즐겨찾기를 비웠습니다.')
    })
    .catch(() => {
      ElMessage.info('취소했습니다.')
    })
}
</script>

<template>
  <div class="running">
    <section class="hero">
      <div class="hero-top">
        <div>
          <p class="section-label">오늘의 러닝 지수</p>
          <p class="hero-city">{{ city.name }} · {{ city.status }}</p>
        </div>

        <el-select v-model="selectedId" size="small" class="city-select" filterable>
          <el-option v-for="item in weatherStore.cities" :key="item.id" :label="item.name" :value="item.id" />
        </el-select>
      </div>

      <el-skeleton v-if="weatherStore.loading && !weatherStore.loaded" :rows="3" animated />

      <template v-else>
        <div class="score-row">
          <p class="score num" :style="{ color: scoreColor }">{{ index.score }}</p>
          <div class="score-side">
            <p class="grade" :style="{ color: scoreColor }">{{ index.grade.label }}</p>
            <p class="comment">{{ index.grade.comment }}</p>
          </div>
        </div>

        <!-- 교재가 강조한 el-progress. 점수를 색까지 바꿔가며 보여 준다 -->
        <el-progress :percentage="index.score" :color="scoreColorHex" :show-text="false" :stroke-width="8" />

        <div class="stat-row">
          <div class="stat">
            <p class="stat-label">추천</p>
            <p class="stat-value num">{{ bestWorst.best === null ? '-' : bestWorst.best.hour }}</p>
            <p class="stat-sub num" v-if="bestWorst.best !== null">{{ bestWorst.best.score }}점</p>
          </div>
          <div class="stat">
            <p class="stat-label">피할 시간</p>
            <p class="stat-value num">
              {{ bestWorst.worst === null ? '-' : bestWorst.worst.hour }}
            </p>
            <p class="stat-sub num" v-if="bestWorst.worst !== null">{{ bestWorst.worst.score }}점</p>
          </div>
          <div class="stat">
            <p class="stat-label">수분</p>
            <p class="stat-value num">{{ hydration }}</p>
            <p class="stat-sub">ml</p>
          </div>
        </div>
      </template>
    </section>

    <section class="surface block">
      <p class="section-label">점수를 깎은 항목</p>

      <ul v-if="penalties.length > 0" class="factors">
        <li v-for="factor in penalties" :key="factor.key">
          <span class="f-label">{{ factor.label }}</span>
          <span class="f-value num">{{ factor.value }}</span>
          <span class="f-delta num">{{ factor.delta }}</span>
        </li>
      </ul>

      <p v-else class="all-clear">깎인 항목이 없습니다. 조건이 아주 좋은 날입니다.</p>

      <div v-if="goodFactors.length > 0" class="good">
        <el-tag v-for="factor in goodFactors" :key="factor.key" size="small" type="info" effect="plain"> {{ factor.label }} {{ factor.value }} </el-tag>
      </div>

      <el-alert type="info" :closable="false" class="disclaimer">
        체감온도 10~18도를 기준 구간으로 두고 환경부 미세먼지 등급(30/80/150)을 참고해 잡은 자체 배점입니다. 의학적 기준이 아니며 실제 컨디션은 개인차와 코스 상태에 따라 달라집니다.
      </el-alert>
    </section>

    <section class="surface block">
      <p class="section-label">시간대별 러닝 지수</p>

      <LineChart v-if="hourly.length > 0" :labels="hourly.map((item) => item.hour)" :values="hourly.map((item) => item.score)" />
      <p v-else class="all-clear">예보 데이터가 없어 시간대별 점수를 계산할 수 없습니다.</p>

      <p class="note">OpenWeatherMap 3시간 예보 · 미세먼지는 현재 값 적용</p>
    </section>

    <div class="actions">
      <el-button type="primary" size="small" @click="router.push({ name: 'weather-detail', params: { cityId: city.id } })"> {{ city.name }} 상세 보기 </el-button>
      <el-button size="small" @click="router.push('/')">대시보드</el-button>
      <el-button v-if="favoriteStore.hasFavorite" size="small" text type="danger" @click="handleClearFavorites"> 즐겨찾기 비우기 </el-button>
    </div>
  </div>
</template>

<style scoped>
.running {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.hero {
  padding: 20px;
  background: radial-gradient(120% 130% at 88% 0%, var(--accent-soft) 0%, transparent 58%), var(--surface);
  border: 1px solid var(--line-soft);
  border-radius: var(--radius);
  box-shadow: var(--shadow);
}

.hero-top {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 10px;
  margin-bottom: 6px;
}

.hero-city {
  margin: 0;
  font-size: 15px;
  font-weight: 600;
}

.city-select {
  width: 96px;
}

.score-row {
  display: flex;
  align-items: baseline;
  gap: 14px;
  margin: 6px 0 12px;
}

.score {
  margin: 0;
  font-size: 68px;
  font-weight: 800;
  line-height: 1;
}

.score-side p {
  margin: 0;
}

.grade {
  font-size: 15px;
  font-weight: 700;
}

.comment {
  color: var(--text-dim);
  font-size: 12px;
}

.stat-row {
  display: flex;
  gap: 8px;
  margin-top: 16px;
}

.stat {
  flex: 1;
  padding: 10px 8px;
  background-color: var(--surface-2);
  border-radius: var(--radius-sm);
  text-align: center;
}

.stat p {
  margin: 0;
  line-height: 1.3;
}

.stat-label {
  color: var(--text-faint);
  font-size: 10.5px;
}

.stat-value {
  font-size: 17px;
  font-weight: 700;
}

.stat-sub {
  color: var(--text-faint);
  font-size: 10.5px;
}

.block {
  padding: 16px;
}

.factors {
  margin: 0;
  padding: 0;
  list-style: none;
}

.factors li {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 0;
  border-bottom: 1px solid var(--line-soft);
}

.factors li:last-child {
  border-bottom: none;
}

.f-label {
  width: 62px;
  color: var(--text-dim);
  font-size: 12.5px;
}

.f-value {
  flex-grow: 1;
  font-weight: 600;
}

.f-delta {
  color: var(--danger);
  font-weight: 700;
}

.all-clear {
  margin: 0;
  padding: 10px 0;
  color: var(--accent);
  font-size: 13px;
}

.good {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
  margin-top: 12px;
}

.disclaimer {
  margin-top: 14px;
  font-size: 11px;
}

.note {
  margin: 10px 0 0;
  color: var(--text-faint);
  font-size: 11px;
}

.actions {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
</style>
