<script setup>
import { computed, ref } from 'vue'
import { provinces, project, MAP_W, MAP_H } from '../../data/koreaMap'
import { calcRunningIndex } from '../../composables/useRunningIndex'

// 남한만 그리는 SVG 지도. 타일 지도를 쓰면 주변국까지 나와 산만해서 직접 그린다.
// 경계는 통계청 시도 경계를 간략화해 path로 내장했고,
// 마커는 같은 투영식으로 위경도를 SVG 좌표로 옮긴다.
const props = defineProps({
  cities: {
    type: Array,
    required: true,
  },
  selectedId: {
    type: String,
    default: '',
  },
})

const emit = defineEmits(['select-city'])

const hoveredId = ref('')

const scoreOf = (city) =>
  calcRunningIndex({
    temp: city.temp,
    humidity: city.humidity,
    pm10: city.pm10,
    wind: city.wind,
    rainProb: city.rainProb,
  }).score

const colorOf = (score) => {
  if (score >= 70) return 'var(--accent)'
  if (score >= 55) return 'var(--cyan)'
  if (score >= 40) return 'var(--warn)'
  return 'var(--danger)'
}

// 점수가 높을수록 원을 키운다. 겹치는 수도권에서도 좋은 곳이 먼저 눈에 띈다.
const radiusOf = (score) => 11 + (score / 100) * 9

const points = computed(() =>
  props.cities.map((city) => {
    const score = scoreOf(city)
    const { x, y } = project(city.lon, city.lat)

    return {
      city,
      score,
      x,
      y,
      r: radiusOf(score),
      color: colorOf(score),
      active: city.id === props.selectedId || city.id === hoveredId.value,
    }
  }),
)

// 점수가 낮은 것부터 그려서 좋은 곳이 위에 오게 한다
const sortedPoints = computed(() => [...points.value].sort((a, b) => a.score - b.score))

const selectedPoint = computed(() => points.value.find((p) => p.city.id === props.selectedId))
</script>

<template>
  <div class="map-wrap">
    <svg :viewBox="`0 0 ${MAP_W} ${MAP_H}`" class="map" role="img" aria-label="전국 러닝 지수 지도">
      <defs>
        <filter id="glow" x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur stdDeviation="6" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <!-- 시도 경계 -->
      <g class="land">
        <path v-for="province in provinces" :key="province.name" :d="province.d" />
      </g>

      <!-- 지역 마커 -->
      <g class="pins">
        <g
          v-for="point in sortedPoints"
          :key="point.city.id"
          class="pin"
          :class="point.active ? 'is-active' : ''"
          @click="emit('select-city', point.city)"
          @mouseenter="hoveredId = point.city.id"
          @mouseleave="hoveredId = ''"
        >
          <circle
            v-if="point.active"
            class="halo"
            :cx="point.x"
            :cy="point.y"
            :r="point.r + 9"
            :fill="point.color"
          />
          <circle
            :cx="point.x"
            :cy="point.y"
            :r="point.r"
            :fill="point.color"
            :filter="point.active ? 'url(#glow)' : undefined"
          />
          <text class="pin-score" :x="point.x" :y="point.y + 4.2">{{ point.score }}</text>

          <!-- 이름은 고르거나 올렸을 때만. 30개를 다 쓰면 수도권이 겹쳐 읽히지 않는다 -->
          <text v-if="point.active" class="pin-name" :x="point.x" :y="point.y - point.r - 9">
            {{ point.city.name }}
          </text>
        </g>
      </g>
    </svg>

    <div class="legend">
      <span><i style="background: var(--accent)" />70+</span>
      <span><i style="background: var(--cyan)" />55+</span>
      <span><i style="background: var(--warn)" />40+</span>
      <span><i style="background: var(--danger)" />40 미만</span>
      <span class="legend-note">원이 클수록 뛰기 좋은 곳</span>
    </div>

    <p v-if="selectedPoint === undefined" class="hint">지도에서 지역을 골라 보세요</p>
  </div>
</template>

<style scoped>
.map-wrap {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.map {
  flex-grow: 1;
  width: 100%;
  min-height: 0;
  overflow: visible;
}

.land path {
  fill: var(--surface-2);
  stroke: var(--line);
  stroke-width: 1.4;
  stroke-linejoin: round;
  transition: fill 0.2s ease;
}

.pin {
  cursor: pointer;
}

.pin circle {
  transition:
    r 0.18s ease,
    opacity 0.18s ease;
}

.halo {
  opacity: 0.22;
}

.pin-score {
  fill: #fff;
  font-size: 12px;
  font-weight: 800;
  text-anchor: middle;
  pointer-events: none;
  font-variant-numeric: tabular-nums;
}

.pin-name {
  fill: var(--text);
  font-size: 17px;
  font-weight: 700;
  text-anchor: middle;
  pointer-events: none;
  paint-order: stroke;
  stroke: var(--surface);
  stroke-width: 4px;
  stroke-linejoin: round;
}

.is-active .pin-score {
  font-size: 13px;
}

.legend {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 6px;
  color: var(--text-dim);
  font-size: 11px;
}

.legend span {
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

.legend i {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.legend-note {
  margin-left: auto;
  color: var(--text-faint);
}

.hint {
  margin: 4px 0 0;
  color: var(--text-faint);
  font-size: 11px;
  text-align: center;
}
</style>
