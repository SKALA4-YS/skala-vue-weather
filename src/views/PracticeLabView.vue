<script setup>
import { RouterLink } from 'vue-router'
import Assignment1 from './Assignment1.vue'
import Assignment2 from './Assignment2.vue'
import WeatherParent from './WeatherParent.vue'
import { practiceDays, troubles } from '../data/practiceLog'

// 회차별로 무엇을 요구했고 무엇을 만들었는지 한 페이지에 모은다.
// 1~3일차는 결과물이 지금도 남아 있어서 화면을 그대로 얹었다.
const embeds = {
  1: Assignment1,
  2: Assignment2,
  3: WeatherParent,
}

const troubleCount = (day) => troubles.filter((item) => item.day === day).length

// `코드` 표기를 <code>로 바꾼다. 요구사항 문구에 문법 이름이 자주 나온다.
const withCode = (text) => text.replace(/`([^`]+)`/g, '<code>$1</code>')
</script>

<template>
  <div class="lab">
    <header class="lab-head">
      <p class="eyebrow">PRACTICE ARCHIVE</p>
      <h1 class="title">실습 아카이브</h1>
      <p class="desc">Vue 문법부터 배포까지, 여덟 번의 실습 기록</p>
    </header>

    <!-- 목차 -->
    <nav class="toc">
      <a v-for="entry in practiceDays" :key="entry.day" class="toc-item" :href="`#day-${entry.day}`">
        <span class="toc-no">{{ String(entry.day).padStart(2, '0') }}</span>
        <span class="toc-text">
          <b>{{ entry.title }}</b>
          <em>{{ entry.topic }}</em>
        </span>
        <span class="toc-arrow" aria-hidden="true">↓</span>
      </a>
    </nav>

    <section v-for="entry in practiceDays" :id="`day-${entry.day}`" :key="entry.day" class="lesson">
      <header class="lesson-head">
        <span class="lesson-no">{{ String(entry.day).padStart(2, '0') }}</span>
        <div class="lesson-title">
          <h2>{{ entry.title }}</h2>
          <p>{{ entry.topic }}</p>
        </div>
        <a class="to-top" href="#top">↑ 목차</a>
      </header>

      <div class="lesson-body">
        <div class="col">
          <p class="col-label">과제 요구사항</p>
          <ul class="req">
            <li v-for="(line, i) in entry.requirements" :key="i" v-html="withCode(line)" />
          </ul>

          <p class="col-label spaced">구현하면서 한 것</p>
          <ul class="done">
            <li v-for="(line, i) in entry.done" :key="i">{{ line }}</li>
          </ul>

          <p v-if="troubleCount(entry.day) > 0" class="trouble-line">
            이 회차에서 막혔던 것
            <RouterLink to="/troubleshooting">{{ troubleCount(entry.day) }}건 →</RouterLink>
          </p>
        </div>

        <div class="col">
          <p class="col-label">실습 화면</p>

          <!-- 1~3일차는 그때 만든 화면이 그대로 남아 있다 -->
          <div v-if="entry.demo === 'embed'" class="stage">
            <component :is="embeds[entry.day]" />
          </div>

          <!-- 4일차 이후는 지금 앱 자체가 결과물이라 해당 화면으로 보낸다 -->
          <RouterLink v-else class="stage-link" :to="entry.route">
            <span class="stage-link-text">
              결과 화면으로 이동
              <em>{{ entry.route }}</em>
            </span>
            <span aria-hidden="true">→</span>
          </RouterLink>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.lab {
  display: flex;
  flex-direction: column;
  gap: 26px;
}

.lab-head {
  padding-bottom: 4px;
}

.lab-head p,
.lab-head h1 {
  margin: 0;
}

.eyebrow {
  color: var(--text-faint);
  font-size: 11.5px;
  font-weight: 800;
  letter-spacing: 0.16em;
}

.title {
  margin-top: 4px !important;
  font-size: 30px;
  font-weight: 900;
  letter-spacing: -0.03em;
}

