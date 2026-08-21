// 날씨 값을 러닝 적합도 점수로 바꾼다.
// 100점에서 시작해 항목별로 깎는 방식이라, 무엇 때문에 몇 점이 깎였는지 화면에 그대로 보여 줄 수 있다.
//
// 기준은 아래 자료를 참고해 잡았다.
//  - 체감온도 10~18도가 지구력 운동에 가장 유리하다는 스포츠의학 통설
//  - 환경부 미세먼지 등급 (30 / 80 / 150)
//  - 기상청 폭염 주의보 체감온도 33도
// 정확한 의학 기준이 아니라 이 앱에서 쓰는 임의 배점이라는 점은 화면에도 적어 둔다.

const clamp = (value, min, max) => Math.min(Math.max(value, min), max)

// 기온: 10~18도를 기준 구간으로 두고 양쪽으로 멀어질수록 깎는다.
const scoreTemp = (temp) => {
  if (temp >= 10 && temp <= 18) return 0
  if (temp > 18 && temp <= 23) return -(temp - 18) * 1.5
  if (temp > 23 && temp <= 28) return -7.5 - (temp - 23) * 3
  if (temp > 28) return -22.5 - (temp - 28) * 4
  if (temp >= 5) return -(10 - temp) * 1.5
  return -7.5 - (5 - temp) * 2
}

// 습도: 땀이 증발하지 못하면 체온이 안 떨어진다. 낮아도 호흡기가 마른다.
const scoreHumidity = (humidity) => {
  if (humidity >= 40 && humidity <= 60) return 0
  if (humidity > 60) return -(humidity - 60) * 0.5
  return -(40 - humidity) * 0.3
}

// 미세먼지: 운동 중에는 호흡량이 늘어 영향이 커지므로 등급이 나빠질수록 기울기를 키웠다.
const scorePm10 = (pm10) => {
  if (pm10 <= 30) return 0
  if (pm10 <= 80) return -(pm10 - 30) * 0.2
  if (pm10 <= 150) return -10 - (pm10 - 80) * 0.4
  return -38 - (pm10 - 150) * 0.6
}

// 바람: 약한 바람은 오히려 도움이 되지만 강해지면 저항이 된다.
const scoreWind = (wind) => {
  if (wind <= 3) return 0
  if (wind <= 7) return -(wind - 3) * 1.5
  return -6 - (wind - 7) * 3
}

const scoreRain = (rainProb) => {
  if (rainProb <= 20) return 0
  if (rainProb <= 50) return -(rainProb - 20) * 0.3
  return -9 - (rainProb - 50) * 0.6
}

// 자외선은 Open-Meteo에서 받아온 값이 있을 때만 반영한다.
const scoreUv = (uvIndex) => {
  if (uvIndex === null || uvIndex === undefined) return 0
  if (uvIndex <= 5) return 0
  return -(uvIndex - 5) * 2
}

const GRADES = [
  { min: 85, label: '최고', severity: 'success', comment: '지금 나가면 딱 좋습니다.' },
  { min: 70, label: '좋음', severity: 'success', comment: '무리 없이 뛸 수 있는 날씨입니다.' },
  { min: 55, label: '보통', severity: 'info', comment: '페이스를 조금 낮춰서 뛰세요.' },
  { min: 40, label: '나쁨', severity: 'warn', comment: '짧게 뛰거나 실내 운동을 권합니다.' },
  { min: 0, label: '위험', severity: 'danger', comment: '야외 러닝은 피하는 게 좋습니다.' },
]

const gradeOf = (score) => GRADES.find((grade) => score >= grade.min)

/**
 * 날씨 한 시점의 러닝 점수와 감점 내역을 계산한다.
 * @param {object} weather temp, humidity, pm10, wind, rainProb, uvIndex(선택)
 */
export const calcRunningIndex = (weather) => {
  const factors = [
    { key: 'temp', label: '기온', value: `${weather.temp}°C`, delta: scoreTemp(weather.temp) },
    {
      key: 'humidity',
      label: '습도',
      value: `${weather.humidity}%`,
      delta: scoreHumidity(weather.humidity),
    },
    {
      key: 'pm10',
      label: '미세먼지',
      value: `${weather.pm10}㎍/㎥`,
      delta: scorePm10(weather.pm10),
    },
    { key: 'wind', label: '바람', value: `${weather.wind}m/s`, delta: scoreWind(weather.wind) },
    {
      key: 'rain',
      label: '강수확률',
      value: `${weather.rainProb}%`,
      delta: scoreRain(weather.rainProb),
    },
  ]

  if (weather.uvIndex !== null && weather.uvIndex !== undefined) {
    factors.push({
      key: 'uv',
      label: '자외선',
      value: String(weather.uvIndex),
      delta: scoreUv(weather.uvIndex),
    })
  }

  const total = factors.reduce((sum, factor) => sum + factor.delta, 0)
  const score = Math.round(clamp(100 + total, 0, 100))

  return {
    score,
    grade: gradeOf(score),
    // 많이 깎인 순으로 정렬해 두면 화면에서 '무엇이 문제인지'가 위에 온다
    factors: factors
      .map((factor) => ({ ...factor, delta: Math.round(factor.delta) }))
      .sort((a, b) => a.delta - b.delta),
  }
}

/** 기온과 습도로 권장 수분 섭취량(ml)을 대략 잡는다. 1시간 러닝 기준. */
export const calcHydration = (temp, humidity) => {
  const base = 500
  const heat = Math.max(0, temp - 20) * 25
  const humid = Math.max(0, humidity - 60) * 2
  // 50ml 단위로 반올림해야 실제로 마시기 좋은 숫자가 된다
  return Math.round((base + heat + humid) / 50) * 50
}

/** 예보 목록에서 시간대별 점수를 만든다. 미세먼지는 시간별 예보가 없어 현재 값을 그대로 쓴다. */
export const buildHourlyIndex = (forecastItems, pm10, uvIndex) =>
  forecastItems.map((item) => {
    const { score, grade } = calcRunningIndex({
      temp: item.temp,
      humidity: item.humidity,
      pm10,
      wind: item.wind,
      rainProb: item.rainProb,
      uvIndex,
    })

    return { time: item.time, hour: item.time.slice(-5), score, grade, temp: item.temp }
  })

/** 시간대별 점수에서 가장 좋은 구간과 가장 나쁜 구간을 찾는다. */
export const pickBestWorst = (hourly) => {
  if (hourly.length === 0) return { best: null, worst: null }

  const sorted = [...hourly].sort((a, b) => b.score - a.score)
  return { best: sorted[0], worst: sorted[sorted.length - 1] }
}
