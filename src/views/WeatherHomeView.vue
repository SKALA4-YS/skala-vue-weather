<script setup>
import { ref, computed, watch, watchEffect, onMounted } from 'vue'
import { useRouter, useRoute, RouterLink } from 'vue-router'
import { Location } from '@element-plus/icons-vue'
import SearchBar from '../components/exercise/SearchBar.vue'
import WeatherCard from '../components/exercise/WeatherCard.vue'
import SearchNotice from '../components/exercise/SearchNotice.vue'
import ViewOptions from '../components/exercise/ViewOptions.vue'
import WatcherMonitor from '../components/exercise/WatcherMonitor.vue'
import StatusBar from '../components/exercise/StatusBar.vue'
import RefreshBar from '../components/exercise/RefreshBar.vue'
import HeroPanel from '../components/exercise/HeroPanel.vue'
import { useWeatherStore } from '../stores/weatherStore'
import { useConfigStore } from '../stores/configStore'
import { useFavoriteStore } from '../stores/favoriteStore'
import { convertTemp } from '../composables/useDisplayTemp'
import { calcRunningIndex } from '../composables/useRunningIndex'
import { areas } from '../data/cities'

/* '/' 메인 대시보드. 3일차 WeatherParent를 라우터·스토어 환경으로 옮긴 화면이다.
   상태·computed·watch는 그대로 두고 데이터 출처와 레이아웃만 바뀌었다. */

const router = useRouter()
const route = useRoute()

const configStore = useConfigStore()
const favoriteStore = useFavoriteStore()
const weatherStore = useWeatherStore()

onMounted(() => {
  weatherStore.loadOnce()
})

/* ── 반응형 상태 (3일차와 동일) ───────────────── */

// 주소창에 ?q=서울 을 달고 들어왔다면 그 값으로 검색창을 채운 채 시작한다
const searchQuery = ref(typeof route.query.q === 'string' ? route.query.q : '')
const selectedCityInfo = ref(null)
const weatherList = computed(() => weatherStore.cities)

const sortType = ref('none')
const onlyHot = ref(false)
const selectedArea = ref('전체')
const watchLogs = ref([])
const effectMessage = ref('대기 중...')

/* ── computed ─────────────────────────────────── */

const scoreOf = (city) =>
  calcRunningIndex({
    temp: city.temp,
    humidity: city.humidity,
    pm10: city.pm10,
    wind: city.wind,
    rainProb: city.rainProb,
  }).score

const filteredWeatherList = computed(() => {
  console.log('[computed 재계산] filteredWeatherList')

  if (searchQuery.value.trim() === '') {
    return weatherList.value
  }
  return weatherList.value.filter((city) => city.name.includes(searchQuery.value.trim()))
})

const visibleWeatherList = computed(() => {
  let list = filteredWeatherList.value

  if (selectedArea.value !== '전체') {
    list = list.filter((city) => city.area === selectedArea.value)
  }
  if (onlyHot.value) {
    list = list.filter((city) => city.temp >= 25)
  }
  if (favoriteStore.showOnlyFavorite) {
    list = list.filter((city) => favoriteStore.isFavorite(city.id))
  }
  if (sortType.value === 'temp') {
    list = [...list].sort((a, b) => b.temp - a.temp)
  } else if (sortType.value === 'name') {
    list = [...list].sort((a, b) => a.name.localeCompare(b.name))
  } else if (sortType.value === 'score') {
    list = [...list].sort((a, b) => scoreOf(b) - scoreOf(a))
  }

  return list
})

const searchState = computed(() => {
  if (searchQuery.value.trim() === '') return 'empty'
  return filteredWeatherList.value.length > 0 ? 'found' : 'none'
})

const statusMessage = computed(() => {
  if (selectedCityInfo.value === null) {
    return '카드를 클릭하면 위쪽 요약이 그 지역으로 바뀝니다.'
  }
  return `${selectedCityInfo.value.name}이(가) 선택되었습니다.`
})

