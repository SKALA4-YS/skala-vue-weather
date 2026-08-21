import { createRouter, createWebHistory } from 'vue-router'
import WeatherHomeView from '../views/WeatherHomeView.vue'

/* ════════════════════════════════════════════════
   [요구사항 1] Vue Router 설정
   - 라우트 규칙(routes 배열) 정의
   - 라우터 지연 로딩(Lazy Loading) 적용
   - Catch-all Route 적용
   ════════════════════════════════════════════════ */

const routes = [
  {
    path: '/',
    name: 'weather-home',
    component: WeatherHomeView,
    /*
      메인 화면만 위에서 import로 즉시 불러온다(정적 import).
      어차피 앱을 열자마자 100% 보게 되는 화면이라, 따로 쪼개면
      "첫 화면을 그리기 위해 파일을 한 번 더 받아오는" 왕복만 늘어난다.
    */
  },
  {
    path: '/about',
    name: 'weather-about',
    // 지연 로딩(Lazy Loading): 화살표 함수 안의 import()는 '지금 실행'이 아니라
    // '나중에 이 경로로 들어오면 그때 실행'된다.
    // 빌드할 때 이 파일은 별도 청크로 잘려 나가고, 사용자가 /about을 눌러야 다운로드된다.
    component: () => import('../views/WeatherAboutView.vue'),
  },
  {
    /*
      동적 경로 매칭. :cityId 자리에 들어온 값은 route.params.cityId로 꺼내 쓴다.
      /weather/city_01 → params.cityId === 'city_01'
    */
    path: '/weather/:cityId',
    name: 'weather-detail',
    component: () => import('../views/WeatherDetailView.vue'),
  },
  {
    // 주간 계획. 5일 예보로 언제 뛸지 고른다.
    path: '/week',
    name: 'week-plan',
    component: () => import('../views/WeekPlanView.vue'),
  },
  {
    // 7일차: 러닝 지수 화면. 도시는 ?city= 쿼리로 고른다.
    path: '/running',
    name: 'running-index',
    component: () => import('../views/RunningIndexView.vue'),
  },
  {
    // [요구사항 6] 추가 view ①: 기온·미세먼지 순위표
    path: '/ranking',
    name: 'weather-ranking',
    component: () => import('../views/WeatherRankingView.vue'),
  },
  {
    /*
      [요구사항 6] 추가 view ②: 1~3일차 과제 보관함.
      3일차까지는 App.vue의 탭 버튼으로 갈아 끼우던 화면인데, 이제 URL로 구분한다.
      :day(\d+) 는 정규식 제약이다. 숫자만 :day에 매칭되므로
      /practice/abc 는 이 규칙에 걸리지 않고 아래 Catch-all로 떨어진다.
    */
    path: '/practice/:day(\\d+)',
    name: 'practice-archive',
    component: () => import('../views/PracticeArchiveView.vue'),
  },
  {
    // /weather 처럼 도시 코드 없이 들어오면 목록으로 돌려보낸다.
    path: '/weather',
    redirect: { name: 'weather-home' },
  },
  {
    /*
      [요구사항 1] Catch-all Route.
      위의 어떤 규칙에도 걸리지 않은 주소를 전부 받아낸다. 반드시 배열의 맨 끝에 둔다.
      위에서부터 순서대로 매칭하기 때문에, 이걸 위로 올리면 모든 경로가 여기서 잡혀 버린다.

      :pathMatch(.*)*  →  파라미터 이름은 pathMatch, (.*)는 '아무 문자나',
      맨 끝의 *는 '/로 나뉜 여러 조각도 통째로' 받겠다는 뜻이다.
      그래서 /kk 뿐 아니라 /a/b/c 같은 주소도 여기로 온다.
    */
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: () => import('../views/NotFoundView.vue'),
  },
]

const router = createRouter({
  /*
    createWebHistory: 브라우저의 History API를 쓰는 모드.
    주소가 /about 처럼 깔끔하게 나온다. (# 이 붙는 방식은 createWebHashHistory)
  */
  history: createWebHistory(),
  routes,

  // 화면을 옮길 때마다 스크롤을 맨 위로. 뒤로 가기일 때는 원래 보던 위치로 되돌린다.
  scrollBehavior(to, from, savedPosition) {
    return savedPosition || { top: 0 }
  },
})

export default router
