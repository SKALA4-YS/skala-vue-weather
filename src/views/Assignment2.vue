<script setup>
import { ref, computed, watch, watchEffect } from 'vue'
import WeatherCard from '../components/WeatherCard.vue'

/* ────────────────────────────────────────────────
   [요구사항 1] 반응형 상태 관리
   검색어(searchQuery), 선택된 도시(selectedCityInfo),
   지역별 날씨 데이터 배열(weatherList)을 ref로 정의한다. (데이터는 1일차와 동일)
   ──────────────────────────────────────────────── */
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

// 한글 조합(IME) 진행 여부. 1일차와 같은 이유로 필요하다.
const isComposing = ref(false)

/* [요구사항 5] 본인만의 반응형 상태 변수 */
const sortType = ref('none') // 정렬 기준
const onlyHot = ref(false) // 25도 이상만 보기
const watchLogs = ref([]) // watch가 남긴 기록 (화면 로그 패널용)
const effectMessage = ref('대기 중...') // watchEffect가 남기는 최신 문구

/* ────────────────────────────────────────────────
   [요구사항 2] 검색 도시 (computed 활용)
   전체 날씨 리스트 중 검색어가 도시 이름에 포함된 항목만 담아 놓는다.
   검색어가 비어 있으면 원본 배열을 그대로 돌려준다. → [요구사항 4] 첫 번째 분기
   ──────────────────────────────────────────────── */
const filteredWeatherList = computed(() => {
  console.log('☑ [computed 재계산] filteredWeatherList 연산 실행됨')

  if (searchQuery.value.trim() === '') {
    return weatherList.value
  }
  return weatherList.value.filter((city) => city.name.includes(searchQuery.value.trim()))
})

/* [요구사항 5] 본인만의 computed
   ① 검색 결과에 보기 설정(필터·정렬)을 덧붙인 최종 목록.
      computed 안에서 다른 computed(filteredWeatherList)를 참조해 단계를 나눴다. */
const visibleWeatherList = computed(() => {
  let list = filteredWeatherList.value

  if (onlyHot.value) {
    list = list.filter((city) => city.temp >= 25)
  }
  if (sortType.value === 'temp') {
    // sort는 원본 배열을 바꾸므로 복사본을 만들어 정렬한다.
    list = [...list].sort((a, b) => b.temp - a.temp)
  } else if (sortType.value === 'name') {
    list = [...list].sort((a, b) => a.name.localeCompare(b.name))
  }

  return list
})

/* ② 검색 상태를 세 가지로 정리한다. 템플릿의 v-if 분기가 이 값 하나만 보면 되도록 만들었다. */
const searchState = computed(() => {
  if (searchQuery.value.trim() === '') return 'empty'
  return filteredWeatherList.value.length > 0 ? 'found' : 'none'
})

/* ③ 상태바 문구. selectedCityInfo에서 파생되는 값이라 ref가 아니라 computed로 뒀다. */
const statusMessage = computed(() => {
  if (selectedCityInfo.value === null) {
    return '카드를 클릭하거나 검색해 보세요.'
  }
  return `${selectedCityInfo.value.name}이 선택되었습니다.`
})

/* ④ 화면에 보이는 목록의 요약 정보 */
const summary = computed(() => {
  const list = visibleWeatherList.value
  if (list.length === 0) return '표시할 도시가 없습니다.'

  const totalTemp = list.reduce((sum, city) => sum + city.temp, 0)
  const avgTemp = (totalTemp / list.length).toFixed(1)
  const hottest = [...list].sort((a, b) => b.temp - a.temp)[0]

  return `${list.length}개 도시 · 평균 기온 ${avgTemp}°C · 가장 더운 곳 ${hottest.name}(${hottest.temp}°C)`
})

/* ────────────────────────────────────────────────
   [요구사항 3] 반응형 변수 변화 감시 (watch, watchEffect)
   ──────────────────────────────────────────────── */

// 화면 로그 패널에 기록을 쌓는다. (watch 콜백 안에서만 호출한다 — 아래 watchEffect 주석 참고)
// 로그마다 고유 번호를 붙이는 이유는 1일차와 같다. 새 로그가 맨 앞에 끼어들기 때문에
// 인덱스를 :key로 쓰면 순서가 밀릴 때 Vue가 엉뚱한 노드를 재사용한다.
let logSeq = 0

const addLog = (message) => {
  logSeq += 1
  watchLogs.value.unshift({ id: logSeq, text: message })

  if (watchLogs.value.length > 8) {
    watchLogs.value.pop()
  }
}

