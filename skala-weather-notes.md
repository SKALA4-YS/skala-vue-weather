# 날씨 과제 - 개념 정리 노트

과제 코드를 설명할 수 있게 정리한 개인 학습 메모.
- 1일차: 날씨 Mockup (v-for / v-if / 폼 바인딩 / 이벤트 수식어)
- 2일차: 날씨 Composition (computed / watch / watchEffect)
- 3일차: 날씨 Component (props / emits / slot / scoped style)
- 4일차: 날씨 Router (routes / 지연 로딩 / 동적 경로 매칭 / Catch-all)
- 5일차: 날씨 Store (Pinia state / getters / actions / composable)
- 6일차: 날씨 Axios (axios 인스턴스 / 인터셉터 / 비동기 상태 / 외부 API)
- 7일차: 날씨 UI Library (Element Plus / 다크 테마 / 러닝 지수 컨셉)

---

## 프로젝트 한눈에 보기

| 파일 | 역할 |
| --- | --- |
| `App.vue` | 내비게이션 바(RouterLink) + RouterView + UnitToggler. 화면 전환 상태 없음 |
| `stores/configStore.js` | 과제 5. 날씨 단위 스토어 (Options 스타일) |
| `stores/favoriteStore.js` | 과제 5 추가 스토어. 즐겨찾기 도시 (setup 스타일) |
| `composables/useDisplayTemp.js` | 과제 5. 섭씨→화씨 변환 로직 재사용 (3곳 공용) |
| `services/weatherApi.js` | 과제 6. OpenWeatherMap 호출과 응답 변환 |
| `services/openMeteoApi.js` | 과제 6·7. Open-Meteo (30개 지역 배치 조회, 자외선·일출/일몰) |
| `data/cities.js` | 전국 30개 지역 좌표와 권역 |
| `views/WeekPlanView.vue` | 주간 계획 (5일 예보 기반) |
| `stores/weatherStore.js` | 과제 6. API 응답 보관 + 로딩/에러 상태 |
| `composables/useRunningIndex.js` | 과제 7. 러닝 지수 계산 (감점 방식) |
| `views/RunningIndexView.vue` | 과제 7. `/running` 러닝 지수 화면 |
| `components/exercise/UnitToggler.vue` | 과제 5. 단위 변경 UI. props·emits 없이 스토어 직결 |
| `router/index.js` | 과제 4. 라우트 규칙(routes 배열), 지연 로딩, Catch-all |
| `data/weatherMock.js` | 과제 4. 도시 코드 기반 Mock Data + `findCityById()` |
| `views/WeatherHomeView.vue` | 과제 4. `/` 메인 대시보드 (WeatherParent 대체) |
| `views/WeatherDetailView.vue` | 과제 4. `/weather/:cityId` 상세 관측 정보 |
| `views/WeatherAboutView.vue` | 과제 4. `/about` 정적 소개 페이지 |
| `views/NotFoundView.vue` | 과제 4. Catch-all이 잡아낸 잘못된 주소 안내 |
| `views/WeatherRankingView.vue` | 과제 4 추가 view. `/ranking` 순위표 (정렬 기준을 URL 쿼리에 보관) |
| `views/PracticeArchiveView.vue` | 과제 4 추가 view. `/practice/:day` 1~3일차 과제 보관함 |
| `views/Assignment1.vue` | 과제 1. 날씨 데이터 보관, 검색·필터·정렬 로직, 레이아웃, 상태바 |
| `views/Assignment2.vue` | 과제 2. 같은 화면을 computed·watch·watchEffect로 재구성 |
| `views/WeatherParent.vue` | 과제 3. 모든 반응형 데이터를 들고 자식들을 조립하는 부모 |
| `components/WeatherCard.vue` | 도시 한 곳의 카드. `city` 객체를 props로 받음 (과제 1·2용) |
| `components/DustBadge.vue` | 미세먼지 농도(`pm10`)만 받아 등급·색상 결정 (전 과제 공용) |
| `components/exercise/` | 실습용 부품 컴포넌트 8종 (아래 3일차 표 참고). 과제 3·4가 함께 씀 |
| `src/main.js` | 앱 진입점 + 라우터 전역 주입(`.use(router)`) + 공통 CSS 등록 |
| `src/assets/main.css` | 전역 공통 스타일 |

---

# 과제 1 (1일차) — Mockup

## 요구사항 대응표

| 요구사항 | 구현 위치 |
| --- | --- |
| 1. `v-for` + `:key="city.id"` | `Assignment1.vue` 템플릿 |
| 2. `v-if` / `v-else` 온도 라벨 | `WeatherCard.vue` |
| 3. `:value` + `@input` + 한글 처리 | `Assignment1.vue` 스크립트·템플릿 |
| 4. 카드 클릭 상태바 / `.stop` alert | `Assignment1.vue` + `WeatherCard.vue` |
| 5. 데이터 추가 + Mockup 3종 | 전체 |

---

# 개념 설명 (1일차)

## Q1. `:key`에 왜 인덱스 말고 `id`를 썼나?

Vue는 목록이 바뀌면 이전 노드와 새 노드를 `:key`로 짝지어서 "재사용할지 새로 만들지"를 판단한다.

인덱스를 키로 쓰면 키가 **위치**를 뜻하게 된다. 이 프로젝트에는 정렬 기능이 있어서 순서가 실제로 바뀐다.
서울이 0번에서 2번으로 이동하면 Vue는 "0번 키는 그대로 있네"라고 보고
서울 자리에 있던 DOM을 부산에 재사용해 버린다.

텍스트만 있으면 티가 안 나지만, 카드 안에 input이나 체크박스가 있으면
입력값이 엉뚱한 도시에 남아 있는 버그가 생긴다.

`id`는 데이터에 붙은 고유값이라 도시가 어디로 이동하든 따라다닌다.
그래서 Vue가 "서울 노드가 2번 위치로 옮겨갔구나"를 정확히 알 수 있다.

## Q2. `:value` + `@input`은 결국 뭔가?

```
데이터 → 화면 :  :value="keyword"      (v-bind)
화면 → 데이터 :  @input="handleInput"   (v-on)
```

이 둘을 합친 축약형이 `v-model`이다. (교안 p.106)
이번 과제는 그 축약을 풀어서 직접 구현한 것.

## Q3. 한글은 왜 따로 처리해야 하나? ★ 핵심

**영어는 왜 문제가 없나?**
`a`를 누르면 그 순간 `input` 이벤트가 완성된 값 `"a"`와 함께 발생한다.
상태에 넣고 `:value`로 되돌려줘도 값이 같으니 아무 일도 일어나지 않는다.

**한글은?**
자음·모음을 조합해서 한 글자를 만든다. "서울"을 칠 때 브라우저 내부에는 이런 중간 상태가 지나간다.

```
ㅅ → 서 → 성 → 서우 → 서울
```

이걸 **IME 조합(composition)** 이라 하고, 조합이 진행되는 동안 브라우저는
그 글자를 "아직 확정되지 않은 버퍼"로 들고 있다. 이때 `input` 이벤트는 미완성 값까지 전부 발생시킨다.

**무엇이 깨지나?**
미완성 값을 `keyword`에 넣으면 `:value` 바인딩이 다시 input에 값을 써넣으려 한다.
브라우저 입장에서는 조합 중인 버퍼를 외부에서 건드린 것이라 조합이 끊기고,
글자가 중복되거나 순서가 뒤집힌다. ("서울" → "서우ㄹ", "서서울" 같은 증상)

**해결 코드**

```js
const handleInput = (e) => {
  if (isComposing.value) return   // 조합 중에는 손대지 않는다
  keyword.value = e.target.value
}

const handleCompositionStart = () => {
  isComposing.value = true
}

const handleCompositionEnd = (e) => {
  isComposing.value = false
  keyword.value = e.target.value  // 확정된 글자만 반영
}
```

`compositionstart` / `compositionend`는 브라우저 표준 이벤트다.
조합이 시작되면 플래그를 켜고, 그동안 들어오는 `input`은 전부 무시하고,
조합이 끝나는 순간의 확정값만 상태에 넣는다.

**이 방식이 정답인 근거**
Vue의 `v-model` 내부 구현(`vModelText`)이 정확히 이 방식이다.
Vue도 `el.composing` 플래그를 두고 `if (e.target.composing) return`으로 조합 중 input을 건너뛴다.
→ "v-model이 내부적으로 해주던 일을 직접 구현한 것"이라고 답하면 된다.

**미리 알아둘 동작**
"서울"을 치면 마지막 "울"은 확정되기 전까지 반영이 안 돼서 `keyword`는 "서"까지만 들어간다.
스페이스를 치거나 다른 곳을 클릭하면 그제서야 "서울"이 된다.
버그가 아니라 `v-model`도 똑같이 동작한다.

**직접 확인하는 법**
`if (isComposing.value) return` 한 줄만 주석 처리하고 한글을 쳐보면 바로 깨진다.

## Q4. 버블링과 `.stop`이 뭔가?

DOM 이벤트는 클릭된 요소에서 시작해 부모로 타고 올라간다.

```
button[상세보기]  →  div.card  →  ...
```

`.stop` 없이 상세보기를 누르면 alert가 뜨고,
이어서 `div.card`의 `@click`까지 실행되어 상태바 문구도 같이 바뀐다.
요구사항이 "버블링 없이"라고 강조한 부분이 이것이다.

`@click.stop`은 `e.stopPropagation()`을 대신 호출해 위로 올라가는 것을 끊는다.

**`.prevent`와 헷갈리지 말 것**
`.prevent`는 `e.preventDefault()`로 태그의 **기본 동작**(링크 이동, 폼 제출)을 막는 것이라 완전히 다르다.

## Q5. props는 어떻게 동작하나?

```js
const props = defineProps({
  city: { type: Object, required: true },
})
```

- `defineProps`는 **컴파일러 매크로**라서 `import` 없이 그냥 쓴다. `<script setup>`이 컴파일될 때 처리된다.
- 데이터는 **부모 → 자식 한 방향**으로만 흐른다. 자식이 `props.city`를 직접 수정하면 안 되고,
  `WeatherCard`도 읽기만 한다.
- `const props = ...`로 변수에 담은 이유:
  **템플릿에서는 그냥 `city`로 쓸 수 있지만, `<script>` 안 함수에서는 `props.city`로 접근해야 하기 때문.**
  `outfitTips()` 안에서 `props.city`를 쓴 것이 그래서다.

## Q6. 자식에서 부모로 알리려면 emit 아닌가? 왜 안 썼나?

여기서 쓴 것은 **속성 상속(fallthrough)** 이다.

```html
<WeatherCard :city="city" @click="selectCity(city.name)" />
```

`WeatherCard`의 템플릿 루트가 `<div class="card">` **하나뿐**이면,
컴포넌트에 걸어둔 `@click`은 props로 선언되지 않은 속성이므로 그 루트 엘리먼트로 자동 전달된다.
그래서 카드 아무 곳이나 누르면 부모의 `selectCity`가 실행된다.

**조건이 있다.** 루트가 여러 개면(Fragment) Vue가 어디에 붙일지 몰라 전달되지 않고 경고를 띄운다.
그래서 `WeatherCard.vue`의 설명 주석을 `<div class="card">` **안쪽**에 두었다.
주석이 루트 앞에 있으면 컴파일 결과가 Fragment가 되어,
개발 모드와 프로덕션 빌드에서 루트 판정 경로가 달라진다.

## Q7. `visibleList()`를 왜 함수로 썼나? `computed`는?

```html
<p v-if="visibleList().length === 0">
```

지금은 일반 함수라서 **렌더링될 때마다 매번 다시 실행된다.**
위 코드만 봐도 `v-for`에서 한 번, `v-if`에서 한 번 호출된다.

원래 Vue에서 이런 파생 데이터는 `computed`로 만드는 것이 정석이다.
`computed`는 의존하는 값(`keyword`, `sortType`, `onlyHot`)이 바뀌지 않으면
이전 결과를 캐싱해 재계산을 건너뛴다.

다만 아직 교재에 나오지 않은 문법이라 배운 범위로 작성했다.
도시 6개짜리 목업에서는 성능 차이가 없고, `computed`를 배우면 그대로 바꿔 끼우면 된다.

