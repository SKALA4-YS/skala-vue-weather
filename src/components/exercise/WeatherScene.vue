<script setup>
import { computed } from 'vue'
import { useWeatherScene } from '../../composables/useWeatherScene'

/* 화면 뒤에 깔리는 배경. 지금 시각·날씨·계절에 따라 장면이 바뀐다.
   3D 라이브러리 없이 SVG 도형과 CSS 애니메이션만 쓴다.

   러너는 팔다리를 따로 두고 번갈아 회전시켜 달리는 것처럼 보이게 했다. */

const scene = useWeatherScene()

// 파티클은 위치를 매번 새로 뽑으면 리렌더마다 튀므로 한 번만 계산한다
const makeDrops = (count, seed) =>
  Array.from({ length: count }, (_, i) => ({
    id: i,
    x: ((i * 37 + seed) % 100) + (i % 5) * 0.7,
    delay: ((i * 13) % 100) / 100,
    duration: 0.55 + ((i * 7) % 40) / 100,
    scale: 0.7 + ((i * 11) % 60) / 100,
  }))

const rainDrops = makeDrops(46, 3)
const snowFlakes = makeDrops(34, 11)

const stars = Array.from({ length: 40 }, (_, i) => ({
  id: i,
  x: (i * 61) % 100,
  y: (i * 29) % 42,
  r: 0.6 + ((i * 7) % 10) / 10,
  delay: ((i * 17) % 30) / 10,
}))

// 도시 실루엣. 폭·높이·창문 수를 고정 값으로 만들어 매번 같은 모양이 나오게 한다
const buildings = [
  { x: 2, w: 9, h: 20, floors: 4 },
  { x: 12, w: 7, h: 31, floors: 6 },
  { x: 20, w: 11, h: 16, floors: 3 },
  { x: 32, w: 8, h: 34, floors: 7 },
  { x: 41, w: 6, h: 24, floors: 5 },
  { x: 48, w: 12, h: 29, floors: 6 },
  { x: 61, w: 7, h: 40, floors: 8 },
  { x: 69, w: 10, h: 22, floors: 4 },
  { x: 80, w: 8, h: 34, floors: 7 },
  { x: 89, w: 9, h: 18, floors: 3 },
]

const windowsOf = (building) =>
  Array.from({ length: building.floors * 2 }, (_, i) => ({
    id: i,
    x: building.x + 1.6 + (i % 2) * (building.w - 4.4),
    y: 100 - building.h + 3 + Math.floor(i / 2) * ((building.h - 5) / building.floors),
    lit: (i * 7 + building.x) % 3 !== 0,
  }))

const trees = [
  { x: 6, s: 1.15 },
  { x: 17, s: 0.85 },
  { x: 27, s: 1 },
  { x: 44, s: 0.78 },
  { x: 58, s: 1.2 },
  { x: 72, s: 0.9 },
  { x: 84, s: 1.05 },
  { x: 94, s: 0.8 },
]

const skyStyle = computed(() => ({
  background: `linear-gradient(180deg, ${scene.sky.value[0]} 0%, ${scene.sky.value[1]} 100%)`,
}))
</script>

