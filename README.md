# SKALA Weather Hands-on

Vue 3 + Vite로 만든 날씨 대시보드입니다. 일곱 개의 과제를 한 프로젝트에 담았습니다.

**컨셉: RUNNING WEATHER — 오늘 뛰기 좋은 날인가**
기온·습도·미세먼지·바람·강수확률·자외선을 조합해 러닝 적합도를 점수로 환산합니다.
전국 30개 지역을 한눈에 보고, 시간대별·일별로 언제 뛰는 게 좋은지 알려줍니다.

| 화면 | 경로 | 내용 |
| --- | --- | --- |
| 대시보드 | `/` | 30개 지역 그리드, 내 위치, 권역 필터 |
| 러닝 지수 | `/running` | 점수 분석, 감점 내역, 시간대별 그래프 |
| 주간 계획 | `/week` | 5일 예보 기반 "언제 뛸까" |
| 지역 순위 | `/ranking` | 기온·미세먼지 순위 |
| 상세 관측 | `/weather/:cityId` | 관측값, 시간별·일별 예보, 일출/자외선 |
| 실습 기록 | `/lab` | 1~7일차에 무엇을 구현했는지 |
| 트러블슈팅 | `/troubleshooting` | 막혔던 12건 (증상 → 원인 → 해결) |
| 지난 과제 | `/practice/:day` | 1~3일차 과제 보관함 |

- **과제 1 (Mockup)** — 배열/조건부 렌더링, 폼 바인딩, 이벤트 수식어, 컴포넌트 분리, Scoped Style
- **과제 2 (Composition)** — 같은 화면을 `computed` · `watch` · `watchEffect`로 다시 구성
- **과제 3 (Component)** — 같은 화면을 기능 변경 없이 `props` · `emits` · `slot`으로 컴포넌트 분리
- **과제 4 (Router)** — 같은 화면을 Vue Router로 페이지 분리 (지연 로딩 · 동적 경로 · Catch-all)
- **과제 5 (Store)** — 화면 밖으로 상태를 꺼내 Pinia 스토어로 관리 (섭씨/화씨 단위 · 즐겨찾기)
- **과제 6 (Axios)** — 목업을 걷어내고 OpenWeatherMap 실제 데이터로 교체
- **과제 7 (UI Library)** — Element Plus 적용 + 러닝 지수 컨셉, 다크 스포츠 톤으로 전면 개편

## 실행 방법

```bash
npm install
cp .env.example .env      # OpenWeatherMap API Key 입력
npm run dev
```

실행 후 http://localhost:3000 으로 접속합니다.
API Key가 없으면 샘플 데이터로 화면이 뜨고, 상단에 "샘플 데이터 표시 중"이라고 나옵니다.
과제 4부터는 화면 전환 탭이 사라지고 **상단 내비게이션 바(RouterLink)** 로 페이지를 이동합니다.
과제 1 · 2 · 3 화면은 `/practice/1` ~ `/practice/3` 주소에 그대로 남아 있습니다.

## 개발 환경

- Node.js 22 이상
- Vue 3.5
- Vue Router 4
- Pinia 4
- Axios 1
- Element Plus 2 (라이트/다크 테마 + CSS 변수 커스터마이즈)
- Pretendard (웹폰트)
- Chart.js 4 (시간대별 그래프)
- Leaflet (러닝 지도)
- Vite 8

## 파일 구성

```
src/
  main.js                  앱 진입점 + 라우터·Pinia 전역 주입 (.use(router) / .use(createPinia()))
  App.vue                  내비게이션 바(RouterLink) + 메인 수문장(RouterView)
  router/
    index.js               라우트 규칙(routes 배열) 정의 및 Lazy Loading 설정
  stores/
    configStore.js         날씨 단위 스토어 (unit / unitSymbol / toggleUnit) — Options 스타일
    favoriteStore.js       즐겨찾기 도시 스토어 (추가 스토어) — setup 스타일
    weatherStore.js        API 응답 보관 (도시 목록 · 예보 · 로딩/에러 상태)
  composables/
    useDisplayTemp.js      단위 변환 로직 재사용 (메인·상세·순위 3곳 공용)
    useRunningIndex.js     러닝 지수 계산 (점수·감점 내역·시간대별·수분 권장량)
  services/
    weatherApi.js          OpenWeatherMap 호출 (axios 인스턴스 · 인터셉터 · 응답 변환)
    openMeteoApi.js        Open-Meteo 호출 (30개 지역 배치 조회 · 자외선 · 일출/일몰)
  data/
    cities.js              전국 30개 지역 좌표와 권역
    practiceLog.js         실습 기록과 트러블슈팅 (두 화면이 공유)
  components/
    WeatherCard.vue        도시 한 곳의 카드 (과제 1 · 2가 공유)
    DustBadge.vue          미세먼지 등급 배지 (전 과제 공유)
    exercise/              실습용 부품 컴포넌트 격리 폴더 (과제 3에서 분리)
      BaseDashboardCard.vue  검색박스·리스트박스 공통 디자인 (slot)
      SearchBar.vue          검색창 (props: query / emits: update-query)
      WeatherCard.vue        카드 (props: city, selected / emits: select-card, click-detail)
      TempBadge.vue          기온 라벨 (추가 분리)
      ViewOptions.vue        정렬·필터 (추가 분리)
      SearchNotice.vue       검색 결과 안내 문구 (추가 분리)
      WatcherMonitor.vue     Watcher 로그 패널 (추가 분리)
      StatusBar.vue          하단 상태바 (추가 분리)
      UnitToggler.vue        단위 설정 변경 UI (내비게이션 바 옆)
      RefreshBar.vue         API 상태 표시와 새로고침 버튼 (ElMessage)
      LineChart.vue          Chart.js 래퍼 (시간대별 지수 그래프)
      HeroPanel.vue          대시보드 상단 요약
      ThemeToggler.vue       라이트/다크 전환
      RunningMap.vue         전국 러닝 지수 지도 (Leaflet)
      ForecastStrip.vue      시간대별 예보 가로 목록
  views/                   페이지 단위 컴포넌트 보관 폴더
    WeatherHomeView.vue    메인 날씨 대시보드 화면 (WeatherParent 대체)
    WeatherAboutView.vue   서비스 소개용 정적 페이지
    WeatherDetailView.vue  :cityId 패턴을 수신하는 동적 상세 페이지
    NotFoundView.vue       정의되지 않은 경로 접근 시 (Catch-all Route)
    RunningIndexView.vue   러닝 지수 화면 (Element Plus 집중 적용)
    WeekPlanView.vue       주간 계획 (5일 예보)
    PracticeLabView.vue    실습 아카이브
    TroubleshootingView.vue 트러블슈팅 기록
    WeatherRankingView.vue 기온·미세먼지 순위표 (추가 view)
    PracticeArchiveView.vue 1~3일차 과제 보관함 (추가 view, /practice/:day)
    Assignment1.vue        과제 1 화면 (Mockup)
    Assignment2.vue        과제 2 화면 (Composition)
    WeatherParent.vue      과제 3 부모 컴포넌트 — 모든 반응형 데이터 보유
  assets/main.css          전역 공통 스타일
```

- **views/Assignment1.vue** — 날씨 데이터를 들고 있고, 검색 · 필터 · 정렬 로직과 레이아웃, 상태바를 담당합니다.
- **views/Assignment2.vue** — 같은 데이터를 `computed`로 가공하고 `watch` · `watchEffect`로 변화를 감시합니다.
- **components/WeatherCard.vue** — 도시 한 곳의 카드입니다. `city` 객체를 props로 받아 기온 라벨, 준비물, 상세보기 버튼을 그립니다.
- **components/DustBadge.vue** — 미세먼지 농도(`pm10`)만 props로 받아 등급과 색상을 결정하는 작은 배지입니다.

컴포넌트 각각의 스타일은 `<style scoped>`로 자기 파일 안에 두어 서로 영향을 주지 않게 했습니다.

---

# 과제 1 — 날씨 Mockup

## 과제 요구사항 구현 내용

### 1. 배열 렌더링 (v-for)

`weatherList` 배열을 `v-for`로 반복해 `WeatherCard`를 찍어냅니다.
`:key`에는 인덱스 대신 데이터가 가진 고유값인 `id`를 바인딩했습니다.

```html
<WeatherCard
  v-for="city in visibleList()"
  :key="city.id"
  :city="city"
  @click="selectCity(city.name)"
/>
```

### 2. 조건부 렌더링 (v-if)

기온 25도를 기준으로 라벨을 다르게 붙입니다. (`WeatherCard.vue`)

```html
<span v-if="city.temp >= 25" class="badge badge-hot">🔥 더움 (25도 이상)</span>
<span v-else class="badge badge-cool">❄ 선선함 (25도 미만)</span>
```

### 3. 양방향 바인딩 및 한글 처리 (:value, @input)

`v-model` 축약형 대신, 그 내부 동작인 **`:value`(데이터 → 화면) + `@input`(화면 → 데이터)** 을 직접 연결했습니다.

```html
<input
  type="text"
  :value="keyword"
  @input="handleInput"
  @compositionstart="handleCompositionStart"
  @compositionend="handleCompositionEnd"
/>
```

**한글 입력 문제와 해결**

`:value` + `@input`만 쓰면 영어는 잘 되지만 한글은 글자가 깨집니다.
한글은 자음·모음을 조합해 한 글자를 만드는 방식(IME 조합)이라, "서울"을 치는 동안
`ㅅ` → `서` → `성` → ... 같은 **조합 중인 미완성 값**까지 `@input`으로 들어옵니다.
이 값을 `keyword`에 넣는 순간 `:value`가 input을 다시 덮어써서 조합이 끊기고 글자가 어긋납니다.

그래서 브라우저의 composition 이벤트로 "지금 조합 중인지"를 상태로 관리하고,
**조합이 끝난 완성 글자만** 반영하도록 했습니다.

```js
const handleInput = (e) => {
  if (isComposing.value) return   // 조합 중에는 무시
  keyword.value = e.target.value
}

const handleCompositionStart = () => {
  isComposing.value = true
}

const handleCompositionEnd = (e) => {
  isComposing.value = false
  keyword.value = e.target.value  // 완성된 글자를 반영
}
```

참고로 `v-model`을 쓰면 Vue가 이 처리를 내부에서 대신 해줍니다.
이번 과제는 그 내부 동작을 직접 구현해 본 셈입니다.

### 4. 이벤트 및 수식어

카드를 클릭하면 하단 상태바에 `"{도시}이 선택되었습니다."`가 표시됩니다.
클릭 리스너는 부모인 `Assignment1.vue`에서 `<WeatherCard @click="selectCity(city.name)" />`처럼 걸어두었는데,
`WeatherCard`의 루트 엘리먼트가 하나뿐이라 이 리스너가 카드 `<div>`로 그대로 전달됩니다.

카드 안의 `[상세보기]` 버튼에는 `@click.stop`을 붙여 **버블링을 차단**했습니다.
수식어가 없으면 버튼을 눌렀을 때 alert가 뜬 뒤 부모 카드의 클릭 이벤트까지 함께 실행됩니다.

