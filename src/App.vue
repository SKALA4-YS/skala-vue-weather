<script setup>
import { RouterLink, RouterView } from 'vue-router'
import UnitToggler from './components/exercise/UnitToggler.vue'
import ThemeToggler from './components/exercise/ThemeToggler.vue'
import WeatherScene from './components/exercise/WeatherScene.vue'
import ShoeMark from './components/exercise/ShoeMark.vue'

// 4일차: 화면 전환 상태가 없다. 지금 어떤 화면인지는 URL이 들고 있다.
// 5일차: 두 토글러는 props도 이벤트도 없이 스토어에서 값을 꺼내 쓴다.
const navItems = [
  { to: '/', label: '대시보드' },
  { to: '/running', label: '러닝 지수' },
  { to: '/week', label: '주간 계획' },
  { to: '/ranking', label: '지역 순위' },
  { to: '/lab', label: '실습 아카이브' },
]
</script>

<template>
  <!-- 지금 날씨·시각·계절에 맞춘 배경. 화면 전체에 깔린다. -->
  <WeatherScene />

  <div id="top" class="app">
    <header class="app-header">
      <RouterLink to="/" class="brand">
        <ShoeMark :size="38" />
        <span class="brand-text">
          <span class="brand-name">RUNNING<em>WEATHER</em></span>
          <span class="brand-sub">오늘 뛰기 좋은 날인가</span>
        </span>
      </RouterLink>

      <div class="header-tools">
        <UnitToggler />
        <ThemeToggler />
      </div>
    </header>

    <nav class="app-nav">
      <RouterLink v-for="item in navItems" :key="item.to" :to="item.to" class="nav-item">
        {{ item.label }}
      </RouterLink>
    </nav>

    <main class="app-main">
      <RouterView v-slot="{ Component }">
        <Transition name="fade" mode="out-in">
          <component :is="Component" />
        </Transition>
      </RouterView>
    </main>

    <footer class="app-foot">
      <span>SKALA Vue 실습 · OpenWeatherMap · Open-Meteo</span>
      <RouterLink to="/troubleshooting" class="foot-link">트러블슈팅</RouterLink>
      <RouterLink to="/about" class="foot-link">소개</RouterLink>
    </footer>
  </div>
</template>

<style scoped>
.app {
  position: relative;
  z-index: 1;
  max-width: 1000px;
  margin: 0 auto;
  padding: 24px 20px 48px;
}

.app-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 18px;
}

.brand {
  display: flex;
  align-items: center;
  gap: 10px;
  color: inherit;
  text-decoration: none;
}

.brand :deep(.plate) {
  filter: drop-shadow(0 3px 8px rgba(10, 132, 255, 0.4));
}

.brand-text {
  display: flex;
  flex-direction: column;
  line-height: 1.25;
}

.brand-name {
  font-size: 13px;
  font-weight: 800;
  letter-spacing: 0.1em;
}

.brand-sub {
  color: var(--text-faint);
  font-size: 11px;
}

.header-tools {
  display: flex;
  align-items: center;
  gap: 10px;
}

.app-nav {
  display: flex;
  gap: 4px;
  margin-bottom: 20px;
  padding: 4px;
  background-color: var(--surface);
  border: 1px solid var(--line-soft);
  border-radius: 999px;
  box-shadow: var(--shadow), var(--edge);
  overflow-x: auto;
}

.nav-item {
  flex: 1;
  padding: 9px 12px;
  border-radius: 999px;
  color: var(--text-dim);
  font-size: 13.5px;
  font-weight: 700;
  letter-spacing: 0.01em;
  text-align: center;
  text-decoration: none;
  white-space: nowrap;
  transition:
    background-color 0.15s ease,
    color 0.15s ease;
}

.nav-item:hover {
  color: var(--accent);
}

/* '/'는 모든 경로의 접두사라 exact 쪽을 써야 항상 켜져 있지 않다 */
.nav-item.router-link-exact-active {
  background-image: linear-gradient(180deg, #3d9bff 0%, var(--accent) 100%);
  color: var(--on-accent);
  font-weight: 700;
  box-shadow: 0 2px 8px rgba(10, 132, 255, 0.4);
}

.app-main {
  min-height: 300px;
}

.app-foot {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  margin-top: 32px;
  color: var(--text-faint);
  font-size: 11.5px;
}

.foot-link {
  color: var(--text-faint);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.16s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
