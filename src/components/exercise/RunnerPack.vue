<script setup>
/* 배경 아래를 지나가는 러너 세 마리.
   앞의 둘은 나란히 느리게 가고, 셋째는 한참 쉬다가 한 번씩 빠르게 지나간다.

   이미지 대신 SVG로 그려서 다크 테마에서 선 색을 바꿀 수 있고
   팔다리를 따로 움직일 수 있다. */

const runners = [
  { key: 'a', body: '#ffffff', ear: '#ffffff', accent: '#f6b8c6', lane: 0 },
  { key: 'b', body: '#ffffff', ear: '#8fa8c8', accent: '#f6b8c6', lane: 1 },
]
</script>

<template>
  <div class="pack" aria-hidden="true">
    <!-- 느긋한 두 마리 -->
    <div v-for="runner in runners" :key="runner.key" class="slow" :class="`lane-${runner.lane}`">
      <svg class="chara" viewBox="-26 -34 52 44">
        <g class="bob">
          <!-- 귀 -->
          <path class="line" :fill="runner.ear" d="M-13 -22 C-16 -30 -10 -31 -8 -25 Z" />
          <path class="line" :fill="runner.ear" d="M13 -22 C16 -30 10 -31 8 -25 Z" />

          <!-- 다리 -->
          <path class="line leg leg-back" :fill="runner.body" d="M-5 -2 L-5 6 L-1 6 L-1 -2 Z" />
          <path class="line leg leg-front" :fill="runner.body" d="M2 -2 L2 6 L6 6 L6 -2 Z" />

          <!-- 몸 -->
          <ellipse class="line" :fill="runner.body" cx="0" cy="-12" rx="15" ry="14" />

          <!-- 팔 -->
          <path class="line arm arm-back" :fill="runner.body" d="M-13 -14 L-19 -9 L-16 -6 L-11 -11 Z" />
          <path class="line arm arm-front" :fill="runner.body" d="M13 -14 L20 -12 L19 -8 L12 -10 Z" />

          <!-- 얼굴. 볼터치에 빗금을 세 개 긋고 눈은 아래로 휜 곡선으로 그린다 -->
          <ellipse :fill="runner.accent" cx="-8" cy="-10.5" rx="3.6" ry="2.3" opacity="0.9" />
          <ellipse :fill="runner.accent" cx="8" cy="-10.5" rx="3.6" ry="2.3" opacity="0.9" />
          <g class="hatch">
            <path d="M-9.4 -11.6 L-9.9 -9.4" />
            <path d="M-8 -11.8 L-8.5 -9.3" />
            <path d="M-6.6 -11.6 L-7.1 -9.4" />
            <path d="M9.4 -11.6 L8.9 -9.4" />
            <path d="M8 -11.8 L7.5 -9.3" />
            <path d="M6.6 -11.6 L6.1 -9.4" />
          </g>
          <path class="ink-stroke" d="M-6.6 -15.4 Q-4.6 -17.4 -2.6 -15.4" />
          <path class="ink-stroke" d="M2.6 -15.4 Q4.6 -17.4 6.6 -15.4" />
          <path class="ink-stroke mouth" d="M-2.6 -12.4 Q-1.3 -10.6 0 -12.4 Q1.3 -10.6 2.6 -12.4" />
        </g>
      </svg>
    </div>

    <!-- 가끔 빠르게 지나가는 한 마리 -->
    <div class="dash">
      <span class="whoosh" />
      <svg class="chara" viewBox="-26 -34 52 44">
        <g class="bob fast">
          <!-- 긴 귀 -->
          <path class="line" fill="#fdf3d0" d="M-9 -22 C-14 -36 -6 -38 -4 -24 Z" />
          <path class="line" fill="#fdf3d0" d="M2 -24 C4 -38 12 -36 7 -22 Z" />

          <path class="line leg leg-back" fill="#fdf3d0" d="M-5 -2 L-5 6 L-1 6 L-1 -2 Z" />
          <path class="line leg leg-front" fill="#fdf3d0" d="M2 -2 L2 6 L6 6 L6 -2 Z" />

          <ellipse class="line" fill="#fdf3d0" cx="0" cy="-12" rx="14.5" ry="13.5" />

          <path class="line arm arm-back" fill="#fdf3d0" d="M-13 -14 L-19 -9 L-16 -6 L-11 -11 Z" />
          <path class="line arm arm-front" fill="#fdf3d0" d="M13 -14 L20 -12 L19 -8 L12 -10 Z" />

          <ellipse fill="#f6b8c6" cx="-8" cy="-10.5" rx="3.6" ry="2.3" opacity="0.9" />
          <ellipse fill="#f6b8c6" cx="8" cy="-10.5" rx="3.6" ry="2.3" opacity="0.9" />
          <g class="hatch">
            <path d="M-9.4 -11.6 L-9.9 -9.4" />
            <path d="M-8 -11.8 L-8.5 -9.3" />
            <path d="M-6.6 -11.6 L-7.1 -9.4" />
            <path d="M9.4 -11.6 L8.9 -9.4" />
            <path d="M8 -11.8 L7.5 -9.3" />
            <path d="M6.6 -11.6 L6.1 -9.4" />
          </g>
          <!-- 우사기는 눈을 사선으로 그어 다른 둘과 구분한다 -->
          <path class="ink-stroke" d="M-6 -17 L-3 -14" />
          <path class="ink-stroke" d="M6 -17 L3 -14" />
          <path class="ink-stroke mouth" d="M-3.2 -12.6 Q-1.6 -10.2 0 -12.6 Q1.6 -10.2 3.2 -12.6" />
        </g>
      </svg>
    </div>
  </div>