const summary = computed(() => {
  const list = visibleWeatherList.value
  if (list.length === 0) return '표시할 지역이 없습니다.'

  const avgRaw = list.reduce((sum, city) => sum + city.temp, 0) / list.length
  const hottest = [...list].sort((a, b) => b.temp - a.temp)[0]

  const symbol = configStore.unitSymbol
  const avgTemp =
    configStore.unit === 'fahrenheit' ? convertTemp(avgRaw, 'fahrenheit') : avgRaw.toFixed(1)
  const hottestTemp = convertTemp(hottest.temp, configStore.unit)

  return `${list.length}곳 · 평균 ${avgTemp}${symbol} · 최고 ${hottest.name} ${hottestTemp}${symbol}`
})

// 히어로에 띄울 지역. 고르기 전에는 러닝 점수가 가장 높은 곳을 먼저 보여 준다.
const heroCity = computed(() => {
  if (selectedCityInfo.value !== null) {
    return weatherStore.findCity(selectedCityInfo.value.id) ?? selectedCityInfo.value
  }
  return [...weatherStore.cities].sort((a, b) => scoreOf(b) - scoreOf(a))[0]
})

const heroLabel = computed(() => {
  if (selectedCityInfo.value !== null) return '선택한 지역'
  return scoreOf(heroCity.value) >= 55 ? '지금 가장 뛰기 좋은 곳' : '그나마 나은 곳'
})

/* ── watch / watchEffect (2일차 실습 유지) ────── */

let logSeq = 0

const addLog = (message) => {
  logSeq += 1
  watchLogs.value.unshift({ id: logSeq, text: message })

  if (watchLogs.value.length > 8) {
    watchLogs.value.pop()
  }
}

watch(selectedCityInfo, (newCity, oldCity) => {
  const before = oldCity === null ? '없음' : oldCity.name
  const message = `[watch] 상태 바 문구 변경 -> "${statusMessage.value}" (이전 선택: ${before})`

  console.log(message)
  addLog(message)
})

watchEffect(() => {
  const message = `[watchEffect] 검색어 '${searchQuery.value}' 로 목록을 거릅니다`

  console.log(message)
  effectMessage.value = message
})

watch([sortType, onlyHot], ([newSort, newHot], [oldSort, oldHot]) => {
  const message = `[watch 다중 감시] 정렬 ${oldSort} → ${newSort} / 25도 이상만 ${oldHot} → ${newHot}`

  console.log(message)
  addLog(message)
})

watch(
  () => filteredWeatherList.value.length,
  (newCount, oldCount) => {
    const message =
      newCount === 0
        ? `[watch 결과 감시] 검색 결과 ${oldCount}건 → 0건`
        : `[watch 결과 감시] 검색 결과 ${oldCount}건 → ${newCount}건`

    console.log(message)
    addLog(message)
  },
)

// 검색어를 URL 쿼리에 동기화한다. push가 아니라 replace라 방문 기록이 쌓이지 않는다.
watch(searchQuery, (newQuery) => {
  const trimmed = newQuery.trim()
  router.replace({ query: trimmed === '' ? {} : { q: trimmed } })
})

/* ── 자식이 올려보낸 이벤트 ─────────────────── */

const handleQueryUpdate = (newQuery) => {
  searchQuery.value = newQuery
}

const handleSelectCard = (city) => {
  selectedCityInfo.value = city
}

// 4일차 요구사항: alert 대신 Programmatic Navigation
const handleClickDetail = (city) => {
  router.push({ name: 'weather-detail', params: { cityId: city.id } })
}

const handleSortUpdate = (newSort) => {
  sortType.value = newSort
}

const handleHotUpdate = (newHot) => {
  onlyHot.value = newHot
}
</script>