```html
<button class="detail-btn" @click.stop="showDetail(city.name, city.status)">상세보기</button>
```

```js
const showDetail = (cityName, status) => {
  window.alert(`${cityName}의 현재 날씨는 [${status}] 상태입니다.`)
}
```

---

## 5. 본인만의 데이터 추가 및 Mockup 확장

### 5-1. 추가한 데이터

기본 데이터(`name`, `temp`, `status`)에 세 가지 항목을 직접 추가하고, 도시도 3개에서 6개로 늘렸습니다.

| 추가 항목 | 설명 |
| --- | --- |
| `humidity` | 습도(%) |
| `pm10` | 미세먼지 농도(㎍/㎥) |
| `rainProb` | 강수확률(%) |

```js
const weatherList = ref([
  { id: 'city_01', name: '서울', temp: 28, status: '맑음', humidity: 55, pm10: 32, rainProb: 10 },
  { id: 'city_02', name: '수원', temp: 24, status: '비', humidity: 82, pm10: 21, rainProb: 80 },
  { id: 'city_03', name: '부산', temp: 26, status: '구름', humidity: 70, pm10: 48, rainProb: 30 },
  { id: 'city_04', name: '대전', temp: 27, status: '맑음', humidity: 48, pm10: 155, rainProb: 5 },
  { id: 'city_05', name: '강릉', temp: 22, status: '흐림', humidity: 65, pm10: 15, rainProb: 40 },
  { id: 'city_06', name: '제주', temp: 29, status: '맑음', humidity: 74, pm10: 92, rainProb: 20 },
])
```

미세먼지 값은 네 등급이 모두 화면에 나타나도록 구간을 나눠 잡았습니다.

### 5-2. 추가 Mockup ①: 미세먼지 등급 배지 (DustBadge.vue)

`pm10` 숫자만 보여주면 좋은 수치인지 알기 어려워서, 환경부 기준을 참고해
네 단계 등급으로 바꾸고 등급마다 배지 색을 다르게 했습니다.

이 부분은 도시 데이터 전체가 필요 없고 농도 하나만 있으면 되므로 별도 컴포넌트로 뺐습니다.
색상은 클래스 이름을 문자열로 돌려주는 함수를 만들어 `:class`에 바인딩했습니다.

```js
const props = defineProps({
  pm10: {
    type: Number,
    required: true,
  },
})

const gradeText = () => {
  if (props.pm10 <= 30) return '좋음'
  if (props.pm10 <= 80) return '보통'
  if (props.pm10 <= 150) return '나쁨'
  return '매우나쁨'
}
```

```html
<span class="badge" :class="gradeClass()">미세먼지 {{ gradeText() }} ({{ pm10 }})</span>
```

| 등급 | 기준(pm10) | 배지 색 |
| --- | --- | --- |
| 좋음 | 0 ~ 30 | 초록 |
| 보통 | 31 ~ 80 | 파랑 |
| 나쁨 | 81 ~ 150 | 주황 |
| 매우나쁨 | 151 이상 | 빨강 |

> 위 `gradeText` / `gradeClass`는 과제 1 시점에 일반 함수로 작성한 것이고,
> 과제 2에서 `computed`로 바꿨습니다. (아래 「computed로 바꾼 곳」 참고)

### 5-3. 추가 Mockup ②: 외출 준비물 추천

추가한 데이터를 실제로 써먹기 위해, 여러 조건을 조합해 준비물 목록을 만들어 주는 기능을 넣었습니다.
결과가 배열이므로 화면에서는 다시 `v-for`로 칩(chip) 형태로 출력합니다.

```js
const outfitTips = () => {
  const city = props.city
  const tips = []

  if (city.rainProb >= 50) tips.push('우산')
  if (city.pm10 > 80) tips.push('마스크')
  if (city.temp < 25) tips.push('겉옷')
  if (city.humidity >= 80) tips.push('제습기')
  if (tips.length === 0) tips.push('따로 챙길 것 없음')

  return tips
}
```

예를 들어 수원(24도, 강수확률 80%, 습도 82%)은 `우산 / 겉옷 / 제습기`가,
대전(27도, 미세먼지 155)은 `마스크`가 표시됩니다.

### 5-4. 추가 Mockup ③: 정렬 · 필터 (v-model 활용)

도시가 6개로 늘어나면서 목록을 골라 볼 수단이 필요해져 보기 설정 영역을 추가했습니다.
드롭다운과 체크박스는 배운 대로 `select`는 문자열 `ref('')`, 단일 체크박스는 불리언 `ref(false)`로 선언했습니다.

```html
<select v-model="sortType">
  <option value="none">기본 순서</option>
  <option value="temp">기온 높은 순</option>
  <option value="name">도시 이름 순</option>
</select>

<input type="checkbox" v-model="onlyHot" /> 25도 이상인 도시만 보기
```

`visibleList()`에서 **검색어 → 필터 → 정렬** 순서로 처리한 뒤 최종 배열을 돌려주고,
`v-for`는 이 결과를 받아 렌더링합니다. 요구사항 3의 검색어도 여기서 함께 적용돼,
검색창에 "서"를 입력하면 서울만 남습니다.

```js
const visibleList = () => {
  let list = weatherList.value

  if (keyword.value !== '') {
    list = list.filter((city) => city.name.includes(keyword.value))
  }
  if (onlyHot.value) {
    list = list.filter((city) => city.temp >= 25)
  }
  if (sortType.value === 'temp') {
    // sort는 원본 배열을 바꾸므로 복사본을 만들어 정렬
    list = [...list].sort((a, b) => b.temp - a.temp)
  } else if (sortType.value === 'name') {
    list = [...list].sort((a, b) => a.name.localeCompare(b.name))
  }

  return list
}
```

정렬할 때 `[...list]`로 복사본을 만든 이유는, `sort()`가 원본 배열을 직접 바꾸는 메서드라
그대로 쓰면 `weatherList` 원본 순서가 망가지기 때문입니다.

조건에 맞는 도시가 하나도 없을 때는 빈 화면 대신 안내 문구를 띄우도록 `v-if`를 하나 더 뒀습니다.

```html
<p v-if="visibleList().length === 0" class="empty">조건에 맞는 도시가 없습니다.</p>
```

---

## 동작 확인 방법

1. 검색창에 `서울`을 한 글자씩 입력했을 때 글자가 깨지지 않고, 아래 "검색 중인 도시"에 그대로 표시되는지 확인
2. 검색창에 `부`를 입력하면 부산만 남는지 확인
3. 카드 본문을 클릭 → 하단 상태바 문구가 바뀌는지 확인
4. `[상세보기]` 버튼 클릭 → alert만 뜨고 **상태바 문구는 바뀌지 않는지** 확인 (`.stop` 동작)
5. 정렬을 "기온 높은 순"으로 바꾸고, "25도 이상만 보기"를 체크해 목록이 달라지는지 확인
6. 대전(매우나쁨), 제주(나쁨), 서울(보통), 강릉(좋음) 배지 색이 다른지 확인

---

# 과제 2 — 날씨 Composition

`src/views/Assignment2.vue` 한 파일에 구현했습니다.
과제 1과 데이터·화면은 같지만, 파생 데이터는 `computed`로, 변화 감지는 `watch` / `watchEffect`로 처리했습니다.

## 1. 반응형 상태 관리

요구사항이 지정한 이름 그대로 `ref`로 선언했습니다. 날씨 데이터는 1일차와 동일합니다.

```js
const searchQuery = ref('')          // 검색어
const selectedCityInfo = ref(null)   // 선택된 도시 (도시 객체 통째로, 아직 없으면 null)
const weatherList = ref([ ... ])     // 지역별 날씨 데이터 배열 (6개 도시)
```

`selectedCityInfo`에 문구 문자열이 아니라 **도시 객체**를 담은 이유는 두 가지입니다.

- 이름이 `~CityInfo`이므로 도시 정보 자체를 담는 편이 자연스럽습니다.
- 객체를 담아 두면 상태바 문구뿐 아니라 "선택된 카드 강조"까지 같은 상태 하나로 처리할 수 있습니다.

상태바 문구는 여기서 **파생되는 값**이라 `ref`가 아니라 `computed`로 만들었습니다.

```js
const statusMessage = computed(() => {
  if (selectedCityInfo.value === null) {
    return '카드를 클릭하거나 검색해 보세요.'
  }
  return `${selectedCityInfo.value.name}이 선택되었습니다.`
})
```

## 2. 검색 도시 (computed 활용) — `filteredWeatherList`

전체 리스트 중 검색어가 도시 이름에 포함된 항목만 담아 놓는 Computed 배열입니다.
**검색어가 비어 있으면 원본 배열을 그대로** 돌려주므로, 요구사항 4의 "검색어가 비었을 때 원본 출력"이 함께 해결됩니다.

```js
const filteredWeatherList = computed(() => {
  console.log('☑ [computed 재계산] filteredWeatherList 연산 실행됨')

  if (searchQuery.value.trim() === '') {
    return weatherList.value
  }
  return weatherList.value.filter((city) => city.name.includes(searchQuery.value.trim()))
})
```

안에 `console.log`를 둔 것은 **캐싱을 눈으로 확인하기 위해서**입니다.
카드를 클릭해 상태바만 바뀌는 경우처럼 `searchQuery`·`weatherList`가 그대로면 이 로그는 찍히지 않습니다.
과제 1의 `visibleList()`는 일반 함수라 화면이 다시 그려질 때마다 무조건 재실행됐던 것과 대비됩니다.

## 3. 반응형 변수 변화 감시 (watch, watchEffect)

### 3-1. `selectedCityInfo` 감시 (watch)

상태바 문구가 바뀔 때마다 콘솔로그를 남깁니다.

```js
watch(selectedCityInfo, (newCity, oldCity) => {
  const before = oldCity === null ? '없음' : oldCity.name
  const message = `👁 [watch 감지] 상태 바 문구가 업데이트되었습니다 -> "${statusMessage.value}" (이전 선택: ${before})`

  console.log(message)
  addLog(message)
})
```

`watch`는 감시 대상을 **직접 지정**하는 방식이라, 여기서는 `selectedCityInfo`가 바뀔 때만 콜백이 실행됩니다.
`oldCity`로 이전에 선택했던 도시까지 함께 출력할 수 있는 것이 `watchEffect`와의 차이입니다.

### 3-2. `searchQuery` 감시 (watchEffect)

도시 검색어를 타이핑할 때마다 변하는 `searchQuery`를 추적해 콘솔로그를 남깁니다.

```js
watchEffect(() => {
  const message = `🔁 [watchEffect 자동 호출] 현재 검색어 '${searchQuery.value}'에 매칭되는 API 데이터를 필터링합니다...`

  console.log(message)
  effectMessage.value = message
})
```

`watchEffect`는 감시 대상을 적지 않아도 **콜백 안에서 읽은 반응형 데이터를 자동으로 추적**합니다.
여기서는 `searchQuery.value`만 읽으므로 검색어에만 반응합니다.

