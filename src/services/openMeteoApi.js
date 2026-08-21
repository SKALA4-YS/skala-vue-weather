import axios from 'axios'

// Open-Meteo는 좌표를 콤마로 이어 붙이면 여러 지점을 한 번에 돌려준다.
// 30개 도시를 도시마다 부르면 OpenWeatherMap 무료 한도(분당 60회)를 금방 넘기지만,
// 이쪽은 목록 전체가 호출 두 번이면 끝난다.
const openMeteo = axios.create({
  baseURL: 'https://api.open-meteo.com/v1',
  timeout: 10000,
})

const airQuality = axios.create({
  baseURL: 'https://air-quality-api.open-meteo.com/v1',
  timeout: 10000,
})

// WMO weather code → 한글 설명과 아이콘.
// OpenWeatherMap과 달리 설명 문구를 주지 않아서 직접 표를 만든다.
const WMO = {
  0: ['맑음', '01d'],
  1: ['대체로 맑음', '02d'],
  2: ['구름 조금', '03d'],
  3: ['흐림', '04d'],
  45: ['안개', '50d'],
  48: ['짙은 안개', '50d'],
  51: ['가랑비', '09d'],
  53: ['이슬비', '09d'],
  55: ['강한 이슬비', '09d'],
  56: ['어는 가랑비', '09d'],
  57: ['어는 이슬비', '09d'],
  61: ['약한 비', '10d'],
  63: ['비', '10d'],
  65: ['강한 비', '10d'],
  66: ['어는 비', '13d'],
  67: ['강한 어는 비', '13d'],
  71: ['약한 눈', '13d'],
  73: ['눈', '13d'],
  75: ['강한 눈', '13d'],
  77: ['싸락눈', '13d'],
  80: ['소나기', '09d'],
  81: ['강한 소나기', '09d'],
  82: ['매우 강한 소나기', '09d'],
  85: ['소낙눈', '13d'],
  86: ['강한 소낙눈', '13d'],
  95: ['뇌우', '11d'],
  96: ['우박 동반 뇌우', '11d'],
  99: ['강한 우박 뇌우', '11d'],
}

export const describeCode = (code) => WMO[code] ?? ['알 수 없음', '03d']

const joinCoords = (list, key) => list.map((city) => city[key]).join(',')

// 지점이 하나면 객체, 여럿이면 배열로 오기 때문에 항상 배열로 맞춰 둔다
const toArray = (data) => (Array.isArray(data) ? data : [data])

/**
 * 도시 목록 전체의 현재 날씨와 대기질을 한 번에 받아 온다.
 * 두 호출은 서로 무관하므로 병렬로 보내고, 대기질이 실패해도 날씨는 살린다.
 */
export const fetchCitiesWeather = async (cityList) => {
  const latitude = joinCoords(cityList, 'lat')
  const longitude = joinCoords(cityList, 'lon')

  const [weatherResult, airResult] = await Promise.allSettled([
    openMeteo.get('/forecast', {
      params: {
        latitude,
        longitude,
        current: 'temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m,precipitation',
        hourly: 'precipitation_probability',
        forecast_hours: 1,
        timezone: 'Asia/Seoul',
      },
    }),
    airQuality.get('/air-quality', {
      params: { latitude, longitude, current: 'pm10,pm2_5', timezone: 'Asia/Seoul' },
    }),
  ])

  if (weatherResult.status === 'rejected') {
    throw new Error(`날씨 정보를 불러오지 못했습니다. (${weatherResult.reason.message})`)
  }

  const weatherList = toArray(weatherResult.value.data)
  const airList = airResult.status === 'fulfilled' ? toArray(airResult.value.data) : []

  return cityList.map((city, index) => {
    const current = weatherList[index].current
    const air = airList[index]?.current
    const [status, icon] = describeCode(current.weather_code)

    // 강수확률은 current에 없어서 hourly 첫 시각 값을 쓴다
    const pop = weatherList[index].hourly?.precipitation_probability?.[0] ?? 0

    return {
      ...city,
      temp: Math.round(current.temperature_2m),
      feelsLike: Math.round(current.apparent_temperature),
      humidity: Math.round(current.relative_humidity_2m),
      wind: Number(current.wind_speed_10m.toFixed(1)),
      status,
      icon,
      weatherCode: current.weather_code,
      rainProb: Math.round(pop),
      pm10: air === undefined ? 0 : Math.round(air.pm10),
      pm25: air === undefined ? null : Math.round(air.pm2_5),
      source: 'open-meteo',
    }
  })
}

const gradeUv = (uv) => {
  if (uv < 3) return '낮음'
  if (uv < 6) return '보통'
  if (uv < 8) return '높음'
  if (uv < 11) return '매우 높음'
  return '위험'
}

// 시각은 '2026-08-21T05:42' 형태로 온다
const toTime = (isoText) => (typeof isoText === 'string' ? isoText.slice(11, 16) : '-')

/** 자외선 지수와 일출/일몰 시각 */
export const fetchSunAndUv = async (lat, lon) => {
  const { data } = await openMeteo.get('/forecast', {
    params: {
      latitude: lat,
      longitude: lon,
      daily: 'uv_index_max,sunrise,sunset',
      timezone: 'Asia/Seoul',
      forecast_days: 1,
    },
  })

  const uv = data.daily.uv_index_max[0]

  return {
    uvIndex: uv,
    uvGrade: gradeUv(uv),
    sunrise: toTime(data.daily.sunrise[0]),
    sunset: toTime(data.daily.sunset[0]),
  }
}
