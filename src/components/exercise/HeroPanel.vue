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

const stats = computed(() => [
  { label: 'TEMP', value: displayTempText.value },
  { label: 'HUMIDITY', value: `${props.city.humidity}%` },
  { label: 'WIND', value: `${props.city.wind}m/s` },
  { label: 'PM10', value: props.city.pm10 },
])
</script>

<template>
  <section class="hero">
    <!-- 사선 스트라이프. 속도감을 주는 장식이라 콘텐츠와 겹치지 않게 오른쪽 위에만 둔다 -->
    <div class="stripes" aria-hidden="true" />

    <header class="head">
      <p class="eyebrow">{{ label }}</p>
      <img
        v-if="city.icon"
        class="icon"
        :src="iconUrl(city.icon)"
        :alt="city.status"
        width="64"
        height="64"
      />
    </header>

    <p class="place">
      {{ city.name }}
      <span class="region">{{ city.region }}</span>
    </p>

    <div class="score-row">
      <p class="score num" :style="{ color: scoreColor }">{{ index.score }}</p>

      <div class="score-side">
        <p class="grade" :style="{ color: scoreColor }">{{ index.grade.label }}</p>
        <div class="bar">
          <div
            class="bar-fill"
            :style="{ width: `${index.score}%`, backgroundColor: scoreColor }"
          />
        </div>
        <p class="comment">{{ index.grade.comment }}</p>
      </div>
    </div>

    <dl class="stats">
      <div v-for="stat in stats" :key="stat.label" class="stat">
        <dt>{{ stat.label }}</dt>
        <dd class="num">{{ stat.value }}</dd>
      </div>
    </dl>

    <RouterLink class="cta" :to="`/running?city=${city.id}`">
      분석 보기
      <span class="cta-arrow" aria-hidden="true">→</span>
    </RouterLink>
  </section>
</template>

<style scoped>
.hero {
  position: relative;
  padding: 22px;
  background:
    radial-gradient(120% 130% at 92% 0%, var(--accent-soft) 0%, transparent 56%),
    var(--surface);
  border: 1px solid var(--line-soft);
  border-radius: var(--radius);
  box-shadow: var(--shadow), var(--edge);
  overflow: hidden;
}

.stripes {
  position: absolute;
  top: -30px;
  right: -40px;
  width: 220px;
  height: 150px;
  background: repeating-linear-gradient(
    115deg,
    var(--accent) 0 3px,
    transparent 3px 13px
  );
  opacity: 0.16;
  transform: skewX(-8deg);
  pointer-events: none;
}

.head {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 10px;
}

.hero p {
  margin: 0;
}

/* 스포츠 브랜드에서 자주 쓰는 대문자 소제목 */
.eyebrow {
  color: var(--text-faint);
  font-size: 11.5px;
  font-weight: 800;
  letter-spacing: 0.14em;
  text-transform: uppercase;
}

.icon {
  margin: -8px -4px -8px 0;
  filter: drop-shadow(0 2px 6px rgba(20, 50, 90, 0.18));
}

.place {
  position: relative;
  z-index: 1;
  margin-top: 2px !important;
  font-size: 26px;
  font-weight: 900;
  letter-spacing: -0.03em;
  line-height: 1.15;
}

.region {
  margin-left: 7px;
  color: var(--text-faint);
  font-size: 12.5px;
  font-weight: 500;
  letter-spacing: 0;
}

.score-row {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-top: 6px;
}

.score {
  font-size: 82px;
  font-weight: 900;
  line-height: 0.92;
  letter-spacing: -0.05em;
}

.score-side {
  flex-grow: 1;
  min-width: 0;
}

.grade {
  font-size: 17px;
  font-weight: 900;
  letter-spacing: -0.01em;
}

.bar {
  height: 6px;
  margin: 6px 0 8px;
  background-color: var(--surface-2);
  border-radius: 3px;
  overflow: hidden;
}

.bar-fill {
  height: 100%;
  border-radius: 3px;
  transition: width 0.35s ease;
}

.comment {
  color: var(--text-dim);
  font-size: 13px;
}

.stats {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1px;
  margin: 18px 0 0;
  background-color: var(--line-soft);
  border-radius: var(--radius-sm);
  overflow: hidden;
}

.stat {
  padding: 10px 8px;
  background-color: var(--surface);
  text-align: center;
}

.stat dt {
  color: var(--text-faint);
  font-size: 9.5px;
  font-weight: 800;
  letter-spacing: 0.1em;
}

.stat dd {
  margin: 2px 0 0;
  font-size: 16px;
  font-weight: 800;
  letter-spacing: -0.02em;
}

.cta {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  margin-top: 14px;
  padding: 9px 18px;
  background-color: var(--text);
  border-radius: 999px;
  color: var(--surface);
  font-size: 13px;
  font-weight: 800;
  letter-spacing: 0.02em;
  text-decoration: none;
  transition: gap 0.16s ease;
}

.cta:hover {
  gap: 12px;
}

.cta-arrow {
  font-weight: 700;
}
</style>
