<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter, RouterLink } from 'vue-router'
import BaseDashboardCard from '../components/exercise/BaseDashboardCard.vue'
import DustBadge from '../components/DustBadge.vue'
import ForecastStrip from '../components/exercise/ForecastStrip.vue'
import { useDisplayTemp } from '../composables/useDisplayTemp'
import { useFavoriteStore } from '../stores/favoriteStore'
import { useWeatherStore } from '../stores/weatherStore'
import { fetchSunAndUv } from '../services/openMeteoApi'
import { iconUrl } from '../services/weatherApi'

/* ════════════════════════════════════════════════
   [요구사항 4] WeatherDetailView.vue — '/weather/:cityId'
   - 지역별 상세 기상관측 정보를 보여 주는 페이지
   - 도시 코드에 해당하는 Mock Data를 임시로 활용
   - 동적 경로 매칭으로 들어온 cityId를 기준으로 Mount 시점에 도시 객체를 선택
   ════════════════════════════════════════════════ */

const route = useRoute()
const router = useRouter()

const weatherStore = useWeatherStore()

// 화면에 그릴 도시 객체. 아직 못 찾았을 수 있으므로 null로 시작한다.
const cityInfo = ref(null)

// 자외선·일출·일몰은 이 화면에서만 쓰므로 스토어에 올리지 않는다
const sunUv = ref(null)
const sunUvError = ref('')

const loadCity = async (cityId) => {
  // 목록을 아직 안 받았으면 먼저 받는다 (상세 주소로 바로 들어온 경우)
  await weatherStore.loadOnce()

  const found = weatherStore.findCity(cityId)

  if (found === undefined) {
    cityInfo.value = null
    return
  }

  cityInfo.value = found
  loadSunUv(found)

  // 예보와 대기오염 상세는 이 화면에 들어왔을 때만 OpenWeatherMap으로 따로 받는다
  if (cityId !== 'my_location') {
    weatherStore.loadCityDetail(cityId)
  }
}

// 요구사항 3: OpenWeatherMap이 아닌 다른 API. 실패해도 나머지 화면은 그대로 둔다.
const loadSunUv = async (city) => {
  sunUv.value = null
  sunUvError.value = ''

  try {
    sunUv.value = await fetchSunAndUv(city.lat, city.lon)
  } catch (error) {
    sunUvError.value = '자외선 정보를 불러오지 못했습니다.'
    console.error('[WeatherDetailView] Open-Meteo 호출 실패', error)
  }
}

// 상세 화면은 마운트 시점에 도시를 고른다
onMounted(() => {
  loadCity(route.params.cityId)
})

/*
  주의할 점 하나.
  상세 화면에서 아래 '이전/다음 도시' 링크로 또 다른 상세 화면(/weather/city_02)에 가면,
  같은 컴포넌트를 재사용하기 때문에 unmount → mount가 일어나지 않는다.
  즉 onMounted가 다시 실행되지 않아서 화면이 그대로 멈춰 있게 된다.

  그래서 route.params.cityId 자체를 감시해 두었다. 파라미터만 바뀌는 이동도 이 watch가 잡아낸다.
*/
watch(
  () => route.params.cityId,
  (newCityId) => {
    loadCity(newCityId)
  },
)

// 새로고침 버튼으로 데이터가 갱신되면 이 화면이 보던 객체도 새 것으로 바꿔 준다
watch(
  () => weatherStore.cities,
  () => {
    const found = weatherStore.findCity(route.params.cityId)
    if (found !== undefined) cityInfo.value = found
  },
)

/*
  [5일차 요구사항 3] 상세 날씨에도 단위 설정 변경 적용.
  cityInfo는 처음에 null이라 그대로 넘기면 에러가 나므로, 없을 때는 0을 넘긴다.
  (아래 템플릿에서 cityInfo가 null이면 이 값을 그리지 않는다.)

  카드와 똑같은 변환식을 여기에 또 쓰지 않고 composable 하나로 공유한다.
  교재가 (참고)로 적어 둔 "유사한 코드가 중복됨" 지점이 바로 여기다.
*/
const { displayTempText } = useDisplayTemp(() =>
  cityInfo.value === null ? 0 : cityInfo.value.temp,
)