→ **2일차에 실제로 바꿔 끼웠다.** `Assignment2.vue`의 `filteredWeatherList` / `visibleWeatherList`가 그것이다.
과제 1 파일은 비교용으로 함수 그대로 남겨 두었다.

## Q8. `[...list].sort()`에서 복사본을 뜬 이유는?

`sort()`는 새 배열을 돌려주는 것이 아니라 **원본 배열을 직접 뒤섞는** 메서드다.
`weatherList.value`를 그대로 정렬하면 원본 순서가 영구히 망가져서
"기본 순서"로 되돌릴 수 없게 된다.

반면 `filter()`는 새 배열을 반환하므로 복사가 필요 없다. 그래서 필터 부분에는 붙이지 않았다.

## Q9. `<style scoped>`는 어떻게 격리되나?

Vue가 그 컴포넌트의 태그들에 `data-v-abc123` 같은 속성을 붙이고,
CSS 셀렉터에도 같은 조건을 달아서 다른 컴포넌트에는 적용되지 않게 만든다.
그래서 `WeatherCard`의 `.card`와 `App.vue`의 스타일이 서로 충돌하지 않는다.

**알아둘 것**: 자식 컴포넌트의 **루트 엘리먼트에는 부모의 스코프 ID도 같이 붙는다.**
부모가 자식의 바깥 여백 정도는 조정할 수 있게 하려는 설계다.

---

# 과제 2 (2일차) — Composition

## 요구사항 대응표

| 요구사항 | 구현 |
| --- | --- |
| 1. 반응형 상태 관리 | `searchQuery` · `selectedCityInfo` · `weatherList` (`ref`) |
| 2. 검색 도시 (computed) | `filteredWeatherList` |
| 3-1. `selectedCityInfo` 감시 | `watch(selectedCityInfo, ...)` |
| 3-2. `searchQuery` 감시 | `watchEffect(() => { ... })` |
| 4. 검색 결과 표시 | `searchState` computed + `v-if` / `v-else-if` / `v-else` |
| 5. 본인만의 상태·computed·watcher | `sortType` `onlyHot` `watchLogs` `effectMessage` / `visibleWeatherList` `searchState` `statusMessage` `summary` / Multi-Source Watch, 결과 개수 Watch |

---

# 개념 설명 (2일차)

## Q10. computed와 일반 함수는 뭐가 다른가? ★ 핵심

둘 다 "값을 계산해서 돌려준다"는 결과는 같다. 차이는 **캐싱**이다.

- 일반 함수 `visibleList()` — 템플릿이 다시 그려질 때마다 **무조건 다시 실행**된다.
  화면 어딘가의 다른 값 하나만 바뀌어도 리렌더가 일어나고, 그때마다 필터·정렬이 처음부터 다시 돈다.
- `computed` — **의존하는 반응형 값이 바뀌었을 때만** 다시 계산한다.
  안 바뀌었으면 지난번에 계산해 둔 결과를 그대로 돌려준다.

여기서 "의존하는 값"은 Vue가 알아서 파악한다. `computed` 콜백이 실행되는 동안 **읽힌 반응형 데이터**를
Vue가 기록해 두었다가, 그 값들이 바뀌면 캐시를 무효로 표시하는 방식이다.

**확인하는 법 (코드에 심어 둔 장치)**

`filteredWeatherList` 안에 `console.log('☑ [computed 재계산] ...')`를 넣어 두었다.

- 검색어를 바꾸면 → 로그가 찍힌다 (의존값이 바뀌었으니 재계산)
- 카드만 클릭하면 → **로그가 안 찍힌다** (`selectedCityInfo`는 이 computed와 무관하므로 캐시 재사용)

카드 클릭 시 상태바가 바뀌면서 화면은 분명히 다시 그려지는데도 로그가 안 나온다는 것이,
일반 함수와 다른 지점을 보여주는 증거다.

## Q11. computed와 watch는 언제 각각 쓰나? ★ 핵심

한 문장으로: **값을 만들면 computed, 일을 시키면 watch.**

| | computed | watch |
| --- | --- | --- |
| 목적 | 기존 상태로부터 **새 값을 계산** | 값이 바뀐 것을 계기로 **동작을 실행** |
| 반환값 | 있다 (그 값을 화면에서 씀) | 없다 |
| 전형적 용도 | 필터링된 목록, 합계, 표시 문구 | 콘솔로그, API 요청, 저장, 알림 |
| 이전 값 | 알 수 없다 | `oldValue`로 받을 수 있다 |

이 과제에서 `statusMessage`(문구 만들기)는 computed, "문구가 바뀌었으니 로그를 남겨라"는 watch인 이유다.

**흔한 실수**: computed 안에서 다른 상태를 바꾸는 것.
computed는 순수하게 값만 계산해야 하고, 부수효과(side effect)는 watch에서 처리한다.

## Q12. watch와 watchEffect의 차이는? ★ 핵심

| | watch | watchEffect |
| --- | --- | --- |
| 감시 대상 | **직접 지정**한다 | 콜백 안에서 읽은 값을 **자동 추적** |
| 최초 실행 | 안 한다 (값이 바뀌어야 실행) | 컴포넌트 생성 시 **즉시 1회 실행** |
| 이전 값 | `oldValue`를 받는다 | 받을 수 없다 (현재 시점만 안다) |

그래서 요구사항이 둘을 나눠서 시킨 것이 이해가 된다.

- `selectedCityInfo` → **이전에 뭘 골랐는지**까지 로그에 남기고 싶으므로 `watch`
- `searchQuery` → 지금 검색어가 뭔지만 알면 되고, 화면이 뜨자마자 초기 상태도 한 번 찍고 싶으므로 `watchEffect`

**즉시 1회 실행을 눈으로 보는 법**: 새로고침만 하고 아무것도 누르지 않아도
화면의 주황색 줄(`effectMessage`)이 초기값 `'대기 중...'`에서 이미 바뀌어 있다.

## Q13. watchEffect 안에서 배열에 로그를 쌓으면 왜 안 되나? ★ 함정

`watchEffect`는 **콜백 안에서 읽은 반응형 데이터를 전부 감시 대상으로 등록**한다.
그래서 이렇게 쓰면 무한 재실행에 빠진다.

```js
// ✗ 위험한 코드
watchEffect(() => {
  watchLogs.value.unshift(message)  // 배열을 '읽고' 바꿨다
})
```

`unshift`는 `watchLogs.value`를 읽는 동작이다. → 감시 대상에 등록됨
→ 그런데 그 값을 바꿨다 → 자기가 자기를 다시 실행시킴 → 무한 반복.

**그래서 코드를 이렇게 나눴다.**

- `watchEffect` 안에서는 `effectMessage.value = message` 처럼 **대입만** 한다.
  대입은 읽기가 아니므로 감시 대상에 등록되지 않는다.
- 로그를 배열에 쌓는 `addLog()`는 **`watch` 콜백에서만** 호출한다.
  `watch`는 첫 번째 인자로 지정한 대상만 감시하고, 콜백 안에서 뭘 읽든 감시하지 않으므로 안전하다.

이 차이가 `watch`와 `watchEffect`의 성격을 가장 잘 보여준다.

## Q14. 같은 카드를 두 번 클릭하면 왜 로그가 안 찍히나?

`watch`는 값이 **실제로 달라졌을 때만** 콜백을 실행한다.
`selectedCityInfo`에는 도시 객체를 담는데, 같은 카드를 다시 누르면 **같은 객체**가 다시 들어간다.
객체 비교는 주소값(참조) 비교라서 Vue는 "안 바뀌었다"고 판단하고 콜백을 건너뛴다.

버그가 아니라 정상 동작이고, 시연할 때 오히려 설명 포인트로 쓸 수 있다.
(같은 이유로, 문자열을 담았다면 같은 문구를 다시 넣어도 로그가 안 찍힌다.)

## Q15. 왜 `selectedCityInfo`에 문구가 아니라 객체를 담았나?

요구사항은 "상태바 문구가 바뀔 때마다 로그"지만, 변수 이름이 `selectedCityInfo`다.
객체를 담으면 상태 하나로 두 가지를 처리할 수 있다.

1. 상태바 문구 → `statusMessage` computed로 파생
2. 선택된 카드 강조 → `selectedCityInfo.id === city.id` 비교

**문구를 ref로 따로 두면 안 되나?**
가능하지만, 그러면 도시가 바뀔 때마다 문구도 손으로 같이 갱신해야 한다.
상태가 두 개가 되면 서로 어긋날 수 있고, 이런 "다른 상태에서 유도되는 값"이 바로 computed를 쓰는 자리다.

## Q16. 배열을 watch할 때 왜 `length`를 감시했나?

```js
watch(() => filteredWeatherList.value.length, (newCount, oldCount) => { ... })
```

`filteredWeatherList`는 `filter()` 결과라서 **호출될 때마다 새 배열**이다. 주소값이 매번 다르다.
그대로 감시하면 내용이 같아도 "바뀌었다"고 판단할 여지가 있고, `oldValue`도 의미가 없다.

교재의 `{ deep: true }`는 이 상황의 해법이 아니다. deep은 객체 내부까지 훑어 감지하게 해 주지만,
`newValue`와 `oldValue`가 같은 주소를 가리켜 **이전 값 추적이 안 된다**.

그래서 교재 p.134·p.140에 나온 **화살표 함수로 감시 대상 좁히기**를 썼다.
감시 대상이 숫자 하나가 되니 `3 → 0`처럼 이전 값이 정확히 남는다.

## Q17. computed는 왜 `.value`를 붙이나?

`computed()`는 `ref`와 같은 형태의 객체를 돌려주기 때문이다. 그래서 규칙도 `ref`와 똑같다.

- `<script>` 안에서는 `.value` 필요 → `filteredWeatherList.value.length`
- `<template>` 안에서는 자동으로 벗겨짐 → `{{ filteredWeatherList.length }}`

차이는 **읽기 전용**이라는 점이다. `filteredWeatherList.value = []` 처럼 대입하면 경고가 난다.
계산 결과이지 직접 보관하는 값이 아니기 때문이다.

## Q18. computed가 다른 computed를 참조해도 되나?

된다. 이 과제의 `visibleWeatherList`가 `filteredWeatherList`를 그대로 읽어 쓴다.

```
searchQuery ─→ filteredWeatherList ─→ visibleWeatherList ─→ summary
                                   ↑                 ↑
                              onlyHot / sortType
```

의존성이 체인으로 이어져서, 검색어가 바뀌면 뒤쪽이 순서대로 다시 계산되고
`onlyHot`만 바뀌면 `filteredWeatherList`는 캐시를 재사용한다.

요구사항 2가 "검색어로 필터링한 배열"을 콕 집어 요구했으므로,
`filteredWeatherList`는 **검색어만** 담당하게 두고 보기 설정은 다음 단계로 분리했다.

---

# 과제 3 (3일차) — Component

## 요구사항 대응표

| 요구사항 | 구현 |
| --- | --- |
| 1. WeatherParent.vue — 모든 반응형 데이터 유지 | `views/WeatherParent.vue` (2일차 상태·computed·watch 그대로) |
| 2. BaseDashboardCard.vue — 공통 디자인 + slot | `#title` / 기본 / `#footer` 슬롯 3종, 네 곳에 재사용 |
| 3. SearchBar.vue — props + `update-query` emits | `:query` 받아 표시, 입력 시 emit |
| 4. WeatherCard.vue — props + `select-card` / `click-detail` emits | 카드 클릭·상세보기를 이름 붙여 emit |
| 5. 컴포넌트별 `<style scoped>` | 부모에는 페이지 틀만 남김 |
| 6. Slot 스코프 | 부모가 `SearchBar` / `WeatherCard`와 직접 바인딩 |
| 7. 추가 컴포넌트 | `TempBadge` `ViewOptions` `SearchNotice` `WatcherMonitor` `StatusBar` |

## 컴포넌트 구성