</template>

<style scoped>
.pack {
  position: absolute;
  left: 0;
  bottom: 0;
  width: 100%;
  height: 120px;
  opacity: 0.9;
  pointer-events: none;
}

.chara {
  width: 96px;
  height: 80px;
  overflow: visible;
}

/* 선은 테마에 따라 바뀐다 */
.line {
  stroke: #1d2733;
  stroke-width: 2.2;
  stroke-linejoin: round;
}

.ink {
  fill: #1d2733;
}

.ink-stroke {
  fill: none;
  stroke: #1d2733;
  stroke-width: 1.7;
  stroke-linecap: round;
}

.mouth {
  stroke-width: 1.5;
}

.hatch path {
  fill: none;
  stroke: #1d2733;
  stroke-width: 0.9;
  stroke-linecap: round;
  opacity: 0.7;
}

:global(html.dark) .line {
  stroke: #0b1119;
}

:global(html.dark) .ink {
  fill: #0b1119;
}

:global(html.dark) .ink-stroke,
:global(html.dark) .hatch path {
  stroke: #0b1119;
}

/* 두 마리는 나란히 천천히 */
.slow {
  position: absolute;
  bottom: 0;
  animation: stroll 46s linear infinite;
}

.lane-0 {
  bottom: 6px;
}

.lane-1 {
  bottom: 0;
  animation-delay: -1.6s;
}

@keyframes stroll {
  from {
    left: -12%;
  }
  to {
    left: 108%;
  }
}

/* 셋째는 한참 쉬었다가 한 번씩 빠르게.
   느린 둘이 46초에 걸쳐 가는 거리를 20% 구간(약 9초)에 통과하므로 다섯 배 빠르다. */
.dash {
  position: absolute;
  bottom: 10px;
  animation: dash 46s linear infinite;
}

@keyframes dash {
  0% {
    left: -14%;
  }
  20% {
    left: 110%;
  }
  100% {
    left: 110%;
  }
}

/* 빠르게 지나갈 때만 속도선이 보인다 */
.whoosh {
  position: absolute;
  top: 26px;
  right: 62px;
  width: 46px;
  height: 14px;
  background:
    linear-gradient(90deg, transparent, rgba(120, 160, 200, 0.55)) center/100% 2px no-repeat,
    linear-gradient(90deg, transparent, rgba(120, 160, 200, 0.4)) center 5px/72% 2px no-repeat,
    linear-gradient(90deg, transparent, rgba(120, 160, 200, 0.4)) center -5px/60% 2px no-repeat;
  animation: whoosh 46s linear infinite;
}

@keyframes whoosh {
  0%,
  20% {
    opacity: 1;
  }
  20.1%,
  100% {
    opacity: 0;
  }
}

/* 달리는 동작 */
.bob {
  animation: bob 0.42s ease-in-out infinite alternate;
}

.fast {
  animation-duration: 0.11s;
}

@keyframes bob {
  from {
    transform: translateY(0);
  }
  to {
    transform: translateY(-2.4px);
  }
}

.leg,
.arm {
  transform-box: fill-box;
  transform-origin: center top;
}

.leg-front {
  animation: stride 0.42s ease-in-out infinite alternate;
}

.leg-back {
  animation: stride 0.42s ease-in-out infinite alternate-reverse;
}

.arm-front {
  animation: swing 0.42s ease-in-out infinite alternate;
}

.arm-back {
  animation: swing 0.42s ease-in-out infinite alternate-reverse;
}

.fast .leg-front,
.fast .leg-back,
.fast .arm-front,
.fast .arm-back {
  animation-duration: 0.11s;
}

@keyframes stride {
  from {
    transform: rotate(24deg);
  }
  to {
    transform: rotate(-22deg);
  }
}

@keyframes swing {
  from {
    transform: rotate(20deg);
  }
  to {
    transform: rotate(-18deg);
  }
}

@media (prefers-reduced-motion: reduce) {
  .pack * {
    animation: none !important;
  }
}
</style>