`effectMessage`는 **값을 대입하기만 하고 읽지 않기 때문에** 추적 대상이 되지 않습니다.
만약 배열에 로그를 쌓듯 자기가 읽은 값을 다시 바꾸면, 그 변경이 다시 자신을 실행시켜 무한 재실행에 빠집니다.
그래서 화면 로그 목록(`watchLogs`)에 쌓는 일은 `watch` 콜백에서만 하도록 나눴습니다.

## 4. 검색 결과 표시 (Template 영역)

세 가지 경우를 `searchState`라는 Computed 하나로 정리해서, 템플릿이 이 값만 보고 분기하도록 했습니다.

```js
const searchState = computed(() => {
  if (searchQuery.value.trim() === '') return 'empty'
  return filteredWeatherList.value.length > 0 ? 'found' : 'none'
})
```

```html
<p v-if="searchState === 'empty'" class="notice notice-plain">
  검색어가 비어 있어 전체 도시를 보여줍니다.
</p>
<p v-else-if="searchState === 'found'" class="notice notice-found">
  '{{ searchQuery }}' 검색 결과 {{ filteredWeatherList.length }}건을 찾았습니다.
</p>
<p v-else class="notice notice-none">
  '{{ searchQuery }}' 와(과) 검색 결과가 일치하는 도시가 없습니다.
</p>
```

| 상태 | 조건 | 화면 |
| --- | --- | --- |
| `empty` | 검색어가 비었을 때 | 원본 데이터 6개를 모두 출력 |
| `found` | 일치하는 데이터가 있을 때 | 해당 데이터만 출력 |
| `none` | 일치하는 데이터가 없을 때 | 목록을 감추고 안내 문구 표시 |

## 5. 본인만의 반응형 상태 변수 · Computed · Watcher

### 5-1. 추가한 상태 변수

| 변수 | 용도 |
| --- | --- |
| `sortType` | 정렬 기준 (기본 / 기온 높은 순 / 이름 순) |
| `onlyHot` | 25도 이상만 보기 체크박스 |
| `watchLogs` | `watch`가 남긴 기록 배열 (화면 로그 패널) |
| `effectMessage` | `watchEffect`가 남긴 최신 문구 |

### 5-2. 추가한 Computed

**① `visibleWeatherList` — Computed 안에서 다른 Computed 참조하기**

검색 결과에 보기 설정(필터·정렬)을 덧붙인 최종 목록입니다.
`filteredWeatherList`를 그대로 읽어 쓰기 때문에, 검색어가 바뀌면 두 Computed가 연쇄적으로 다시 계산됩니다.

```js
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
```

요구사항 2의 `filteredWeatherList`는 **검색어만** 담당하도록 두고, 보기 설정은 이 단계로 분리했습니다.

**② `searchState`** — 위 4번에서 설명한 검색 상태 분기용.

**③ `statusMessage`** — `selectedCityInfo`에서 파생된 상태바 문구.

**④ `summary`** — 화면에 보이는 목록의 요약 (개수 · 평균 기온 · 가장 더운 도시).

```js
const summary = computed(() => {
  const list = visibleWeatherList.value
  if (list.length === 0) return '표시할 도시가 없습니다.'

  const totalTemp = list.reduce((sum, city) => sum + city.temp, 0)
  const avgTemp = (totalTemp / list.length).toFixed(1)
  const hottest = [...list].sort((a, b) => b.temp - a.temp)[0]

  return `${list.length}개 도시 · 평균 기온 ${avgTemp}°C · 가장 더운 곳 ${hottest.name}(${hottest.temp}°C)`
})
```

### 5-3. 추가한 Watcher

**① Multi-Source Watch — 보기 설정 두 개를 한꺼번에 감시**

```js
watch([sortType, onlyHot], ([newSort, newHot], [oldSort, oldHot]) => {
  const message = `⚙ [watch 다중 감시] 정렬 ${oldSort} → ${newSort} / 25도 이상만 ${oldHot} → ${newHot}`

  console.log(message)
  addLog(message)
})
```

감시 대상을 배열로 묶으면 둘 중 하나만 바뀌어도 콜백이 발동하고,
새 값과 옛 값도 같은 순서의 배열로 들어옵니다.

**② 검색 결과 '개수'만 콕 집어 감시**

```js
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
```

배열 자체를 감시하면 `filter`가 매번 새 배열을 만들기 때문에 값이 실제로 달라졌는지 알기 어렵습니다.
그래서 화살표 함수로 감시 대상을 `length` 하나로 좁혔습니다. 이렇게 하면 옛 값 추적도 정상적으로 됩니다.

### 5-4. computed로 바꾼 곳

과제 1에서 일반 함수로 작성했던 파생 데이터를 `computed`로 교체했습니다.

| 파일 | 과제 1 | 과제 2 |
| --- | --- | --- |
| `Assignment2.vue` | `visibleList()` 함수 | `filteredWeatherList` + `visibleWeatherList` |
| `WeatherCard.vue` | `outfitTips()` 함수 | `outfitTips` computed |
| `DustBadge.vue` | `gradeText()` / `gradeClass()` 함수 | 같은 이름의 computed |

템플릿에서 `outfitTips()`처럼 괄호를 붙여 호출하던 것을 `outfitTips`로 바꿔 씁니다.
`computed`는 의존하는 값이 그대로면 이전 결과를 재사용하므로, 카드가 다시 그려져도 다시 계산하지 않습니다.

### 5-5. 선택된 카드 강조

`selectedCityInfo`가 도시 객체이므로, 목록에서 같은 `id`인 카드에만 `selected` props를 넘겨 강조했습니다.

```html
<WeatherCard
  v-for="city in visibleWeatherList"
  :key="city.id"
  :city="city"
  :selected="selectedCityInfo !== null && selectedCityInfo.id === city.id"
  @click="selectCity(city)"
/>
```

`selected`는 `default: false`로 선언해서, 이 props를 넘기지 않는 과제 1 화면은 그대로 동작합니다.

---

## 과제 2 동작 확인 방법

브라우저 콘솔(F12)을 열어 두고 확인합니다. 같은 로그가 화면의 **Watcher 모니터링** 패널에도 쌓입니다.

1. 새로고침 직후 — 아무것도 누르지 않았는데 `watchEffect` 로그가 이미 찍혀 있는지 확인 (최초 1회 즉시 실행)
2. 검색창에 `부산`을 입력 → `[watchEffect 자동 호출]` 로그가 이어서 찍히는지 확인
   (한글은 1일차와 같은 이유로 **조합이 끝난 글자 단위**로 반영됩니다. `부산`의 `산`은 스페이스를 치거나
   다른 곳을 클릭해야 들어갑니다. 영문 `busan`을 치면 한 글자마다 로그가 찍히는 것을 볼 수 있습니다.)
3. 카드 클릭 → `[watch 감지] 상태 바 문구가 업데이트되었습니다` 로그와 함께 카드가 파랗게 강조되는지 확인
4. 같은 카드를 한 번 더 클릭 → **로그가 찍히지 않는지** 확인 (값이 실제로 바뀌지 않으면 `watch`는 발동하지 않음)
5. 검색창에 `가나다` 입력 → "검색 결과가 일치하는 도시가 없습니다" 안내와 `[watch 결과 감시]` 0건 로그 확인
6. 검색창을 비움 → 원본 6개가 모두 돌아오는지 확인
7. 정렬을 바꾸거나 체크박스를 누름 → `[watch 다중 감시]` 로그에 옛 값과 새 값이 함께 찍히는지 확인
8. 카드만 클릭할 때 `[computed 재계산]` 로그가 **찍히지 않는지** 확인 (캐싱 동작)

---

# 과제 3 — 날씨 Component

과제 2와 **화면도 기능도 완전히 같습니다.** 한 파일에 몰려 있던 것을 컴포넌트로 나눈 것만 다릅니다.
과제 2 파일(`Assignment2.vue`)은 비교용으로 그대로 남겨 두었고, 과제 3은 새 파일로 만들었습니다.

## 1. WeatherParent.vue — 모든 반응형 데이터 유지

`src/views/WeatherParent.vue`. 과제 2의 상태 · Computed · Watcher를 **한 줄도 바꾸지 않고** 옮겼습니다.

| 구분 | 유지한 것 |
| --- | --- |
| 상태 | `searchQuery` `selectedCityInfo` `weatherList` `sortType` `onlyHot` `watchLogs` `effectMessage` |
| Computed | `filteredWeatherList` `visibleWeatherList` `searchState` `statusMessage` `summary` |
| Watcher | `watch(selectedCityInfo)` · `watchEffect(searchQuery)` · Multi-Source Watch · 결과 개수 Watch |

바뀐 것은 **상태를 바꾸는 방법**뿐입니다. 이전에는 템플릿에서 바로 `selectCity(city)`를 불렀지만,
이제는 자식이 올려보낸 이벤트를 받는 핸들러가 그 일을 합니다.

```js
// SearchBar가 update-query를 올려보내면 검색어를 갱신한다.
const handleQueryUpdate = (newQuery) => {
  searchQuery.value = newQuery
}

// WeatherCard가 select-card를 올려보내면 선택 도시를 저장한다. (watch가 이 변화를 감지)
const handleSelectCard = (city) => {
  selectedCityInfo.value = city
}

// 상세보기 alert도 자식이 아니라 부모가 처리한다.
const handleClickDetail = (city) => {
  window.alert(`${city.name}의 현재 날씨는 [${city.status}] 상태입니다.`)
}
```

한글 조합(IME) 플래그 `isComposing`만 `SearchBar` 안으로 내렸습니다.
input 엘리먼트의 입력 상태일 뿐 화면 데이터가 아니라서, 부모가 알 필요가 없기 때문입니다.

## 2. BaseDashboardCard.vue — 공통 디자인 + slot

검색박스와 리스트박스가 똑같이 쓰던 패널 디자인(연한 배경 + 테두리 + 제목 줄)을 한 곳으로 모으고,
내용은 `<slot>`으로 구멍만 뚫어 두었습니다.

```html
<section class="dashboard-card">
  <h2 class="card-head">
    <span v-if="icon !== ''" class="head-icon">{{ icon }}</span>
    <slot name="title">제목 없는 카드</slot>
  </h2>

  <div class="card-body">
    <slot></slot>
  </div>

  <div v-if="$slots.footer" class="card-foot">
    <slot name="footer"></slot>
  </div>
</section>
```

| 슬롯 | 용도 |
| --- | --- |
| `#title` (이름 있는 슬롯) | 제목 줄. 안 넘기면 fallback 문구 `제목 없는 카드`가 대신 보입니다. |
| 기본 슬롯 | 박스 본문. 검색박스에는 `SearchBar`, 리스트박스에는 `WeatherCard` 목록이 들어갑니다. |
| `#footer` | 박스 아래 요약 줄. `$slots.footer`로 검사해서 **안 넘긴 박스는 구분선까지 사라집니다.** |