.desc {
  margin-top: 4px !important;
  color: var(--text-dim);
  font-size: 13.5px;
}

/* 목차 */
.toc {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 0 18px;
  padding-bottom: 6px;
  border-bottom: 2px solid var(--text);
}

.toc-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 0;
  border-top: 1px solid var(--line);
  color: inherit;
  text-decoration: none;
}

.toc-item:hover .toc-arrow {
  transform: translateY(3px);
  color: var(--accent);
}

.toc-no {
  font-size: 26px;
  font-weight: 300;
  letter-spacing: -0.04em;
  color: var(--text-faint);
}

.toc-text {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  line-height: 1.3;
}

.toc-text b {
  font-size: 14px;
  font-weight: 800;
}

.toc-text em {
  color: var(--text-faint);
  font-size: 11.5px;
  font-style: normal;
}

.toc-arrow {
  color: var(--text-faint);
  transition:
    transform 0.15s ease,
    color 0.15s ease;
}

/* 회차 */
.lesson {
  scroll-margin-top: 20px;
}

.lesson-head {
  display: flex;
  align-items: center;
  gap: 14px;
  padding-bottom: 14px;
}

.lesson-no {
  font-size: 44px;
  font-weight: 200;
  line-height: 1;
  letter-spacing: -0.05em;
  color: var(--text-faint);
}

.lesson-title {
  flex-grow: 1;
}

.lesson-title h2 {
  margin: 0;
  font-size: 21px;
  font-weight: 900;
  letter-spacing: -0.03em;
}

.lesson-title p {
  margin: 2px 0 0;
  color: var(--text-faint);
  font-size: 12.5px;
}

.to-top {
  padding: 6px 12px;
  border: 1px solid var(--line);
  border-radius: 999px;
  color: var(--text-dim);
  font-size: 11.5px;
  text-decoration: none;
  white-space: nowrap;
}

.to-top:hover {
  border-color: var(--accent);
  color: var(--accent);
}

.lesson-body {
  display: grid;
  grid-template-columns: 300px 1fr;
  gap: 24px;
  padding-top: 16px;
  border-top: 2px solid var(--text);
}

.col-label {
  margin: 0 0 10px;
  color: var(--text-faint);
  font-size: 11.5px;
  font-weight: 700;
  letter-spacing: 0.04em;
}

.spaced {
  margin-top: 18px !important;
}

.req,
.done {
  margin: 0;
  padding-left: 16px;
  color: var(--text-dim);
}

.req li,
.done li {
  margin-bottom: 6px;
  font-size: 13px;
  line-height: 1.5;
}

.req :deep(code) {
  padding: 1px 5px;
  background-color: var(--surface-2);
  border-radius: 4px;
  color: var(--accent);
  font-size: 11.5px;
}

.trouble-line {
  margin: 16px 0 0;
  padding-top: 12px;
  border-top: 1px solid var(--line-soft);
  color: var(--text-faint);
  font-size: 12px;
}

.trouble-line a {
  margin-left: 4px;
  color: var(--accent);
  font-weight: 700;
  text-decoration: none;
}

/* 예전 화면은 자기 배경을 갖고 있어 회색 무대 위에 올린다 */
.stage {
  padding: 16px;
  background-color: var(--surface-2);
  border: 1px solid var(--line-soft);
  border-radius: var(--radius);
  max-height: 620px;
  overflow-y: auto;
}

.stage-link {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 22px;
  background-color: var(--surface);
  border: 1px solid var(--line);
  border-radius: var(--radius);
  color: var(--text);
  font-weight: 800;
  text-decoration: none;
  transition:
    border-color 0.15s ease,
    transform 0.15s ease;
}

.stage-link:hover {
  border-color: var(--accent);
  transform: translateX(3px);
}

.stage-link-text {
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.stage-link-text em {
  color: var(--text-faint);
  font-size: 12px;
  font-style: normal;
  font-weight: 400;
}

@media (max-width: 860px) {
  .lesson-body {
    grid-template-columns: 1fr;
  }
}
</style>
