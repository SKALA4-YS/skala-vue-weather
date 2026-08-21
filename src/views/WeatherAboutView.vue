<script setup>
import { RouterLink } from 'vue-router'
import BaseDashboardCard from '../components/exercise/BaseDashboardCard.vue'

/* ════════════════════════════════════════════════
   [요구사항 5] WeatherAboutView.vue — '/about'
   상태도 props도 없는 정적 페이지다.
   이런 화면일수록 지연 로딩의 효과가 크다. 서비스 소개를 안 보고 나가는 사용자는
   이 파일을 아예 내려받지 않는다. (router/index.js에서 () => import(...)로 등록)
   ════════════════════════════════════════════════ */
</script>

<template>
  <div class="about-view">
    <BaseDashboardCard>
      <template #title>서비스 소개</template>

      <p class="intro">
        본 앱은 Vue 3 · Vue Router 4 · Pinia · Axios를 기반으로 제작된 실습용 기상 관측
        대시보드입니다. 날씨 데이터는 OpenWeatherMap에서, 자외선·일출 정보는 Open-Meteo에서 받아옵니다.
      </p>

      <ul class="feature-list">
        <li><code>components/exercise/</code> 폴더 내부의 독립 부품 컴포넌트 연동</li>
        <li>클라이언트 사이드 라우팅을 통한 새로고침 없는 화면 전환</li>
        <li>URL 쿼리 스트링(<code>?q=</code>) 매핑을 활용한 실시간 검색 상태 동기화</li>
        <li>동적 경로 매칭(<code>/weather/:cityId</code>) 기반 지역 상세 조회</li>
        <li>Catch-all Route를 이용한 잘못된 주소 안내</li>
        <li>Pinia 전역 스토어를 통한 섭씨/화씨 단위 일괄 전환</li>
        <li>즐겨찾기 도시 스토어 및 브라우저 저장소 연동</li>
        <li>Axios 인스턴스와 인터셉터를 이용한 외부 API 연동</li>
        <li>현재 날씨 · 대기오염 · 3시간 예보 등 복수 엔드포인트 병렬 호출</li>
      </ul>

      <template #footer>
        SKALA Vue 실습 · 4일차(Vue Router) · 5일차(Pinia) · 6일차(Axios)
      </template>
    </BaseDashboardCard>

    <!-- 선언적 이동. 단순히 '누르면 저기로 간다'가 전부일 때는 RouterLink가 정답이다.
         router.push는 이동 전에 판단할 것이 있을 때 쓴다. -->
    <RouterLink class="home-btn" to="/">대시보드 홈으로 이동</RouterLink>
  </div>
</template>

<style scoped>
.intro {
  margin: 0 0 12px;
  color: var(--text-dim);
}

.feature-list {
  margin: 0;
  padding-left: 18px;
  color: var(--text-dim);
}

.feature-list li {
  margin-bottom: 5px;
  font-size: 13px;
}

code {
  padding: 1px 6px;
  background-color: var(--surface-2);
  border-radius: 4px;
  color: var(--accent);
  font-size: 11.5px;
}

.home-btn {
  display: block;
  margin-top: 14px;
  padding: 11px;
  background-color: var(--accent);
  border-radius: var(--radius-sm);
  color: #10160a;
  font-weight: 600;
  text-align: center;
  text-decoration: none;
}
</style>