| 파일 | props | emits |
| --- | --- | --- |
| `BaseDashboardCard.vue` | `icon` | — (slot 3종) |
| `SearchBar.vue` | `query` | `update-query` |
| `WeatherCard.vue` | `city` `selected` | `select-card` `click-detail` |
| `TempBadge.vue` | `temp` | — |
| `ViewOptions.vue` | `sortType` `onlyHot` | `update-sort` `update-hot` |
| `SearchNotice.vue` | `state` `query` `count` | — |
| `WatcherMonitor.vue` | `effectMessage` `logs` | — |
| `StatusBar.vue` | `message` | — |

---

# 개념 설명 (3일차)

## Q19. props와 emits는 결국 무슨 관계인가? ★ 핵심

한 문장으로: **props는 내려주는 값, emits는 올려보내는 알림.**

Vue의 데이터 흐름은 **부모 → 자식 한 방향(one-way data flow)** 이다.
자식이 부모 데이터를 직접 고칠 수 있으면, 값이 어디서 바뀌었는지 추적이 불가능해지기 때문이다.

그래서 자식은 "내가 바꿨다"가 아니라 **"이런 일이 있었다"** 만 알리고, 실제로 상태를 바꾸는 코드는 부모에만 둔다.

```
WeatherParent.searchQuery ──props(:query)──→ SearchBar 화면에 표시
WeatherParent.handleQueryUpdate ←──emit(update-query)── SearchBar 입력 발생
```

`SearchBar`의 "검색 중인 도시: OO"가 이 한 바퀴를 눈으로 보여준다.
저건 내가 친 값을 그대로 보여주는 게 아니라, **emit → 부모 상태 변경 → props로 다시 내려온** 값이다.

**확인하는 법**: `WeatherParent`의 `handleQueryUpdate` 안을 비워 보면, 타이핑해도 화면 문구가 안 바뀐다.
자식이 상태를 못 바꾼다는 증거다.

## Q20. slot은 props와 뭐가 다른가? ★ 핵심

| | props | slot |
| --- | --- | --- |
| 넘기는 것 | **값** (문자열, 숫자, 객체) | **템플릿 조각** (엘리먼트, 컴포넌트) |
| 자식이 하는 일 | 값을 받아 **자기가 그린다** | 자리만 내주고 **부모가 그린 걸 끼운다** |

`BaseDashboardCard`는 "박스 디자인"만 알고, 그 안에 검색창이 들어올지 카드 목록이 들어올지 모른다.
모르기 때문에 **네 곳(검색 / 보기 설정 / 날씨 현황 / 모니터링)에 그대로 재사용**할 수 있다.

만약 slot 없이 props로만 만들었다면 `BaseDashboardCard`가 내용물 종류를 전부 알아야 하고,
새 박스를 추가할 때마다 이 파일을 고쳐야 했을 것이다.

**세 가지 슬롯을 쓴 이유**

```html
<slot name="title">제목 없는 카드</slot>   <!-- fallback: 안 넘기면 이 문구가 보인다 -->
<slot></slot>                              <!-- 기본 슬롯: 박스 본문 -->
<div v-if="$slots.footer">                 <!-- 안 넘긴 박스는 구분선까지 사라진다 -->
  <slot name="footer"></slot>
</div>
```

`$slots`에는 **부모가 실제로 넘긴 슬롯만** 들어 있다. 그래서 요약 줄은 리스트박스에만 붙는다.

## Q21. slot 안의 컴포넌트는 어느 스코프에서 평가되나? ★ 교재 요구사항 6

**부모 스코프다.** 눈에 보이는 위치(자식 안)와 코드가 평가되는 위치(부모)가 다르다.

```html
<!-- WeatherParent.vue -->
<BaseDashboardCard icon="🔍">
  <SearchBar :query="searchQuery" @update-query="handleQueryUpdate" />
</BaseDashboardCard>
```

`SearchBar`는 화면상 `BaseDashboardCard` 안에 있지만, `searchQuery`와 `handleQueryUpdate`는
`WeatherParent`의 것이다. 슬롯 내용은 **부모 템플릿의 일부로 컴파일**되고,
자식은 완성된 결과를 자리에 끼워 넣기만 한다.

**이게 왜 편한가**
스코프가 `BaseDashboardCard`였다면 `searchQuery`를 찾지 못해 에러가 났을 것이고,
`BaseDashboardCard`에 props를 한 번 더 뚫어 `SearchBar`로 내려주는 코드가 필요했을 것이다.
(이런 걸 props drilling이라고 한다.) 슬롯 덕분에 중간 컴포넌트를 그냥 통과할 수 있다.

**반대 방향도 있다**: 자식이 가진 값을 슬롯에 넘겨주고 싶으면 `<slot :item="...">`(scoped slot)을 쓴다.
이번 과제는 부모가 모든 데이터를 갖고 있어서 쓸 일이 없었다.

## Q22. scoped 스타일이 slot 내용에는 왜 안 먹나? ★ 함정

`<style scoped>`는 셀렉터에 `data-v-XXXX` 조건을 붙인다.
그런데 이 ID는 **그 템플릿을 컴파일한 컴포넌트**의 것이다.

슬롯 내용은 Q21처럼 부모가 컴파일하므로 **부모의 ID**를 달고 온다.
그래서 `BaseDashboardCard.vue`에 이렇게 써도 적용되지 않는다.

```css
/* ✗ 슬롯으로 들어온 <p>에는 안 먹는다 */
.card-body p { color: red; }
```

`p[data-v-베이스ID]`를 찾는데, 실제 `<p>`에는 `data-v-부모ID`만 붙어 있기 때문이다.
(`.card-body` 자체는 `BaseDashboardCard`가 직접 그린 것이라 정상 적용된다.)

**그래서 어떻게 했나**: 슬롯에 들어갈 내용의 디자인은 **그 내용을 가진 컴포넌트가 각자** 들고 있게 했다.
검색창 스타일은 `SearchBar`에, 카드 스타일은 `WeatherCard`에. 요구사항 5가 자연스럽게 해결된다.

## Q23. 1·2일차에는 emit 없이 됐는데 왜 굳이 바꿨나?

1·2일차는 **속성 상속(fallthrough)** 을 이용했다. (Q6 참고)
부모가 `<WeatherCard @click="..." />`로 건 리스너가 자식의 루트 엘리먼트로 자동 전달되는 성질이다.

동작은 하지만 한계가 있다.

| | fallthrough `@click` | 이름 붙인 emit |
| --- | --- | --- |
| 의미 | "카드 어딘가를 클릭했다" | "카드를 **선택**했다" / "**상세보기**를 눌렀다" |
| 함께 넘기는 값 | DOM 이벤트 객체 | 내가 정한 값 (도시 객체) |
| 조건 | 루트 엘리먼트가 하나뿐이어야 함 | 제약 없음 |
| 부모 템플릿 | `@click` 하나뿐이라 구분 불가 | `@select-card` / `@click-detail`로 구분 |

이번엔 카드에서 올라오는 사건이 **두 종류**라서 이름이 필요했다. `@click` 하나로는 구분할 수 없다.

## Q24. 자식에서 v-model을 쓰면 왜 안 되나?

`ViewOptions`에서 `<select v-model="sortType">`라고 쓰면 **props를 직접 수정**하는 셈이다.
Vue가 콘솔에 경고를 낸다.

```
Set operation on key "sortType" failed: target is readonly
```

props는 읽기 전용이다. 그래서 `v-model`이 하던 일을 다시 풀어 썼다.

```html
<select :value="sortType" @change="handleSortChange">
<input type="checkbox" :checked="onlyHot" @change="handleHotChange" />
```

```js
const handleSortChange = (e) => emit('update-sort', e.target.value)
const handleHotChange = (e) => emit('update-hot', e.target.checked)
```

체크박스는 `:value`가 아니라 **`:checked`** 이고, 읽을 때도 `e.target.checked`다.
1일차에 `:value` + `@input`으로 `v-model`을 풀어 봤던 것의 연장선이다.

> 참고: Vue 3.4+에는 `defineModel()`이라는 축약이 있어서 자식에서도 `v-model`처럼 쓸 수 있다.
> 내부적으로는 결국 props + `update:modelValue` emit이라 원리는 같다. 교재 범위 밖이라 쓰지 않았다.

## Q25. 상세보기 alert를 왜 부모로 올렸나?

1·2일차에는 `WeatherCard` 안에서 바로 `window.alert`를 띄웠다.
요구사항 4가 "상세보기(click-detail 이벤트)를 부모에게 전달"이라고 했으므로 부모가 처리하게 바꿨다.

원칙으로 봐도 이쪽이 맞다. **자식은 표시만 하고, 무슨 일을 할지는 부모가 정한다.**
alert를 모달로 바꾸거나, 상세 페이지로 이동하게 바꾸고 싶어질 때
`WeatherCard`는 손대지 않고 부모의 `handleClickDetail`만 고치면 된다.

## Q26. `isComposing`은 왜 자식(SearchBar)에 남겼나?

요구사항 1이 "모든 반응형 데이터 유지"인데 이것만 자식에 있다. 기준은 **"이게 화면 데이터인가, 입력 도구의 상태인가"** 다.

| 상태 | 위치 | 이유 |
| --- | --- | --- |
| `searchQuery` | 부모 | 목록 필터링·watchEffect 등 **다른 곳에서도 쓴다** |
| `isComposing` | 자식 | `<input>` 하나가 지금 한글 조합 중인지일 뿐, **아무도 궁금해하지 않는다** |

이걸 부모로 올리면 부모가 IME라는 입력 세부사항까지 알아야 하고, emit도 하나 더 늘어난다.
**여러 컴포넌트가 함께 쓰는 값만 위로 올린다(lift state up)** 는 것이 일반적인 기준이다.

## Q27. 추가 컴포넌트는 어떤 기준으로 나눴나? (요구사항 7)

기준은 **"이 부분이 실제로 필요로 하는 데이터가 무엇인가"** 였다.

- `TempBadge` — 도시 객체 전체가 아니라 **기온 하나**면 된다. (`DustBadge`가 `pm10`만 받는 것과 같은 결)
- `SearchNotice` — `empty`/`found`/`none` **판단은 부모 computed**가 하고, 자식은 **표시 방법**만 안다.
- `WatcherMonitor` — **감시(로직)는 부모, 표시(디자인)는 자식.** watch를 자식으로 내리면
  요구사항 1(모든 반응형 데이터는 부모)에 어긋난다.
- `ViewOptions` / `StatusBar` — 화면에서 독립된 영역이고, 각자의 스타일을 갖는다.

반대로 **나누지 않은 것**도 이유가 있다. "보기 설정 조건에 맞는 도시가 없습니다" 한 줄은
부모의 `visibleWeatherList`에만 의존하는 문구 하나라, 파일을 만들면 오히려 찾아보기 번거로워진다.
**컴포넌트를 잘게 쪼개는 것 자체가 목적이 아니라, 재사용되거나 책임이 분명할 때 나누는 것**이다.

## Q28. 과제 2 파일을 왜 안 지웠나?

교재 요구사항이 "**기능 변경 없이** 분리"라서, 비교 대상이 남아 있어야 그게 증명된다.
`/practice/2` ↔ `/practice/3`을 오갔을 때 화면과 콘솔 로그가 똑같으면 "기능이 그대로"라는 뜻이다.
(4일차 전에는 상단 탭 버튼이 그 역할을 했다.)

`components/WeatherCard.vue`(과제 1·2용)와 `components/exercise/WeatherCard.vue`가 따로 있는 것도 같은 이유다.
과제 3 카드는 emit 방식이라 과제 1·2의 fallthrough 방식과 동작이 다르다.
한 파일로 합치면 과제 1·2가 깨지므로 폴더를 나눴다.

---

# 과제 4 (4일차) — Router

## 요구사항 대응표

| 요구사항 | 구현 위치 |
| --- | --- |
| 1. 라우터 설정 (지연 로딩, Catch-all) | `router/index.js` |
| 2. App.vue에 RouterLink · RouterView 배치 | `App.vue` |
| 3. WeatherHomeView (WeatherParent 대체, alert → router.push) | `views/WeatherHomeView.vue` |
| 4. WeatherDetailView (cityId 기반, Mount 시점 선택) | `views/WeatherDetailView.vue` |
| 5. WeatherAboutView (소개 + 홈으로 돌아가기) | `views/WeatherAboutView.vue` |
| 6. 추가 view 작성 및 라우팅 | `views/WeatherRankingView.vue`, `views/PracticeArchiveView.vue` |

