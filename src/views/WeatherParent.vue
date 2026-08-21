<script setup>
import { ref, computed, watch, watchEffect } from 'vue'
import BaseDashboardCard from '../components/exercise/BaseDashboardCard.vue'
import SearchBar from '../components/exercise/SearchBar.vue'
import WeatherCard from '../components/exercise/WeatherCard.vue'
import SearchNotice from '../components/exercise/SearchNotice.vue'
import ViewOptions from '../components/exercise/ViewOptions.vue'
import WatcherMonitor from '../components/exercise/WatcherMonitor.vue'
import StatusBar from '../components/exercise/StatusBar.vue'

/* ════════════════════════════════════════════════
   [요구사항 1] WeatherParent.vue — 모든 반응형 데이터 유지
   2일차(Assignment2.vue)의 상태·computed·watch를 기능 변경 없이 그대로 옮겨 왔다.
   달라진 것은 화면을 그리는 부분뿐이다. 상태는 전부 여기에만 있고,
   자식들은 props로 받아 보여 주고 emit으로 알려 오기만 한다.
   ════════════════════════════════════════════════ */

const searchQuery = ref('')
const selectedCityInfo = ref(null)
const weatherList = ref([
  { id: 'city_01', name: '서울', temp: 28, status: '맑음', humidity: 55, pm10: 32, rainProb: 10 },
  { id: 'city_02', name: '수원', temp: 24, status: '비', humidity: 82, pm10: 21, rainProb: 80 },
  { id: 'city_03', name: '부산', temp: 26, status: '구름', humidity: 70, pm10: 48, rainProb: 30 },
  { id: 'city_04', name: '대전', temp: 27, status: '맑음', humidity: 48, pm10: 155, rainProb: 5 },
  { id: 'city_05', name: '강릉', temp: 22, status: '흐림', humidity: 65, pm10: 15, rainProb: 40 },
  { id: 'city_06', name: '제주', temp: 29, status: '맑음', humidity: 74, pm10: 92, rainProb: 20 },
])

// 본인만의 반응형 상태 (2일차 요구사항 5에서 추가한 것들)
const sortType = ref('none')
const onlyHot = ref(false)
const watchLogs = ref([])
const effectMessage = ref('대기 중...')

// 한글 조합(IME) 플래그는 SearchBar 안으로 내려갔다.
// input 엘리먼트의 입력 상태일 뿐이라 부모가 알 필요가 없기 때문이다.

/* ── computed (2일차와 동일) ───────────────────── */

const filteredWeatherList = computed(() => {
  console.log('☑ [computed 재계산] filteredWeatherList 연산 실행됨')

  if (searchQuery.value.trim() === '') {
    return weatherList.value
  }
  return weatherList.value.filter((city) => city.name.includes(searchQuery.value.trim()))
})

const visibleWeatherList = computed(() => {
  let list = filteredWeatherList.value

  if (onlyHot.value) {
    list = list.filter((city) => city.temp >= 25)
  }
  if (sortType.value === 'temp') {
    list = [...list].sort((a, b) => b.temp - a.temp)
  } else if (sortType.value === 'name') {
    list = [...list].sort((a, b) => a.name.localeCompare(b.name))
  }

  return list
})

const searchState = computed(() => {
  if (searchQuery.value.trim() === '') return 'empty'
  return filteredWeatherList.value.length > 0 ? 'found' : 'none'
})

const statusMessage = computed(() => {
  if (selectedCityInfo.value === null) {
    return '카드를 클릭하거나 검색해 보세요.'
  }
  return `${selectedCityInfo.value.name}이 선택되었습니다.`
})

const summary = computed(() => {
  const list = visibleWeatherList.value
  if (list.length === 0) return '표시할 도시가 없습니다.'

  const totalTemp = list.reduce((sum, city) => sum + city.temp, 0)
  const avgTemp = (totalTemp / list.length).toFixed(1)
  const hottest = [...list].sort((a, b) => b.temp - a.temp)[0]

  return `${list.length}개 도시 · 평균 기온 ${avgTemp}°C · 가장 더운 곳 ${hottest.name}(${hottest.temp}°C)`
})

/* ── watch / watchEffect (2일차와 동일) ────────── */

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
  const message = `👁 [watch 감지] 상태 바 문구가 업데이트되었습니다 -> "${statusMessage.value}" (이전 선택: ${before})`

  console.log(message)
  addLog(message)
})

watchEffect(() => {
  const message = `🔁 [watchEffect 자동 호출] 현재 검색어 '${searchQuery.value}'에 매칭되는 API 데이터를 필터링합니다...`

  console.log(message)
  effectMessage.value = message
})

watch([sortType, onlyHot], ([newSort, newHot], [oldSort, oldHot]) => {
  const message = `⚙ [watch 다중 감시] 정렬 ${oldSort} → ${newSort} / 25도 이상만 ${oldHot} → ${newHot}`

  console.log(message)
  addLog(message)
})

