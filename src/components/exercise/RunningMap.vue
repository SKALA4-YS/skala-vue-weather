<script setup>
import { ref, onMounted, onBeforeUnmount, watch, nextTick } from 'vue'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { useConfigStore } from '../../stores/configStore'
import { calcRunningIndex } from '../../composables/useRunningIndex'

// 전국 러닝 지수를 지도에 뿌린다.
// Leaflet 기본 마커는 이미지 경로가 번들에서 깨지므로 divIcon(HTML 마커)을 쓴다.
// 점수를 마커 안에 직접 그릴 수 있어서 오히려 이쪽이 목적에 맞는다.
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

const configStore = useConfigStore()
const mapRef = ref(null)

let map = null
let markerLayer = null
let tileLayer = null

const scoreOf = (city) =>
  calcRunningIndex({
    temp: city.temp,
    humidity: city.humidity,
    pm10: city.pm10,
    wind: city.wind,
    rainProb: city.rainProb,
  }).score

const colorOf = (score) => {
  if (score >= 70) return '#16a34a'
  if (score >= 55) return '#0a84ff'
  if (score >= 40) return '#f08c00'
  return '#e5484d'
}

// 다크에서는 어두운 타일, 라이트에서는 밝은 타일을 쓴다. 둘 다 키가 필요 없다.
const tileUrl = () =>
  configStore.isDark
    ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
    : 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png'

const drawMarkers = () => {
  if (map === null) return

  if (markerLayer !== null) {
    markerLayer.clearLayers()
  } else {
    markerLayer = L.layerGroup().addTo(map)
  }

  props.cities.forEach((city) => {
    const score = scoreOf(city)
    const isOn = city.id === props.selectedId

    const marker = L.marker([city.lat, city.lon], {
      icon: L.divIcon({
        className: 'run-pin-wrap',
        html: `
          <div class="run-pin${isOn ? ' is-on' : ''}" style="--pin:${colorOf(score)}">
            <b>${score}</b>
            <span>${city.name}</span>
          </div>`,
        iconSize: [38, 28],
        iconAnchor: [19, 28],
      }),
      // 수도권처럼 좁은 곳에 마커가 몰리면 점수가 높은 쪽을 위로 올린다
      zIndexOffset: isOn ? 1000 : score,
    })

    marker.on('click', () => emit('select-city', city))
    marker.addTo(markerLayer)
  })
}

onMounted(() => {
  map = L.map(mapRef.value, {
    zoomControl: true,
    scrollWheelZoom: false, // 페이지 스크롤을 지도가 가로채지 않게 한다
    attributionControl: true,
  })

  tileLayer = L.tileLayer(tileUrl(), {
    attribution: '&copy; OpenStreetMap &copy; CARTO',
    maxZoom: 12,
    minZoom: 5,
  }).addTo(map)

  drawMarkers()

  // 마운트 직후에는 Leaflet이 컨테이너 크기를 0으로 알고 있어서
  // 바로 fitBounds를 하면 엉뚱하게 축소된다. 크기를 다시 재고 나서 맞춘다.
  nextTick(() => {
    map.invalidateSize()

    // 좌표를 고정하면 제주처럼 끝에 있는 지역이 잘린다.
    // 전체 지역을 감싸는 범위로 자동 맞춤한다.
    const bounds = L.latLngBounds(props.cities.map((city) => [city.lat, city.lon]))
    map.fitBounds(bounds, { padding: [30, 30] })
  })
})

onBeforeUnmount(() => {
  // 지도를 정리하지 않으면 화면을 떠난 뒤에도 타일 요청과 리스너가 남는다
  if (map !== null) {
    map.remove()
    map = null
  }
})

watch(() => [props.cities, props.selectedId], drawMarkers, { deep: true })

watch(
  () => configStore.isDark,
  () => {
    if (tileLayer !== null) tileLayer.setUrl(tileUrl())
  },
)
</script>

<template>
  <div class="map-box">
    <div ref="mapRef" class="map" />

    <div class="legend">
      <span><i style="background: #16a34a" />70+ 좋음</span>
      <span><i style="background: #0a84ff" />55+ 보통</span>
      <span><i style="background: #f08c00" />40+ 나쁨</span>
      <span><i style="background: #e5484d" />40 미만</span>
    </div>
  </div>
</template>

<style scoped>
.map-box {
  position: relative;
}

.map {
  height: 520px;
  border-radius: var(--radius);
  background-color: var(--surface-2);
}

.legend {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 10px;
  color: var(--text-dim);
  font-size: 11px;
}

.legend span {
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

.legend i {
  width: 9px;
  height: 9px;
  border-radius: 50%;
}
</style>

<style>
/* 마커는 Leaflet이 지도 컨테이너 바깥에 직접 그려서 scoped가 닿지 않는다.
   그래서 이 블록만 전역으로 두고, 클래스 이름을 run- 으로 구분했다. */
.run-pin {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 38px;
  height: 28px;
  background-color: var(--pin);
  border: 1.5px solid #fff;
  border-radius: 8px;
  color: #fff;
  line-height: 1.05;
  text-align: center;
  cursor: pointer;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.28);
  transition: transform 0.15s ease;
}

.run-pin:hover {
  transform: scale(1.12);
}

.run-pin.is-on {
  transform: scale(1.2);
  border-color: #14243a;
  z-index: 500;
}

.run-pin b {
  font-size: 11.5px;
  font-weight: 800;
}

.run-pin span {
  font-size: 7.5px;
  opacity: 0.92;
}

.leaflet-container {
  font-family: inherit;
  border-radius: var(--radius);
}

.leaflet-control-attribution {
  font-size: 9px;
}
</style>