## 라우트 규칙 표

| path | name | 화면 | 로딩 |
| --- | --- | --- | --- |
| `/` | `weather-home` | 메인 대시보드 | 정적 import |
| `/about` | `weather-about` | 서비스 소개 | 지연 로딩 |
| `/weather/:cityId` | `weather-detail` | 지역 상세 관측 | 지연 로딩 |
| `/ranking` | `weather-ranking` | 순위표 (추가) | 지연 로딩 |
| `/practice/:day(\d+)` | `practice-archive` | 1~3일차 보관함 (추가) | 지연 로딩 |
| `/weather` | — | `/`로 redirect | — |
| `/:pathMatch(.*)*` | `not-found` | 404 화면 | 지연 로딩 |

## 3일차 → 4일차에서 실제로 바뀐 코드

| 3일차 | 4일차 |
| --- | --- |
| `App.vue`의 `ref('assignment3')` + 탭 버튼 | 상태 없음. URL이 그 역할을 함 |
| `WeatherParent.vue` 안의 `weatherList` 배열 | `data/weatherMock.js`로 분리 (상세 화면도 읽어야 하므로) |
| `handleClickDetail` → `window.alert(...)` | `router.push('/weather/' + city.id)` |
| 검색어는 컴포넌트 안에만 있음 | `?q=` 쿼리 스트링과 동기화 |

**`components/exercise/` 안의 8개 컴포넌트는 한 줄도 고치지 않았다.**
`WeatherCard`는 여전히 `click-detail`을 emit할 뿐이고, 받는 쪽이 alert 대신 이동을 할 뿐이다.
3일차에 "자식은 무슨 일이 있었는지만 알리고 판단은 부모가 한다"고 나눠 둔 덕분이다.

---

# 개념 설명 (4일차)

## Q29. Vue Router가 왜 필요한가?

일반 웹사이트는 링크를 누르면 브라우저가 **서버에서 HTML을 새로 받아와** 화면 전체를 갈아엎는다.
화면이 하얗게 깜빡이고, 앱이 들고 있던 상태(검색어, 로그인 정보)도 전부 날아간다.

Vue 같은 SPA(Single Page Application)는 HTML 파일이 `index.html` **하나뿐이다.**
Vue Router는 그 안에서

1. 주소창의 URL 변화를 감지하고
2. 서버에 요청을 보내지 않은 채
3. `<RouterView />` 자리에 들어갈 컴포넌트만 바꿔 끼운다

즉 **URL을 화면 상태로 쓰는 장치**다. 3일차 탭 방식과 결과는 비슷해 보이지만
새로고침·뒤로 가기·링크 공유가 되느냐에서 갈린다. (→ Q39)

## Q30. `createWebHistory`와 `createWebHashHistory`의 차이는?

| | createWebHistory | createWebHashHistory |
| --- | --- | --- |
| 주소 모양 | `/about` | `/#/about` |
| 원리 | HTML5 History API (`pushState`) | URL의 `#` 뒤는 서버로 전송되지 않는 성질 |
| 서버 설정 | **필요함** | 필요 없음 |

이 프로젝트는 주소가 깔끔한 `createWebHistory`를 썼다.

**주의할 점 하나.** history 모드에서 `/about`을 주소창에 직접 치거나 새로고침하면
브라우저는 서버에 진짜로 `/about`을 요청한다. 서버에는 그런 파일이 없으니 404가 뜬다.
개발 서버(Vite)는 알아서 `index.html`을 돌려주지만, **배포할 때는 서버에
"어떤 주소로 와도 index.html을 주라"는 설정(fallback)을 넣어야 한다.**
그게 곤란한 환경(정적 호스팅 등)에서는 hash 모드를 쓴다.

## Q31. 지연 로딩(Lazy Loading)이 뭔가?

```js
// 정적 import — 파일 맨 위에서 미리 가져온다. 앱 시작 시 같이 번들됨
import WeatherHomeView from '../views/WeatherHomeView.vue'

// 지연 로딩 — 이 경로로 들어온 순간에 비로소 실행된다
component: () => import('../views/WeatherAboutView.vue')
```

차이는 **`import()`가 실행되는 시점**이다. 화살표 함수로 감싸 두면 등록만 해 두고
실제 호출은 라우터가 그 경로로 이동할 때 한다.
Vite는 이걸 알아채고 빌드할 때 파일을 **별도 청크로 잘라 낸다.**

```
dist/assets/index-*.js                109.39 kB   ← 첫 진입에 받는 것
dist/assets/WeatherDetailView-*.js      3.18 kB   ← 상세보기를 눌러야 받음
dist/assets/WeatherAboutView-*.js       1.24 kB   ← /about 을 눌러야 받음
```

**왜 좋은가:** 화면이 30개인 앱에서 사용자가 보는 건 보통 3~4개다.
전부 하나로 묶으면 첫 화면이 뜨기까지 안 볼 29개까지 기다려야 한다.

**왜 홈(`/`)만 정적 import인가:** 어차피 앱을 열면 100% 보게 되는 화면이다.
쪼개 놓으면 "번들 받고 → 라우터 실행 → 홈 청크를 또 받고" 로 네트워크 왕복만 한 번 늘어난다.
**첫 화면은 정적, 나머지는 지연**이 일반적인 기준이다.

## Q32. Catch-all Route의 `:pathMatch(.*)*` 는 무슨 뜻인가?

```js
{ path: '/:pathMatch(.*)*', name: 'not-found', component: ... }
```

세 조각으로 나눠 보면 된다.

| 조각 | 뜻 |
| --- | --- |
| `:pathMatch` | 파라미터 이름. 아무 이름이나 써도 된다 (`:catchAll` 등) |
| `(.*)` | 정규식 제약. "아무 문자나 몇 개든" |
| 맨 뒤 `*` | 반복 표시. `/`로 나뉜 **여러 조각**도 받겠다는 뜻 |

맨 뒤 `*`가 없으면 `/kk`는 잡히지만 `/a/b/c`는 못 잡는다.
`/`는 경로 구분자라 한 파라미터 안에 들어가지 못하기 때문이다.

**반드시 배열 맨 끝에 둬야 한다.** 라우터는 routes 배열을 위에서부터 순서대로 확인하고
**처음 걸린 규칙 하나만** 쓴다. 이걸 맨 위로 올리면 `/about`도 여기서 먼저 잡혀
모든 주소가 404 화면이 된다.

## Q33. RouterLink와 `<a>`, RouterLink와 router.push의 차이는?

**RouterLink vs `<a href>`**

RouterLink도 결국 `<a>`로 그려진다. 다만 클릭 이벤트를 가로채서
`event.preventDefault()`로 **브라우저의 기본 이동(=페이지 전체 새로고침)을 막고**
라우터가 컴포넌트만 바꿔 끼운다.
`<a href="/about">`으로 쓰면 앱이 통째로 다시 로드되어 SPA의 의미가 사라진다.

**RouterLink vs router.push**

| | RouterLink | router.push |
| --- | --- | --- |
| 부르는 이름 | 선언적 이동 | Programmatic Navigation |
| 쓰는 곳 | 템플릿 | 스크립트 |
| 적합한 상황 | 누르면 그냥 저기로 감 | 이동 **전에** 할 일이 있음 |

과제 요구사항 3이 `router.push`를 시킨 이유가 여기 있다. 상세보기는
"버튼을 눌렀다 → (로그를 남기고 / 유효성을 확인하고) → 이동한다" 형태라
코드로 제어할 여지가 필요하다. 반면 About 페이지의 "홈으로 이동"은
조건이 없으므로 RouterLink가 맞다.

## Q34. `push`와 `replace`는 뭐가 다른가?

브라우저 방문 기록(history) 스택을 **쌓느냐, 덮어쓰느냐**의 차이다.

- `router.push` — 기록을 하나 쌓는다. 뒤로 가기를 누르면 이전 화면으로 돌아온다.
- `router.replace` — 현재 기록을 덮어쓴다. 뒤로 가기 목록에 남지 않는다.

검색어를 URL에 동기화할 때 `replace`를 쓴 이유가 이것이다.

```js
watch(searchQuery, (newQuery) => {
  router.replace({ query: newQuery.trim() === '' ? {} : { q: newQuery.trim() } })
})
```

`push`로 하면 `서`, `서울` 처럼 **글자를 칠 때마다 기록이 쌓여서**
뒤로 가기를 여러 번 눌러야 이전 화면으로 나갈 수 있다.
순위표의 정렬 기준 변경도 같은 이유로 `replace`다.

## Q35. `useRoute`와 `useRouter`는 어떻게 구분하나?

이름이 한 글자 차이라 헷갈리는데 역할이 정반대다.

| | useRoute() | useRouter() |
| --- | --- | --- |
| 뜻 | 지금 **어디에 있는지** | 어디로 **가게 할지** |
| 성격 | 읽기 (반응형 객체) | 실행 (메서드 모음) |
| 주요 멤버 | `params`, `query`, `path`, `name` | `push()`, `replace()`, `back()` |

외우는 요령: **route는 명사(현재 위치), router는 기계(이동 장치).**
`route.params.cityId`는 반응형이라 `watch`로 감시할 수 있다. (→ Q36)

## Q36. `onMounted`만으로는 왜 부족한가? (실수하기 쉬운 부분)

요구사항 4가 "Mount 시점에 Mock Data에서 도시 객체 선택"이라 이렇게 썼다.

```js
onMounted(() => { loadCity(route.params.cityId) })
```

`/`에서 `/weather/city_01`로 들어올 때는 잘 동작한다.
그런데 상세 화면에서 **다른 도시의 상세 화면**(`/weather/city_02`)으로 이동하면 화면이 그대로 멈춘다.

이유는 **경로 규칙이 같으면 Vue가 컴포넌트를 재사용**하기 때문이다.
`WeatherDetailView` → `WeatherDetailView` 이동은 파라미터만 바뀌는 것이라
unmount → mount가 일어나지 않고, 따라서 `onMounted`가 다시 실행되지 않는다.
(성능상 일부러 그렇게 만든 것이다. DOM을 통째로 다시 만들 이유가 없으니까)

그래서 파라미터 자체를 감시한다.

```js
watch(() => route.params.cityId, (newCityId) => { loadCity(newCityId) })
```

> 다른 해법으로 `<RouterView :key="$route.fullPath" />` 처럼 key를 주어
> 강제로 새 컴포넌트로 만드는 방법도 있다. 확실하지만 매번 새로 그리는 비용이 든다.
> 이 프로젝트는 watch 쪽을 골랐다.

상세 화면에 **이전/다음 도시 링크**를 넣어 둔 것은 이 상황을 직접 재현해 보기 위해서다.

## Q37. `params`와 `query`는 언제 뭘 쓰나?

```
/weather/city_01?from=ranking
         ───┬───  ────┬────
          params    query
```

| | params (`/weather/:cityId`) | query (`?q=서울`) |
| --- | --- | --- |
| 성격 | **무엇을** 보여줄지 (리소스 식별) | **어떻게** 보여줄지 (부가 조건) |
| 없으면 | 화면이 성립하지 않음 | 화면은 그대로 성립함 |
| 라우트 규칙 | path에 미리 선언해야 함 | 선언 불필요, 아무 때나 붙임 |

이 프로젝트에서는
- 도시 상세 = `params` — 도시 코드가 없으면 상세 화면 자체가 말이 안 된다
- 검색어 `?q=`, 정렬 `?by=` = `query` — 없어도 목록은 잘 뜬다

**주의:** `params` 값은 언제나 **문자열**이다. `/practice/3`의 `route.params.day`는
숫자 3이 아니라 문자열 `'3'`이라서 `PracticeArchiveView`에서 `Number()`로 변환했다.

## Q38. `/weather/city_99`는 왜 404가 아닌가?

두 상황을 구분했다.

| 상황 | 예시 | 처리 |
| --- | --- | --- |
| **경로 규칙**에 없는 주소 | `/kk`, `/practice/abc` | Catch-all → NotFoundView |
| 경로는 맞지만 **데이터**가 없음 | `/weather/city_99` | DetailView 안에서 안내 문구 |

