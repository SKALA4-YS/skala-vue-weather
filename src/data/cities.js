// 전국 30개 지역. 좌표는 각 시청 기준.
// 관측값(기온·습도 등)은 API로 받아 덮어쓰고, 여기 있는 것은 API가 주지 않는 정보다.
export const cities = [
  { id: 'city_01', name: '서울', region: '서울특별시', area: '수도권', lat: 37.5665, lon: 126.978 },
  { id: 'city_02', name: '인천', region: '인천광역시', area: '수도권', lat: 37.4563, lon: 126.7052 },
  { id: 'city_03', name: '수원', region: '경기도 수원시', area: '수도권', lat: 37.2636, lon: 127.0286 },
  { id: 'city_04', name: '성남', region: '경기도 성남시', area: '수도권', lat: 37.42, lon: 127.1265 },
  { id: 'city_05', name: '고양', region: '경기도 고양시', area: '수도권', lat: 37.6584, lon: 126.832 },
  { id: 'city_06', name: '용인', region: '경기도 용인시', area: '수도권', lat: 37.2411, lon: 127.1776 },
  { id: 'city_07', name: '부천', region: '경기도 부천시', area: '수도권', lat: 37.5035, lon: 126.766 },
  { id: 'city_08', name: '안산', region: '경기도 안산시', area: '수도권', lat: 37.3219, lon: 126.8309 },
  { id: 'city_09', name: '춘천', region: '강원특별자치도 춘천시', area: '강원', lat: 37.8813, lon: 127.7298 },
  { id: 'city_10', name: '강릉', region: '강원특별자치도 강릉시', area: '강원', lat: 37.7519, lon: 128.8761 },
  { id: 'city_11', name: '원주', region: '강원특별자치도 원주시', area: '강원', lat: 37.3422, lon: 127.9202 },
  { id: 'city_12', name: '속초', region: '강원특별자치도 속초시', area: '강원', lat: 38.207, lon: 128.5918 },
  { id: 'city_13', name: '청주', region: '충청북도 청주시', area: '충청', lat: 36.6424, lon: 127.489 },
  { id: 'city_14', name: '충주', region: '충청북도 충주시', area: '충청', lat: 36.9911, lon: 127.926 },
  { id: 'city_15', name: '천안', region: '충청남도 천안시', area: '충청', lat: 36.8151, lon: 127.1139 },
  { id: 'city_16', name: '대전', region: '대전광역시', area: '충청', lat: 36.3504, lon: 127.3845 },
  { id: 'city_17', name: '세종', region: '세종특별자치시', area: '충청', lat: 36.48, lon: 127.289 },
  { id: 'city_18', name: '전주', region: '전북특별자치도 전주시', area: '전라', lat: 35.8242, lon: 127.148 },
  { id: 'city_19', name: '군산', region: '전북특별자치도 군산시', area: '전라', lat: 35.9676, lon: 126.7369 },
  { id: 'city_20', name: '광주', region: '광주광역시', area: '전라', lat: 35.1595, lon: 126.8526 },
  { id: 'city_21', name: '목포', region: '전라남도 목포시', area: '전라', lat: 34.8118, lon: 126.3922 },
  { id: 'city_22', name: '여수', region: '전라남도 여수시', area: '전라', lat: 34.7604, lon: 127.6622 },
  { id: 'city_23', name: '대구', region: '대구광역시', area: '경상', lat: 35.8714, lon: 128.6014 },
  { id: 'city_24', name: '포항', region: '경상북도 포항시', area: '경상', lat: 36.019, lon: 129.3435 },
  { id: 'city_25', name: '경주', region: '경상북도 경주시', area: '경상', lat: 35.8562, lon: 129.2247 },
  { id: 'city_26', name: '안동', region: '경상북도 안동시', area: '경상', lat: 36.5684, lon: 128.7294 },
  { id: 'city_27', name: '울산', region: '울산광역시', area: '경상', lat: 35.5384, lon: 129.3114 },
  { id: 'city_28', name: '창원', region: '경상남도 창원시', area: '경상', lat: 35.2281, lon: 128.6811 },
  { id: 'city_29', name: '부산', region: '부산광역시', area: '경상', lat: 35.1796, lon: 129.0756 },
  { id: 'city_30', name: '제주', region: '제주특별자치도 제주시', area: '제주', lat: 33.4996, lon: 126.5312 },
]

export const areas = ['전체', '수도권', '강원', '충청', '전라', '경상', '제주']

export const findCityById = (cityId) => cities.find((city) => city.id === cityId)