watch(
  () => filteredWeatherList.value.length,
  (newCount, oldCount) => {
    const message =
      newCount === 0
        ? `🚨 [watch 결과 감시] 검색 결과가 ${oldCount}건 → 0건이 되었습니다.`
        : `🔍 [watch 결과 감시] 검색 결과가 ${oldCount}건 → ${newCount}건으로 바뀌었습니다.`

    console.log(message)
    addLog(message)
  },
)

/* ── 자식이 올려보낸 이벤트를 받는 핸들러 ──────────
   상태를 바꾸는 코드는 전부 부모에만 있다. 자식은 "이런 일이 있었다"만 알린다.
   ──────────────────────────────────────────────── */

// SearchBar의 update-query → 검색어 갱신
const handleQueryUpdate = (newQuery) => {
  searchQuery.value = newQuery
}

// WeatherCard의 select-card → 선택된 도시 객체를 통째로 저장 (watch가 이 변화를 감지)
const handleSelectCard = (city) => {
  selectedCityInfo.value = city
}

// WeatherCard의 click-detail → 상세보기.
// 1·2일차에는 alert를 자식이 직접 띄웠지만, 요구사항대로 부모가 받아 처리한다.
const handleClickDetail = (city) => {
  window.alert(`${city.name}의 현재 날씨는 [${city.status}] 상태입니다.`)
}

// ViewOptions의 update-sort / update-hot → 보기 설정 갱신
const handleSortUpdate = (newSort) => {
  sortType.value = newSort
}

const handleHotUpdate = (newHot) => {
  onlyHot.value = newHot
}
</script>

<template>
  <div class="page">
    <h1>🧩 과제 3: 날씨 (컴포넌트)</h1>

    <!--
      [요구사항 2, 6] 검색박스와 리스트박스는 같은 BaseDashboardCard를 쓴다.
      SearchBar와 WeatherCard는 시각적으로 BaseDashboardCard 안에 있지만,
      <slot>으로 전달되는 내용은 '부모(WeatherParent) 스코프'에서 컴파일·평가되므로
      여기서 :query / @update-query 처럼 직접 바인딩·통신할 수 있다.
      BaseDashboardCard는 자기 안에 무엇이 들어오는지 전혀 몰라도 된다.
    -->
    <BaseDashboardCard icon="🔍">
      <template #title>도시 검색 (한글 즉시 동기화)</template>

      <SearchBar :query="searchQuery" @update-query="handleQueryUpdate" />
    </BaseDashboardCard>

    <BaseDashboardCard icon="⚙">
      <template #title>보기 설정</template>

      <ViewOptions
        :sort-type="sortType"
        :only-hot="onlyHot"
        @update-sort="handleSortUpdate"
        @update-hot="handleHotUpdate"
      />
    </BaseDashboardCard>

    <BaseDashboardCard icon="📊">
      <template #title>지역별 날씨 현황</template>

      <!-- [2일차 요구사항 4] 검색 상태 안내 -->
      <SearchNotice
        :state="searchState"
        :query="searchQuery"
        :count="filteredWeatherList.length"
      />

      <template v-if="searchState !== 'none'">
        <WeatherCard
          v-for="city in visibleWeatherList"
          :key="city.id"
          :city="city"
          :selected="selectedCityInfo !== null && selectedCityInfo.id === city.id"
          @select-card="handleSelectCard"
          @click-detail="handleClickDetail"
        />

        <p v-if="visibleWeatherList.length === 0" class="empty">
          보기 설정 조건에 맞는 도시가 없습니다.
        </p>
      </template>

      <!-- 이름 붙인 슬롯. 이 박스에만 요약 줄이 붙는다. -->
      <template #footer>{{ summary }}</template>
    </BaseDashboardCard>

    <BaseDashboardCard icon="🖥">
      <template #title>Watcher 모니터링</template>

      <WatcherMonitor :effect-message="effectMessage" :logs="watchLogs" />
    </BaseDashboardCard>

    <StatusBar :message="statusMessage" />
  </div>
</template>

<style scoped>
/*
  [요구사항 5] 부모에게 남은 디자인은 '페이지 전체 틀'뿐이다.
  패널·검색창·카드·상태바 디자인은 각 컴포넌트의 <style scoped>로 옮겼다.
*/
.page {
  max-width: 560px;
  margin: 0 auto;
  padding: 20px 24px 24px;
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
}

h1 {
  margin: 0 0 18px;
  padding-bottom: 12px;
  font-size: 20px;
  border-bottom: 1px solid #e3e8ef;
}

/* 보기 설정 때문에 목록이 비었을 때의 안내. 이 문구는 부모가 직접 그린다. */
.empty {
  margin: 0;
  padding: 16px 0;
  text-align: center;
  color: #889;
}
</style>
