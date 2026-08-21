<script setup>
import { useRoute, RouterLink } from 'vue-router'

/* ════════════════════════════════════════════════
   [요구사항 1] NotFoundView.vue — Catch-all Route가 그리는 화면
   routes 배열의 어떤 규칙에도 걸리지 않은 주소가 전부 여기로 온다.
   (/kk, /weather/city_01/extra, /practice/abc ...)

   서버가 404를 준 게 아니라 라우터가 매칭에 실패한 것이므로,
   HTTP 상태 코드는 여전히 200이다. '앱 안에서의 404'인 셈이다.
   ════════════════════════════════════════════════ */

const route = useRoute()
</script>

<template>
  <div class="notfound-view">
    <p class="emoji">404</p>

    <h2 class="title">페이지를 찾을 수 없습니다.</h2>

    <p class="desc">
      요청하신 주소가 존재하지 않거나,<br />
      아직 개발되지 않았습니다.
    </p>

    <!-- Catch-all이 잡아낸 실제 경로. route.path로 확인할 수 있다. -->
    <p class="path">
      입력한 주소: <code>{{ route.path }}</code>
    </p>

    <RouterLink class="home-btn" to="/">날씨 메인으로 이동</RouterLink>
  </div>
</template>

<style scoped>
.notfound-view {
  padding: 44px 20px;
  background-color: var(--surface);
  border: 1px solid var(--line-soft);
  border-radius: var(--radius);
  text-align: center;
}

.emoji {
  margin: 0 0 10px;
  font-size: 36px;
  letter-spacing: 6px;
}

.title {
  margin: 0 0 10px;
  font-size: 18px;
}

.desc {
  margin: 0 0 14px;
  color: var(--text-dim);
}

.path {
  margin: 0 0 18px;
  color: var(--text-faint);
  font-size: 12px;
}

.path code {
  padding: 1px 6px;
  background-color: var(--surface-2);
  border-radius: 4px;
  color: var(--warn);
}

.home-btn {
  display: inline-block;
  padding: 9px 22px;
  background-color: var(--accent);
  border-radius: 999px;
  color: #10160a;
  font-weight: 600;
  text-decoration: none;
}
</style>
