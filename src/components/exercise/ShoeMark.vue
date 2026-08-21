<script setup>
// 브랜드 마크. 러닝화 옆모습을 단순화해 그렸다.
// 앞코가 오른쪽, 발목이 왼쪽 위로 오는 각도가 달리는 방향과 맞는다.
defineProps({
  size: {
    type: Number,
    default: 34,
  },
})
</script>

<template>
  <svg class="shoe" :width="size" :height="size" viewBox="0 0 40 40" role="img" aria-label="러닝 웨더">
    <rect class="plate" x="0" y="0" width="40" height="40" rx="12" />

    <g transform="translate(4.5, 9)">
      <!-- 갑피 -->
      <path
        class="upper"
        d="M4.5 2.2
           C3.2 4.4 2.8 7.4 2.8 10.2
           L2.8 14.6
           L29.4 14.6
           C29.4 12.2 28.2 10.4 25.4 9.4
           L18.6 7
           C16.6 6.2 15.4 4.8 14.2 3.2
           L12.6 1.2
           C10.6 -1 6 -0.4 4.5 2.2 Z"
      />

      <!-- 밑창 -->
      <path
        class="sole"
        d="M1.6 15.2
           L30.6 15.2
           C31.6 15.2 32 16 31.6 16.9
           C30.8 18.6 29 19.6 26.8 19.6
           L3.4 19.6
           C2 19.6 1 18.8 1 17.5
           L1 16.4
           C1 15.7 1.2 15.2 1.6 15.2 Z"
      />

      <!-- 신발끈 -->
      <g class="laces">
        <path d="M6.4 4.4 L11.4 6.6" />
        <path d="M5.4 7.4 L11 9.2" />
        <path d="M5 10.4 L11.6 11.6" />
      </g>

      <!-- 속도선 -->
      <g class="speed">
        <path d="M-2.5 5.5 L2 5.5" />
        <path d="M-4 9.5 L1.4 9.5" />
      </g>
    </g>
  </svg>
</template>

<style scoped>
.shoe {
  display: block;
  flex-shrink: 0;
}

.plate {
  fill: url(#none);
  fill: var(--accent);
}

.upper {
  fill: #fff;
}

.sole {
  fill: rgba(255, 255, 255, 0.55);
}

.laces path {
  stroke: var(--accent);
  stroke-width: 1.5;
  stroke-linecap: round;
}

.speed path {
  stroke: rgba(255, 255, 255, 0.75);
  stroke-width: 1.6;
  stroke-linecap: round;
}
</style>