<template>
  <div class="scene" aria-hidden="true">
    <div class="sky" :style="skyStyle" />

    <svg class="layer" viewBox="0 0 100 100" preserveAspectRatio="none">
      <!-- 별 -->
      <g v-if="scene.showStars.value" class="stars">
        <circle
          v-for="star in stars"
          :key="star.id"
          :cx="star.x"
          :cy="star.y"
          :r="star.r * 0.12"
          :style="{ animationDelay: `${star.delay}s` }"
        />
      </g>

      <!-- 해와 달 -->
      <circle v-if="scene.showSun.value" class="sun" cx="80" cy="18" r="5" />
      <g v-if="scene.showMoon.value" class="moon">
        <circle cx="80" cy="17" r="4" />
        <circle class="moon-cut" cx="78" cy="15.5" r="3.4" />
      </g>

      <!-- 구름 -->
      <g v-if="scene.showClouds.value" class="clouds">
        <g class="cloud cloud-1">
          <ellipse cx="20" cy="16" rx="9" ry="3.4" />
          <ellipse cx="25" cy="14" rx="6" ry="3.6" />
        </g>
        <g class="cloud cloud-2">
          <ellipse cx="62" cy="24" rx="11" ry="3.8" />
          <ellipse cx="56" cy="22" rx="6.5" ry="3.4" />
        </g>
      </g>
    </svg>

    <!-- 배경 실루엣 -->
    <svg class="layer" viewBox="0 0 100 100" preserveAspectRatio="none">
      <template v-if="scene.backdrop.value === 'city'">
        <g class="city">
          <g v-for="building in buildings" :key="building.x">
            <rect
              :x="building.x"
              :y="100 - building.h"
              :width="building.w"
              :height="building.h"
            />
            <rect
              v-for="win in windowsOf(building)"
              :key="win.id"
              class="window"
              :class="win.lit ? 'is-lit' : ''"
              :x="win.x"
              :y="win.y"
              width="1.5"
              :height="1.6"
            />
          </g>
        </g>
      </template>

      <template v-else>
        <!-- 언덕 두 겹으로 원근을 만든다 -->
        <path
          class="hill hill-far"
          :fill="scene.foliage.value.groundDark"
          d="M0,78 Q18,66 34,74 Q52,84 68,70 Q84,58 100,72 L100,100 L0,100 Z"
        />
        <g class="trees">
          <g v-for="tree in trees" :key="tree.x" :transform="`translate(${tree.x}, 0)`">
            <rect class="trunk" x="-0.5" y="80" width="1" height="8" />
            <ellipse
              :fill="scene.foliage.value.leaf"
              cx="0"
              cy="78"
              :rx="3.2 * tree.s"
              :ry="4.4 * tree.s"
            />
            <ellipse
              :fill="scene.foliage.value.leafDark"
              cx="-1"
              cy="80"
              :rx="2.2 * tree.s"
              :ry="3 * tree.s"
            />
          </g>
        </g>
        <path
          class="hill hill-near"
          :fill="scene.foliage.value.ground"
          d="M0,88 Q24,82 46,88 Q70,94 100,86 L100,100 L0,100 Z"
        />
      </template>
    </svg>

    <!-- 콘텐츠 쪽 가독성을 위해 위로 갈수록 배경을 덮는다 -->
    <div class="veil" />

    <!-- 달리는 사람. 팔다리를 번갈아 돌려 달리는 동작을 만든다.
         위 레이어는 preserveAspectRatio="none"이라 세로로 늘어나므로 러너는 따로 뺐다. -->
    <div class="runner-track">
      <svg class="runner-svg" viewBox="-14 -26 28 30">
        <g class="runner">
          <rect class="limb leg leg-back" x="-1.5" y="-2" width="3" height="10" rx="1.5" />
          <rect class="limb arm arm-back" x="-1.2" y="-14" width="2.4" height="8" rx="1.2" />
          <rect class="torso" x="-2.6" y="-16" width="5.2" height="10" rx="2.6" />
          <circle class="head" cx="0.4" cy="-19" r="3" />
          <rect class="limb leg leg-front" x="-1.5" y="-2" width="3" height="10" rx="1.5" />
          <rect class="limb arm arm-front" x="-1.2" y="-14" width="2.4" height="8" rx="1.2" />
        </g>
      </svg>
    </div>

    <!-- 비와 눈 -->
    <div v-if="scene.condition.value === 'rain' || scene.condition.value === 'storm'" class="rain">
      <span
        v-for="drop in rainDrops"
        :key="drop.id"
        :style="{
          left: `${drop.x}%`,
          animationDelay: `${drop.delay}s`,
          animationDuration: `${drop.duration}s`,
          transform: `scaleY(${drop.scale})`,
        }"
      />
    </div>

    <div v-if="scene.condition.value === 'snow'" class="snow">
      <span
        v-for="flake in snowFlakes"
        :key="flake.id"
        :style="{
          left: `${flake.x}%`,
          animationDelay: `${flake.delay * 6}s`,
          animationDuration: `${6 + flake.duration * 4}s`,
          width: `${flake.scale * 5}px`,
          height: `${flake.scale * 5}px`,
        }"
      />
    </div>
  
  </div>
</template>

<style scoped>
.scene {
  position: fixed;
  inset: 0;
  z-index: 0;
  overflow: hidden;
  pointer-events: none;
}

.sky,
.layer {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
}

/* 장면이 화면을 다 채우면 콘텐츠와 싸운다. 아래쪽만 쓰고 전체를 옅게 깐다. */
.scene {
  opacity: 0.5;
}

:global(html.dark) .scene {
  opacity: 0.55;
}

.layer {
  top: auto;
  bottom: 0;
  height: 38vh;
}