// 체감 온도도 같은 방식으로 단위를 맞춘다 (API에서 받은 값이라 없을 수도 있다)
const { displayTempText: feelsLikeText } = useDisplayTemp(() =>
  cityInfo.value === null || cityInfo.value.feelsLike === undefined ? 0 : cityInfo.value.feelsLike,
)

// [5일차 요구사항 4] 상세 화면에서도 같은 즐겨찾기 스토어를 쓴다.
// 목록에서 별을 눌렀다가 상세로 들어와도 상태가 그대로 이어진다.
const favoriteStore = useFavoriteStore()

const handleToggleFavorite = () => {
  favoriteStore.toggleFavorite(cityInfo.value.id)
}

// 현재 도시의 목록상 위치를 찾아 이전/다음 도시를 구한다. (없으면 null)
const currentIndex = computed(() => {
  if (cityInfo.value === null) return -1
  return weatherStore.cities.findIndex((city) => city.id === cityInfo.value.id)
})

const prevCity = computed(() => {
  const index = currentIndex.value
  return index > 0 ? weatherStore.cities[index - 1] : null
})

const nextCity = computed(() => {
  const index = currentIndex.value
  const list = weatherStore.cities
  return index >= 0 && index < list.length - 1 ? list[index + 1] : null
})

// 브라우저 뒤로 가기와 같은 동작. 주소를 직접 쳐서 들어왔다면 갈 곳이 없으므로 홈으로 보낸다.
const goBack = () => {
  // vue-router는 history.state에 직전 경로를 back으로 넣어 둔다. 값이 있으면 돌아갈 곳이 있다는 뜻.
  const historyState = window.history.state

  if (historyState && typeof historyState.back === 'string') {
    router.back()
    return
  }
  router.push('/')
}
</script>

