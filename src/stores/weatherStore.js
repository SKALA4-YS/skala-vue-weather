import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { cities as cityList } from '../data/cities'
import { fetchCitiesWeather } from '../services/openMeteoApi'
import { fetchCityWeather, fetchWeatherByCoords, hasApiKey } from '../services/weatherApi'

// 데이터를 두 곳에서 받아 온다.
//  - 목록 30개: Open-Meteo (좌표를 이어 붙여 한 번에 조회. 호출 두 번이면 끝)
//  - 도시 하나 상세: OpenWeatherMap (예보·대기오염까지 함께)
// 30개를 도시마다 OpenWeatherMap으로 부르면 90회라 무료 한도(분당 60)를 넘긴다.
export const useWeatherStore = defineStore('weather', () => {
  const cities = ref(
    cityList.map((city) => ({
      ...city,
      temp: 0,
      humidity: 0,
      pm10: 0,
      wind: 0,
      rainProb: 0,
      status: '불러오는 중',
    })),
  )
  const forecasts = ref({}) // cityId -> 3시간 예보
  const dailies = ref({}) // cityId -> 일별 예보
  const detailLoaded = ref({}) // cityId -> OpenWeatherMap 상세를 받아 왔는지

  const myLocation = ref(null)
  const locationError = ref('')
  const locating = ref(false)

  const loading = ref(false)
  const errorMessage = ref('')
  const loaded = ref(false)
  const updatedAt = ref('')

  const findCity = (cityId) => {
    if (cityId === 'my_location') return myLocation.value ?? undefined
    return cities.value.find((city) => city.id === cityId)
  }

  const forecastOf = (cityId) => forecasts.value[cityId] ?? []
  const dailyOf = (cityId) => dailies.value[cityId] ?? []

  const areaCounts = computed(() => {
    const counts = {}
    cities.value.forEach((city) => {
      counts[city.area] = (counts[city.area] ?? 0) + 1
    })
    return counts
  })

  const stamp = () => {
    updatedAt.value = new Date().toTimeString().slice(0, 8)
  }

  /** 목록 전체 갱신 */
  const loadAll = async () => {
    if (loading.value) return

    loading.value = true
    errorMessage.value = ''

    try {
      cities.value = await fetchCitiesWeather(cityList)
      loaded.value = true
      stamp()
    } catch (error) {
      errorMessage.value = error.message
      console.error('[weatherStore] loadAll 실패', error)
    } finally {
      loading.value = false
    }
  }

  const loadOnce = async () => {
    if (loaded.value) return
    await loadAll()
  }

  /**
   * 도시 하나를 OpenWeatherMap으로 다시 받아 상세 항목까지 채운다.
   * 이미 받아 둔 도시는 건너뛴다.
   */
  const loadCityDetail = async (cityId, force = false) => {
    if (!hasApiKey) return
    if (!force && detailLoaded.value[cityId] === true) return

    const base = cityList.find((city) => city.id === cityId)
    if (base === undefined) return

    try {
      const result = await fetchCityWeather(base)

      const index = cities.value.findIndex((city) => city.id === cityId)
      if (index !== -1) {
        // Open-Meteo로 채워 둔 값 위에 OpenWeatherMap 값을 덮어쓴다
        cities.value[index] = { ...cities.value[index], ...result.city, source: 'openweathermap' }
      }

      forecasts.value = { ...forecasts.value, [cityId]: result.forecast }
      dailies.value = { ...dailies.value, [cityId]: result.daily }
      detailLoaded.value = { ...detailLoaded.value, [cityId]: true }
    } catch (error) {
      errorMessage.value = error.message
      console.error(`[weatherStore] ${cityId} 상세 조회 실패`, error)
    }
  }

  /** 브라우저 위치 권한을 받아 현재 좌표의 날씨를 가져온다 */
  const loadMyLocation = () => {
    if (navigator.geolocation === undefined) {
      locationError.value = '이 브라우저는 위치 기능을 지원하지 않습니다.'
      return
    }

    locating.value = true
    locationError.value = ''

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords

        try {
          const result = await fetchWeatherByCoords(latitude, longitude)
          myLocation.value = result.city
          forecasts.value = { ...forecasts.value, my_location: result.forecast }
          dailies.value = { ...dailies.value, my_location: result.daily }
        } catch (error) {
          locationError.value = error.message
        } finally {
          locating.value = false
        }
      },
      (error) => {
        // 권한을 거부해도 앱은 그대로 동작해야 하므로 안내만 남긴다
        locationError.value = error.code === error.PERMISSION_DENIED ? '위치 권한이 거부되었습니다. 브라우저 설정에서 허용해 주세요.' : '현재 위치를 가져오지 못했습니다.'
        locating.value = false
      },
      { timeout: 10000, maximumAge: 300000 },
    )
  }

  const clearMyLocation = () => {
    myLocation.value = null
    locationError.value = ''
  }

  return {
    cities,
    forecasts,
    dailies,
    myLocation,
    locationError,
    locating,
    loading,
    errorMessage,
    loaded,
    updatedAt,
    areaCounts,
    findCity,
    forecastOf,
    dailyOf,
    loadAll,
    loadOnce,
    loadCityDetail,
    loadMyLocation,
    clearMyLocation,
  }
})
