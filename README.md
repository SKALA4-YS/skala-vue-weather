# Running Weather

날씨를 러닝 적합도로 바꿔 보여주는 대시보드입니다.
SKALA Vue.js 과정의 실습 과제를 하나의 프로젝트로 이어 만들었습니다.

기온·습도·미세먼지·바람·강수확률·자외선을 조합해 100점 만점의 러닝 지수를 계산하고,
전국 30개 지역을 지도와 목록으로 비교할 수 있습니다.

배포: https://skala-vue-weather-murex.vercel.app

## 실행

```bash
npm install
cp .env.example .env      # OpenWeatherMap API Key 입력
npm run dev
```

http://localhost:3000 으로 접속합니다.

API Key가 없어도 목록과 지도는 동작합니다. 목록은 키가 필요 없는 Open-Meteo를 쓰기 때문입니다.
키가 있어야 상세 화면의 예보와 대기오염, 주간 계획이 채워집니다.

| 명령 | 설명 |
| --- | --- |
| `npm run dev` | 개발 서버 (3000 포트) |
| `npm run build` | 배포용 빌드 (production 모드) |
| `npm run build:staging` | 검증용 빌드 |
| `npm run lint` | ESLint 검사 및 자동 수정 |
| `npm run format` | Prettier 포맷 |

## 화면

| 경로 | 내용 |
| --- | --- |
| `/` | 지도, 오늘의 요약, 30개 지역 목록 |
| `/running` | 러닝 지수 분석, 감점 내역, 시간대별 그래프 |
| `/week` | 5일 예보로 보는 주간 계획 |
| `/ranking` | 뛰기 좋은 순 · 기온순 · 공기순 |
| `/weather/:cityId` | 지역 상세 관측 정보 |
| `/lab` | 일차별 실습 기록 |
| `/troubleshooting` | 작업하며 막혔던 15가지 |
| `/practice/:day` | 1~3일차 과제 화면 보관 |

## 기술

Vue 3, Vue Router 4, Pinia, Axios, Element Plus, Chart.js, Vite.

## 폴더 구조

```
src/
  main.js                  진입점. 라우터·Pinia·Element Plus 등록
  App.vue                  헤더, 내비게이션, RouterView
  router/index.js          라우트 규칙과 지연 로딩
  stores/
    configStore.js         단위(°C/°F)와 테마. Options 스타일
    favoriteStore.js       즐겨찾기. setup 스타일
    weatherStore.js        API 응답과 로딩·에러 상태
  services/
    weatherApi.js          OpenWeatherMap 호출과 응답 변환
    openMeteoApi.js        Open-Meteo 배치 조회, 자외선, 일출/일몰
  composables/
    useDisplayTemp.js      섭씨/화씨 변환
    useRunningIndex.js     러닝 지수 계산
    useWeatherScene.js     배경 씬 판정
  data/
    cities.js              전국 30개 지역 좌표
    koreaMap.js            남한 시도 경계 SVG path
    practiceLog.js         실습 기록과 트러블슈팅
  components/exercise/     화면을 구성하는 부품들
  views/                   페이지 단위 컴포넌트
```

## 러닝 지수

`composables/useRunningIndex.js`에서 계산합니다. 100점에서 시작해 항목별로 깎습니다.

| 항목 | 감점 없는 구간 | 근거 |
| --- | --- | --- |
| 기온 | 10~18°C | 지구력 운동에 유리한 구간 |
| 습도 | 40~65% | 땀이 증발할 수 있는 범위 |
| 미세먼지 | 30㎍/㎥ 이하 | 환경부 등급 경계 (30/80/150) |
| 바람 | 3m/s 이하 | 그 이상은 저항이 됨 |
| 강수확률 | 30% 이하 | |
| 자외선 | 5 이하 | Open-Meteo 값이 있을 때만 |

가중치를 곱해 합산하는 대신 감점 방식을 쓴 이유는, 무엇 때문에 몇 점이 깎였는지
화면에 그대로 보여줄 수 있기 때문입니다. 점수만 보여주면 그 숫자를 믿을 근거가 없습니다.

배점 결과입니다.

```
이상적 (15도/50%/청정)      100점 최고
초여름 맑음 (24도/60%)       94점 최고
한여름 습함 (28도/85%)       73점 좋음
한파 (-5도/바람7)            59점 보통
장마 (25도/94%/비100%)       47점 나쁨
미세먼지 최악 (180)          44점 나쁨
폭염 (34도/70%)              38점 위험
```

처음에는 비 오는 날이 폭염보다 낮게 나왔습니다. 비는 불편한 정도지만 폭염은 실제로 위험한데
우선순위가 뒤집힌 셈이라, 강수확률 기울기를 낮추고 32도(폭염주의보 기준)를 넘으면
급격히 깎이도록 고쳤습니다.

의학적 기준이 아니라 이 앱에서 정한 배점이라는 안내를 화면에도 적어 두었습니다.

## API 사용

두 곳에서 데이터를 받습니다.

| 용도 | API | 호출 수 |
| --- | --- | --- |
| 목록 30개 지역 | Open-Meteo | 2회 |
| 지역 하나의 상세 | OpenWeatherMap | 3회 |

처음에는 전부 OpenWeatherMap으로 받았는데, 지역을 30개로 늘리자
30 × 3 = 90회가 되어 무료 한도(분당 60회)를 넘겼습니다.

