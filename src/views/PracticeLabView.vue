<script setup>
import { RouterLink } from 'vue-router'
import { practiceDays } from '../data/practiceLog'
import { troubles } from '../data/practiceLog'

// 1~7일차에 무엇을 했는지 모아 둔 화면.
const stack = [
  { name: 'Vue 3', desc: 'script setup 기반 SFC' },
  { name: 'Vue Router 4', desc: '지연 로딩 · 동적 경로 · Catch-all' },
  { name: 'Pinia', desc: '단위 설정 · 즐겨찾기 · 날씨 데이터' },
  { name: 'Axios', desc: '인스턴스 · 인터셉터 · 병렬 호출' },
  { name: 'Element Plus', desc: '폼 · 피드백 · 데이터 표시 컴포넌트' },
  { name: 'Chart.js / Leaflet', desc: '시간대별 그래프 · 러닝 지도' },
]
</script>

<template>
  <div class="lab">
    <section class="surface intro">
      <p class="section-label">실습 아카이브</p>
      <h2 class="title">7일간 무엇을 만들었나</h2>
      <p class="desc">하나의 날씨 화면을 매일 다른 방식으로 다시 만들었습니다. 1~3일차 결과물은 지금도 그대로 남겨 두어 비교할 수 있습니다.</p>

      <div class="stack">
        <div v-for="item in stack" :key="item.name" class="stack-item">
          <p class="stack-name">{{ item.name }}</p>
          <p class="stack-desc">{{ item.desc }}</p>
        </div>
      </div>
    </section>

    <section v-for="entry in practiceDays" :key="entry.day" class="surface day">
      <div class="day-head">
        <div class="day-no">{{ entry.day }}</div>
        <div>
          <p class="day-title">{{ entry.title }}</p>
          <p class="day-topic">{{ entry.topic }}</p>
        </div>
        <RouterLink :to="entry.route" class="day-link">화면 보기</RouterLink>
      </div>

      <ul class="done">
        <li v-for="(line, index) in entry.done" :key="index">{{ line }}</li>
      </ul>

      <p class="day-foot">
        관련 트러블슈팅
        <span class="count">{{ troubles.filter((t) => t.day === entry.day).length }}건</span>
      </p>
    </section>

    <RouterLink to="/troubleshooting" class="cta"> 막혔던 문제 {{ troubles.length }}건 보러 가기 </RouterLink>
  </div>
</template>

<style scoped>
.lab {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.title {
  margin: 0 0 6px;
  font-size: 22px;
  font-weight: 800;
}

.desc {
  margin: 0 0 16px;
  color: var(--text-dim);
  font-size: 13px;
}

.stack {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 8px;
}

.stack-item {
  padding: 10px 12px;
  background-color: var(--surface-2);
  border-radius: var(--radius-sm);
}

.stack-item p {
  margin: 0;
}

.stack-name {
  font-size: 13px;
  font-weight: 700;
}

.stack-desc {
  color: var(--text-faint);
  font-size: 11px;
}

.day-head {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
}

.day-no {
  display: grid;
  place-items: center;
  width: 34px;
  height: 34px;
  flex-shrink: 0;
  background-color: var(--accent);
  border-radius: 10px;
  color: var(--on-accent);
  font-weight: 800;
}

.day-head p {
  margin: 0;
}

.day-title {
  font-size: 15px;
  font-weight: 700;
}

.day-topic {
  color: var(--text-faint);
  font-size: 11.5px;
}

.day-link {
  margin-left: auto;
  color: var(--accent);
  font-size: 12px;
  font-weight: 600;
  text-decoration: none;
  white-space: nowrap;
}

.done {
  margin: 0;
  padding-left: 18px;
  color: var(--text-dim);
}

.done li {
  margin-bottom: 4px;
  font-size: 12.5px;
}

.day-foot {
  margin: 12px 0 0;
  padding-top: 10px;
  border-top: 1px solid var(--line-soft);
  color: var(--text-faint);
  font-size: 11.5px;
}

.count {
  margin-left: 4px;
  color: var(--accent);
  font-weight: 700;
}

.cta {
  padding: 14px;
  background-color: var(--accent);
  border-radius: var(--radius);
  color: var(--on-accent);
  font-weight: 700;
  text-align: center;
  text-decoration: none;
}
</style>
