<script setup>
import { computed, ref } from 'vue'
import { provinces, project, MAP_W, MAP_H } from '../../data/koreaMap'
import { calcRunningIndex } from '../../composables/useRunningIndex'

/* 남한만 그리는 지도. 타일 지도를 쓰면 주변국까지 나와 산만해서 직접 그린다.

   비스듬히 내려다보는 각도를 만들려고 세로를 TILT배로 눌렀다.
   SVG의 scale(1, TILT)은 좌표계가 그대로라 마커 위치를 같은 식으로 계산할 수 있다.
   (CSS rotateX는 원근이 섞여 마커와 어긋난다)

   지역은 점수만큼 솟는 기둥으로 표시한다. 색만 쓸 때보다 높낮이가 먼저 읽힌다. */

const TILT = 0.62

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
  if (score >= 70) return '#22c55e'
  if (score >= 55) return '#0a84ff'
  if (score >= 40) return '#f59e0b'
  return '#ef4444'
}

const points = computed(() =>
  props.cities.map((city) => {
    const score = scoreOf(city)
    const { x, y } = project(city.lon, city.lat)

    return {
      city,
      score,
      x,
      baseY: y * TILT, // 지도와 같은 비율로 눌러 준다
      height: 26 + (score / 100) * 96, // 점수만큼 솟는 기둥
      color: colorOf(score),
      active: city.id === props.selectedId || city.id === hoveredId.value,
    }
  }),
)

// 위쪽(북쪽)부터 그려야 아래 기둥이 위 기둥을 가린다
const drawOrder = computed(() => [...points.value].sort((a, b) => a.baseY - b.baseY))

const viewBox = computed(() => `-30 -150 ${MAP_W + 60} ${MAP_H * TILT + 190}`)
</script>

<template>
  <div class="map-wrap">
    <svg :viewBox="viewBox" class="map" role="img" aria-label="전국 러닝 지수 지도">
      <defs>
        <linearGradient id="landFace" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="var(--map-top)" />
          <stop offset="100%" stop-color="var(--map-bottom)" />
        </linearGradient>
      </defs>

      <!-- 아래로 조금 내린 어두운 복사본이 지도의 '두께'가 된다 -->
      <g :transform="`scale(1, ${TILT})`">
        <g class="land-side" transform="translate(0, 26)">
          <path v-for="province in provinces" :key="province.name" :d="province.d" />
        </g>

        <g class="land-face">
          <path v-for="province in provinces" :key="province.name" :d="province.d" />
        </g>
      </g>

      <!-- 기둥은 눌린 좌표 위에 세우므로 scale 밖에 둔다 -->
      <g class="pins">
        <g
          v-for="point in drawOrder"
          :key="point.city.id"
          class="pin"
          :class="point.active ? 'is-active' : ''"
          @click="emit('select-city', point.city)"
          @mouseenter="hoveredId = point.city.id"
          @mouseleave="hoveredId = ''"
        >
          <!-- 바닥 그림자 -->
          <ellipse class="pin-shadow" :cx="point.x" :cy="point.baseY" rx="11" ry="4" />

          <!-- 기둥. 오른쪽에 어두운 면을 덧대 입체로 보이게 한다 -->
          <rect
            class="pin-bar"
            :x="point.x - 5"
            :y="point.baseY - point.height"
            width="10"
            :height="point.height"
            rx="4"
            :fill="point.color"
          />
          <rect
            class="pin-bar-side"
            :x="point.x + 1.5"
            :y="point.baseY - point.height"
            width="3.5"
            :height="point.height"
            rx="1.6"
          />

          <!-- 꼭대기 점수 알약 -->
          <g class="pin-cap" :transform="`translate(${point.x}, ${point.baseY - point.height})`">
            <rect class="cap-box" x="-17" y="-14" width="34" height="22" rx="11" :fill="point.color" />
            <text class="cap-score" x="0" y="1.5">{{ point.score }}</text>
          </g>

          <!-- 이름은 고르거나 마우스를 올렸을 때만. 30개를 다 쓰면 수도권이 겹쳐 못 읽는다 -->
          <text
            v-if="point.active"
            class="pin-name"
            :x="point.x"
            :y="point.baseY - point.height - 26"
          >
            {{ point.city.name }}
          </text>
        </g>
      </g>
    </svg>

    <div class="legend">
      <span><i style="background: #22c55e" />70+</span>
      <span><i style="background: #0a84ff" />55+</span>
      <span><i style="background: #f59e0b" />40+</span>
      <span><i style="background: #ef4444" />40 미만</span>
      <span class="legend-note">기둥이 높을수록 뛰기 좋은 곳</span>
    </div>
  </div>
</template>

<style scoped>
.map-wrap {
  --map-top: #ffffff;
  --map-bottom: #c8dcf3;
  --map-side: #93b4d8;

  display: flex;
  flex-direction: column;
  height: 100%;
}

:global(html.dark) .map-wrap {
  --map-top: #202a36;
  --map-bottom: #161d27;
  --map-side: #0d131a;
}

.map {
  flex-grow: 1;
  width: 100%;
  min-height: 0;
  overflow: visible;
}

.land-face path {
  fill: url(#landFace);
  stroke: #8fb2d6;
  stroke-width: 1.3;
  stroke-linejoin: round;
}

:global(html.dark) .land-face path {
  stroke: #33415a;
}

.land-side path {
  fill: var(--map-side);
  stroke: var(--map-side);
  stroke-width: 2;
  stroke-linejoin: round;
}

.pin {
  cursor: pointer;
}

.pin-shadow {
  fill: rgba(20, 45, 80, 0.22);
}

:global(html.dark) .pin-shadow {
  fill: rgba(0, 0, 0, 0.45);
}

.pin-bar-side {
  fill: rgba(0, 0, 0, 0.22);
}

.pin-cap {
  transition: transform 0.16s ease;
}

.cap-box {
  stroke: #fff;
  stroke-width: 2;
}

:global(html.dark) .cap-box {
  stroke: #0d131a;
}

.cap-score {
  fill: #fff;
  font-size: 14px;
  font-weight: 800;
  text-anchor: middle;
  pointer-events: none;
  font-variant-numeric: tabular-nums;
}

.is-active .cap-box {
  stroke-width: 3;
}

.is-active .pin-bar,
.is-active .cap-box {
  filter: drop-shadow(0 4px 10px rgba(10, 132, 255, 0.45));
}

.pin-name {
  fill: var(--text);
  font-size: 21px;
  font-weight: 800;
  text-anchor: middle;
  pointer-events: none;
  paint-order: stroke;
  stroke: var(--surface);
  stroke-width: 5px;
  stroke-linejoin: round;
}

.legend {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 4px;
  color: var(--text-dim);
  font-size: 12px;
}

.legend span {
  display: inline-flex;
  align-items: center;
  gap: 5px;
}

.legend i {
  width: 9px;
  height: 9px;
  border-radius: 50%;
}

.legend-note {
  margin-left: auto;
  color: var(--text-faint);
}
</style>