.veil {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    180deg,
    var(--bg) 0%,
    color-mix(in srgb, var(--bg) 88%, transparent) 40%,
    color-mix(in srgb, var(--bg) 70%, transparent) 72%,
    color-mix(in srgb, var(--bg) 86%, transparent) 100%
  );
}

.sun {
  fill: #ffd66b;
  filter: drop-shadow(0 0 3px rgba(255, 210, 80, 0.9));
}

.moon circle {
  fill: #eef3ff;
}

.moon-cut {
  fill: v-bind('scene.sky.value[0]');
}

.stars circle {
  fill: #fff;
  animation: twinkle 3.4s ease-in-out infinite;
}

@keyframes twinkle {
  0%,
  100% {
    opacity: 0.25;
  }
  50% {
    opacity: 0.9;
  }
}

.cloud ellipse {
  fill: rgba(255, 255, 255, 0.82);
}

:global(html.dark) .rain span {
  background: linear-gradient(180deg, transparent, rgba(160, 200, 240, 0.7));
}

:global(html.dark) .cloud ellipse {
  fill: rgba(190, 205, 225, 0.35);
}

.cloud-1 {
  animation: drift 62s linear infinite;
}

.cloud-2 {
  animation: drift 88s linear infinite reverse;
}

@keyframes drift {
  from {
    transform: translateX(-14%);
  }
  to {
    transform: translateX(114%);
  }
}

.city rect {
  fill: #1d2739;
}

:global(html.dark) .city rect {
  fill: #070b12;
}

.window {
  fill: #3a4a63;
}

.window.is-lit {
  fill: #ffd98a;
  opacity: 0.9;
}

.trunk {
  fill: #6b4b2a;
}

.hill-far {
  opacity: 0.85;
}

/* 러너는 지면 높이에 맞춰 두고 좌우로 천천히 지나가게 한다 */
.runner-track {
  position: absolute;
  opacity: 0.85;
  left: 0;
  bottom: 5vh;
  width: 100%;
  height: 120px;
}

.runner-svg {
  position: absolute;
  bottom: 0;
  width: 104px;
  height: 116px;
  animation: cross 24s linear infinite;
}

.runner > * {
  fill: #0f1826;
}

.runner {
  transform: translateY(-2px);
}

:global(html.dark) .runner > * {
  fill: #f0f6ff;
}

.torso {
  transform: rotate(9deg);
}

.limb {
  transform-origin: 0 0;
}

.arm {
  transform-origin: 0 -14px;
}

.limb.leg {
  transform-origin: 0 -2px;
}

.arm-front {
  animation: swingA 0.52s ease-in-out infinite alternate;
}

.arm-back {
  animation: swingB 0.52s ease-in-out infinite alternate;
}

.leg-front {
  animation: strideA 0.52s ease-in-out infinite alternate;
}

.leg-back {
  animation: strideB 0.52s ease-in-out infinite alternate;
}

@keyframes cross {
  from {
    left: -10%;
  }
  to {
    left: 106%;
  }
}

@keyframes swingA {
  from {
    transform: rotate(46deg);
  }
  to {
    transform: rotate(-40deg);
  }
}

@keyframes swingB {
  from {
    transform: rotate(-40deg);
  }
  to {
    transform: rotate(46deg);
  }
}

@keyframes strideA {
  from {
    transform: rotate(30deg);
  }
  to {
    transform: rotate(-26deg);
  }
}

@keyframes strideB {
  from {
    transform: rotate(-26deg);
  }
  to {
    transform: rotate(30deg);
  }
}

.rain,
.snow {
  position: absolute;
  inset: 0;
  opacity: 0.75;
}

.rain span {
  position: absolute;
  top: -12%;
  width: 1.6px;
  height: 38px;
  background: linear-gradient(180deg, transparent, rgba(96, 150, 205, 0.85));
  animation: fall linear infinite;
}

@keyframes fall {
  from {
    transform: translateY(-12vh);
  }
  to {
    transform: translateY(112vh);
  }
}

.snow span {
  position: absolute;
  top: -6%;
  background-color: #fff;
  border-radius: 50%;
  opacity: 0.85;
  animation: drop linear infinite;
}

@keyframes drop {
  from {
    transform: translate(0, -8vh);
  }
  to {
    transform: translate(26px, 108vh);
  }
}

/* 움직임을 줄이도록 설정한 사용자에게는 애니메이션을 멈춘다 */
@media (prefers-reduced-motion: reduce) {
  .scene * {
    animation: none !important;
  }
}
</style>