`/weather/city_99`는 `/weather/:cityId` 규칙에 **정상적으로 매칭된다.**
`city_99`가 유효한 도시인지는 라우터가 알 수 없고, Mock Data(또는 API)를 조회해 봐야 안다.
그래서 `findCityById()`가 `undefined`를 돌려주면 그 화면 안에서 처리한다.

라우터가 판단할 수 있는 것과 데이터가 판단할 수 있는 것을 섞지 않는 것이 요점이다.

## Q39. 3일차 탭 방식과 라우터 방식은 결국 뭐가 다른가?

3일차 App.vue는 이랬다.

```js
const currentTab = ref('assignment3')   // 어떤 화면인지를 '상태'가 들고 있음
```

4일차 App.vue에는 **상태가 하나도 없다.** URL이 그 역할을 가져갔기 때문이다.
그래서 다음 것들이 공짜로 따라온다.

| | 탭 방식 (3일차) | 라우터 방식 (4일차) |
| --- | --- | --- |
| 새로고침 | 첫 화면으로 초기화됨 | 보던 화면 그대로 |
| 링크 공유 | 불가능 (주소가 하나뿐) | 가능 (`/weather/city_01`) |
| 뒤로 가기 | 앱을 벗어나 버림 | 이전 화면으로 |
| 코드 분할 | 전부 한 덩어리 | 화면 단위 지연 로딩 |

한 줄로 정리하면 **"화면 상태를 컴포넌트에서 URL로 옮긴 것"** 이다.
`/practice/:day` 화면을 추가 view로 만든 것도 이 차이를 직접 비교해 보려고 남긴 것이다.

---

# 과제 5 (5일차) — Store (Pinia)

## 요구사항 대응표

| 요구사항 | 구현 위치 |
| --- | --- |
| stores/configStore.js (unit / unitSymbol / toggleUnit) | `stores/configStore.js` |
| 1. UnitToggler.vue 작성 | `components/exercise/UnitToggler.vue` |
| 2. Navigation Bar 옆에 배치 | `App.vue` |
| 3. 메인·상세 날씨에 단위 적용 | `WeatherCard.vue`, `WeatherDetailView.vue` (+ 순위표·요약 줄) |
| 3의 (참고) Composable로 중복 해결 | `composables/useDisplayTemp.js` |
| 4. 추가 Store 또는 state/getter/action 추가 | `stores/favoriteStore.js` + configStore에 3개 추가 |

## configStore 구성

| 구분 | 이름 | 설명 |
| --- | --- | --- |
| state | `unit` | `'celsius'` / `'fahrenheit'` (초기값 celsius) |
| getters | `unitSymbol` | `°C` / `°F` |
| getters | `unitLabel` | `섭씨(°C)` / `화씨(°F)` — 추가 |
| getters | `nextUnitLabel` | 버튼 툴팁용 — 추가 |
| actions | `toggleUnit` | 토글 |
| actions | `setUnit(unit)` | 지정 + localStorage 저장 — 추가 |

## 단위 적용 위치 (요구사항 3)

| 위치 | 방식 |
| --- | --- |
| `WeatherCard.vue` 메인 카드 | `useDisplayTemp(() => props.city.temp)` |
| `WeatherDetailView.vue` 상세 | `useDisplayTemp(() => cityInfo.value...temp)` |
| `WeatherRankingView.vue` 순위 | `convertTemp()` 직접 호출 (v-for 안이라 composable 불가) |
| `WeatherHomeView.vue` 요약 줄 | `convertTemp()` — 평균·최고 기온 |

## 4일차 → 5일차에서 실제로 바뀐 코드

| 4일차 | 5일차 |
| --- | --- |
| 기온을 `{{ city.temp }}°C`로 직접 출력 | `{{ displayTempText }}` (스토어 단위 적용) |
| `App.vue`에 내비게이션 링크만 | 링크 + `<UnitToggler />` |
| 상태는 각 컴포넌트의 `ref` | 여러 화면이 공유하는 것만 스토어로 |

**주의:** `WeatherCard`는 과제 3 화면(`/practice/3`)에서도 쓰이므로, 단위 변경과 즐겨찾기가
거기에도 그대로 적용된다. 스토어가 컴포넌트 트리와 무관한 전역이라는 증거이기도 하다.
과제 3의 판정 기준이었던 alert·상태바 동작은 `WeatherParent` 쪽이라 그대로 남아 있다.

---

# 개념 설명 (5일차)

## Q40. Pinia가 왜 필요한가? ★ 핵심

3일차에 배운 방식은 **props는 아래로, emits는 위로**였다. 이 규칙만으로 안 되는 경우가 두 가지 있다.

**① props drilling** — 중간 컴포넌트가 자기와 상관없는 값을 넘겨주기만 하는 상황.

```
WeatherHomeView → BaseDashboardCard → WeatherCard
                  (unit을 쓰지도 않으면서 받아서 넘기기만 함)
```

**② 형제 관계** — `App.vue`의 UnitToggler와 목록 안의 WeatherCard는 부모-자식이 아니다.
공통 조상까지 값을 올렸다가 다시 내려야 하는데, 그 조상은 단위에 아무 관심이 없다.

Pinia는 상태를 **컴포넌트 트리 바깥**에 두고, 필요한 컴포넌트가 직접 꺼내 쓰게 한다.

```
              ┌──────────────┐
              │ configStore  │   ← 트리 밖에 있음
              └──────┬───────┘
        ┌────────────┼────────────┬──────────┐
        ↓            ↓            ↓          ↓
   UnitToggler  WeatherCard  DetailView  RankingView
```

그래서 `UnitToggler.vue`에는 props도 emits도 없고, `App.vue`에는 `<UnitToggler />`만 적혀 있다.

## Q41. state / getters / actions는 컴포넌트의 무엇에 해당하나?

| 스토어 | 컴포넌트 | 하는 일 |
| --- | --- | --- |
| `state` | `ref()` / `data()` | 원본 데이터 |
| `getters` | `computed` | state를 가공한 값. **캐싱된다** |
| `actions` | `methods` / 일반 함수 | state를 바꾸는 동작. 비동기도 가능 |

컴포넌트에서 쓰던 개념을 그대로 옮겨 놓은 것이라, 새로 외울 것은 사실상 `defineStore` 하나다.

## Q42. state는 왜 함수로 돌려주나?

```js
state: () => ({ unit: 'celsius' })   // ○
state: { unit: 'celsius' }           // ×
```

객체를 그대로 쓰면 그 객체 **하나**를 모두가 공유하게 된다.
함수로 두면 스토어가 만들어질 때마다 새 객체를 만들 수 있다.
컴포넌트의 `data()`가 함수인 것과 똑같은 이유다.

(스토어는 앱에서 보통 하나만 쓰이지만, 테스트나 SSR에서는 매 요청마다 새로 만들어야 한다.)

## Q43. getters에서 화살표 함수를 쓰면 안 되는 때는?

```js
getters: {
  unitSymbol: (state) => (state.unit === 'celsius' ? '°C' : '°F'),   // ○ state만 쓰면 OK

  unitLabel() {                                                       // ○ 일반 함수여야 함
    return this.unit === 'celsius' ? `섭씨(${this.unitSymbol})` : `화씨(${this.unitSymbol})`
  },
}
```

**다른 getter를 참조할 때**가 그 경우다.
화살표 함수는 자기만의 `this`가 없어서 `this.unitSymbol`에 접근할 수 없다.
`state`만 쓰는 getter는 인자로 받으므로 화살표 함수로 써도 된다.

## Q44. Options 스타일과 setup 스타일은 뭐가 다른가?

| | Options 스타일 (`configStore`) | setup 스타일 (`favoriteStore`) |
| --- | --- | --- |
| state | `state: () => ({ ... })` | `ref()` |
| getters | `getters: { ... }` | `computed()` |
| actions | `actions: { ... }` | 그냥 함수 |
| this | `this.unit`으로 접근 | 필요 없음 |
| 공개 범위 | 적은 것이 전부 공개 | `return`에 넣은 것만 공개 |

**기능은 완전히 같다.** 골라 쓰면 된다.
- 교재 표가 state/getters/actions로 되어 있어 `configStore`는 Options 스타일로 맞췄다.
- `favoriteStore`는 setup 스타일로 써서 비교용으로 남겼다.
  `<script setup>`에서 쓰던 문법이 그대로라 익숙하고, `return`에서 뺀 `save()`처럼
  **내부 전용 함수를 감출 수 있다**는 점이 다르다.

## Q45. 그럼 모든 상태를 스토어에 올리면 되나? ★ 물어보기 좋은 질문

**아니다.** 이 프로젝트에서도 검색어(`searchQuery`), 정렬(`sortType`), watch 로그는
여전히 `WeatherHomeView` 안의 `ref`로 남아 있다.

기준은 **"이 값을 누가 알아야 하나"** 하나다.

| 질문 | 두는 곳 | 이 프로젝트의 예 |
| --- | --- | --- |
| 그 화면에서만 쓰는가 | 컴포넌트의 `ref` | 검색어, 정렬, IME 조합 플래그 |
| 여러 화면이 공유하는가 | 스토어 | 단위 설정, 즐겨찾기 |

전부 스토어에 올리면 화면을 떠나도 값이 남아 있어 오히려 버그가 되고
(다른 도시를 검색하고 돌아왔는데 이전 검색어가 남아 있는 식),
컴포넌트만 봐서는 상태가 어디 있는지 알 수 없게 된다.

`ViewOptions.vue`에 두 방식이 나란히 들어 있는 것이 그래서다.
"25도 이상만 보기"는 props/emits, "즐겨찾기만 보기"는 스토어 직결이다.
스토어 쪽은 부모가 넘겨줄 것이 하나도 늘지 않는 대신,
그 컴포넌트를 다른 프로젝트에 떼어 갈 수 없게 된다. **맞바꾸는 것이지 우열이 아니다.**

## Q46. 스토어 state를 컴포넌트에서 직접 바꿔도 되나?

된다. Vuex와 달리 Pinia는 mutation이 없어서 이렇게 써도 동작한다.

```js
configStore.unit = 'fahrenheit'      // 동작은 한다
configStore.toggleUnit()             // 이렇게 쓴 이유
```

그래도 action을 쓴 이유는 **바꾸는 방법을 한 곳에 모아 두기 위해서**다.
지금은 localStorage 저장과 콘솔 로그가 `setUnit` 안에 들어 있는데,
직접 대입하는 코드가 여기저기 흩어져 있었다면 그 코드를 전부 찾아 고쳐야 했다.

## Q47. `storeToRefs`는 왜 안 썼나? ★ 함정

스토어를 구조 분해하면 **반응성이 끊긴다.**

```js
const { unit } = useConfigStore()     // ✗ 이 순간의 문자열 값만 복사됨. 안 바뀐다
```

`unit`은 그냥 문자열이라 스토어와의 연결이 사라지기 때문이다. 해결책이 두 가지다.

```js
const configStore = useConfigStore()
configStore.unit                      // ① 스토어 객체를 통해 접근 (이 프로젝트가 쓴 방식)

const { unit } = storeToRefs(useConfigStore())   // ② ref로 감싸서 꺼내기
unit.value                                        // .value가 필요해짐
```

이 프로젝트는 ①을 썼다. 템플릿에서 `configStore.unitLabel`처럼 쓰면
**어느 스토어에서 온 값인지 코드에 그대로 보인다**는 게 이유다.

단, **action은 구조 분해해도 된다.** 함수는 반응성과 무관하기 때문이다.
`const { toggleUnit } = useConfigStore()`는 정상 동작한다.

## Q48. 원본 데이터를 화씨로 바꾸지 않고 왜 표시할 때만 변환하나?

`weatherMock.js`의 `temp`는 계속 섭씨 숫자로 두고, 화면에 그릴 때만 변환한다.

원본을 바꿔 버리면
- 단위를 두 번 토글했을 때 반올림 오차가 누적된다 (28 → 82 → 27.8 → ...)
- "25도 이상" 같은 **판정 기준이 전부 깨진다**

그래서 `TempBadge`에는 변환값이 아니라 `city.temp`를 그대로 넘긴다.
화씨 82를 넘기면 항상 '더움'이 되어 버린다.
**원본은 하나, 표현은 여러 개**가 원칙이다. (날짜를 UTC로 저장하고 표시할 때 지역 시간으로 바꾸는 것과 같다.)