`BaseDashboardCard`는 자기 안에 무엇이 들어오는지 전혀 모릅니다. 그래서 같은 파일을 검색박스, 보기 설정,
리스트박스, Watcher 모니터링까지 **네 곳에 재사용**했습니다.

## 3. SearchBar.vue — props로 받고 emits로 올린다

```js
defineProps({
  query: { type: String, required: true },   // 부모의 검색 도시 데이터를 받아 표시
})

const emit = defineEmits(['update-query'])   // 검색 시 검색어를 부모에게 전달

const handleInput = (e) => {
  if (isComposing.value) return
  emit('update-query', e.target.value)
}
```

과제 1·2와 똑같이 `:value` + `@input` + composition 이벤트를 쓰지만,
**상태를 직접 바꾸지 않고 emit으로 넘긴다**는 점만 다릅니다.

화면의 "검색 중인 도시: OO"는 자기가 입력한 값이 아니라 **부모에게서 다시 내려온 `query`** 를 표시합니다.
즉 `emit → 부모 상태 변경 → props로 재하강`이 한 바퀴 돌았다는 증거입니다.

## 4. WeatherCard.vue — 이벤트 두 개를 구분해서 emit

```js
const emit = defineEmits(['select-card', 'click-detail'])

const handleSelect = () => emit('select-card', props.city)
const handleDetail = () => emit('click-detail', props.city)
```

```html
<div class="card" :class="cardClass" @click="handleSelect">
  ...
  <button class="detail-btn" @click.stop="handleDetail">상세보기</button>
</div>
```

과제 1·2에서는 부모가 건 `@click`이 루트 엘리먼트로 자동 전달되는 성질(fallthrough)에 기대고 있었습니다.
과제 3에서는 요구사항대로 **이름 붙인 이벤트를 직접 emit** 합니다.
덕분에 부모 템플릿만 봐도 "카드를 고른 것"과 "상세보기를 누른 것"이 구분됩니다.

```html
<WeatherCard
  v-for="city in visibleWeatherList"
  :key="city.id"
  :city="city"
  :selected="selectedCityInfo !== null && selectedCityInfo.id === city.id"
  @select-card="handleSelectCard"
  @click-detail="handleClickDetail"
/>
```

`@click.stop`은 그대로 필요합니다. 없으면 버튼 클릭이 카드 `<div>`로 번져
`click-detail`과 `select-card`가 **둘 다** 발생합니다.

## 5. `<style scoped>`로 디자인 분리

부모에 남은 스타일은 페이지 전체 틀(`.page`, `h1`)과 "보기 설정 조건에 맞는 도시가 없습니다" 문구뿐입니다.
패널 · 검색창 · 카드 · 배지 · 상태바 디자인은 전부 각 컴포넌트 파일로 옮겼습니다.

**주의할 점 하나** — `<slot>`으로 들어온 내용은 **부모 스코프의 ID**를 달고 옵니다.
그래서 `BaseDashboardCard.vue`에서 `.card-body p { ... }` 처럼 슬롯 안쪽을 겨냥해도 적용되지 않습니다.
슬롯에 들어갈 내용의 디자인은 그 내용을 가진 컴포넌트가 각자 들고 있어야 합니다.

## 6. Slot과 스코프

`SearchBar`와 `WeatherCard`는 화면상 `BaseDashboardCard` 안에 있지만,
슬롯 내용은 **부모(`WeatherParent`) 스코프에서 컴파일 · 평가**됩니다.
그래서 중간의 `BaseDashboardCard`를 거치지 않고 부모가 바로 바인딩 · 통신할 수 있습니다.

```html
<BaseDashboardCard icon="🔍">
  <template #title>도시 검색 (한글 즉시 동기화)</template>

  <!-- BaseDashboardCard 안이지만, :query와 @update-query는 WeatherParent와 직결된다 -->
  <SearchBar :query="searchQuery" @update-query="handleQueryUpdate" />
</BaseDashboardCard>
```

만약 스코프가 `BaseDashboardCard`였다면 `searchQuery`를 찾지 못해 에러가 났을 것이고,
props를 `BaseDashboardCard` → `SearchBar`로 한 번 더 내려주는 코드가 필요했을 것입니다.

## 7. 추가로 분리한 컴포넌트

요구사항 4개 외에 다섯 개를 더 나눴습니다. 기준은 **"이 부분이 필요로 하는 데이터가 무엇인가"** 입니다.

| 컴포넌트 | 받는 props | 분리한 이유 |
| --- | --- | --- |
| `TempBadge.vue` | `temp` | 도시 객체 전체가 아니라 기온 하나만 필요합니다. `DustBadge`와 같은 결로 맞췄습니다. |
| `ViewOptions.vue` | `sortType` `onlyHot` | 정렬·필터 UI. 변경은 `update-sort` / `update-hot`으로 올립니다. |
| `SearchNotice.vue` | `state` `query` `count` | `empty`/`found`/`none` 판단은 부모 Computed가 하고, 표시 방법만 담당합니다. |
| `WatcherMonitor.vue` | `effectMessage` `logs` | 감시(로직)는 부모에, 표시(디자인)는 자식에 두었습니다. |
| `StatusBar.vue` | `message` | 문구는 부모의 `statusMessage` Computed에서 내려옵니다. |

`ViewOptions`에서 `v-model`을 그대로 쓰지 않은 이유는, 자식이 `v-model`을 걸면 **props를 직접 수정**하는 셈이라
Vue가 경고를 내기 때문입니다. 데이터는 부모 → 자식 한 방향으로만 흘러야 하므로
`:value` + `@change` → `emit` 형태로 풀어 썼습니다.

```js
const handleSortChange = (e) => emit('update-sort', e.target.value)
const handleHotChange = (e) => emit('update-hot', e.target.checked)
```

## 데이터 흐름 한눈에 보기

```
                    ┌──────────────── WeatherParent (모든 상태) ────────────────┐
                    │                                                          │
   props (아래로)   ↓                                                          ↑  emits (위로)
                    │                                                          │
  SearchBar :query ─┤                              update-query ───────────────┤
  ViewOptions :sort-type :only-hot ─┤              update-sort / update-hot ───┤
  WeatherCard :city :selected ──────┤              select-card / click-detail ─┤
  SearchNotice :state :query :count ┤                                          │
  WatcherMonitor :effect-message :logs ┤                                       │
  StatusBar :message ───────────────┘                                          │
                    │                                                          │
                    └── BaseDashboardCard는 <slot>으로 자리만 빌려준다 ─────────┘
```

## 과제 3 동작 확인 방법

과제 2와 기능이 같으므로 **과제 2의 확인 항목이 그대로 통과해야 합니다.** 추가로 볼 것은 다음과 같습니다.

1. `/practice/2` ↔ `/practice/3`을 오갔을 때 화면과 동작이 같은지 확인
2. 검색창에 입력 → "검색 중인 도시"가 갱신되는지 확인 (emit → 부모 → props 한 바퀴)
3. 카드 본문 클릭 → 상태바 문구 변경 + 카드 강조 (`select-card`)
4. `[상세보기]` 클릭 → **alert만 뜨고 상태바는 그대로**인지 확인 (`.stop`이 `select-card`를 막는지)
5. 콘솔에 과제 2와 똑같은 `watch` / `watchEffect` / `computed` 로그가 찍히는지 확인
6. 네 개의 박스(검색 / 보기 설정 / 날씨 현황 / 모니터링)가 **같은 디자인**인지 확인 (`BaseDashboardCard` 재사용)
7. 리스트박스에만 아래쪽 요약 줄이 있고 나머지 박스에는 없는지 확인 (`$slots.footer` 분기)

---

# 과제 4 — 날씨 Router

## 과제 요구사항 구현 내용

### 1. Vue Router 설정 (지연 로딩 · Catch-all)

`src/router/index.js`에 라우트 규칙을 정의하고, `main.js`에서 `.use(router)`로 전역 주입했습니다.

| path | name | 컴포넌트 | 로딩 방식 |
| --- | --- | --- | --- |
| `/` | `weather-home` | WeatherHomeView | 정적 import |
| `/about` | `weather-about` | WeatherAboutView | 지연 로딩 |
| `/weather/:cityId` | `weather-detail` | WeatherDetailView | 지연 로딩 |
| `/ranking` | `weather-ranking` | WeatherRankingView | 지연 로딩 (추가) |
| `/practice/:day(\d+)` | `practice-archive` | PracticeArchiveView | 지연 로딩 (추가) |
| `/weather` | — | → `/`로 redirect | — |
| `/:pathMatch(.*)*` | `not-found` | NotFoundView | 지연 로딩 |

**지연 로딩**은 컴포넌트를 화살표 함수로 감싸 등록하는 방식입니다.

```js
component: () => import('../views/WeatherAboutView.vue')
```

이렇게 쓰면 `import()`가 등록 시점이 아니라 **해당 경로로 들어온 순간** 실행됩니다.
빌드하면 파일이 별도 청크로 잘려 나가는 것을 눈으로 확인할 수 있습니다.

```
dist/assets/index-*.js                109.39 kB   ← 첫 진입에 받는 것
dist/assets/WeatherDetailView-*.js      3.18 kB   ← /weather/city_01 을 눌러야 받음
dist/assets/WeatherAboutView-*.js       1.24 kB   ← /about 을 눌러야 받음
dist/assets/NotFoundView-*.js           0.72 kB
```

메인 화면(`/`)만 정적 import로 두었습니다. 앱을 열면 100% 보게 되는 화면이라
따로 쪼개면 첫 화면을 그리기 위한 네트워크 왕복만 한 번 더 늘어나기 때문입니다.

**Catch-all Route**는 위의 어떤 규칙에도 걸리지 않은 주소를 전부 받아냅니다.

```js
{ path: '/:pathMatch(.*)*', name: 'not-found', component: () => import('../views/NotFoundView.vue') }
```

- `pathMatch` : 파라미터 이름 (자유롭게 지어도 됨)
- `(.*)` : 아무 문자나 매칭하라는 정규식
- 맨 뒤의 `*` : `/`로 나뉜 여러 조각도 통째로 받겠다는 뜻 → `/a/b/c`도 여기로 옴

라우터는 배열을 **위에서부터 순서대로** 확인하므로 이 규칙은 반드시 맨 끝에 둬야 합니다.
위로 올리면 모든 주소가 여기서 먼저 잡혀 버립니다.

### 2. App.vue — 내비게이션 바와 메인 콘텐츠 영역

```html
<nav class="nav-bar">
  <RouterLink to="/">🌤 날씨 대시보드</RouterLink>
  <RouterLink to="/ranking">🏆 기온 순위</RouterLink>
  <RouterLink to="/about">ℹ 서비스 소개</RouterLink>
  <RouterLink :to="{ name: 'practice-archive', params: { day: 3 } }">📚 지난 과제</RouterLink>
</nav>

<main class="app-main">
  <RouterView v-slot="{ Component }">
    <Transition name="fade" mode="out-in">
      <component :is="Component" />
    </Transition>
  </RouterView>
</main>
```

