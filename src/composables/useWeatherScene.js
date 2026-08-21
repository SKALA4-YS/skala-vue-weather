import { computed } from 'vue'
import { useWeatherStore } from '../stores/weatherStore'
import { useConfigStore } from '../stores/configStore'

/* 배경 씬을 무엇으로 그릴지 정한다.
   기준은 세 가지다. 지금 몇 시인가, 어떤 날씨인가, 어느 계절인가.

   날씨 코드는 Open-Meteo가 주는 WMO 코드를 쓴다.
   OpenWeatherMap으로 받아온 지역은 코드가 없어서 status 문구로 대신 판단한다. */

const timeOfDayNow = () => {
  const hour = new Date().getHours()

  if (hour >= 5 && hour < 8) return 'dawn'
  if (hour >= 8 && hour < 17) return 'day'
  if (hour >= 17 && hour < 20) return 'dusk'
  return 'night'
}

const seasonNow = () => {
  const month = new Date().getMonth() + 1

  if (month >= 3 && month <= 5) return 'spring'
  if (month >= 6 && month <= 8) return 'summer'
  if (month >= 9 && month <= 11) return 'autumn'
  return 'winter'
}

const conditionOf = (city) => {
  if (city === undefined || city === null) return 'clear'

  const code = city.weatherCode

  if (typeof code === 'number') {
    if (code >= 95) return 'storm'
    if (code >= 71 && code <= 77) return 'snow'
    if (code === 85 || code === 86) return 'snow'
    if ((code >= 51 && code <= 67) || (code >= 80 && code <= 82)) return 'rain'
    if (code >= 2) return 'cloud'
    return 'clear'
  }

  // 코드가 없으면 한글 설명으로 판단한다
  const status = city.status ?? ''
  if (status.includes('뇌우') || status.includes('천둥')) return 'storm'
  if (status.includes('눈')) return 'snow'
  if (status.includes('비') || status.includes('소나기')) return 'rain'
  if (status.includes('구름') || status.includes('흐림') || status.includes('안개')) return 'cloud'
  return 'clear'
}

// 계절별 초목 색. 겨울은 잎이 없으므로 가지 색만 쓴다.
const FOLIAGE = {
  spring: { leaf: '#7ec850', leafDark: '#4f9c2f', ground: '#8fd160', groundDark: '#5da83a' },
  summer: { leaf: '#3fa93b', leafDark: '#237a26', ground: '#4fb03f', groundDark: '#2b7d2a' },
  autumn: { leaf: '#e08a2e', leafDark: '#b45f1c', ground: '#c79a4a', groundDark: '#9a6f2c' },
  winter: { leaf: '#cfe0ea', leafDark: '#9db6c6', ground: '#e6eef4', groundDark: '#bccddb' },
}

// 시간대별 하늘. 위에서 아래로 두 색을 깐다.
const SKY = {
  dawn: ['#f7c1a0', '#ffe4c4'],
  day: ['#5fb8f0', '#c8e8fb'],
  dusk: ['#f0895f', '#f7c9a3'],
  night: ['#101d3a', '#28406b'],
}

const SKY_RAIN = {
  dawn: ['#9aa9b8', '#c8d3dc'],
  day: ['#8fa3b5', '#c3cfd9'],
  dusk: ['#7f8b9c', '#b0bcc7'],
  night: ['#0d1526', '#1e2b42'],
}

export const useWeatherScene = () => {
  const weatherStore = useWeatherStore()
  const configStore = useConfigStore()

  // 내 위치를 연결했다면 그곳을, 아니면 점수가 가장 높은 지역을 기준으로 삼는다
  const sceneCity = computed(() => {
    if (weatherStore.myLocation !== null) return weatherStore.myLocation
    return weatherStore.cities[0]
  })

  const timeOfDay = computed(() => timeOfDayNow())
  const season = computed(() => seasonNow())
  const condition = computed(() => conditionOf(sceneCity.value))

  const isWet = computed(() => condition.value === 'rain' || condition.value === 'storm')
  const isNight = computed(() => timeOfDay.value === 'night')

  // 밤이거나 비가 오면 도시 실루엣을, 그밖에는 언덕과 나무를 그린다.
  // 비 오는 밤의 도시가 이 앱에서 가장 자주 보게 되는 장면이다.
  const backdrop = computed(() => (isNight.value || isWet.value ? 'city' : 'nature'))

  const sky = computed(() => {
    const table = isWet.value ? SKY_RAIN : SKY
    const pair = table[timeOfDay.value]

    // 다크 테마에서는 배경도 함께 가라앉혀야 카드가 떠 보인다
    return configStore.isDark ? [pair[0], pair[1]] : pair
  })

  const foliage = computed(() => FOLIAGE[season.value])

  const showSun = computed(() => !isNight.value && condition.value !== 'rain' && condition.value !== 'storm')
  const showMoon = computed(() => isNight.value && condition.value === 'clear')
  const showStars = computed(() => isNight.value && condition.value !== 'rain')
  const showClouds = computed(() => condition.value !== 'clear')

  const label = computed(() => {
    const timeText = { dawn: '새벽', day: '낮', dusk: '저녁', night: '밤' }[timeOfDay.value]
    const seasonText = { spring: '봄', summer: '여름', autumn: '가을', winter: '겨울' }[season.value]
    const condText = {
      clear: '맑음',
      cloud: '구름',
      rain: '비',
      snow: '눈',
      storm: '뇌우',
    }[condition.value]

    return `${seasonText} · ${timeText} · ${condText}`
  })

  return {
    sceneCity,
    timeOfDay,
    season,
    condition,
    backdrop,
    sky,
    foliage,
    isNight,
    showSun,
    showMoon,
    showStars,
    showClouds,
    label,
  }
}