## Q49. Composable이 뭔가? 스토어와 뭐가 다른가?

Composable은 **반응형 로직을 담은 재사용 함수**다. 이름을 `use~`로 짓고,
컴포넌트가 아닌 `.js` 파일인데 안에서 `ref`/`computed`를 쓴다.

| | Store (Pinia) | Composable |
| --- | --- | --- |
| 인스턴스 | 앱 전체에 **하나** (싱글턴) | 호출할 때마다 **새로** 생김 |
| 쓰는 목적 | 공유해야 하는 **상태** | 반복되는 **로직** |
| 예 | `configStore.unit` | `useDisplayTemp()` |

단위 값 자체는 하나여야 하니 스토어에, "섭씨를 화씨로 바꿔 문자열로 만든다"는 계산 절차는
호출하는 곳마다 따로 있어도 되니 composable에 두었다.

**v-for 안에서는 composable을 못 쓴다.** composable은 `computed`를 만드는데,
반응형 API는 setup이 실행될 때 **한 번만** 호출해야 컴포넌트가 정리 시점을 알 수 있다.
그래서 순위표처럼 도시마다 변환이 필요한 곳은 순수 함수 `convertTemp()`를 직접 호출한다.

> 교재는 Composable을 "범위 제외"로 적어 두었지만, 기온 표시가 3곳이라
> 중복이 실제로 생겨서 만들었다. 계산식 자체는 교재 코드 그대로다.

## Q50. `useConfigStore()`는 왜 setup 안에서 호출해야 하나?

```js
const configStore = useConfigStore()   // ○ <script setup> 안
```

`useConfigStore()`는 "활성화된 Pinia 인스턴스"를 찾아 스토어를 돌려준다.
그 인스턴스는 `main.js`의 `app.use(createPinia())`가 만든다.

모듈 최상단(import 직후)에서 호출하면 **`main.js`가 실행되기 전**일 수 있어
`getActivePinia() was called but there was no active Pinia` 에러가 난다.
`main.js`에서 `.use(createPinia())`를 `.mount()`보다 먼저 둔 것도 같은 이유다.

---

# 과제 6 (6일차) — Axios

## 요구사항 대응표

| 요구사항 | 구현 위치 |
| --- | --- |
| Axios 설치, API Key 발급 | `package.json`, `.env` (`.env.example` 참고) |
| 1. 실제 날씨 데이터 적용 | `services/weatherApi.js`, `stores/weatherStore.js` |
| 2. OpenWeatherMap 추가 API로 확장 | air_pollution(미세먼지), forecast(예보·강수확률) |
| 3. 기타 외부 API로 확장 | `services/openMeteoApi.js` (자외선·일출/일몰) |

## 5일차 → 6일차에서 바뀐 것

| 5일차 | 6일차 |
| --- | --- |
| `weatherMock.js` 배열을 그대로 화면에 | API 응답으로 덮어쓰고, mock은 폴백으로만 |
| 도시 목록이 `WeatherHomeView`의 계산값 | `weatherStore.cities` (목록·상세·순위 공용) |
| 로딩/실패라는 개념 자체가 없음 | `loading` / `errorMessage` / `usingFallback` |

---

# 개념 설명 (6일차)

## Q51. 왜 컴포넌트에서 axios를 직접 부르지 않고 services/를 따로 뒀나?

컴포넌트 안에 `axios.get('https://api.openweathermap.org/...')`를 적으면
- URL과 키가 화면 코드에 흩어지고
- 응답 구조(`data.main.temp`)를 화면이 전부 알아야 하고
- API가 바뀌면 그 화면을 전부 찾아 고쳐야 한다

`services/weatherApi.js`가 응답을 앱이 쓰던 도시 객체 모양으로 바꿔서 돌려주기 때문에,
카드와 상세 화면 템플릿은 5일차 그대로 두고도 실제 데이터가 들어왔다.
API를 다른 회사 것으로 바꿔도 고칠 곳은 이 파일 하나다.

## Q52. `axios.create()`로 인스턴스를 만드는 이유는?

```js
const owm = axios.create({
  baseURL: 'https://api.openweathermap.org',
  timeout: 8000,
  params: { appid: API_KEY, units: 'metric', lang: 'kr' },
})
```

공통값을 한 번만 적어 두면 호출부는 `owm.get('/data/2.5/weather', { params: { lat, lon } })`처럼
달라지는 것만 쓰면 된다. `params`도 인스턴스 것과 호출 시 것이 합쳐진다.

`axios.get()`을 그냥 쓰면 전역 설정을 건드리게 되어, 다른 API(Open-Meteo)에까지
`appid`가 붙어 나간다. 그래서 제공자마다 인스턴스를 따로 만들었다.

## Q53. 인터셉터는 무엇에 쓰나?

요청이 나가기 직전, 또는 응답이 돌아온 직후에 끼어드는 함수다.
여기서는 응답 인터셉터로 에러 메시지를 화면에 쓸 수 있는 문장으로 바꿔 둔다.

```js
if (status === 401) return Promise.reject(new Error('API Key가 올바르지 않습니다...'))
if (status === 429) return Promise.reject(new Error('무료 호출 한도를 넘었습니다...'))
```

이 처리가 없으면 화면마다 `if (error.response.status === 401)`을 반복해야 한다.
실무에서는 요청 인터셉터에 토큰을 붙이거나, 401이면 로그인 화면으로 보내는 데도 쓴다.

## Q54. `Promise.all`과 `Promise.allSettled` 중 왜 allSettled인가? ★

도시 하나에 세 곳을 부른다. 순서대로 `await`하면 3배 느려지므로 병렬로 보낸다.

```js
const [current, air, forecast] = await Promise.allSettled([...])
```

`Promise.all`은 **하나만 실패해도 전체가 실패**한다.
그러면 대기오염 API가 잠깐 죽었다는 이유로 기온까지 화면에서 사라진다.

`allSettled`는 전부 기다린 뒤 각각의 성공/실패를 알려 준다.
그래서 현재 날씨만 필수로 두고(없으면 카드를 못 그리니까),
대기오염과 예보는 실패하면 폴백 값을 쓰도록 했다.

## Q55. 왜 API 응답을 스토어에 넣었나?

목록·상세·순위 세 화면이 같은 데이터를 쓴다.
화면마다 각자 부르면 상세로 들어갈 때마다 18회씩 다시 호출하게 된다.

스토어에 담아 두고 `loadOnce()`로 "이미 실제 데이터가 있으면 건너뛰기"를 하면,
상세 화면 진입 시 추가 호출이 0이 된다. (Network 탭에서 확인 가능)

반대로 상세 화면의 자외선 정보는 그 화면에서만 쓰므로 컴포넌트의 `ref`에 담았다.
5일차 Q45에서 정리한 기준(여러 화면이 공유하는가)을 그대로 적용한 것이다.

## Q56. 로딩과 실패는 어떻게 다뤘나?

비동기가 들어오면 상태가 세 가지로 늘어난다. 하나라도 빠뜨리면 화면이 이상해진다.

| 상태 | 스토어 | 화면 |
| --- | --- | --- |
| 부르는 중 | `loading` | "불러오는 중…", 새로고침 버튼 비활성 |
| 성공 | `usingFallback = false` | "실시간 · 갱신 시각" |
| 실패 | `errorMessage` | 빨간 안내 + 폴백 데이터 유지 |

**실패해도 화면을 비우지 않는다.** `cities`를 초기화하지 않고 폴백을 그대로 두었다.
날씨 앱에서 화면이 텅 비는 것보다 지난 값이라도 보이는 쪽이 낫다고 봤다.

`finally`에서 `loading = false`를 하는 이유는, 성공하든 실패하든
로딩 표시는 반드시 꺼져야 하기 때문이다.

## Q57. API Key를 코드에 적지 않고 .env에 둔 이유는?

키를 소스에 적으면 GitHub에 그대로 올라간다. 남이 내 키로 호출하면 한도가 소진된다.

```
.env            → .gitignore에 등록 (커밋 안 됨)
.env.example    → 키 이름만 적어서 커밋 (받는 사람이 뭘 채워야 하는지 알 수 있게)
```

Vite는 `VITE_`로 시작하는 변수만 클라이언트 코드에 넣어 준다.
접두사가 없는 변수는 빌드 결과에 포함되지 않는다.

**다만 솔직하게 알아둘 것:** `VITE_`를 붙인 순간 그 값은 빌드된 JS에 그대로 박히므로
브라우저 개발자 도구에서 볼 수 있다. `.env`는 "실수로 깃허브에 올리는 것"을 막을 뿐,
프론트엔드 코드에서 키를 진짜로 숨길 수는 없다.
실제 서비스라면 서버를 하나 두고 서버가 키를 들고 대신 호출하게 한다.

## Q58. 응답의 키 이름을 왜 그대로 안 쓰고 바꿔 담았나?

```js
temp: Math.round(current.main.temp),
status: current.weather[0].description,
```

화면이 `city.main.temp`처럼 API 구조를 그대로 알게 되면, 제공자를 바꾸는 순간
모든 템플릿을 고쳐야 한다. 5일차까지 쓰던 이름(`temp`, `status`, `humidity`)을 유지했더니
카드·상세·순위 템플릿을 거의 손대지 않고 실제 데이터로 갈아 끼울 수 있었다.

`Math.round`를 씌운 것도 같은 맥락이다. API는 `28.37`처럼 주는데
화면에 소수점까지 필요하지 않아서 변환 단계에서 정리했다.

---

# 과제 7 (7일차) — UI Library (Element Plus)

## 요구사항 대응표

| 요구사항 | 구현 |
| --- | --- |
| 외부 UI Library 선정 및 적용 | Element Plus 2 (다크 모드 + CSS 변수 커스터마이즈) |
| 1~3. 실제 API 연동 및 확장 | 6일차에서 완료 |
| 본인 컨셉 | 러닝 웨더 — 날씨를 야외 운동 적합도로 환산, 다크 스포츠 톤 |

## 교체 내역

| 컴포넌트 | 이전 | Element Plus |
| --- | --- | --- |
| SearchBar | `<input>` | el-input |
| ViewOptions | `<select>` / checkbox | el-select / el-checkbox |
| UnitToggler | 버튼 | **el-switch** (교재 강조) |
| TempBadge / DustBadge | 직접 만든 배지 | el-tag |
| WeatherCard | `<button>` | el-button |
| RefreshBar | 텍스트 + 버튼 | el-tag + el-button + **ElMessage** |
| BaseDashboardCard | 직접 만든 패널 | **el-card** (slot 구조는 3일차 그대로) |
| RunningIndexView | — | **el-progress**, el-select, el-alert, el-skeleton, **ElMessageBox** |
| Watcher 패널 | 항상 노출 | el-collapse |

## 디자인을 다시 잡은 이유

라이브러리만 갈아 끼웠더니 화면이 여전히 정돈되지 않았다. 원인은 구조였다.

| 문제 | 개선 |
| --- | --- |
| 흰 셸 → 회색 패널 → 흰 카드 3중 중첩 | 섹션 라벨 + 카드 한 겹 |
| 도시명·기온·습도·점수가 전부 같은 크기 | 기온과 점수만 크게, 나머지는 작은 줄 |
| 제목마다 이모지 | 대문자 라벨 + 형광 점 하나 |
| 배지 3종이 제각각 | el-tag로 통일 |
| 받아온 날씨 아이콘 미사용 | 카드·상세·예보에 표시 |

---

# 개념 설명 (7일차)

## Q59. UI 라이브러리를 왜 쓰나? 직접 만들면 안 되나?

지금까지 배지·버튼·상태바를 전부 직접 CSS로 만들었다. 동작은 한다.
문제는 하나를 만들 때마다 신경 쓸 것이 계속 따라온다는 점이다.

- 키보드로 접근 가능한가 (Tab, Enter, Esc)
- 스크린리더가 읽을 수 있는가 (aria-*)
- 포커스 표시가 보이는가
- 비활성·로딩 상태의 모양은

`el-button` 하나만 봐도 loading, disabled, text, circle, type이 전부 제공된다.