Open-Meteo는 좌표를 콤마로 이어 붙이면 여러 지점을 한 번에 돌려줍니다.
목록에 필요한 값은 이쪽에서 두 번의 호출로 받고, 예보와 대기오염이 필요한 상세 화면에서만
OpenWeatherMap을 부릅니다. 한 번 받은 지역은 다시 부르지 않습니다.

Open-Meteo는 설명 문구 대신 WMO 코드만 주기 때문에, 코드를 한글 설명과 아이콘으로
바꾸는 표를 `openMeteoApi.js`에 두었습니다.

## 지도

남한만 SVG로 직접 그렸습니다. 처음에는 Leaflet + OpenStreetMap 타일을 썼는데
중국과 일본이 크게 잡혀 정작 남한이 작게 보였습니다.

통계청 시도 경계 GeoJSON을 SVG path로 변환해 42KB로 내장했고, 외부 요청이 없습니다.
위경도를 SVG 좌표로 옮기는 투영식은 경계와 마커가 함께 씁니다.

비스듬히 내려다보는 각도는 세로를 `scale(1, 0.62)`로 눌러서 만들었습니다.
CSS `rotateX`는 원근이 섞여 마커 위치가 어긋나는데, SVG `scale`은 좌표계가 그대로라
마커도 같은 식으로 계산하면 정확히 맞습니다.

지역은 점수만큼 솟는 기둥으로 표시합니다. 색만 쓸 때보다 높낮이가 먼저 읽힙니다.

## 배경

지금 시각·날씨·계절에 따라 배경 장면이 바뀝니다. 밤이거나 비가 오면 도시 실루엣을,
그밖에는 계절 색을 입힌 언덕과 나무를 그립니다. 아래쪽에는 러너가 지나갑니다.

콘텐츠 가독성을 위해 씬 전체를 `opacity: 0.5`로 낮추고 배경색 덮개를 한 장 덮었습니다.
`prefers-reduced-motion`을 켠 환경에서는 애니메이션이 멈춥니다.

## 일차별 구현

| 일차 | 주제 | 내용 |
| --- | --- | --- |
| 1 | Mockup | `v-for` + `:key`, `v-if`, `:value`/`@input`으로 한글 IME 처리, `.stop` |
| 2 | Composition | `computed` 캐싱, `watch`, `watchEffect`, 다중 소스 감시 |
| 3 | Component | props/emits 단방향 흐름, named slot, `<style scoped>` |
| 4 | Router | 지연 로딩, 동적 경로, Catch-all, `router.push` |
| 5 | Pinia | Options·setup 두 스타일, composable, localStorage |
| 6 | Axios | 인스턴스와 인터셉터, `Promise.allSettled` 병렬 호출 |
| 7 | UI Library | Element Plus, 러닝 지수 컨셉, 30개 지역 확대 |
| 8 | Deployment | ESLint/Prettier, 환경 변수, 빌드, Vercel |

1~3일차 화면은 `/practice/1` ~ `/practice/3`에 그대로 남겨 두었습니다.

## 환경 변수

```
VITE_OPENWEATHER_API_KEY=발급받은_키
```

Vite는 `VITE_`로 시작하는 변수만 클라이언트 코드에 넘겨줍니다.
`.env`는 `.gitignore`에 있고 `.env.example`만 저장소에 있습니다.

다만 `VITE_`를 붙인 순간 그 값은 빌드된 JS에 그대로 들어가므로 브라우저에서 볼 수 있습니다.
`.env`는 실수로 저장소에 올리는 것을 막을 뿐, 프론트엔드에서 키를 숨길 수는 없습니다.
실제 서비스라면 서버를 두고 서버가 키를 들고 대신 호출해야 합니다.

빌드 모드별로 `.env.staging`, `.env.production`을 두었습니다.

## 배포

Vercel에 GitHub 저장소를 연결했습니다. `main`에 push하면 자동으로 다시 배포됩니다.

`vercel.json`에 SPA rewrite가 있습니다. 이게 없으면 `/running`으로 직접 접속했을 때
서버가 그 경로의 파일을 찾다가 404를 냅니다.

```json
{ "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }] }
```

Vercel 프로젝트 설정의 Environment Variables에 `VITE_OPENWEATHER_API_KEY`를 등록해야
상세 화면과 주간 계획이 채워집니다.

## 트러블슈팅

작업하며 막혔던 15가지를 증상·원인·해결로 정리해 `/troubleshooting` 화면에 담았습니다.
몇 가지만 옮기면 이렇습니다.

- 한글 입력 시 글자가 깨짐 — IME 조합 중인 값을 상태에 넣어 조합 버퍼가 끊김
- scoped 스타일이 slot 내용에 안 먹음 — 슬롯 내용은 부모 스코프에서 컴파일됨
- 상세에서 다른 지역으로 이동해도 화면이 그대로 — 같은 경로 규칙이면 컴포넌트를 재사용해 `onMounted`가 다시 실행되지 않음
- 지역을 30개로 늘리자 429 — 호출 수 설계를 다시 함
- 다크 모드에서 차트 색만 그대로 — Chart.js는 캔버스라 CSS 변수를 읽지 못함
- 빗줄기가 화면에 안 보임 — 가독성용 덮개보다 먼저 그려서 덮여 있었음