// ① selectedCityInfo 감시 (watch): 상태바 문구가 바뀔 때마다 콘솔로그를 남긴다.
watch(selectedCityInfo, (newCity, oldCity) => {
  const before = oldCity === null ? '없음' : oldCity.name
  const message = `👁 [watch 감지] 상태 바 문구가 업데이트되었습니다 -> "${statusMessage.value}" (이전 선택: ${before})`

  console.log(message)
  addLog(message)
})

// ② searchQuery 감시 (watchEffect): 타이핑할 때마다 변하는 검색어를 추적한다.
//    watchEffect는 감시 대상을 적지 않아도 내부에서 읽은 반응형 데이터를 자동으로 추적한다.
//    여기서는 searchQuery.value만 읽으므로 검색어에만 반응한다.
//    (주의: effectMessage는 '대입'만 하므로 추적 대상이 되지 않는다.
//     만약 watchLogs처럼 값을 읽고 다시 바꾸면 자기 자신을 감시하게 되어 무한 재실행에 빠진다.)
watchEffect(() => {
  const message = `🔁 [watchEffect 자동 호출] 현재 검색어 '${searchQuery.value}'에 매칭되는 API 데이터를 필터링합니다...`

  console.log(message)
  effectMessage.value = message
})

/* [요구사항 5] 본인만의 Watcher */

// ③ 보기 설정 두 개를 한꺼번에 감시한다. (Multi-Source Watch)
watch([sortType, onlyHot], ([newSort, newHot], [oldSort, oldHot]) => {
  const message = `⚙ [watch 다중 감시] 정렬 ${oldSort} → ${newSort} / 25도 이상만 ${oldHot} → ${newHot}`

  console.log(message)
  addLog(message)
})

// ④ 검색 결과 '개수'만 콕 집어 감시한다. (화살표 함수로 감시 대상 지정)
//    배열 자체를 감시하면 매번 새 배열이라 의미가 없어서 length를 감시했다.
watch(
  () => filteredWeatherList.value.length,
  (newCount, oldCount) => {
    const message = newCount === 0 ? `🚨 [watch 결과 감시] 검색 결과가 ${oldCount}건 → 0건이 되었습니다.` : `🔍 [watch 결과 감시] 검색 결과가 ${oldCount}건 → ${newCount}건으로 바뀌었습니다.`

    console.log(message)
    addLog(message)
  },
)

/* ────────────────────────────────────────────────
   이벤트 핸들러
   ──────────────────────────────────────────────── */

// 1일차와 동일하게 :value + @input으로 직접 바인딩한다.
// 한글은 조합 중인 글자까지 @input으로 들어오므로, 조합이 끝난 값만 상태에 반영한다.
const handleInput = (e) => {
  if (isComposing.value) return
  searchQuery.value = e.target.value
}

const handleCompositionStart = () => {
  isComposing.value = true
}

const handleCompositionEnd = (e) => {
  isComposing.value = false
  searchQuery.value = e.target.value
}

// 카드를 클릭하면 선택된 도시 '객체'를 통째로 담는다. → watch가 이 변화를 감지한다.
const selectCity = (city) => {
  selectedCityInfo.value = city
}
</script>