- `RouterLink`는 최종적으로 `<a>`로 그려지지만 클릭을 가로채 **새로고침 없이** 화면만 바꿉니다.
  `<a href="/about">`로 쓰면 페이지 전체를 다시 내려받게 되므로 SPA의 장점이 사라집니다.
- 과제 3까지 App.vue가 들고 있던 `currentTab` 상태가 **완전히 사라졌습니다.**
  "지금 어떤 화면인가"를 이제 URL이 들고 있기 때문입니다.
- 현재 경로와 일치하는 링크에는 `router-link-active` / `router-link-exact-active` 클래스가
  자동으로 붙습니다. `to="/"`는 모든 경로의 접두사이므로 **exact** 쪽에 스타일을 줘야
  항상 켜져 있지 않습니다.

### 3. WeatherHomeView.vue — WeatherParent 대체

과제 3의 `WeatherParent.vue`를 `/` 경로에 맞게 옮긴 화면입니다. 달라진 점은 세 가지입니다.

**① 상세보기의 `window.alert()` 제거 → Programmatic Navigation**

```js
const handleClickDetail = (city) => {
  console.log(`🧭 [Programmatic Navigation] /weather/${city.id} 로 이동합니다.`)
  router.push(`/weather/${city.id}`)
}
```

`WeatherCard`가 올려보내는 `click-detail` 이벤트는 그대로입니다.
**받는 쪽의 처리만** alert에서 화면 이동으로 바뀌었습니다.
카드 컴포넌트는 자기가 무슨 일에 쓰이는지 몰라도 되는 상태 그대로입니다.

**② 도시 데이터를 `data/weatherMock.js`로 분리**

목록 화면과 상세 화면이 같은 데이터를 읽어야 하므로 컴포넌트 밖으로 뺐습니다.
실제 프로젝트라면 이 자리가 API 호출 계층이 됩니다.

**③ 검색어를 URL 쿼리 스트링에 동기화**

```js
watch(searchQuery, (newQuery) => {
  const trimmed = newQuery.trim()
  router.replace({ query: trimmed === '' ? {} : { q: trimmed } })
})
```

`/?q=서울` 상태를 그대로 링크로 공유하거나 새로고침해도 검색어가 유지됩니다.
`push`가 아니라 `replace`인 이유는, 글자를 칠 때마다 방문 기록이 쌓이면
뒤로 가기를 열 번 눌러야 이전 화면으로 돌아가기 때문입니다.

### 4. WeatherDetailView.vue — 동적 경로 매칭

```js
onMounted(() => {
  loadCity(route.params.cityId)   // Mount 시점에 Mock Data에서 도시 객체 선택
})
```

`/weather/city_01`로 들어오면 `route.params.cityId`가 `'city_01'`이 되고,
`findCityById()`로 Mock Data에서 도시 객체를 찾아 화면에 뿌립니다.

**놓치기 쉬운 부분:** 상세 화면에서 다른 도시의 상세 화면(`/weather/city_02`)으로 이동하면
Vue는 **같은 컴포넌트를 재사용**합니다. unmount → mount가 일어나지 않으므로
`onMounted`가 다시 실행되지 않고 화면이 그대로 멈춰 있게 됩니다.
그래서 파라미터 자체를 감시하는 `watch`를 함께 두었습니다.

```js
watch(() => route.params.cityId, (newCityId) => { loadCity(newCityId) })
```

`/weather/city_99`처럼 **경로 규칙에는 맞지만 데이터가 없는** 경우는
Catch-all이 아니라 이 화면 안에서 "해당 도시 정보를 찾을 수 없습니다" 안내로 처리합니다.
경로가 틀린 것과 데이터가 없는 것은 다른 상황이기 때문입니다.

### 5. WeatherAboutView.vue

상태도 props도 없는 정적 소개 페이지입니다. 이런 화면일수록 지연 로딩 효과가 큽니다.
하단의 "대시보드 홈으로 이동"은 `router.push`가 아니라 `RouterLink`를 썼습니다.
누르면 그냥 저기로 간다가 전부일 때는 선언적 이동이 맞습니다.

### 6. 추가 view 2종

**`/ranking` — WeatherRankingView.vue**

기온 순 / 공기 좋은 순 순위표입니다. 정렬 기준을 `ref`가 아니라 **URL 쿼리에 두었습니다.**

```js
const sortBy = computed(() => (route.query.by === 'pm10' ? 'pm10' : 'temp'))
```

`route.query`도 반응형이라 주소가 바뀌면 이 computed가 다시 계산됩니다.
행을 클릭하면 해당 도시의 상세 화면으로 `router.push` 합니다.

**`/practice/:day(\d+)` — PracticeArchiveView.vue**

과제 3까지 탭 버튼으로 갈아 끼우던 1~3일차 화면을 URL로 구분합니다.
`:day(\d+)`는 정규식 제약이라 숫자만 매칭됩니다.
`/practice/abc`는 이 규칙에 걸리지 않고 **Catch-all로 떨어져 404 화면**이 뜹니다.
`/practice/9`처럼 숫자지만 없는 과제는 컴포넌트 안에서 걸러 안내 문구를 보여 줍니다.

## 라우터 흐름 한눈에 보기

```
                URL 변경 (RouterLink 클릭 / router.push / 주소창 입력 / 뒤로 가기)
                                        │
                                        ▼
                        router/index.js 의 routes 배열을
                            위에서부터 순서대로 매칭
                                        │
        ┌───────────────┬───────────────┼───────────────┬────────────────┐
        ▼               ▼               ▼               ▼                ▼
       '/'          '/about'   '/weather/:cityId'   '/ranking'    매칭 실패한 전부
   HomeView       AboutView       DetailView       RankingView   → Catch-all 404
        │                               │
        │                        route.params.cityId
        │                               ▼
        └── router.push ──────▶  onMounted / watch 로
            ('/weather/'+id)        Mock Data 조회
                                        │
                                        ▼
                            App.vue 의 <RouterView /> 자리에 렌더링
```

## 과제 4 동작 확인 방법

1. `/` 접속 → 대시보드가 뜨고, 상단 내비게이션의 "날씨 대시보드"에만 밑줄이 있는지 확인
2. 카드의 `[상세보기]` 클릭 → **alert 없이** 주소가 `/weather/city_01`로 바뀌며 상세 화면 전환
3. 상세 화면에서 **이전/다음 도시** 링크 클릭 → 내용이 실제로 바뀌는지 확인
   (`watch`를 지우면 여기서 화면이 멈춘다. `onMounted`만으로는 부족한 이유)
4. 브라우저 **뒤로 가기** → 대시보드로 복귀, 앞으로 가기도 정상 동작
5. 검색창에 `서울` 입력 → 주소가 `/?q=서울`로 바뀌는지 확인 → **새로고침해도 검색어 유지**
6. 주소창에 `/kk` 직접 입력 → 404 화면 + "입력한 주소: /kk" 표시
7. 주소창에 `/weather/city_99` 입력 → 404가 아니라 "해당 도시 정보를 찾을 수 없습니다" 안내
8. 주소창에 `/practice/abc` 입력 → 정규식 제약에 걸려 **404 화면**
9. F12 → Network 탭을 열어 둔 채 `/about` 클릭 → `WeatherAboutView-*.js` 파일이
   **그때 처음** 다운로드되는지 확인 (지연 로딩 증거)
10. 페이지를 이동해도 브라우저가 **새로고침되지 않는지** 확인 (탭의 로딩 스피너가 돌지 않음)

---

# 과제 5 — 날씨 Store (Pinia)

## 과제 요구사항 구현 내용

### 1. stores/configStore.js — 날씨 단위 스토어

교재 표 그대로 `state` / `getters` / `actions`를 갖는 Options 스타일로 작성했습니다.

| 구분 | 이름 | 설명 |
| --- | --- | --- |
| state | `unit` | 단위를 저장하는 변수 (초기값 `celsius`) |
| getters | `unitSymbol` | 현재 단위에 맞는 기호 (`°C` / `°F`) |
| getters | `unitLabel` | 화면 표시용 문구 (`섭씨(°C)` / `화씨(°F)`) — **추가** |
| getters | `nextUnitLabel` | 버튼 툴팁용, 바꿀 대상 이름 — **추가** |
| actions | `toggleUnit` | `celsius` ↔ `fahrenheit` 토글 |
| actions | `setUnit(unit)` | 특정 단위로 지정 + localStorage 저장 — **추가** |

```js
export const useConfigStore = defineStore('config', {
  state: () => ({
    unit: localStorage.getItem('weather-unit') === 'fahrenheit' ? 'fahrenheit' : 'celsius',
  }),
  getters: {
    unitSymbol: (state) => (state.unit === 'celsius' ? '°C' : '°F'),
    unitLabel() {
      return this.unit === 'celsius' ? `섭씨(${this.unitSymbol})` : `화씨(${this.unitSymbol})`
    },
  },
  actions: {
    toggleUnit() {
      this.setUnit(this.unit === 'celsius' ? 'fahrenheit' : 'celsius')
    },
  },
})
```

**왜 스토어가 필요한가**: 단위 설정은 내비게이션 바(`App.vue`), 메인 카드(`WeatherCard`),
상세 화면(`WeatherDetailView`), 순위표(`WeatherRankingView`)가 모두 알아야 하는 값입니다.
props로 내리면 중간 컴포넌트들이 자기와 상관없는 값을 받아 넘기기만 해야 하고(props drilling),
애초에 `App.vue`와 `WeatherCard`는 부모-자식 관계도 아니라서 내려보낼 길이 없습니다.

`getters`에서 다른 getter를 참조할 때는 **화살표 함수를 쓰면 안 됩니다.**
화살표 함수는 자기 `this`가 없어 `this.unitSymbol`에 접근할 수 없습니다.

### 2. UnitToggler.vue와 Navigation Bar 배치

```html
<!-- UnitToggler.vue -->
<span class="unit-label">날씨단위: {{ configStore.unitLabel }}</span>
<button class="unit-btn" @click="configStore.toggleUnit()">단위변경</button>
```

```html
<!-- App.vue -->
<div class="nav-bar">
  <nav class="nav-links"> ... RouterLink 4개 ... </nav>
  <UnitToggler />
</div>
```

`UnitToggler.vue`에는 **props도 emits도 없습니다.** 3일차 방식이라면 부모가 `unit`을
props로 내려주고 자식이 `update-unit`을 emit해야 했지만, 스토어를 직접 꺼내 쓰므로
`App.vue`는 `<UnitToggler />`라고 자리만 내주면 됩니다.

### 3. 메인과 상세 날씨에 단위 적용

교재가 (참고)로 짚은 대로 **기온을 보여 주는 곳이 3군데**라 유사 코드가 실제로 중복됩니다.
그래서 변환 규칙을 `composables/useDisplayTemp.js` 하나로 모았습니다. 계산식은 교재 코드 그대로입니다.

