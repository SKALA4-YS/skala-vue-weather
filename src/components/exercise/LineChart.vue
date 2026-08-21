<script setup>
import { ref, onMounted, onBeforeUnmount, watch } from 'vue'
import Chart from 'chart.js/auto'
import { useConfigStore } from '../../stores/configStore'

// Element Plus에는 차트가 없어서 Chart.js를 직접 감싼다.
// 컴포넌트가 사라질 때 destroy를 해 주지 않으면 캔버스가 남아 메모리를 잡는다.
const props = defineProps({
  labels: {
    type: Array,
    required: true,
  },
  values: {
    type: Array,
    required: true,
  },
})

const configStore = useConfigStore()
const canvasRef = ref(null)
let chart = null

const render = () => {
  if (canvasRef.value === null) return

  const line = configStore.isDark ? '#35a0ff' : '#0a84ff'
  const grid = configStore.isDark ? '#1e2732' : '#e6eff9'
  const tick = configStore.isDark ? '#5f6d7e' : '#8ba3bd'

  const gradient = canvasRef.value.getContext('2d').createLinearGradient(0, 0, 0, 180)
  gradient.addColorStop(0, configStore.isDark ? 'rgba(53,160,255,0.35)' : 'rgba(10,132,255,0.28)')
  gradient.addColorStop(1, 'rgba(10, 132, 255, 0)')

  chart = new Chart(canvasRef.value, {
    type: 'line',
    data: {
      labels: props.labels,
      datasets: [
        {
          data: props.values,
          borderColor: line,
          backgroundColor: gradient,
          borderWidth: 2,
          fill: true,
          tension: 0.35,
          pointRadius: 3,
          pointBackgroundColor: line,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        y: {
          min: 0,
          max: 100,
          ticks: { stepSize: 25, color: tick, font: { size: 10 } },
          grid: { color: grid },
        },
        x: {
          ticks: { color: tick, font: { size: 10 } },
          grid: { display: false },
        },
      },
    },
  })
}

onMounted(render)

onBeforeUnmount(() => {
  if (chart !== null) chart.destroy()
})

// 도시나 단위가 바뀌면 데이터만 갈아 끼운다. 매번 새로 만들면 깜빡인다.
watch(
  () => [props.labels, props.values],
  () => {
    if (chart === null) return
    chart.data.labels = props.labels
    chart.data.datasets[0].data = props.values
    chart.update()
  },
)

// 테마가 바뀌면 선·눈금 색을 새로 계산해야 해서 통째로 다시 그린다
watch(
  () => configStore.isDark,
  () => {
    if (chart !== null) chart.destroy()
    render()
  },
)
</script>

<template>
  <div class="chart-box">
    <canvas ref="canvasRef" />
  </div>
</template>

<style scoped>
.chart-box {
  position: relative;
  height: 180px;
}
</style>