<template>
  <div class="detail-view">
    <!-- 도시를 찾은 경우 -->
    <template v-if="cityInfo !== null">
      <BaseDashboardCard>
        <template #title>상세 관측 정보</template>

        <!-- [요구사항 4] 목록에서 누른 즐겨찾기가 여기에도 그대로 반영된다. -->
        <button
          class="fav-line"
          :class="favoriteStore.isFavorite(cityInfo.id) ? 'fav-on' : ''"
          @click="handleToggleFavorite"
        >
          {{ favoriteStore.isFavorite(cityInfo.id) ? '★ 즐겨찾기 해제' : '☆ 즐겨찾기 추가' }}
        </button>

        <dl class="observe-list">
          <div class="observe-row">
            <dt>지역</dt>
            <dd>{{ cityInfo.region }}</dd>
          </div>
          <div class="observe-row">
            <dt>실시간 기온</dt>
            <!-- [요구사항 3] 상단 [단위변경] 버튼을 누르면 이 값도 함께 바뀐다. -->
            <dd>{{ displayTempText }}</dd>
          </div>
          <div class="observe-row">
            <dt>기상 현황</dt>
            <dd>
              <img
                v-if="cityInfo.icon"
                :src="iconUrl(cityInfo.icon)"
                :alt="cityInfo.status"
                width="32"
                height="32"
              />
              {{ cityInfo.status }}
            </dd>
          </div>
          <div v-if="cityInfo.feelsLike !== undefined" class="observe-row">
            <dt>체감 온도</dt>
            <dd>{{ feelsLikeText }}</dd>
          </div>
          <div class="observe-row">
            <dt>대기 습도</dt>
            <dd>{{ cityInfo.humidity }}%</dd>
          </div>
          <div class="observe-row">
            <dt>현재 풍속</dt>
            <dd>{{ cityInfo.wind }}m/s</dd>
          </div>
          <div class="observe-row">
            <dt>강수 확률</dt>
            <dd>{{ cityInfo.rainProb }}%</dd>
          </div>
          <div class="observe-row">
            <dt>미세먼지</dt>
            <dd>
              {{ cityInfo.pm10 }}㎍/㎥
              <DustBadge :pm10="cityInfo.pm10" />
            </dd>
          </div>
          <div v-if="cityInfo.pm25 !== null && cityInfo.pm25 !== undefined" class="observe-row">
            <dt>초미세먼지</dt>
            <dd>{{ cityInfo.pm25 }}㎍/㎥</dd>
          </div>
        </dl>

        <template #footer>
          도시 코드 {{ cityInfo.id }} · 관측 시각 {{ cityInfo.observedAt }}
        </template>
      </BaseDashboardCard>

      <BaseDashboardCard>
        <template #title>시간대별 예보</template>

        <ForecastStrip :items="weatherStore.forecastOf(cityInfo.id)" />

        <template #footer>OpenWeatherMap 5 day / 3 hour forecast</template>
      </BaseDashboardCard>

      <BaseDashboardCard v-if="weatherStore.dailyOf(cityInfo.id).length > 0">
        <template #title>일별 예보</template>

        <div class="daily-row">
          <div v-for="day in weatherStore.dailyOf(cityInfo.id)" :key="day.date" class="daily-item">
            <p class="daily-label">{{ day.label }}</p>
            <img :src="iconUrl(day.icon)" :alt="`${day.label} 날씨`" width="38" height="38" />
            <p class="daily-temp num">{{ day.max }}° <span>{{ day.min }}°</span></p>
            <p class="daily-pop num">{{ day.rainProb }}%</p>
          </div>
        </div>

        <template #footer>3시간 예보를 날짜별로 묶어 만든 값입니다 (추가 호출 없음)</template>
      </BaseDashboardCard>

      <BaseDashboardCard>
        <template #title>일출 · 일몰 · 자외선</template>

        <div v-if="sunUv !== null" class="sun-row">
          <div class="sun-item">
            <p class="sun-label">일출</p>
            <p class="sun-value">{{ sunUv.sunrise }}</p>
          </div>
          <div class="sun-item">
            <p class="sun-label">일몰</p>
            <p class="sun-value">{{ sunUv.sunset }}</p>
          </div>
          <div class="sun-item">
            <p class="sun-label">자외선 지수</p>
            <p class="sun-value">{{ sunUv.uvIndex }} ({{ sunUv.uvGrade }})</p>
          </div>
        </div>

        <p v-else-if="sunUvError !== ''" class="sun-error">{{ sunUvError }}</p>
        <p v-else class="sun-loading">불러오는 중…</p>

        <template #footer>Open-Meteo API (키 없이 호출)</template>
      </BaseDashboardCard>

      <!-- 이전/다음 도시로 이동. 같은 컴포넌트를 재사용하는 이동이라 위쪽 watch가 필요했다. -->
      <nav class="sibling-nav">
        <RouterLink
          v-if="prevCity !== null"
          class="sibling-link"
          :to="{ name: 'weather-detail', params: { cityId: prevCity.id } }"
        >
          ← {{ prevCity.name }}
        </RouterLink>
        <span v-else class="sibling-blank"></span>

        <RouterLink
          v-if="nextCity !== null"
          class="sibling-link"
          :to="{ name: 'weather-detail', params: { cityId: nextCity.id } }"
        >
          {{ nextCity.name }} →
        </RouterLink>
        <span v-else class="sibling-blank"></span>
      </nav>

      <button class="back-btn" @click="goBack">← 메인 대시보드로 돌아가기</button>
    </template>

    <!-- 없는 도시 코드로 들어온 경우. /weather/city_99 처럼 경로 규칙에는 맞지만
         데이터가 없는 상황이라 Catch-all(NotFound)이 아니라 여기서 처리한다. -->
    <div v-else class="not-exist">
      <p class="not-exist-title">해당 도시 정보를 찾을 수 없습니다.</p>
      <p class="not-exist-sub">
        요청하신 도시 코드 <code>{{ route.params.cityId }}</code> 는 등록되어 있지 않습니다.
      </p>
      <RouterLink class="home-link" to="/">날씨 메인으로 이동</RouterLink>
    </div>
  </div>