```js
export const convertTemp = (rawTemp, unit) => {
  if (unit === 'fahrenheit') {
    return Math.round((rawTemp * 9) / 5 + 32)   // 화씨 변환 연산
  }
  return rawTemp                                 // 'celsius'일 때는 원본 그대로 반환
}

export const useDisplayTemp = (source) => {
  const configStore = useConfigStore()
  const displayTemp = computed(() => convertTemp(toValue(source), configStore.unit))
  const displayTempText = computed(() => `${displayTemp.value}${configStore.unitSymbol}`)
  return { displayTemp, displayTempText }
}
```

사용하는 쪽은 한 줄입니다.

```js
// WeatherCard.vue — 메인 카드
const { displayTempText } = useDisplayTemp(() => props.city.temp)
```

| 적용 위치 | 방식 |
| --- | --- |
| `WeatherCard.vue` (메인 카드) | `useDisplayTemp(() => props.city.temp)` |
| `WeatherDetailView.vue` (상세) | `useDisplayTemp(() => cityInfo.value?.temp)` |
| `WeatherRankingView.vue` (순위) | `convertTemp()` 직접 호출 (v-for 안이라 composable 불가) |
| `WeatherHomeView.vue` (요약 줄) | `convertTemp()` — 평균·최고 기온 |

**원본 데이터는 건드리지 않습니다.** `weatherMock.js`의 `temp`는 계속 섭씨 숫자이고,
변환은 화면에 그릴 때만 일어납니다. 그래서 `TempBadge`에는 변환값이 아니라 `city.temp`를
그대로 넘깁니다 — "25도 이상" 기준 자체가 섭씨 기준이라, 화씨 82를 넘기면 항상 '더움'이 됩니다.

### 4. 추가 스토어 — favoriteStore.js (즐겨찾기)

`configStore`는 교재 표에 맞춰 **Options 스타일**로 썼고, 추가 스토어는 같은 일을
**setup 스타일**로 써서 두 방식을 비교할 수 있게 했습니다.

| Options 스타일 | setup 스타일 |
| --- | --- |
| `state: () => ({ ... })` | `ref()` |
| `getters: { ... }` | `computed()` |
| `actions: { ... }` | 그냥 함수 |
| — | 마지막에 `return`으로 공개할 것을 직접 고름 |

```js
export const useFavoriteStore = defineStore('favorite', () => {
  const favoriteIds = ref(readSaved())
  const showOnlyFavorite = ref(false)

  const favoriteCount = computed(() => favoriteIds.value.length)
  const isFavorite = (cityId) => favoriteIds.value.includes(cityId)   // 인자를 받으므로 함수

  const toggleFavorite = (cityId) => { ... ; save() }

  return { favoriteIds, showOnlyFavorite, favoriteCount, isFavorite, toggleFavorite, ... }
})
```

- **인자를 받는 getter는 `computed`로 만들 수 없습니다.** `computed`는 값 하나를 캐싱하는
  것이라 도시마다 다른 답을 줄 수 없어서, `isFavorite`은 그냥 함수로 내보냈습니다.
- `return`에 넣지 않은 것(`save`)은 스토어 밖에서 접근할 수 없습니다. 내부 구현을 감추는 수단입니다.
- 두 스토어 모두 `localStorage`에 저장해서 **새로고침해도 설정이 유지**됩니다.

활용한 곳:

| 위치 | 하는 일 |
| --- | --- |
| `WeatherCard.vue` | 카드마다 ★/☆ 버튼 (`@click.stop`으로 카드 선택과 분리) |
| `WeatherDetailView.vue` | 상세 화면에서도 같은 즐겨찾기 토글 |
| `ViewOptions.vue` | "⭐ 즐겨찾기만 보기" 체크박스 + 개수 표시 |
| `WeatherHomeView.vue` | `visibleWeatherList`에서 즐겨찾기 필터 적용 |

`ViewOptions.vue`는 **한 파일 안에서 두 방식을 나란히** 볼 수 있게 두었습니다.
"25도 이상만 보기"는 props/emits(3일차 방식), "즐겨찾기만 보기"는 스토어 직결(5일차 방식)입니다.

```html
<!-- props로 받은 값은 자식이 못 고치므로 :checked + @change -->
<input type="checkbox" :checked="onlyHot" @change="handleHotChange" />

<!-- 스토어 state는 읽기 전용이 아니라서 v-model을 그대로 걸 수 있다 -->
<input type="checkbox" v-model="favoriteStore.showOnlyFavorite" />
```

## 데이터 흐름 비교

```
  [3일차 방식 — props / emits]         [5일차 방식 — Pinia]

      WeatherHomeView                      ┌──────────────┐
        │  ↑                               │ configStore  │  ← 컴포넌트 트리 밖
   props│  │emits                          │ favoriteStore│
        ↓  │                               └──────┬───────┘
      ViewOptions                       ┌────────┼────────┬─────────┐
        │  ↑     ← 중간 컴포넌트가       ↓        ↓        ↓         ↓
   props│  │emits    자기와 상관없는   App.vue  Weather  Detail   Ranking
        ↓  │         값을 넘겨야 함   (Toggler)  Card     View     View
      WeatherCard
```

## 과제 5 동작 확인 방법

1. 상단 **[단위변경]** 클릭 → 메인 카드의 기온이 `28°C` → `82°F`로 바뀌는지 확인
2. 같은 클릭 한 번에 **요약 줄(평균 기온)** 까지 함께 바뀌는지 확인
3. 카드의 `[상세보기]` → 상세 화면의 "실시간 기온"도 화씨인지 확인 (요구사항 3)
4. 🏆 기온 순위 화면의 기온도 함께 바뀌는지 확인
5. 화씨 상태에서 **새로고침** → 설정이 유지되는지 확인 (localStorage)
6. 화씨(82°F)인데도 🔥 **더움 배지가 그대로**인지 확인 (판정 기준은 섭씨 원본)
7. 카드의 ☆ 클릭 → ★로 바뀌고, **상태바는 그대로**인지 확인 (`.stop`)
8. 즐겨찾기한 도시의 상세 화면 → **★ 즐겨찾기 해제**로 표시되는지 확인 (스토어 공유)
9. "⭐ 즐겨찾기만 보기" 체크 → 목록이 즐겨찾기한 도시만 남는지 확인
10. 📚 지난 과제(`/practice/3`) → **과제 3 화면의 카드에도** 단위가 적용되는지 확인
    (같은 `WeatherCard`를 쓰므로 스토어가 전역이라는 증거)

---

# 과제 6 — 날씨 Axios

## 준비

