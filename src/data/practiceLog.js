// 실습 기록과 트러블슈팅. 화면 두 곳에서 읽는다.

export const practiceDays = [
  {
    day: 1,
    title: 'Mockup',
    topic: 'v-for / v-if / 폼 바인딩 / 이벤트 수식어',
    done: [
      '배열 렌더링에 :key로 인덱스 대신 id를 바인딩',
      '기온 25도 기준 v-if / v-else 라벨 분기',
      'v-model 대신 :value + @input을 직접 연결하고 한글 조합(IME) 처리',
      '@click.stop으로 상세보기 버튼의 버블링 차단',
      '미세먼지 등급 배지, 외출 준비물 추천, 정렬·필터를 직접 추가',
    ],
    route: '/practice/1',
  },
  {
    day: 2,
    title: 'Composition',
    topic: 'computed / watch / watchEffect',
    done: [
      '함수로 쓰던 목록 가공을 computed로 바꿔 캐싱 적용',
      'watch로 선택 도시 변화를 감지해 상태바 문구 갱신',
      'watchEffect로 검색어 변화를 자동 추적 (최초 1회 즉시 실행)',
      '다중 소스 watch와 getter로 좁힌 watch(결과 개수)를 추가',
      '화면에 Watcher 모니터링 패널을 만들어 로그를 눈으로 확인',
    ],
    route: '/practice/2',
  },
  {
    day: 3,
    title: 'Component',
    topic: 'props / emits / slot / scoped style',
    done: [
      '기능 변경 없이 한 화면을 8개 컴포넌트로 분리',
      'BaseDashboardCard에 named slot을 두어 패널 디자인을 공통화',
      '자식은 props로 받고 emits로 알리는 단방향 흐름 유지',
      'fallthrough 대신 이름 붙인 이벤트(select-card / click-detail)로 전환',
      '컴포넌트마다 <style scoped>로 스타일 격리',
    ],
    route: '/practice/3',
  },
  {
    day: 4,
    title: 'Vue Router',
    topic: '지연 로딩 / 동적 경로 / Catch-all',
    done: [
      '라우트 규칙 정의와 화면 단위 지연 로딩 적용',
      'Catch-all Route로 정의되지 않은 주소 처리',
      '동적 경로 매칭(/weather/:cityId)과 Mount 시점 데이터 조회',
      '상세보기의 window.alert를 router.push로 교체',
      '검색어를 URL 쿼리에 동기화해 새로고침·공유에도 유지',
    ],
    route: '/weather/city_01',
  },
  {
    day: 5,
    title: 'Pinia',
    topic: 'state / getters / actions / composable',
    done: [
      'configStore를 Options 스타일로, favoriteStore를 setup 스타일로 작성해 비교',
      '단위 설정을 전역 스토어로 올려 props drilling 제거',
      '섭씨→화씨 변환 로직을 composable로 묶어 여러 화면에서 재사용',
      'localStorage 연동으로 새로고침 후에도 설정 유지',
    ],
    route: '/running',
  },
  {
    day: 6,
    title: 'Axios',
    topic: 'API 연동 / 인터셉터 / 비동기 상태',
    done: [
      'axios 인스턴스와 응답 인터셉터로 공통 설정과 에러 메시지 정리',
      '현재 날씨·대기오염·예보를 Promise.allSettled로 병렬 호출',
      '응답을 화면이 쓰던 키 이름으로 변환해 템플릿 수정 없이 실데이터 적용',
      'Open-Meteo(자외선·일출/일몰)를 다른 제공자 API로 추가',
      '로딩·실패 상태를 스토어에 두고 실패해도 화면이 비지 않게 처리',
    ],
    route: '/weather/city_01',
  },
  {
    day: 7,
    title: 'UI Library',
    topic: 'Element Plus / 컨셉 확장',
    done: [
      'Element Plus 적용 (el-switch · el-progress · ElMessage · ElMessageBox)',
      '러닝 지수 컨셉: 100점에서 항목별 감점, 감점 내역을 화면에 노출',
      '전국 30개 지역으로 확대하고 목록은 Open-Meteo 배치 조회로 전환',
      '라이트(기본)/다크 테마, Geolocation, 5일 예보, 러닝 지도 추가',
    ],
    route: '/',
  },
]