</template>

<style scoped>
.daily-row {
  display: flex;
  gap: 8px;
  overflow-x: auto;
}

.daily-item {
  flex: 1 0 auto;
  min-width: 74px;
  padding: 10px 6px;
  background-color: var(--surface-2);
  border-radius: var(--radius-sm);
  text-align: center;
}

.daily-item p {
  margin: 0;
}

.daily-label {
  color: var(--text-faint);
  font-size: 11px;
}

.daily-temp {
  font-size: 13px;
  font-weight: 700;
}

.daily-temp span {
  color: var(--text-faint);
  font-weight: 400;
}

.daily-pop {
  color: var(--cyan);
  font-size: 10.5px;
}

.fav-line {
  margin-bottom: 10px;
  padding: 4px 12px;
  background-color: var(--surface-2);
  border: 1px solid var(--line);
  border-radius: 999px;
  color: var(--text-dim);
  font-size: 11.5px;
  cursor: pointer;
}

.fav-line.fav-on {
  border-color: var(--warn);
  color: var(--warn);
}

.observe-list {
  margin: 0;
  padding: 0;
}

.observe-row {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 7px 0;
  border-bottom: 1px solid var(--line-soft);
}

.observe-row:last-child {
  border-bottom: none;
}

.observe-row dt {
  flex-shrink: 0;
  width: 84px;
  color: var(--text-faint);
  font-size: 12px;
}

.observe-row dd {
  display: flex;
  align-items: center;
  gap: 6px;
  margin: 0;
  font-weight: 600;
  font-variant-numeric: tabular-nums;
}

.sun-row {
  display: flex;
  gap: 8px;
}

.sun-item {
  flex: 1;
  padding: 10px 6px;
  background-color: var(--surface-2);
  border-radius: var(--radius-sm);
  text-align: center;
}

.sun-item p {
  margin: 0;
}

.sun-label {
  color: var(--text-faint);
  font-size: 10.5px;
}

.sun-value {
  font-weight: 700;
  font-variant-numeric: tabular-nums;
}

.sun-loading,
.sun-error {
  margin: 0;
  padding: 10px 0;
  color: var(--text-faint);
  text-align: center;
  font-size: 12px;
}

.sibling-nav {
  display: flex;
  justify-content: space-between;
  margin-bottom: 14px;
}

.sibling-link {
  padding: 6px 12px;
  background-color: var(--surface);
  border: 1px solid var(--line-soft);
  border-radius: 999px;
  color: var(--text-dim);
  font-size: 12px;
  text-decoration: none;
}

.sibling-link:hover {
  border-color: var(--accent);
  color: var(--accent);
}

.sibling-blank {
  display: inline-block;
}

.back-btn {
  padding: 8px 16px;
  background-color: var(--surface-2);
  border: 1px solid var(--line);
  border-radius: var(--radius-sm);
  color: var(--text);
  cursor: pointer;
}

.back-btn:hover {
  border-color: var(--accent);
}

.not-exist {
  padding: 40px 20px;
  text-align: center;
}

.not-exist-title {
  margin: 0 0 6px;
  font-size: 16px;
  font-weight: 700;
}

.not-exist-sub {
  margin: 0 0 16px;
  color: var(--text-dim);
}

.not-exist code {
  padding: 1px 6px;
  background-color: var(--surface-2);
  border-radius: 4px;
  color: var(--warn);
}

.home-link {
  display: inline-block;
  padding: 8px 18px;
  background-color: var(--accent);
  border-radius: 999px;
  color: #10160a;
  font-weight: 600;
  text-decoration: none;
}
</style>