1. `npm install axios`
2. [openweathermap.org](https://openweathermap.org/api) 가입 후 My API keys에서 키 발급
3. `.env` 파일에 키를 넣고 dev 서버 재시작

```
VITE_OPENWEATHER_API_KEY=발급받은_키
```

Vite는 `VITE_`로 시작하는 변수만 클라이언트 코드에 넘겨줍니다.
`.env`는 `.gitignore`에 넣었고, 대신 `.env.example`을 커밋했습니다.
발급 직후에는 키가 활성화되기까지 시간이 걸려 401이 날 수 있습니다.

## 1. 실제 날씨 데이터 적용

호출 코드는 `services/weatherApi.js`에 모았습니다. 컴포넌트에서 axios를 직접 부르지 않습니다.

```js
const owm = axios.create({
  baseURL: 'https://api.openweathermap.org',
  timeout: 8000,
  params: { appid: API_KEY, units: 'metric', lang: 'kr' },
})
```

인스턴스로 만들어 두면 매번 키와 단위를 적지 않아도 됩니다.
`units: 'metric'`으로 섭씨를 받고, 화씨 변환은 과제 5의 `configStore`가 화면에서 처리합니다.

응답 인터셉터에서 상태 코드별 메시지를 미리 만들어 둡니다.
컴포넌트는 `error.message`만 그대로 화면에 쓰면 됩니다.

```js
owm.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status
    if (status === 401) return Promise.reject(new Error('API Key가 올바르지 않습니다...'))
    if (status === 429) return Promise.reject(new Error('무료 호출 한도를 넘었습니다...'))
    ...
  },
)
```

받아온 응답은 기존 도시 객체 모양으로 맞춰서 돌려줍니다.
이렇게 하면 카드나 상세 화면의 템플릿을 고치지 않아도 됩니다.

| 화면에서 쓰던 키 | OpenWeatherMap 응답 |
| --- | --- |
| `temp` | `main.temp` |
| `status` | `weather[0].description` (`lang=kr`이라 한글) |
| `humidity` | `main.humidity` |
| `wind` | `wind.speed` |
| `pm10` | air_pollution의 `components.pm10` |
| `rainProb` | forecast의 `list[0].pop` × 100 |

`id` `name` `region` `lat` `lon`은 API가 주지 않으므로 `data/weatherMock.js`에서 계속 관리합니다.
이 파일의 기온·습도 값은 이제 API 실패 시 쓰는 폴백 역할입니다.

## 2. 추가 엔드포인트로 기능 확장

도시 하나마다 세 곳을 부릅니다. 순서대로 기다리면 느려지므로 병렬로 보냅니다.

```js
const [current, air, forecast] = await Promise.allSettled([
  fetchCurrent(lat, lon),
  fetchAirPollution(lat, lon),
  fetchForecast(lat, lon),
])
```

`Promise.all`이 아니라 `allSettled`를 쓴 이유는, 대기오염이나 예보가 실패해도
현재 날씨만 있으면 카드를 그릴 수 있기 때문입니다. 현재 날씨가 실패했을 때만 에러로 처리합니다.

| 엔드포인트 | 쓰는 곳 |
| --- | --- |
| `/data/2.5/weather` | 카드와 상세의 기온·습도·풍속·체감온도·날씨 아이콘 |
| `/data/2.5/air_pollution` | 미세먼지(pm10) 실제 값, 초미세먼지(pm2.5) 항목 추가 |
| `/data/2.5/forecast` | 상세 화면의 24시간 예보, 목록의 강수확률 |

도시 6곳 × 3회 = 18회를 한 번에 부르므로, 화면을 옮길 때마다 다시 부르지 않도록
응답을 `stores/weatherStore.js`에 담아 둡니다.
목록에서 받아 둔 예보를 상세 화면이 그대로 꺼내 쓰기 때문에 상세 진입 시 추가 호출이 없습니다.
무료 요금제는 분당 60회 제한이라 새로고침을 연달아 누르면 429가 납니다.

## 3. 다른 제공자 API 추가

`services/openMeteoApi.js` — Open-Meteo에서 자외선 지수와 일출/일몰 시각을 받아
상세 화면 아래쪽에 표시합니다. 이쪽은 비상업용이면 키가 필요 없어서,
OpenWeatherMap 키 발급 전에도 실제 호출을 확인할 수 있습니다.

```js
const { data } = await openMeteo.get('/forecast', {
  params: { latitude: lat, longitude: lon, daily: 'uv_index_max,sunrise,sunset', ... },
})
```

이 호출은 상세 화면에서만 쓰고 다른 화면과 공유하지 않으므로 스토어에 올리지 않고
컴포넌트의 `ref`에 담았습니다. 실패해도 그 패널에만 안내가 뜨고 나머지 화면은 그대로입니다.

## 로딩과 실패 처리

`RefreshBar.vue`가 상단에서 현재 상태를 보여 줍니다.

- 불러오는 중 — 파란 글씨
- 샘플 데이터 표시 중 — 주황 글씨 (키가 없거나 호출 실패)
- OpenWeatherMap 실시간 · 시각 — 초록 글씨

호출이 실패해도 화면을 비우지 않고 폴백 데이터를 그대로 둔 채 안내만 띄웁니다.
날씨 앱에서 화면이 텅 비는 것보다 "지난 값이지만 뭔가 보이는" 쪽이 낫다고 봤습니다.

## 과제 6 동작 확인 방법

1. `.env` 없이 실행 → "샘플 데이터 표시 중"이 뜨고 화면은 정상 동작
2. 키를 넣고 재시작 → 기온·날씨 설명이 실제 값으로 바뀌는지 확인
3. 날씨 설명이 한글인지 확인 (`lang=kr`)
4. F12 → Network에서 `weather`, `air_pollution`, `forecast` 요청이 병렬로 나가는지 확인
5. 상세 화면 진입 → 예보 요청이 **추가로 나가지 않는지** 확인 (스토어 재사용)
6. 상세 화면에 `open-meteo.com` 요청이 하나 더 나가는지 확인
7. `[단위변경]` → API로 받은 값도 화씨로 바뀌는지 확인 (과제 5와 연결)
8. `.env`에 일부러 틀린 키를 넣고 실행 → 401 안내 문구가 뜨는지 확인
9. 새로고침을 연달아 여러 번 → 429 안내 문구 확인
10. 미세먼지 배지 등급이 실제 수치에 맞게 바뀌는지 확인

---

# 과제 7 — 날씨 UI Library (Element Plus)

## UI Library 선정

Element Plus를 골랐습니다. 교재 239~248쪽이 전부 Element Plus 컴포넌트 카탈로그이고,
강조 표시된 `el-card` · `el-input` · `el-switch` · `el-progress` · `ElMessage` · `ElMessageBox`를
실제로 쓸 수 있어서입니다.

```js
import ElementPlus from 'element-plus'
import ko from 'element-plus/es/locale/lang/ko'
import 'element-plus/dist/index.css'
import 'element-plus/theme-chalk/dark/css-vars.css'

document.documentElement.classList.add('dark')
app.use(ElementPlus, { locale: ko })
```

다크 모드는 `html`에 `dark` 클래스가 있을 때만 적용되는 CSS 변수 파일을 따로 불러옵니다.
이 앱은 다크 고정이라 `main.js`에서 클래스를 한 번 붙였습니다.

## 컨셉 — 러닝 웨더 (다크 스포츠)

처음에는 라이브러리만 갈아 끼우고 기존 레이아웃을 그대로 뒀는데, 화면이 정돈되지 않았습니다.
원인은 라이브러리가 아니라 구조였습니다.

| 문제 | 개선 |
| --- | --- |
| 흰 셸 → 회색 패널 → 흰 카드 3중 중첩 | 중첩을 없애고 섹션 라벨 + 카드 한 겹으로 |
| 도시명·기온·습도·점수가 전부 같은 크기 | 기온과 러닝 점수만 크게, 나머지는 작은 줄로 |
| 제목마다 이모지 (🌤🔍⚙📊) | 대문자 라벨과 형광 점 하나로 대체 |
| 배지 3종이 제각각 | `el-tag` 하나로 통일 |
| 받아온 날씨 아이콘 미사용 | 카드·상세·예보에 표시 |

색은 검정 배경(`#0a0e14`)에 라임 형광(`#c6f432`)을 액센트로 씁니다.
`assets/main.css`에서 자체 토큰과 Element Plus 변수(`--el-color-primary` 등)를 함께 정의해서,
라이브러리 컴포넌트와 직접 만든 부분의 색이 어긋나지 않게 했습니다.

```css
html.dark {
  --el-color-primary: #c6f432;
  --el-bg-color: var(--surface);
  --el-text-color-primary: var(--text);
}
```

## 컴포넌트 교체 내역

| 컴포넌트 | 이전 | Element Plus |
| --- | --- | --- |
| `SearchBar` | `<input>` | `el-input` (prefix-icon, clearable) |
| `ViewOptions` | `<select>`, `checkbox` | `el-select`, `el-checkbox` |
| `UnitToggler` | 버튼 | **`el-switch`** (교재 강조) |
| `TempBadge` / `DustBadge` | 직접 만든 배지 | `el-tag` |
| `WeatherCard` | `<button>` | `el-button` (circle, text) |
| `RefreshBar` | 텍스트 + 버튼 | `el-tag` + `el-button` + **`ElMessage`** |
| `BaseDashboardCard` | 직접 만든 패널 | **`el-card`** (slot 구조는 3일차 그대로) |
| `RunningIndexView` | — | `el-progress`, `el-select`, `el-alert`, `el-skeleton`, **`ElMessageBox`** |
| Watcher 패널 | 항상 노출 | `el-collapse`로 접어 둠 |

`BaseDashboardCard`는 바깥 틀만 `el-card`로 바꾸고 `<slot>` 구조는 3일차 그대로 뒀습니다.
슬롯 학습 결과물을 유지하면서 라이브러리도 쓰는 절충입니다.

`SearchBar`는 `el-input`으로 바꾸면서도 **`v-model`을 쓰지 않았습니다.**
1일차부터 처리해 온 한글 IME 조합을 직접 다뤄야 하기 때문입니다.

```html
<el-input
  :model-value="query"
  @input="handleInput"
  @compositionstart="handleCompositionStart"
  @compositionend="handleCompositionEnd"
/>
```

주의할 점이 하나 있습니다. 기본 HTML 요소는 이벤트 객체를 넘기지만 Element Plus는 **값 자체**를 넘깁니다.

```js
// <select>: e.target.value
// el-select: 값이 바로 온다
const handleSortChange = (value) => emit('update-sort', value)
```

## 러닝 지수

`composables/useRunningIndex.js`가 계산합니다. 100점에서 항목별로 깎습니다.

| 항목 | 감점 없는 구간 | 근거 |
| --- | --- | --- |
| 기온 | 10~18°C | 지구력 운동에 유리한 구간이라는 통설 |
| 습도 | 40~60% | 땀 증발이 원활한 범위 |
| 미세먼지 | ~30㎍/㎥ | 환경부 등급 경계 (30/80/150) |
| 바람 | ~3m/s | 그 이상은 저항으로 작용 |
| 강수확률 | ~20% | |
| 자외선 | ~5 | Open-Meteo 값이 있을 때만 |

감점 방식을 고른 이유는 **무엇 때문에 몇 점이 깎였는지 화면에 그대로 보여 주기 위해서**입니다.
가중치를 곱해 합산하면 점수는 나오지만 "왜 이 점수인지"를 설명할 수 없습니다.

실제 값으로 검산한 결과입니다.

```
이상적(15도/50%/청정)     100점 최고
가을 청명(18도/45%/UV4)   100점 최고
한파(-8도/바람8)           58점 보통   기온-33 바람-9
미세먼지 최악(180)          44점 나쁨   미세먼지-56
한여름 폭염(35도/80%)       34점 위험   기온-50 습도-10
```

**의학적 기준이 아니라 이 앱에서 정한 배점**이라는 안내를 `el-alert`로 화면에 넣었습니다.

화면 구성:

| 영역 | 쓰인 컴포넌트 |
| --- | --- |
| 도시 선택 | `el-select` (선택값을 `?city=` 쿼리에 동기화) |
| 점수 게이지 | `el-progress` (점수대별 색상) |
| 감점 내역 | 목록 + `el-tag` |
| 시간대별 그래프 | `LineChart.vue` (Chart.js 직접 래핑) |
| 로딩 | `el-skeleton` |
| 즐겨찾기 비우기 | `ElMessageBox.confirm` |

Element Plus에는 차트가 없어서 Chart.js를 직접 감쌌습니다.
`onBeforeUnmount`에서 `destroy()`를 호출하지 않으면 캔버스가 남습니다.

## 배포 준비

`vercel.json`에 SPA rewrite를 넣어 뒀습니다. 이게 없으면 `/running`으로 직접 접속했을 때
서버가 그 경로의 파일을 찾다가 404를 냅니다 (과제 4 노트 Q30의 history 모드 문제).

```json
{ "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }] }
```

배포 시 Vercel 프로젝트 설정에 `VITE_OPENWEATHER_API_KEY`를 환경변수로 등록해야 합니다.

## 과제 7 동작 확인 방법

1. 대시보드 상단 히어로에 러닝 점수가 가장 높은 도시가 뜨는지 확인
2. 카드를 클릭하면 히어로가 그 도시로 바뀌는지 확인
3. 상단 스위치로 °C ↔ °F 전환 (`el-switch`)
4. 새로고침 버튼 → 성공/실패 토스트가 뜨는지 확인 (`ElMessage`)
5. 러닝 화면에서 도시 변경 → 주소가 `?city=`로 바뀌는지 확인
6. 러닝 화면 하단 "즐겨찾기 비우기" → 확인 창이 뜨는지 (`ElMessageBox`)
7. 검색창에 `서울`을 한 글자씩 입력 → **한글이 깨지지 않는지** 확인
8. 정렬 드롭다운·체크박스 동작 확인 (이벤트 객체 → 값 변경분)
9. 대시보드 맨 아래 Watcher 모니터링을 펼쳐 2일차 로그가 쌓이는지 확인
10. 상세 화면에서 예보 스트립과 일출/일몰·자외선이 뜨는지 확인

---

# 과제 7 보강 — 규모와 마감

다른 조 결과물을 보고 부족했던 부분을 채웠습니다. 컨셉(러닝 지수)은 그대로 두고
**밀도와 마감**을 올리는 쪽으로 잡았습니다.

## 1. 지역 6개 → 30개

`data/cities.js`에 전국 30개 지역(수도권 8 · 강원 4 · 충청 5 · 전라 5 · 경상 6 · 제주 1)을 넣고
권역 필터를 추가했습니다. 목록이 길어지면서 검색·정렬·순위 기능이 비로소 의미가 생겼습니다.

여기서 호출 수 문제가 생깁니다. 30개 × 3개 엔드포인트 = **90회**로 무료 한도(분당 60회)를 넘습니다.
그래서 데이터 출처를 둘로 나눴습니다.

| 용도 | API | 호출 수 |
| --- | --- | --- |
| 목록 30개 | Open-Meteo (좌표를 콤마로 이어 붙여 배치 조회) | **2회** |
| 지역 하나 상세 | OpenWeatherMap (현재·예보·대기오염) | 3회 |

```js
// 좌표를 이어 붙이면 지점별 결과가 배열로 온다
const latitude = cityList.map((city) => city.lat).join(',')
const longitude = cityList.map((city) => city.lon).join(',')
```

Open-Meteo는 설명 문구를 주지 않고 WMO 코드만 주기 때문에, 코드 → 한글 설명 표를 직접 만들었습니다.
상세 화면에 들어갈 때만 그 지역을 OpenWeatherMap으로 다시 받아 예보·대기오염까지 채웁니다.
한 번 받은 지역은 `detailLoaded`에 표시해 두고 다시 부르지 않습니다.

## 2. 라이트 / 다크 테마

기본은 라이트(화이트-블루), 헤더 버튼으로 다크로 전환합니다. 선택은 localStorage에 남습니다.

```css
:root        { --bg: #eef4fb; --surface: #fff;    --accent: #0a84ff; }
html.dark    { --bg: #0a0e14; --surface: #141a22; --accent: #35a0ff; }
```

토큰 이름을 같게 두고 값만 덮어쓰기 때문에, 컴포넌트 CSS는 한 벌만 있으면 됩니다.
Element Plus 변수(`--el-*`)도 같은 블록에서 함께 지정합니다.

주의할 점이 두 가지 있었습니다.

- **Chart.js는 CSS 변수를 못 읽습니다.** 캔버스에 직접 그리기 때문입니다.
  그래서 `LineChart.vue`가 `configStore.isDark`를 보고 실제 색값을 계산하고,
  테마가 바뀌면 `destroy()` 후 다시 그립니다.
- `el-progress`의 `color`도 같은 이유로 CSS 변수 대신 색값을 넘깁니다.

## 3. 내 위치 (Geolocation)

```js
navigator.geolocation.getCurrentPosition(
  async (position) => { ... },
  (error) => {
    locationError.value =
      error.code === error.PERMISSION_DENIED
        ? '위치 권한이 거부되었습니다...'
        : '현재 위치를 가져오지 못했습니다.'
  },
)
```

권한을 거부해도 앱은 그대로 동작하고 안내만 남습니다.
받아온 좌표는 `my_location`이라는 가상 지역 id로 스토어에 담아, 기존 상세 화면을 그대로 재사용합니다.

## 4. 일별 예보 (추가 호출 없음)

5일 예보는 **이미 받아 둔 3시간 예보를 날짜별로 묶어** 만듭니다.

```js
const toDailyItems = (forecast) => {
  const byDate = {}
  forecast.list.forEach((item) => {
    const date = item.dt_txt.slice(0, 10)
    ...
  })
  return Object.values(byDate).map((day) => ({
    min: Math.round(Math.min(...day.temps)),
    max: Math.round(Math.max(...day.temps)),
    rainProb: Math.round(Math.max(...day.pops) * 100),
  }))
}
```

`/week` 화면이 이 값으로 날짜별 러닝 점수를 매기고 가장 좋은 날을 표시합니다.
다만 일별 예보에는 습도·바람이 없어 현재 값을 대신 쓰므로, 그 한계를 화면에 적어 두었습니다.

## 5. 레이아웃과 타이포

- **Pretendard** 웹폰트 적용 (CDN)
- 대시보드를 `1.7fr / 1fr` 2단으로 나눠 왼쪽은 요약, 오른쪽은 내 위치·데이터 상태
- 지역 카드는 `repeat(auto-fill, minmax(230px, 1fr))` 그리드라 화면 폭에 따라 2~4열로 접힘
- 숫자에 `font-variant-numeric: tabular-nums`를 걸어 값이 바뀔 때 자릿수가 흔들리지 않게 함

---

# 러닝 지도와 실습 기록

## 전국 러닝 지도 (SVG)

대시보드의 주인공입니다. 처음에는 Leaflet + OpenStreetMap 타일로 만들었는데
중국과 일본이 크게 잡혀 남한이 작게 보였습니다. 타일 지도를 걷어내고 **남한만 직접 그렸습니다.**

- 통계청(kostat) 시도 경계 GeoJSON을 SVG path로 변환해 **42KB로 내장**. 외부 요청이 없습니다.
- 위경도 → SVG 좌표 투영식을 경계와 마커가 **함께 씁니다**. 경도에 `cos(36°)` 보정을 줘서
  한국 형태가 자연스럽게 나옵니다.
- 경도 130도 밖(울릉도·독도)은 제외했습니다. 넣으면 투영 범위가 동쪽으로 늘어나 본토가 작아집니다.

### 입체로 보이게 한 방법

3D 라이브러리를 쓰지 않고 SVG만으로 처리했습니다.

**① 비스듬히 내려다보는 각도** — 세로를 `scale(1, 0.62)`로 눌렀습니다.
CSS `rotateX`는 원근이 섞여 마커 위치가 어긋나는데, SVG `scale`은 좌표계가 그대로라
마커도 같은 식(`y * 0.62`)으로 계산하면 정확히 맞습니다.

**② 지도의 두께** — 같은 경계를 아래로 26px 내려 어둡게 한 번 더 그립니다.
그 위에 밝은 면을 얹으면 옆면이 있는 것처럼 보입니다.

**③ 점수만큼 솟는 기둥** — 지역을 점이 아니라 막대로 표시합니다.
오른쪽에 어두운 면을 덧대 원기둥처럼 보이게 하고, 바닥에는 타원 그림자를 깝니다.
색만 쓸 때보다 **높낮이가 먼저 읽혀서** 어디가 뛰기 좋은지 한눈에 들어옵니다.

```
북쪽부터 그려야 남쪽 기둥이 북쪽 기둥을 가린다 → 자연스러운 원근
이름은 고르거나 마우스를 올렸을 때만 → 30개를 다 쓰면 수도권이 겹쳐 못 읽는다
```

### 화면 전반의 입체감

그림자를 세 겹으로 쌓았습니다. 가까운 것은 진하고 좁게, 먼 것은 옅고 넓게 깔아야
카드가 실제로 떠 있는 것처럼 보입니다.

```css
--shadow:
  0 1px 2px  rgba(18, 48, 88, 0.05),
  0 4px 10px rgba(18, 48, 88, 0.06),
  0 16px 34px rgba(18, 48, 88, 0.07);
--edge: inset 0 1px 0 rgba(255, 255, 255, 0.9);   /* 윗면이 빛을 받는 느낌 */
```

카드에 마우스를 올리면 `translateY(-3px)`와 함께 그림자가 깊어지고,
누르면 다시 내려앉습니다.

## 실습 기록 (`/lab`)과 트러블슈팅 (`/troubleshooting`)

`data/practiceLog.js` 한 곳에 기록을 두고 두 화면이 함께 읽습니다.

- **실습 기록** — 일차별로 무엇을 구현했는지, 어떤 문법을 썼는지
- **트러블슈팅** — 실제로 막혔던 12건. 해결 방법만 적지 않고 **왜 그런 일이 생겼는지**를 함께 남겼습니다.
  태그(API · 반응형 · 라우터 · 스토어 · UI · 스타일 · 의존성 · 보안)로 걸러 볼 수 있습니다.

기록된 항목 예시입니다.

| 일차 | 문제 | 원인 |
| --- | --- | --- |
| 1 | 한글 입력 시 글자가 깨짐 | IME 조합 중인 값을 상태에 넣어 조합 버퍼가 끊김 |
| 3 | scoped 스타일이 slot에 안 먹음 | 슬롯 내용은 부모 스코프에서 컴파일됨 |
| 4 | 상세→상세 이동 시 내용 그대로 | 같은 경로 규칙이면 컴포넌트를 재사용해 onMounted 미실행 |
| 6 | 실제 키를 `.env.example`에 넣음 | 커밋되는 파일과 아닌 파일을 혼동 |
| 7 | 30개 지역 확대 후 429 | 30 × 3콜 = 90회로 분당 60회 한도 초과 |
| 7 | 다크 모드에서 차트 색만 그대로 | Chart.js는 캔버스라 CSS 변수를 못 읽음 |

## 커밋 기록

작업을 논리 단위로 나눠 커밋했습니다.

```
chore: Vue 3 + Vite 프로젝트 설정
feat: 1~2일차 실습 (Mockup / Composition)
feat: 3일차 실습 (Component 분리)
feat: 4일차 실습 (Vue Router)
feat: 5일차 실습 (Pinia)
feat: 6일차 실습 (Axios API 연동)
feat: 7일차 실습 (Element Plus + 러닝 지수 컨셉)
docs: README와 개념 정리 노트
feat: 전국 러닝 지도 (Leaflet)
feat: 실습 아카이브와 트러블슈팅 페이지
```

---

# 배경 씬 — 지금 날씨가 화면에 보이게

화면 뒤에 지금 시각·날씨·계절에 맞춘 장면을 깔았습니다. 3D 라이브러리 없이 SVG 도형과
CSS 애니메이션만 씁니다. 기준이 되는 지역은 **내 위치를 연결했으면 그곳**, 아니면 목록 첫 지역입니다.

## 무엇으로 장면을 정하나

| 축 | 값 | 화면에 나타나는 것 |
| --- | --- | --- |
| 시각 | 새벽 / 낮 / 저녁 / 밤 | 하늘 그라데이션, 해와 달, 별 |
| 날씨 | 맑음 / 구름 / 비 / 눈 / 뇌우 | 구름, 빗줄기, 눈송이, 하늘 채도 |
| 계절 | 봄 / 여름 / 가을 / 겨울 | 나무와 언덕 색 (연두 · 진초록 · 주황 · 흰) |

배경 실루엣은 두 종류입니다. **밤이거나 비가 오면 도시**(창문에 불이 켜진 빌딩),
그밖에는 **언덕과 나무**를 그립니다. 비 오는 밤의 도시가 이 앱에서 가장 자주 보게 되는 장면입니다.

날씨 판별은 Open-Meteo의 WMO 코드를 씁니다. OpenWeatherMap으로 받은 지역은 코드가 없어서
한글 설명 문구로 대신 판단합니다.

```js
if (code >= 95) return 'storm'
if (code >= 71 && code <= 77) return 'snow'
if ((code >= 51 && code <= 67) || (code >= 80 && code <= 82)) return 'rain'
```

## 달리는 러너

배경 아래쪽을 러너 실루엣이 가로질러 갑니다. 머리·몸통·팔·다리를 따로 두고
팔다리만 번갈아 회전시켜 달리는 동작을 만들었습니다.

```css
.arm-front { animation: swingA 0.52s ease-in-out infinite alternate; }
.arm-back  { animation: swingB 0.52s ease-in-out infinite alternate; }
```

카드 뒤로 들어갔다 나오는데, 배경이 콘텐츠보다 뒤에 있으니 자연스러운 깊이가 생깁니다.

## 콘텐츠를 방해하지 않게

배경이 강하면 정보가 읽히지 않습니다. 세 가지로 눌렀습니다.

- 씬 전체를 `opacity: 0.5`로 낮춤
- 실루엣은 화면 아래 38vh만 사용
- 맨 위에 배경색 그라데이션 덮개(veil)를 한 장 깔아 위로 갈수록 배경을 지움

여기서 한 번 걸렸습니다. **빗줄기를 덮개보다 먼저 그려서 화면에 보이지 않았습니다.**
비·눈·러너를 덮개 뒤로 옮기고, 대신 덮개를 거치지 않으니 진해져서 `opacity`로 다시 낮췄습니다.

`prefers-reduced-motion`을 켠 환경에서는 모든 애니메이션이 멈춥니다.