<template>
  <div class="home">
    <div class="top-grid">
      <HeroPanel :city="heroCity" :label="heroLabel" />

      <aside class="side">
        <!-- 내 위치: 권한을 거부해도 앱은 그대로 동작하고 안내만 남는다 -->
        <div class="surface loc-box">
          <p class="section-label">내 위치</p>

          <template v-if="weatherStore.myLocation !== null">
            <p class="loc-temp num">{{ weatherStore.myLocation.temp }}°</p>
            <p class="loc-status">{{ weatherStore.myLocation.status }}</p>
            <div class="loc-actions">
              <RouterLink to="/weather/my_location" class="loc-link">상세 보기</RouterLink>
              <el-button size="small" text @click="weatherStore.clearMyLocation()">해제</el-button>
            </div>
          </template>

          <template v-else>
            <p class="loc-desc">현재 위치의 날씨와 러닝 지수를 확인할 수 있습니다.</p>
            <el-button
              type="primary"
              size="small"
              :icon="Location"
              :loading="weatherStore.locating"
              @click="weatherStore.loadMyLocation()"
            >
              위치 연결
            </el-button>
            <p v-if="weatherStore.locationError !== ''" class="loc-error">
              {{ weatherStore.locationError }}
            </p>
          </template>
        </div>

        <div class="surface">
          <p class="section-label">데이터</p>
          <RefreshBar />
        </div>
      </aside>
    </div>

    <section class="surface search-box">
      <SearchBar :query="searchQuery" @update-query="handleQueryUpdate" />

      <div class="area-tabs">
        <button
          v-for="area in areas"
          :key="area"
          class="area-tab"
          :class="selectedArea === area ? 'is-on' : ''"
          @click="selectedArea = area"
        >
          {{ area }}
        </button>
      </div>

      <ViewOptions
        :sort-type="sortType"
        :only-hot="onlyHot"
        @update-sort="handleSortUpdate"
        @update-hot="handleHotUpdate"
      />
    </section>

    <section>
      <div class="list-head">
        <SearchNotice
          :state="searchState"
          :query="searchQuery"
          :count="filteredWeatherList.length"
        />
        <p class="summary num">{{ summary }}</p>
      </div>

      <div v-if="searchState !== 'none'" class="card-grid">
        <WeatherCard
          v-for="city in visibleWeatherList"
          :key="city.id"
          :city="city"
          :selected="selectedCityInfo !== null && selectedCityInfo.id === city.id"
          @select-card="handleSelectCard"
          @click-detail="handleClickDetail"
        />
      </div>

      <p v-if="visibleWeatherList.length === 0" class="empty">조건에 맞는 지역이 없습니다.</p>
    </section>

    <StatusBar :message="statusMessage" />

    <el-collapse class="monitor-fold">
      <el-collapse-item name="watch">
        <template #title>
          <span class="fold-title">Watcher 모니터링 (2일차 실습)</span>
        </template>
        <WatcherMonitor :effect-message="effectMessage" :logs="watchLogs" />
      </el-collapse-item>
    </el-collapse>
  </div>
</template>

<style scoped>
.home {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.top-grid {
  display: grid;
  grid-template-columns: 1.7fr 1fr;
  gap: 14px;
}

.side {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.loc-box p {
  margin: 0;
}

.loc-temp {
  font-size: 30px;
  font-weight: 800;
  line-height: 1.1;
}

.loc-status {
  margin-bottom: 8px !important;
  color: var(--text-dim);
  font-size: 12.5px;
}

.loc-desc {
  margin-bottom: 10px !important;
  color: var(--text-dim);
  font-size: 12px;
}

.loc-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.loc-link {
  color: var(--accent);
  font-size: 12.5px;
  font-weight: 600;
  text-decoration: none;
}

.loc-error {
  margin-top: 8px !important;
  color: var(--danger);
  font-size: 11px;
}

.search-box {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.area-tabs {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.area-tab {
  padding: 5px 13px;
  background-color: var(--surface-2);
  border: 1px solid var(--line-soft);
  border-radius: 999px;
  color: var(--text-dim);
  font-size: 12.5px;
  cursor: pointer;
  transition: all 0.15s ease;
}

.area-tab:hover {
  border-color: var(--accent);
  color: var(--accent);
}

.is-on {
  background-color: var(--accent);
  border-color: var(--accent);
  color: var(--on-accent);
  font-weight: 600;
}

.list-head {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 10px;
}

.summary {
  margin: 0 0 10px;
  color: var(--text-faint);
  font-size: 11.5px;
}

.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(230px, 1fr));
  gap: 10px;
}

.empty {
  margin: 0;
  padding: 40px 0;
  color: var(--text-faint);
  text-align: center;
}

.monitor-fold {
  --el-collapse-header-bg-color: transparent;
  --el-collapse-content-bg-color: transparent;
  border-top: 1px solid var(--line-soft);
  border-bottom: none;
}

.monitor-fold :deep(.el-collapse-item__header),
.monitor-fold :deep(.el-collapse-item__wrap) {
  background-color: transparent;
}

.fold-title {
  color: var(--text-faint);
  font-size: 11.5px;
}

@media (max-width: 720px) {
  .top-grid {
    grid-template-columns: 1fr;
  }
}
</style>