반대로 잃는 것도 있다. 번들이 커지고, 라이브러리 업데이트에 묶이고, 디자인이 남들과 비슷해진다.
그래서 CSS 변수로 색을 바꿔 컨셉을 입혔다.

## Q60. Element Plus 다크 모드는 어떻게 켜나?

```js
import 'element-plus/theme-chalk/dark/css-vars.css'
document.documentElement.classList.add('dark')
```

다크용 CSS 변수는 `html.dark` 아래에만 정의돼 있다. 그래서 파일을 불러오는 것만으로는 안 되고,
`html`에 `dark` 클래스를 붙여야 적용된다.

이 앱은 다크 고정이라 `main.js`에서 한 번 붙였다.
사용자가 토글하게 하려면 이 클래스를 켜고 끄면 된다.

## Q61. 라이브러리 색을 어떻게 내 컨셉에 맞췄나?

Element Plus는 색을 CSS 변수로 노출한다. 그래서 SCSS를 건드리지 않고 변수만 덮어썼다.

```css
html.dark {
  --el-color-primary: #c6f432;
  --el-bg-color: var(--surface);
  --el-text-color-primary: var(--text);
}
```

내 자체 토큰(`--surface`, `--accent`)과 라이브러리 변수를 같은 파일에 두면
직접 만든 부분과 라이브러리 컴포넌트의 색이 어긋나지 않는다.

한 가지 걸린 점: primary 버튼 글자색이 흰색 고정이라 라임 배경 위에서 안 읽혔다.
`--el-button-text-color`를 어두운 색으로 따로 지정해 해결했다.

## Q62. el-input으로 바꾸면서 왜 v-model을 안 썼나?

`v-model`을 쓰면 한 줄로 끝나지만, 1일차부터 다룬 **한글 IME 조합 처리**를 못 하게 된다.

```html
<el-input :model-value="query" @input="handleInput"
          @compositionstart="..." @compositionend="..." />
```

Element Plus 컴포넌트도 결국 `<input>`을 렌더링하므로 기본 DOM 이벤트를 그대로 걸 수 있다.
라이브러리를 쓴다고 해서 아래에 있는 HTML이 사라지는 게 아니다.

## Q63. 기본 요소와 Element Plus 컴포넌트의 이벤트 차이는? (한 번 걸렸던 부분)

```js
// <select>는 이벤트 객체를 준다
const handleSortChange = (e) => emit('update-sort', e.target.value)

// el-select는 값 자체를 준다
const handleSortChange = (value) => emit('update-sort', value)
```

`el-input`의 `@input`도 마찬가지로 값을 넘긴다.
다만 `@compositionend`는 네이티브 이벤트라 이벤트 객체가 오므로 `e.target.value`를 써야 한다.
같은 컴포넌트 안에서 두 방식이 섞이는 셈이라 헷갈리기 쉽다.

## Q64. ElMessage와 ElMessageBox는 무엇이 다른가?

둘 다 컴포넌트를 템플릿에 심지 않고 **함수 호출로 띄운다**는 점이 특징이다.

| | ElMessage | ElMessageBox |
| --- | --- | --- |
| 모양 | 상단에 잠깐 뜨는 토스트 | 화면 중앙 모달 |
| 사용자 응답 | 필요 없음 | 확인/취소를 기다림 |
| 반환 | 없음 | Promise |

```js
ElMessage.success('6개 도시를 새로 불러왔습니다.')

ElMessageBox.confirm('즐겨찾기를 모두 지울까요?', '확인', { type: 'warning' })
  .then(() => { ... })
  .catch(() => { ... })   // 취소도 reject로 온다
```

**주의:** 취소를 눌러도 `catch`로 들어온다. `catch`를 빼면 처리되지 않은 Promise 거부 경고가 뜬다.
브라우저 기본 `confirm()`을 대체하는 용도라, 1일차의 `window.alert`와 대비해서 설명하면 좋다.

## Q65. 러닝 지수를 왜 감점 방식으로 만들었나? ★ 컨셉 설명

가중치를 곱해 더하는 방식으로도 점수는 나온다. 감점 방식을 고른 이유는
**화면에 "무엇 때문에 몇 점이 깎였는지"를 그대로 보여 줄 수 있기 때문**이다.

```
강수확률 69%   -20
기온 27°C      -19
습도 94%       -17
```

점수 하나만 보여 주면 사용자는 그 숫자를 믿을 근거가 없다.
계산 과정을 펼쳐 보이면 "아 습도 때문이구나"를 알 수 있고, 이게 이 컨셉의 핵심이다.

배점 근거는 체감온도 10~18도 구간(지구력 운동에 유리하다는 통설)과
환경부 미세먼지 등급 경계(30/80/150)를 참고했다.
**의학적 기준이 아니라 이 앱에서 정한 값**이라는 문구를 `el-alert`로 화면에 넣었다.
근거 없이 그럴듯한 숫자를 보여 주는 것보다 한계를 밝히는 편이 낫다고 봤다.

## Q66. 시간대별 점수는 어떻게 계산했나? 차트는 어떻게 붙였나?

6일차에 받아 둔 3시간 예보 8개(24시간)를 그대로 쓴다.
예보 항목에 기온·습도·바람·강수확률이 있으므로 같은 계산식을 시점마다 돌린다.

한계가 하나 있다. **미세먼지는 시간별 예보를 받지 않아 현재 값을 그대로 적용**했다.
(air_pollution forecast는 별도 호출이라 호출 수가 두 배가 된다.) 화면 하단에 적어 두었다.

Element Plus에는 차트가 없어서 Chart.js를 직접 감쌌다(`LineChart.vue`).

```js
onBeforeUnmount(() => {
  if (chart !== null) chart.destroy()
})
```

`destroy()`를 빼먹으면 화면을 떠나도 캔버스와 이벤트 리스너가 남는다.
데이터가 바뀔 때도 새로 만들지 않고 `chart.update()`로 갈아 끼운다. 매번 새로 만들면 깜빡인다.

---

# 개념 설명 (확장분)

## Q67. 지역을 30개로 늘리면서 무엇이 문제가 됐나? ★

30개 × 3개 엔드포인트 = 90회. OpenWeatherMap 무료는 **분당 60회**라 그대로 넘긴다.
화면을 두 번만 새로고침해도 429가 난다.

해결은 "무엇을 언제 부를지"를 나눈 것이다.

| 용도 | API | 호출 수 |
| --- | --- | --- |
| 목록 30개 | Open-Meteo 배치 | 2회 |
| 지역 하나 상세 | OpenWeatherMap | 3회 |

Open-Meteo는 좌표를 콤마로 이어 붙이면 지점별 결과를 배열로 돌려준다.

```js
const latitude = cityList.map((city) => city.lat).join(',')
```

목록에 필요한 것(기온·습도·바람·대기질)은 배치로 한 번에 받고,
예보와 대기오염 상세는 그 화면에 들어갔을 때만 OpenWeatherMap으로 받는다.
한 번 받은 지역은 `detailLoaded`에 표시해 두고 다시 부르지 않는다.

**교재 요구사항(OpenWeatherMap 사용)은 상세·러닝·주간 화면에서 그대로 지킨다.**
목록만 다른 제공자를 쓰는 이유는 호출 한도 때문이라고 설명하면 된다.

## Q68. Open-Meteo는 왜 날씨 설명이 없나?

OpenWeatherMap은 `weather[0].description`으로 '실 비' 같은 한글 문구를 준다.
Open-Meteo는 **WMO 기상 코드**(숫자)만 준다.

```js
const WMO = { 0: ['맑음', '01d'], 61: ['약한 비', '10d'], 95: ['뇌우', '11d'], ... }
```

그래서 코드 → 한글 설명 + 아이콘 표를 직접 만들었다.
API마다 주는 모양이 다르므로, 화면이 쓰는 형태로 맞춰 주는 계층(services/)이 있어야 하는 이유가 여기서도 드러난다.

## Q69. 라이트/다크 테마는 어떻게 한 벌로 관리하나?

토큰 이름을 같게 두고 **값만 덮어쓴다.**

```css
:root     { --bg: #eef4fb; --surface: #fff;    --accent: #0a84ff; }
html.dark { --bg: #0a0e14; --surface: #141a22; --accent: #35a0ff; }
```

컴포넌트는 전부 `var(--surface)`처럼 토큰만 쓰므로 CSS를 한 벌만 쓰면 된다.
Element Plus도 `html.dark`를 보고 자기 변수를 바꾸므로 같은 스위치로 함께 움직인다.

**걸린 것:** Chart.js는 캔버스에 직접 그려서 **CSS 변수를 읽지 못한다.**
`configStore.isDark`를 보고 실제 색값을 계산해 넘기고, 테마가 바뀌면 차트를 다시 그린다.

```js
watch(() => configStore.isDark, () => { chart.destroy(); render() })
```

`el-progress`의 `color` 속성도 같은 이유로 CSS 변수 대신 색값(`#0a84ff`)을 넘겨야 한다.

## Q70. Geolocation은 어떻게 다뤘나?

```js
navigator.geolocation.getCurrentPosition(성공콜백, 실패콜백, { timeout: 10000 })
```

Promise가 아니라 **콜백 방식**이라 async/await로 바로 쓸 수 없다.
성공 콜백 안에서 다시 await를 쓰려고 `async (position) => { ... }` 형태로 감쌌다.

세 가지를 반드시 처리해야 한다.

1. 브라우저가 지원하지 않는 경우 (`navigator.geolocation === undefined`)
2. 사용자가 권한을 거부한 경우 (`error.PERMISSION_DENIED`)
3. 시간이 오래 걸리는 경우 (`timeout` 옵션)

**권한을 거부해도 앱은 그대로 동작해야 한다.** 그래서 목록은 건드리지 않고 안내 문구만 남긴다.
받아온 좌표는 `my_location`이라는 가상 지역 id로 스토어에 담아 기존 상세 화면을 그대로 재사용한다.

> HTTPS 또는 localhost에서만 동작한다. 배포 후 http로 접속하면 권한 요청 자체가 뜨지 않는다.

## Q71. 일별 예보를 추가 호출 없이 만든 방법은?

OpenWeatherMap 무료 요금제에는 일별 예보 API가 없다. 대신 3시간 예보를 40개 준다.
이걸 날짜별로 묶으면 일별 예보가 된다.

```js
byDate[date].temps.push(item.main.temp)
...
min: Math.round(Math.min(...day.temps)),
max: Math.round(Math.max(...day.temps)),
rainProb: Math.round(Math.max(...day.pops) * 100),   // 그날 최대 강수확률
```

**한계도 같이 말할 것:** 일별로 묶으면 습도·바람은 시점마다 달라 대표값을 정하기 어렵다.
그래서 `/week` 화면의 날짜별 점수는 최고기온과 강수확률만 쓰고,
습도·바람은 현재 값을 대신 적용했다고 화면에 적어 두었다.

---

# 제출 전 체크리스트

`npm run dev` 실행 후 http://localhost:3000 에서 확인.
과제 1~3 화면은 상단 **📚 지난 과제**(`/practice/1` ~ `/practice/3`)에서 볼 수 있다.

## 과제 1

1. 검색창에 `서울`을 한 글자씩 입력 → 글자가 깨지지 않고 "검색 중인 도시"에 표시되는가 ★
2. 검색창에 `부` 입력 → 부산만 남는가
3. 카드 본문 클릭 → 하단 상태바 문구가 바뀌는가
4. `[상세보기]` 클릭 → alert만 뜨고 **상태바는 그대로**인가 ★ (`.stop` 검증)
5. 정렬을 "기온 높은 순"으로, "25도 이상만 보기" 체크 → 목록이 달라지는가
6. 대전(매우나쁨) · 제주(나쁨) · 서울(보통) · 강릉(좋음) 배지 색이 다른가

## 과제 2 (콘솔 F12를 열어 두고)

