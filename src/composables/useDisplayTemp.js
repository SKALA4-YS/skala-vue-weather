import { computed, toValue } from 'vue'
import { useConfigStore } from '../stores/configStore'

/* ════════════════════════════════════════════════
   [요구사항 3의 (참고)] 단위 변환 Composable

   교재 코드는 각 컴포넌트 안에 이렇게 두라고 되어 있다.

     const displayTemp = computed(() => {
       const rawTemp = props.cityItem.temp      // 기본 원본 데이터는 섭씨 숫자
       if (configStore.unit === 'fahrenheit') {
         return Math.round((rawTemp * 9) / 5 + 32)   // 화씨 변환 연산
       }
       return rawTemp                            // 'celsius'일 때는 원본 그대로 반환
     })

   그런데 이 프로젝트는 기온을 보여 주는 곳이 세 군데다.
     ① WeatherCard (목록 카드)  ② WeatherDetailView (상세)  ③ WeatherRankingView (순위)
   교재가 (참고)로 적어 둔 "유사한 코드가 중복됨" 상황이 실제로 생겨서,
   변환 규칙을 이 파일 하나로 모았다. 계산식 자체는 교재 코드 그대로다.

   Composable = 반응형 로직을 담은 재사용 함수. 규칙은 두 가지다.
     - 이름을 use~ 로 짓는다
     - 컴포넌트가 아니라 그냥 .js 함수인데, 안에서 ref/computed 같은 반응형 API를 쓴다
   컴포넌트(=화면 조각)를 재사용하는 것이 아니라 '로직'을 재사용하는 방법이다.
   ════════════════════════════════════════════════ */

/*
  변환 규칙 자체는 반응형과 무관한 순수 함수라 따로 빼 두었다.
  v-for 안에서 도시마다 변환해야 하는 곳(WeatherRankingView)은
  composable을 반복 호출할 수 없으므로 이 함수를 직접 쓴다.
  (composable은 setup에서 한 번만 호출해야 한다. → 노트 Q49)
*/
export const convertTemp = (rawTemp, unit) => {
  if (unit === 'fahrenheit') {
    return Math.round((rawTemp * 9) / 5 + 32)
  }
  return rawTemp
}

/**
 * @param source 섭씨 원본 기온. 숫자, ref, 또는 () => props.city.temp 같은 getter 함수
 */
export const useDisplayTemp = (source) => {
  const configStore = useConfigStore()

  const displayTemp = computed(() => {
    /*
      toValue()는 숫자 / ref / getter 함수 중 무엇이 와도 실제 값을 꺼내 준다.
      props.city.temp를 그대로 넘기면 그 순간의 숫자로 고정돼 반응성이 끊기므로,
      호출하는 쪽에서 () => props.city.temp 형태로 넘기고 여기서 풀어 준다.
    */
    return convertTemp(toValue(source), configStore.unit)
  })

  // 숫자와 기호를 붙인 표시용 문자열. '28°C' / '82°F'
  const displayTempText = computed(() => `${displayTemp.value}${configStore.unitSymbol}`)

  return { displayTemp, displayTempText }
}
