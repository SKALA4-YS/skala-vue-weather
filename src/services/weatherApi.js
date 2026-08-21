import axios from 'axios'

// 키는 .env에 VITE_OPENWEATHER_API_KEY로 넣는다.
// Vite는 VITE_ 로 시작하는 것만 클라이언트에 노출한다.
const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY ?? ''

export const hasApiKey = API_KEY !== ''

// 공통 설정을 담은 인스턴스. 호출할 때마다 appid와 units를 적지 않아도 된다.
const owm = axios.create({
  baseURL: 'https://api.openweathermap.org',
  timeout: 8000,
  params: {
    appid: API_KEY,
    units: 'metric', // 섭씨로 받는다. 화씨 변환은 configStore가 화면에서 처리
    lang: 'kr',
  },
})

// 에러 메시지를 화면에 그대로 쓸 수 있는 문장으로 바꿔 둔다.
owm.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status

    if (status === 401) {
      return Promise.reject(new Error('API Key가 올바르지 않습니다. .env 파일을 확인해 주세요.'))
    }
    if (status === 429) {
      return Promise.reject(new Error('무료 호출 한도(분당 60회)를 넘었습니다. 잠시 후 다시 시도해 주세요.'))
    }
    if (error.code === 'ECONNABORTED') {
      return Promise.reject(new Error('응답이 너무 늦어 요청을 취소했습니다.'))
    }
    return Promise.reject(new Error(error.message))
  },
)

// 현재 날씨
const fetchCurrent = (lat, lon) => owm.get('/data/2.5/weather', { params: { lat, lon } }).then((res) => res.data)

// 5일 / 3시간 단위 예보
const fetchForecast = (lat, lon) => owm.get('/data/2.5/forecast', { params: { lat, lon } }).then((res) => res.data)

// 대기오염 정보. 이 엔드포인트는 units/lang을 무시한다.
const fetchAirPollution = (lat, lon) => owm.get('/data/2.5/air_pollution', { params: { lat, lon } }).then((res) => res.data)

const toObservedAt = (unixSeconds) => {
  const d = new Date(unixSeconds * 1000)
  const pad = (n) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`
}

// OWM 응답을 앱이 쓰던 도시 객체 모양으로 맞춘다.
// 화면 쪽을 고치지 않으려고 키 이름을 그대로 유지했다.
const mergeCity = (base, current, air, forecast) => ({
  ...base,
  temp: Math.round(current.main.temp),
  feelsLike: Math.round(current.main.feels_like),
  status: current.weather[0].description,
  icon: current.weather[0].icon,
  humidity: current.main.humidity,
  wind: current.wind.speed,
  pressure: current.main.pressure,
  // air_pollution은 pm10을 소수로 준다
  pm10: air === null ? base.pm10 : Math.round(air.list[0].components.pm10),
  pm25: air === null ? null : Math.round(air.list[0].components.pm2_5),
  // 강수확률(pop)은 현재 날씨에 없어서 예보의 가장 가까운 시점 값을 쓴다
  rainProb: forecast === null ? base.rainProb : Math.round(forecast.list[0].pop * 100),
  observedAt: toObservedAt(current.dt),
})

// 예보 응답에서 화면에 쓸 항목만 추린다.
// humidity와 wind는 러닝 지수를 시간대별로 계산할 때 쓴다.
const toForecastItems = (forecast, count = 8) =>
  forecast.list.slice(0, count).map((item) => ({
    time: item.dt_txt.slice(5, 16).replace('-', '/'),
    temp: Math.round(item.main.temp),
    feelsLike: Math.round(item.main.feels_like),
    humidity: item.main.humidity,
    wind: item.wind.speed,
    status: item.weather[0].description,
    icon: item.weather[0].icon,
    rainProb: Math.round(item.pop * 100),
  }))

// 3시간 예보를 날짜별로 묶어 일별 예보를 만든다. 추가 호출 없이 같은 응답을 다시 쓴다.
const toDailyItems = (forecast) => {
  const byDate = {}

  forecast.list.forEach((item) => {
    const date = item.dt_txt.slice(0, 10)

    if (byDate[date] === undefined) {
      byDate[date] = { date, temps: [], pops: [], icons: [] }
    }
    byDate[date].temps.push(item.main.temp)
    byDate[date].pops.push(item.pop)
    byDate[date].icons.push(item.weather[0].icon)
  })

  return Object.values(byDate).map((day) => ({
    date: day.date,
    label: `${Number(day.date.slice(5, 7))}/${Number(day.date.slice(8, 10))}`,
    min: Math.round(Math.min(...day.temps)),
    max: Math.round(Math.max(...day.temps)),
    rainProb: Math.round(Math.max(...day.pops) * 100),
    // 하루를 대표하는 아이콘은 정오에 가까운 값을 쓴다
    icon: day.icons[Math.min(4, day.icons.length - 1)].replace('n', 'd'),
  }))
}

/**
 * 도시 하나의 현재 날씨 + 대기질 + 예보를 한 번에 가져온다.
 * 셋 중 하나가 실패해도 나머지는 살리려고 allSettled를 쓴다.
 */
export const fetchCityWeather = async (baseCity) => {
  const [current, air, forecast] = await Promise.allSettled([fetchCurrent(baseCity.lat, baseCity.lon), fetchAirPollution(baseCity.lat, baseCity.lon), fetchForecast(baseCity.lat, baseCity.lon)])

  // 현재 날씨는 없으면 카드를 그릴 수 없으므로 여기서 실패로 본다
  if (current.status === 'rejected') {
    throw current.reason
  }

  const airData = air.status === 'fulfilled' ? air.value : null
  const forecastData = forecast.status === 'fulfilled' ? forecast.value : null

  return {
    city: mergeCity(baseCity, current.value, airData, forecastData),
    forecast: forecastData === null ? [] : toForecastItems(forecastData),
    daily: forecastData === null ? [] : toDailyItems(forecastData),
  }
}

/** 좌표만 알고 있을 때(내 위치) 쓰는 조회. 지역 이름은 API가 준 값을 쓴다. */
export const fetchWeatherByCoords = async (lat, lon) => {
  const base = {
    id: 'my_location',
    name: '내 위치',
    region: '',
    lat,
    lon,
  }

  const result = await fetchCityWeather(base)
  result.city.name = '내 위치'
  result.city.region = '현재 좌표 기준'

  return result
}

export const iconUrl = (icon) => `https://openweathermap.org/img/wn/${icon}@2x.png`