1. 새로고침 직후 → 아무것도 안 눌렀는데 `[watchEffect 자동 호출]` 로그가 이미 있는가 ★ (최초 1회 즉시 실행)
2. 검색어 입력 → 칠 때마다 `[watchEffect 자동 호출]` 로그가 이어지는가
3. 카드 클릭 → `[watch 감지] 상태 바 문구가 업데이트되었습니다` 로그 + 카드 강조 ★
4. 같은 카드 재클릭 → **로그가 안 찍히는가** ★ (Q14)
5. `가나다` 입력 → "검색 결과가 일치하는 도시가 없습니다" 안내가 뜨는가
6. 검색어 지움 → 원본 6개가 다시 나오는가
7. 정렬/체크박스 변경 → `[watch 다중 감시]`에 옛 값과 새 값이 함께 찍히는가
8. 카드만 클릭 → `[computed 재계산]` 로그가 **안 찍히는가** ★ (Q10, 캐싱 증거)

## 과제 3 (과제 2 항목이 전부 그대로 통과해야 함)

1. `/practice/2` ↔ `/practice/3`을 오갔을 때 화면·콘솔 로그가 같은가 ★ ("기능 변경 없이"의 증명)
2. 검색창 입력 → "검색 중인 도시"가 갱신되는가 (emit → 부모 → props 한 바퀴, Q19)
3. 카드 본문 클릭 → 상태바 변경 + 카드 강조 (`select-card`)
4. `[상세보기]` 클릭 → **alert만 뜨고 상태바는 그대로**인가 ★ (`.stop`이 `select-card`를 막는지)
5. 네 개 박스의 디자인이 같은가 (`BaseDashboardCard` 재사용)
6. 리스트박스에만 아래 요약 줄이 있는가 (`$slots.footer` 분기, Q20)
7. 콘솔에 props 수정 경고가 없는가 (Q24)

## 과제 4 (F12 → Network 탭을 열어 두고)

1. 카드의 `[상세보기]` 클릭 → **alert 없이** 주소가 `/weather/city_01`로 바뀌는가 ★ (요구사항 3)
2. 상세 화면에서 **이전/다음 도시** 링크 클릭 → 내용이 실제로 바뀌는가 ★★ (Q36, 가장 헷갈리는 부분)
3. 브라우저 **뒤로 가기** → 대시보드로 돌아오는가
4. `/about` 처음 클릭 → Network에 `WeatherAboutView-*.js`가 **그때** 잡히는가 ★ (지연 로딩 증거, Q31)
5. 페이지 이동 시 탭의 로딩 스피너가 **안 도는가** (새로고침이 아님, Q29)
6. 검색창에 `서울` → 주소가 `/?q=서울`이 되고, **새로고침해도 유지**되는가 (Q34)
7. 주소창에 `/kk` → 404 화면 + "입력한 주소: /kk" ★ (Catch-all, Q32)
8. 주소창에 `/practice/abc` → **404 화면**인가 (정규식 제약 `\d+`)
9. 주소창에 `/weather/city_99` → 404가 아니라 "도시 정보를 찾을 수 없습니다" ★ (Q38)
10. 내비게이션에서 현재 화면 링크에만 밑줄이 있는가 (`router-link-exact-active`)

## 과제 5

1. 상단 **[단위변경]** → 메인 카드 기온이 `28°C` → `82°F`로 바뀌는가 ★ (요구사항 3)
2. 같은 클릭으로 **요약 줄의 평균 기온**까지 바뀌는가
3. 상세 화면의 "실시간 기온"도 화씨인가 ★ (요구사항 3의 '상세')
4. 🏆 기온 순위의 기온도 바뀌는가 (composable 대신 `convertTemp` 쓴 곳)
5. 화씨 상태에서 **새로고침** → 유지되는가 (localStorage)
6. 화씨(82°F)인데 🔥 **더움 배지가 그대로**인가 ★★ (Q48, 판정은 섭씨 원본 기준)
7. 카드의 ☆ 클릭 → ★로 바뀌고 **상태바는 그대로**인가 (`.stop`)
8. 즐겨찾기한 도시의 상세 화면에 **★ 해제**로 뜨는가 (스토어 공유 증거)
9. "⭐ 즐겨찾기만 보기" 체크 → 목록이 걸러지는가
10. `/practice/3`(과제 3 화면)의 카드에도 단위가 적용되는가 ★ (스토어가 전역이라는 증거)
11. 콘솔에 Pinia 관련 경고가 없는가 (Q50)

## 과제 6 (F12 → Network 탭을 열어 두고)

1. `.env` 없이 실행 → "샘플 데이터 표시 중"이 뜨고 화면은 정상 동작하는가
2. 키를 넣고 재시작 → 기온이 실제 값으로 바뀌는가 ★
3. 날씨 설명이 한글인가 (`lang=kr`)
4. `weather` / `air_pollution` / `forecast` 요청이 병렬로 나가는가 ★ (Q54)
5. 상세 화면 진입 시 예보 요청이 **추가로 안 나가는가** ★ (스토어 재사용, Q55)
6. 상세 화면에 `open-meteo.com` 요청이 하나 더 나가는가 (요구사항 3)
7. `[단위변경]` → API로 받은 값도 화씨로 바뀌는가 (5일차와 연결)
8. 틀린 키를 넣고 실행 → 401 안내 문구가 뜨는가 (Q53)
9. 새로고침 연타 → 429 안내 문구가 뜨는가
10. 미세먼지 배지 등급이 실제 수치를 따라가는가

## 과제 7

1. `/running` → 점수·등급·감점 내역이 뜨는가 ★
2. 도시 변경 → 주소가 `?city=`로 바뀌고, 그 주소를 새 탭에 넣어도 같은 도시가 뜨는가
3. 감점 내역이 많이 깎인 순으로 정렬되는가
4. 시간대별 그래프가 8개 시점으로 그려지는가
5. 대시보드 카드에도 러닝 점수 태그가 붙는가
6. 검색창에 `서울` 한 글자씩 → **한글이 안 깨지는가** ★★ (el-input으로 바꾼 뒤에도, Q62)
7. 정렬 드롭다운·체크박스가 동작하는가 (Q63)
8. 상단 스위치로 °C ↔ °F 전환되는가 (el-switch)
9. 새로고침 → 토스트가 뜨는가 (ElMessage)
10. '즐겨찾기 비우기' → 확인 창이 뜨고, 취소해도 오류가 없는가 (ElMessageBox, Q64)

## 확장분

1. 지역이 30개로 나오고 권역 필터가 동작하는가
2. 라이트 ↔ 다크 전환, 새로고침 후에도 유지되는가 ★
3. 다크로 바꿨을 때 **차트 색도 함께 바뀌는가** ★ (Q69, CSS 변수를 못 읽는 부분)
4. '위치 연결' → 권한 허용 시 내 위치 카드가 뜨는가
5. 권한을 거부해도 목록은 그대로 동작하는가 ★ (Q70)
6. `/week`에서 5일 예보와 '가장 좋은 날'이 뜨는가
7. F12 Network에서 목록 로딩이 **2회 호출**로 끝나는가 ★ (Q67)
8. 상세 화면에 들어갈 때만 openweathermap 요청이 추가로 나가는가
9. 같은 지역 상세를 다시 열면 요청이 안 나가는가 (detailLoaded 캐시)

# 질문 받을 확률이 높은 순서

## 확장분

1. **지역을 늘리면서 호출 한도를 어떻게 해결했나** (Q67) — 가장 물어보기 좋은 설계 이야기
2. **Geolocation 실패 처리** (Q70) — 세 가지 경우를 말할 수 있어야 함
3. **테마를 한 벌 CSS로 관리한 방법 / 차트만 예외인 이유** (Q69)
4. **일별 예보를 추가 호출 없이 만든 방법과 한계** (Q71)
5. **API마다 응답이 다른데 화면은 왜 안 고쳤나** (Q68, Q58과 이어짐)

## 과제 7

1. **왜 Element Plus를 골랐나** (Q59) — 트레이드오프까지 말할 것
2. **러닝 지수를 어떻게 계산했나 / 근거는** (Q65) — 컨셉의 핵심, 한계도 같이
3. **el-input으로 바꾸면서 v-model을 왜 안 썼나** (Q62) — 1일차 한글 처리와 연결
4. **다크 모드와 색 커스터마이즈** (Q60, Q61)
5. **ElMessage / ElMessageBox 차이** (Q64) — 취소가 catch로 오는 것까지
6. **기본 요소와 라이브러리 컴포넌트의 이벤트 차이** (Q63)
7. **BaseDashboardCard는 왜 el-card로만 감쌌나** — slot 학습 결과물을 남기려고

## 과제 6

1. **`Promise.all`이 아니라 `allSettled`인 이유** (Q54) — 실패 처리를 설명할 수 있어야 함
2. **컴포넌트에서 axios를 직접 안 부른 이유** (Q51)
3. **인터셉터를 어디에 썼나** (Q53)
4. **API Key를 어떻게 관리했나 / .env면 안전한가** (Q57) — 솔직하게 답할 것
5. **로딩·실패 상태를 어떻게 다뤘나** (Q56)
6. **응답을 왜 스토어에 넣었나** (Q55) — 5일차 Q45와 이어짐
7. **응답 키를 왜 바꿔 담았나** (Q58)

## 과제 5

1. **Pinia를 왜 쓰나 / props로는 왜 안 되나** (Q40) — 가장 먼저 물어볼 부분
2. **모든 상태를 스토어에 올리면 되나** (Q45) — 판단 기준을 말할 수 있어야 함
3. **state를 왜 함수로 돌려주나** (Q42)
4. **getters에서 화살표 함수를 못 쓰는 때** (Q43) — 코드에 실제로 둘 다 있음
5. **`storeToRefs`를 왜 안 썼나** (Q47) — 구조 분해하면 반응성이 끊긴다는 것
6. **원본을 왜 안 바꾸나 / 배지는 왜 섭씨 기준인가** (Q48) — 시연 중 눈에 띌 수 있음
7. **Composable과 Store의 차이** (Q49) — 교재가 (참고)로 언급한 부분
8. **Options 스타일과 setup 스타일** (Q44)

## 과제 4

1. **지연 로딩이 뭐고 왜 하나 / 홈은 왜 정적 import인가** (Q31) — 요구사항에 명시된 부분
2. **Catch-all `:pathMatch(.*)*` 해석과 왜 맨 끝인가** (Q32) — 문법을 설명할 수 있어야 함
3. **RouterLink와 router.push 중 왜 push를 썼나** (Q33) — 요구사항 3이 콕 집은 부분
4. **`onMounted`만으로 안 되는 이유** (Q36) — 시연 중 직접 드러날 수 있음
5. **params와 query의 구분** (Q37)
6. **useRoute / useRouter 차이** (Q35)
7. **탭 방식과 뭐가 다른가** (Q39) — 3일차와 비교해 물어볼 수 있음

## 과제 3

1. **props와 emits** (Q19) — 단방향 데이터 흐름을 말할 수 있어야 함
2. **slot이 왜 필요한가 / props와 뭐가 다른가** (Q20)
3. **slot 내용은 어느 스코프에서 평가되나** (Q21) — 교재가 요구사항 6으로 콕 집은 부분
4. **scoped 스타일이 slot에 안 먹는 이유** (Q22) — 실제로 겪는 함정
5. **1·2일차 fallthrough를 왜 emit으로 바꿨나** (Q23)
6. **컴포넌트 분리 기준** (Q27) — "왜 이만큼만 나눴나"를 물어볼 수 있음

## 과제 2

1. **computed와 watch의 차이** (Q11) — 가장 기본이면서 자주 묻는 것
2. **watch와 watchEffect의 차이** (Q12) — 요구사항이 둘을 나눠 시킨 이유
3. **computed와 일반 함수(메서드)의 차이** (Q10) — 캐싱을 설명할 수 있어야 함
4. **왜 `length`를 감시했나 / deep은 왜 안 썼나** (Q16)
5. **같은 카드 두 번 눌렀는데 왜 로그가 없나** (Q14) — 시연 중 나올 수 있는 질문

## 과제 1

1. **한글 처리를 왜 그렇게 했나** (Q3)
2. **`:key`에 왜 id인가** (Q1)
3. **`.stop`이 없으면 어떻게 되나** (Q4)
4. **emit을 왜 안 썼나** (Q6)

Q11, Q12, Q3, Q19, Q21, Q31, Q36, Q40, Q45, Q54, Q57, Q65, Q67은 소리 내어 한 번 설명해보고 넘어갈 것.
