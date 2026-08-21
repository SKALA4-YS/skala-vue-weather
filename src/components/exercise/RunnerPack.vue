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

          <!-- 얼굴 -->
          <ellipse :fill="runner.accent" cx="-7.5" cy="-11" rx="3.4" ry="2.2" opacity="0.85" />
          <ellipse :fill="runner.accent" cx="7.5" cy="-11" rx="3.4" ry="2.2" opacity="0.85" />
          <circle class="ink" cx="-4.5" cy="-15" r="1.5" />
          <circle class="ink" cx="4.5" cy="-15" r="1.5" />
          <path class="ink-stroke" d="M-2.4 -10.6 Q0 -8.4 2.4 -10.6" />
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

          <ellipse fill="#f6b8c6" cx="-7.5" cy="-11" rx="3.4" ry="2.2" opacity="0.85" />
          <ellipse fill="#f6b8c6" cx="7.5" cy="-11" rx="3.4" ry="2.2" opacity="0.85" />
          <circle class="ink" cx="-4.5" cy="-15" r="1.5" />
          <circle class="ink" cx="4.5" cy="-15" r="1.5" />
          <path class="ink-stroke" d="M-2.4 -10.6 Q0 -8.4 2.4 -10.6" />
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
  stroke-width: 1.8;
  stroke-linecap: round;
}

:global(html.dark) .line {
  stroke: #0b1119;
}

:global(html.dark) .ink {
  fill: #0b1119;
}

:global(html.dark) .ink-stroke {
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

/* 셋째는 한참 쉬었다가 한 번씩 빠르게. 46초 중 앞의 30%(약 14초)만 달린다 */
.dash {
  position: absolute;
  bottom: 10px;
  animation: dash 46s linear infinite;
}

@keyframes dash {
  0% {
    left: -14%;
  }
  30% {
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
  30% {
    opacity: 1;
  }
  30.1%,
  100% {
    opacity: 0;
  }
}

/* 달리는 동작 */
.bob {
  animation: bob 0.42s ease-in-out infinite alternate;
}

.fast {
  animation-duration: 0.16s;
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
  animation-duration: 0.16s;
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
