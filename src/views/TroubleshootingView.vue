<script setup>
import { ref, computed } from 'vue'
import { RouterLink } from 'vue-router'
import { troubles, troubleTags } from '../data/practiceLog'

// 실습하면서 실제로 막혔던 것만 모았다. 증상 → 원인 → 해결 순서.
const selectedTag = ref('전체')

const filtered = computed(() => {
  if (selectedTag.value === '전체') return troubles
  return troubles.filter((item) => item.tag === selectedTag.value)
})

const countOf = (tag) => (tag === '전체' ? troubles.length : troubles.filter((item) => item.tag === tag).length)
</script>

<template>
  <div class="ts">
    <section class="surface intro">
      <p class="section-label">트러블슈팅</p>
      <h2 class="title">막혔던 {{ troubles.length }}가지</h2>
      <p class="desc">해결한 방법만 적지 않고 왜 그런 일이 생겼는지를 함께 남겼습니다. 같은 실수를 다시 하지 않으려고 만든 기록입니다.</p>

      <div class="tags">
        <button v-for="tag in troubleTags" :key="tag" class="tag" :class="selectedTag === tag ? 'is-on' : ''" @click="selectedTag = tag">
          {{ tag }}
          <span class="tag-count">{{ countOf(tag) }}</span>
        </button>
      </div>
    </section>

    <article v-for="item in filtered" :key="item.id" class="surface item">
      <div class="item-head">
        <span class="day-chip">{{ item.day }}일차</span>
        <span class="tag-chip">{{ item.tag }}</span>
        <code class="file">{{ item.file }}</code>
      </div>

      <h3 class="item-title">{{ item.title }}</h3>

      <dl class="rows">
        <div class="row">
          <dt>증상</dt>
          <dd>{{ item.symptom }}</dd>
        </div>
        <div class="row">
          <dt>원인</dt>
          <dd>{{ item.cause }}</dd>
        </div>
        <div class="row fix">
          <dt>해결</dt>
          <dd>{{ item.fix }}</dd>
        </div>
      </dl>
    </article>

    <p v-if="filtered.length === 0" class="empty">해당 분류의 기록이 없습니다.</p>

    <RouterLink to="/lab" class="cta">실습 아카이브로 돌아가기</RouterLink>
  </div>
</template>

<style scoped>
.ts {
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

.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.tag {
  padding: 5px 12px;
  background-color: var(--surface-2);
  border: 1px solid var(--line-soft);
  border-radius: 999px;
  color: var(--text-dim);
  font-size: 12px;
  cursor: pointer;
}

.tag:hover {
  border-color: var(--accent);
  color: var(--accent);
}

.is-on {
  background-color: var(--accent);
  border-color: var(--accent);
  color: var(--on-accent);
  font-weight: 600;
}

.tag-count {
  margin-left: 3px;
  opacity: 0.7;
  font-size: 10.5px;
}

.item-head {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 8px;
}

.day-chip,
.tag-chip {
  padding: 2px 8px;
  border-radius: 999px;
  font-size: 10.5px;
  font-weight: 600;
}

.day-chip {
  background-color: var(--accent-soft);
  color: var(--accent);
}

.tag-chip {
  background-color: var(--surface-2);
  color: var(--text-dim);
}

.file {
  margin-left: auto;
  color: var(--text-faint);
  font-size: 10.5px;
}

.item-title {
  margin: 0 0 12px;
  font-size: 16px;
  font-weight: 700;
}

.rows {
  margin: 0;
}

.row {
  display: flex;
  gap: 12px;
  padding: 8px 0;
  border-top: 1px solid var(--line-soft);
}

.row dt {
  flex-shrink: 0;
  width: 40px;
  color: var(--text-faint);
  font-size: 11.5px;
  font-weight: 700;
}

.row dd {
  margin: 0;
  color: var(--text-dim);
  font-size: 13px;
}

.fix dd {
  color: var(--text);
}

.empty {
  margin: 0;
  padding: 40px 0;
  color: var(--text-faint);
  text-align: center;
}

.cta {
  padding: 14px;
  background-color: var(--surface);
  border: 1px solid var(--line);
  border-radius: var(--radius);
  color: var(--text-dim);
  font-weight: 600;
  text-align: center;
  text-decoration: none;
}
</style>
