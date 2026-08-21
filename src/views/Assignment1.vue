<script setup>
import { ref } from 'vue'
import WeatherCard from '../components/WeatherCard.vue'

// [요구사항 1] 화면에 반복 출력할 날씨 데이터
// [요구사항 5] 기본 항목(name, temp, status)에 습도, 미세먼지, 강수확률을 추가하고 도시도 6개로 늘렸다.
const weatherList = ref([
  { id: 'city_01', name: '서울', temp: 28, status: '맑음', humidity: 55, pm10: 32, rainProb: 10 },
  { id: 'city_02', name: '수원', temp: 24, status: '비', humidity: 82, pm10: 21, rainProb: 80 },
  { id: 'city_03', name: '부산', temp: 26, status: '구름', humidity: 70, pm10: 48, rainProb: 30 },
  { id: 'city_04', name: '대전', temp: 27, status: '맑음', humidity: 48, pm10: 155, rainProb: 5 },
  { id: 'city_05', name: '강릉', temp: 22, status: '흐림', humidity: 65, pm10: 15, rainProb: 40 },
  { id: 'city_06', name: '제주', temp: 29, status: '맑음', humidity: 74, pm10: 92, rainProb: 20 },
])

// [요구사항 3] 검색어와 한글 조합(IME) 진행 여부
const keyword = ref('')
const isComposing = ref(false)

// [요구사항 4] 하단 상태바에 표시할 문구
const statusMessage = ref('카드를 클릭하거나 검색해 보세요.')

// [요구사항 5] 목록 정렬 기준과 필터 옵션
const sortType = ref('none')
const onlyHot = ref(false)

// [요구사항 3] v-model 대신 :value + @input으로 직접 양방향 바인딩을 구현한다.
// 이 방식은 한글을 칠 때 조합 중인 글자('ㅅ', '서', ...)가 그대로 들어와 글자가 깨지므로,
// composition 이벤트로 조합 중인지 판단해서 조합이 끝난 뒤에만 상태를 바꾼다.
const handleInput = (e) => {
  if (isComposing.value) return
  keyword.value = e.target.value
}

const handleCompositionStart = () => {
  isComposing.value = true
}

const handleCompositionEnd = (e) => {
  isComposing.value = false
  keyword.value = e.target.value
}

// [요구사항 4] 카드를 클릭하면 상태바 문구를 바꾼다.
const selectCity = (cityName) => {
  statusMessage.value = `${cityName}이 선택되었습니다.`
}

// [요구사항 5] 검색어, 필터, 정렬을 차례로 적용한 최종 목록
const visibleList = () => {
  let list = weatherList.value

  if (keyword.value !== '') {
    list = list.filter((city) => city.name.includes(keyword.value))
  }
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
}
</script>

<template>
  <div class="page">
    <h1>🌤 과제 1: 날씨 (Mockup)</h1>

    <!-- [요구사항 3] 도시 검색 -->
    <section class="panel">
      <h2>🔍 도시 검색</h2>
      <input
        type="text"
        class="search-input"
        placeholder="검색할 도시 이름 입력"
        :value="keyword"
        @input="handleInput"
        @compositionstart="handleCompositionStart"
        @compositionend="handleCompositionEnd"
      />
      <p class="search-echo">검색 중인 도시: {{ keyword }}</p>
    </section>

    <!-- [요구사항 5] 정렬 / 필터 -->
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

    <!-- [요구사항 1, 4] 날씨 카드 목록 -->
    <section class="panel">
      <h2>📍 지역별 날씨 현황</h2>

      <!--
        [요구사항 1] :key에 고유값인 id를 바인딩한다.
        [요구사항 4] 여기에 건 @click은 WeatherCard의 루트 엘리먼트로 전달되어,
                     카드 아무 곳이나 누르면 selectCity가 실행된다.
      -->
      <WeatherCard v-for="city in visibleList()" :key="city.id" :city="city" @click="selectCity(city.name)" />

      <p v-if="visibleList().length === 0" class="empty">조건에 맞는 도시가 없습니다.</p>
    </section>

    <!-- [요구사항 4] 상태바 -->
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

.empty {
  margin: 0;
  padding: 16px 0;
  text-align: center;
  color: #889;
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
