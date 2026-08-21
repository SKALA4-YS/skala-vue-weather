<script setup>
/* 배경 아래를 지나가는 캐릭터 셋.
   앞의 둘은 나란히 느긋하게 가고, 셋째는 한참 쉬었다가 한 번씩 빠르게 지나간다.

   이미지라서 팔다리를 따로 움직일 수 없으므로
   위아래 통통 튀는 동작과 몸을 기울이는 것으로 달리는 느낌을 만든다.
   그림 대신 직접 그린 SVG를 쓰고 싶으면 RunnerPack.vue로 바꿔 끼우면 된다. */

const slowOnes = [
  { key: 'chiikawa', src: '/characters/chiikawa.png', alt: '', bottom: 4, delay: 0 },
  { key: 'hachiware', src: '/characters/hachiware.png', alt: '', bottom: 0, delay: -1.8 },
]
</script>

<template>
  <div class="pack" aria-hidden="true">
    <div v-for="one in slowOnes" :key="one.key" class="lane slow" :style="{ bottom: `${one.bottom}px`, animationDelay: `${one.delay}s` }">
      <img class="chara jog" :src="one.src" :alt="one.alt" />
    </div>

    <div class="lane dash">
      <span class="whoosh" />
      <img class="chara sprint" src="/characters/usagi.png" alt="" />
    </div>
  </div>
</template>

<style scoped>
.pack {
  position: fixed;
  left: 0;
  bottom: -8px;
  z-index: 2;
  width: 100%;
  height: 96px;
  opacity: 0.94;
  pointer-events: none;
}

.lane {
  position: absolute;
}

.chara {
  display: block;
  width: auto;
  height: 66px;
  /* 원본이 작은 그림이라 확대할 때 흐려지지 않게 한다 */
  image-rendering: auto;
  filter: drop-shadow(0 3px 4px rgba(20, 45, 80, 0.22));
}

:global(html.dark) .chara {
  filter: drop-shadow(0 3px 6px rgba(0, 0, 0, 0.5));
}

/* 둘은 나란히 천천히 */
.slow {
  animation: stroll 46s linear infinite;
}

@keyframes stroll {
  from {
    left: -12%;
  }
  to {
    left: 108%;
  }
}

/* 셋째는 46초 주기 중 20% 구간(약 9초)에만 달린다. 느린 둘보다 다섯 배 빠르다. */
.dash {
  bottom: 8px;
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

/* 속도선은 달리는 동안에만 보인다 */
.whoosh {
  position: absolute;
  top: 30px;
  right: 68px;
  width: 52px;
  height: 16px;
  background:
    linear-gradient(90deg, transparent, rgba(110, 150, 195, 0.6)) center/100% 2px no-repeat,
    linear-gradient(90deg, transparent, rgba(110, 150, 195, 0.45)) center 6px/74% 2px no-repeat,
    linear-gradient(90deg, transparent, rgba(110, 150, 195, 0.45)) center -6px/62% 2px no-repeat;
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

/* 느긋하게 뛰는 동작 */
.jog {
  animation: jog 0.5s ease-in-out infinite alternate;
}

@keyframes jog {
  from {
    transform: translateY(0) rotate(-3deg);
  }
  to {
    transform: translateY(-6px) rotate(3deg);
  }
}

/* 전력질주는 더 빠르고 앞으로 기운다 */
.sprint {
  animation: sprint 0.14s ease-in-out infinite alternate;
}

@keyframes sprint {
  from {
    transform: translateY(0) rotate(8deg);
  }
  to {
    transform: translateY(-9px) rotate(14deg);
  }
}

@media (prefers-reduced-motion: reduce) {
  .pack * {
    animation: none !important;
  }
}
</style>
