<script setup>
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import { useDisplayTemp } from '../../composables/useDisplayTemp'
import { calcRunningIndex } from '../../composables/useRunningIndex'
import { iconUrl } from '../../services/weatherApi'

// 대시보드 맨 위 요약. 어떤 지역을 보여줄지는 부모가 정한다.
const props = defineProps({
  city: {
    type: Object,
    required: true,
  },
  label: {
    type: String,
    default: '오늘의 요약',
  },
})

const { displayTempText } = useDisplayTemp(() => props.city.temp)

const index = computed(() =>
  calcRunningIndex({
    temp: props.city.temp,
    humidity: props.city.humidity,
    pm10: props.city.pm10,
    wind: props.city.wind,
    rainProb: props.city.rainProb,
  }),
)

const scoreColor = computed(() => {
  const score = index.value.score
  if (score >= 70) return 'var(--accent)'
  if (score >= 55) return 'var(--cyan)'
  if (score >= 40) return 'var(--warn)'
  return 'var(--danger)'
})
</script>

<template>
  <section class="hero">
    <p class="section-label">{{ label }}</p>

    <div class="body">
      <img
        v-if="city.icon"
        class="icon"
        :src="iconUrl(city.icon)"
        :alt="city.status"
        width="88"
        height="88"
      />

      <div class="main">
        <p class="name">{{ city.name }}<span class="region">{{ city.region }}</span></p>
        <p class="temp num">{{ displayTempText }}</p>
        <p class="status">{{ city.status }} · 습도 {{ city.humidity }}% · 바람 {{ city.wind }}m/s</p>
      </div>

      <div class="score-box">
        <p class="score num" :style="{ color: scoreColor }">{{ index.score }}</p>
        <p class="score-label">러닝 지수 · {{ index.grade.label }}</p>
        <RouterLink class="link" :to="`/running?city=${city.id}`">분석 보기</RouterLink>
      </div>
    </div>

    <p class="comment">{{ index.grade.comment }}</p>
  </section>
</template>

<style scoped>
.hero {
  padding: 20px;
  background:
    radial-gradient(120% 130% at 88% 0%, var(--accent-soft) 0%, transparent 58%),
    var(--surface);
  border: 1px solid var(--line-soft);
  border-radius: var(--radius);
  box-shadow: var(--shadow);
}

.body {
  display: flex;
  align-items: center;
  gap: 12px;
}

.icon {
  flex-shrink: 0;
}

.main {
  flex-grow: 1;
  min-width: 0;
}

.main p,
.score-box p {
  margin: 0;
}

.name {
  font-size: 15px;
  font-weight: 700;
}

.region {
  margin-left: 6px;
  color: var(--text-faint);
  font-size: 11.5px;
  font-weight: 400;
}

.temp {
  font-size: 46px;
  font-weight: 800;
  line-height: 1.05;
}

.status {
  color: var(--text-dim);
  font-size: 12.5px;
}

.score-box {
  flex-shrink: 0;
  text-align: right;
}

.score {
  font-size: 40px;
  font-weight: 800;
  line-height: 1;
}

.score-label {
  color: var(--text-faint);
  font-size: 11px;
}

.link {
  display: inline-block;
  margin-top: 4px;
  color: var(--accent);
  font-size: 12px;
  font-weight: 600;
  text-decoration: none;
}

.link:hover {
  text-decoration: underline;
}

.comment {
  margin: 14px 0 0;
  padding-top: 12px;
  border-top: 1px solid var(--line-soft);
  color: var(--text-dim);
  font-size: 12.5px;
}
</style>