<template>
  <div class="page">
    <h1>🌤 과제 2: 날씨 (컴포지션)</h1>

    <!-- [요구사항 1, 3] 검색어 입력 -->
    <section class="panel">
      <h2>🔍 도시 검색</h2>
      <input
        type="text"
        class="search-input"
        placeholder="검색할 도시 이름 입력"
        :value="searchQuery"
        @input="handleInput"
        @compositionstart="handleCompositionStart"
        @compositionend="handleCompositionEnd"
      />
      <p class="search-echo">검색 중인 도시: {{ searchQuery }}</p>
    </section>

    <!-- [요구사항 5] 보기 설정 — Multi-Source Watch의 감시 대상 -->
    <section class="panel">
      <h2>⚙ 보기 설정</h2>
      <label class="option">
        정렬
        <select v-model="sortType">
          <option value="none">기본 순서</option>
          <option value="temp">기온 높은 순</option>
          <option value="name">도시 이름 순</option>
        </select>
      </label>
      <label class="option">
        <input type="checkbox" v-model="onlyHot" />
        25도 이상인 도시만 보기
      </label>
    </section>

    <!-- [요구사항 2, 4] 검색 결과 표시 -->
    <section class="panel">
      <h2>📍 지역별 날씨 현황</h2>

      <!-- [요구사항 4] 검색 상태에 따른 안내 문구 -->
      <p v-if="searchState === 'empty'" class="notice notice-plain">검색어가 비어 있어 전체 도시를 보여줍니다.</p>
      <p v-else-if="searchState === 'found'" class="notice notice-found">'{{ searchQuery }}' 검색 결과 {{ filteredWeatherList.length }}건을 찾았습니다.</p>
      <p v-else class="notice notice-none">'{{ searchQuery }}' 와(과) 검색 결과가 일치하는 도시가 없습니다.</p>

      <!-- 검색 결과가 있을 때만 목록을 그린다. -->
      <template v-if="searchState !== 'none'">
        <WeatherCard v-for="city in visibleWeatherList" :key="city.id" :city="city" :selected="selectedCityInfo !== null && selectedCityInfo.id === city.id" @click="selectCity(city)" />

        <!-- 검색은 됐지만 보기 설정 때문에 하나도 안 남은 경우 -->
        <p v-if="visibleWeatherList.length === 0" class="notice notice-plain">보기 설정 조건에 맞는 도시가 없습니다.</p>

        <p class="summary">{{ summary }}</p>
      </template>
    </section>

    <!-- [요구사항 3] 감시 결과를 화면에서도 확인할 수 있게 만든 로그 패널 -->
    <section class="panel">
      <h2>🖥 Watcher 모니터링</h2>
      <p class="effect-line">{{ effectMessage }}</p>
      <ul class="log-list">
        <li v-for="log in watchLogs" :key="log.id">{{ log.text }}</li>
        <li v-if="watchLogs.length === 0" class="log-empty">아직 감지된 변화가 없습니다. 카드를 클릭하거나 보기 설정을 바꿔 보세요.</li>
      </ul>
      <small class="hint">
        ※ 같은 내용이 브라우저 콘솔(F12)에도 그대로 출력됩니다.<br />
        ※ 위 주황색 줄은 watchEffect가 남긴 것으로, 새로고침 직후 아무것도 누르지 않아도 초기값('대기 중...')이 이미 덮어써져 있습니다. 최초 1회 즉시 실행되기 때문입니다.
      </small>
    </section>

    <!-- [요구사항 1, 3] 상태바 — selectedCityInfo에서 파생된 computed 문구 -->
    <p class="status-bar">{{ statusMessage }}</p>
  </div>
</template>

<style scoped>
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

h2 {
  margin: 0 0 10px;
  font-size: 15px;
  color: #2f4f7f;
}

.panel {
  margin-bottom: 16px;
  padding: 14px 16px;
  background-color: #f7f9fc;
  border: 1px solid #e3e8ef;
  border-radius: 8px;
}

.search-input {
  width: 100%;
  padding: 7px 10px;
  border: 1px solid #c5cede;
  border-radius: 4px;
}

.search-echo {
  margin: 6px 0 0;
  color: #667;
}

.option {
  display: inline-block;
  margin-right: 16px;
}

.option select {
  padding: 4px 6px;
  border: 1px solid #c5cede;
  border-radius: 4px;
}

.notice {
  margin: 0 0 10px;
  padding: 7px 10px;
  border-radius: 6px;
  font-size: 13px;
}

.notice-plain {
  background-color: #eef2f7;
  color: #556;
}

.notice-found {
  background-color: #e7f2ff;
  color: #1c5aa8;
}

.notice-none {
  background-color: #fff0f0;
  color: #b02a2a;
}

.summary {
  margin: 10px 0 0;
  padding-top: 8px;
  border-top: 1px dashed #d6dee9;
  color: #556;
  font-size: 13px;
}

.effect-line {
  margin: 0 0 8px;
  padding: 7px 10px;
  background-color: #fdf3e3;
  border-radius: 6px;
  color: #8a5a12;
  font-size: 12px;
  word-break: break-all;
}

.log-list {
  margin: 0;
  padding: 0;
  list-style: none;
  max-height: 150px;
  overflow-y: auto;
}

.log-list li {
  padding: 4px 6px;
  border-bottom: 1px solid #e7ecf3;
  color: #445;
  font-size: 12px;
  word-break: break-all;
}

.log-list li:last-child {
  border-bottom: none;
}

.log-empty {
  color: #99a;
}

.hint {
  display: block;
  margin-top: 8px;
  color: #99a;
  font-size: 11px;
}

.status-bar {
  margin: 0;
  padding: 10px;
  background-color: #e8f5e9;
  border: 1px solid #c3e3c6;
  border-radius: 6px;
  text-align: center;
  color: #2b6b34;
}
</style>