/* 실제로 막혔던 것만 적었다. 증상 → 원인 → 해결 순서. */
export const troubles = [
  {
    id: 'tb-01',
    day: 1,
    title: '한글을 입력하면 글자가 깨짐',
    tag: '반응형',
    symptom: "검색창에 '서울'을 치면 '서서울', '서우ㄹ'처럼 어긋난 글자가 남았다.",
    cause:
      '한글은 자음·모음을 조합해 한 글자를 만든다. 조합 중인 미완성 값까지 @input으로 들어오는데, 그 값을 상태에 넣으면 :value가 input을 다시 덮어써서 브라우저의 조합 버퍼가 끊긴다.',
    fix: 'compositionstart / compositionend로 조합 여부를 플래그에 두고, 조합 중 들어오는 input은 무시한 뒤 조합이 끝난 확정 값만 반영했다. Vue의 v-model 내부 구현(vModelText)이 쓰는 방식과 같다.',
    file: 'components/exercise/SearchBar.vue',
  },
  {
    id: 'tb-02',
    day: 3,
    title: 'scoped 스타일이 slot 내용에 적용되지 않음',
    tag: '스타일',
    symptom:
      'BaseDashboardCard의 <style scoped>에서 .card-body p를 지정했는데 슬롯으로 들어온 내용에 먹지 않았다.',
    cause:
      '슬롯으로 전달되는 내용은 부모 스코프에서 컴파일되어 부모의 data-v 속성을 달고 온다. 자식의 scoped 셀렉터 조건과 맞지 않는다.',
    fix: '슬롯에 들어갈 컴포넌트가 각자 자기 <style scoped>를 갖게 했다. 3일차 요구사항(컴포넌트별 스타일 분리)과도 맞는 방향이었다.',
    file: 'components/exercise/BaseDashboardCard.vue',
  },
  {
    id: 'tb-03',
    day: 4,
    title: '상세 화면에서 다른 지역으로 이동해도 내용이 그대로',
    tag: '라우터',
    symptom:
      '상세 화면의 이전/다음 지역 링크를 눌러도 주소만 바뀌고 화면 내용이 바뀌지 않았다.',
    cause:
      '경로 규칙이 같으면(/weather/:cityId → /weather/:cityId) Vue가 컴포넌트를 재사용한다. unmount → mount가 일어나지 않아 onMounted가 다시 실행되지 않는다.',
    fix: 'route.params.cityId 자체를 watch해서 파라미터만 바뀌는 이동도 잡아냈다. <RouterView :key="$route.fullPath">로 강제 재생성하는 방법도 있지만 매번 다시 그리는 비용이 든다.',
    file: 'views/WeatherDetailView.vue',
  },
  {
    id: 'tb-04',
    day: 6,
    title: 'API Key를 넣었는데 401이 계속 남',
    tag: 'API',
    symptom: '키를 .env에 넣고 서버를 재시작해도 Invalid API key가 반환됐다.',
    cause:
      '키 형식은 정상이었고, OpenWeatherMap이 발급 직후 키를 바로 활성화하지 않기 때문이었다. curl로 직접 호출해 앱 코드 문제가 아님을 먼저 확인했다.',
    fix: '기다렸다가 다시 호출해 정상 응답을 확인했다. 그 사이에도 앱이 동작하도록, 키가 없거나 실패하면 폴백 데이터로 화면을 그리고 안내만 띄우게 만들어 두었다.',
    file: 'services/weatherApi.js',
  },
  {
    id: 'tb-05',
    day: 6,
    title: '.env에 넣어야 할 키를 .env.example에 넣음',
    tag: '보안',
    symptom: '실제 API Key가 커밋 대상 파일(.env.example)에 들어가 있었다.',
    cause:
      '.env는 gitignore 대상이지만 .env.example은 커밋된다. 두 파일의 역할을 혼동하면 키가 그대로 저장소에 올라간다.',
    fix: '키를 .env로 옮기고 .env.example은 이름만 남겼다. git status에 .env가 뜨지 않는 것까지 확인했다. 커밋 이력이 없던 시점이라 유출은 없었다.',
    file: '.env.example',
  },
  {
    id: 'tb-06',
    day: 7,
    title: 'PrimeVue 설치 후 빌드가 테마를 찾지 못함',
    tag: '의존성',
    symptom:
      'Rolldown failed to resolve import "@primeuix/themes/aura" 오류로 빌드가 실패했다.',
    cause:
      'npm이 PrimeVue 5를 설치했는데 5는 테마 패키지 경로가 다르고 @primeui/license-manager 의존이 붙는다. 불필요한 @primevue/themes를 제거하는 과정에서 실제 테마 패키지까지 함께 삭제됐다.',
    fix: '학습 자료가 많고 라이선스 게이팅이 없는 PrimeVue 4로 내려 맞췄다. 이후 교재가 다루는 Element Plus로 전환하면서 이 의존성은 모두 정리했다.',
    file: 'package.json',
  },
  {
    id: 'tb-07',
    day: 7,
    title: 'OS가 다크 모드면 화면이 깨짐',
    tag: '스타일',
    symptom: '흰 배경 카드 위에 검은 버튼이 놓여 대비가 무너졌다.',
    cause:
      'PrimeVue의 darkModeSelector 기본값이 system이라 OS 설정을 따라 컴포넌트만 어두워졌다. 직접 만든 스타일은 밝은 상태 그대로였다.',
    fix: '존재하지 않는 셀렉터를 지정해 자동 전환을 껐다. 이후 라이트/다크를 직접 지원하면서, html의 클래스를 앱이 제어하는 방식으로 정리했다.',
    file: 'src/main.js',
  },
  {
    id: 'tb-08',
    day: 7,
    title: '지역을 30개로 늘리자 429가 발생',
    tag: 'API',
    symptom: '목록을 두 번 새로고침하면 호출 한도 초과 응답이 왔다.',
    cause:
      '30개 지역 × 3개 엔드포인트 = 90회. OpenWeatherMap 무료 요금제는 분당 60회다.',
    fix: '데이터 출처를 나눴다. 목록은 좌표를 콤마로 이어 붙여 한 번에 조회할 수 있는 Open-Meteo로 바꿔 2회로 줄이고, 예보·대기오염이 필요한 상세 화면에서만 OpenWeatherMap을 호출한다. 한 번 받은 지역은 다시 부르지 않는다.',
    file: 'services/openMeteoApi.js',
  },
  {
    id: 'tb-09',
    day: 7,
    title: '다크 모드로 바꿔도 차트 색이 그대로',
    tag: '스타일',
    symptom: '테마를 전환하면 화면은 바뀌는데 그래프 선과 눈금만 이전 색으로 남았다.',
    cause:
      'Chart.js는 캔버스에 직접 그리기 때문에 CSS 변수(var(--accent))를 읽지 못한다. 문자열이 그대로 색으로 해석되지 않는다.',
    fix: 'configStore.isDark를 보고 실제 색값을 계산해 넘기고, 테마 변경을 watch해서 차트를 destroy 후 다시 그린다. el-progress의 color 속성도 같은 이유로 색값을 넘겨야 했다.',
    file: 'components/exercise/LineChart.vue',
  },
  {
    id: 'tb-10',
    day: 7,
    title: 'Element Plus로 바꾸자 정렬 드롭다운이 동작하지 않음',
    tag: 'UI',
    symptom: '정렬을 바꿔도 목록 순서가 그대로였다.',
    cause:
      '기본 <select>는 @change에 이벤트 객체를 넘겨 e.target.value로 값을 꺼내지만, el-select는 값 자체를 넘긴다. e.target.value가 undefined가 됐다.',
    fix: '핸들러가 값을 직접 받도록 고쳤다. 다만 같은 파일의 @compositionend는 네이티브 이벤트라 여전히 e.target.value를 쓴다. 한 컴포넌트 안에 두 방식이 섞여 있다는 점을 주석에 남겼다.',
    file: 'components/exercise/ViewOptions.vue',
  },
  {
    id: 'tb-11',
    day: 7,
    title: '지도 마커에 스타일이 적용되지 않음',
    tag: '스타일',
    symptom: 'divIcon으로 만든 핀에 <style scoped>의 규칙이 전혀 먹지 않았다.',
    cause:
      'Leaflet은 마커를 컴포넌트 템플릿이 아니라 자바스크립트로 직접 DOM에 넣는다. Vue가 붙이는 data-v 속성이 없어서 scoped 셀렉터와 맞지 않는다.',
    fix: '마커 스타일만 scoped가 아닌 전역 <style> 블록으로 분리하고, 클래스 이름에 run- 접두사를 붙여 다른 스타일과 충돌하지 않게 했다.',
    file: 'components/exercise/RunningMap.vue',
  },
  {
    id: 'tb-12',
    day: 7,
    title: 'applyTheme is not a function',
    tag: '스토어',
    symptom: '테마 기능을 넣자마자 앱이 실행되지 않고 콘솔에 함수가 없다는 오류가 떴다.',
    cause:
      '스토어에 action을 추가하는 편집이 실제로는 적용되지 않은 채 main.js에서 먼저 호출했다. getters 블록만 수정되고 actions 블록이 그대로였다.',
    fix: 'actions에 applyTheme / toggleTheme을 추가했다. 저장 후에는 파일을 다시 열어 반영 여부를 확인하는 절차를 넣었다.',
    file: 'stores/configStore.js',
  },
]

export const troubleTags = ['전체', 'API', '반응형', '라우터', '스토어', 'UI', '스타일', '의존성', '보안']
