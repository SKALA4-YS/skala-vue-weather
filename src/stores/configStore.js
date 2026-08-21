import { defineStore } from 'pinia'

/* ════════════════════════════════════════════════
   [요구사항] stores/configStore.js — 날씨 단위를 세팅하는 스토어

   | state   | unit       | 단위를 저장하는 변수 (초기값: celsius)     |
   | getters | unitSymbol | 현재 단위 상태에 맞는 기호 (°C / °F)       |
   | actions | toggleUnit | 'celsius'와 'fahrenheit'를 토글하는 함수   |

   왜 스토어가 필요한가:
   단위 설정은 내비게이션 바(UnitToggler), 메인 목록의 카드, 상세 화면, 순위표가
   모두 알아야 하는 값이다. props로 내리려면
     App.vue → RouterView → WeatherHomeView → WeatherCard
   처럼 중간 컴포넌트들이 자기와 상관없는 값을 받아서 넘겨주기만 해야 한다(props drilling).
   게다가 App.vue와 WeatherCard는 부모-자식 관계도 아니라서 애초에 내려보낼 길이 없다.

   Pinia는 컴포넌트 트리 바깥에 상태를 두고, 필요한 컴포넌트가 직접 꺼내 쓰게 한다.
   ════════════════════════════════════════════════ */

/*
  Options 스타일 정의. 교재의 state / getters / actions 표와 모양이 그대로 맞는다.
  (setup 스타일로도 쓸 수 있다. stores/favoriteStore.js가 그 방식으로 되어 있다.)

  첫 번째 인자 'config'는 스토어의 고유 ID다. 앱 안에서 겹치면 안 되고,
  Vue DevTools의 Pinia 탭에도 이 이름으로 나타난다.
*/
export const useConfigStore = defineStore('config', {
  // state는 반드시 함수로 돌려준다. 객체를 그대로 쓰면 여러 곳에서 같은 객체를 공유하게 된다.
  // (컴포넌트의 data()가 함수인 것과 같은 이유)
  state: () => ({
    // 새로고침해도 유지되도록 localStorage에 저장해 둔 값이 있으면 그것으로 시작한다.
    unit: localStorage.getItem('weather-unit') === 'fahrenheit' ? 'fahrenheit' : 'celsius',
    // 기본은 라이트. 저장된 값이 dark일 때만 어두운 화면으로 시작한다.
    theme: localStorage.getItem('weather-theme') === 'dark' ? 'dark' : 'light',
  }),

  getters: {
    // computed와 같은 역할. state를 인자로 받아 가공한 값을 돌려주며, 결과는 캐싱된다.
    unitSymbol: (state) => (state.unit === 'celsius' ? '°C' : '°F'),

    /*
      [요구사항 4] getter 추가.
      다른 getter를 참조할 때는 화살표 함수 대신 일반 함수로 써야 한다.
      화살표 함수는 자기만의 this가 없어서 this.unitSymbol에 접근할 수 없기 때문이다.
    */
    unitLabel() {
      return this.unit === 'celsius' ? `섭씨(${this.unitSymbol})` : `화씨(${this.unitSymbol})`
    },

    isDark: (state) => state.theme === 'dark',

    // [요구사항 4] 버튼에 표시할 '바꿀 대상' 이름
    nextUnitLabel() {
      return this.unit === 'celsius' ? '화씨(°F)' : '섭씨(°C)'
    },
  },

  actions: {
    /*
      state를 바꾸는 함수. actions 안에서는 this로 state에 바로 접근한다.
      (Options 스타일이라 this를 쓴다. setup 스타일이면 ref를 직접 다룬다.)

      컴포넌트에서 configStore.unit = 'fahrenheit' 처럼 직접 대입해도 동작하지만,
      "단위를 토글한다"는 의미를 action 이름으로 남겨 두면
      나중에 로그를 남기거나 서버에 저장하는 일이 생겨도 이 함수 안만 고치면 된다.
    */
    toggleUnit() {
      this.setUnit(this.unit === 'celsius' ? 'fahrenheit' : 'celsius')
    },

    // [요구사항 4] action 추가. 특정 단위로 직접 지정한다.
    setUnit(unit) {
      this.unit = unit === 'fahrenheit' ? 'fahrenheit' : 'celsius'
      localStorage.setItem('weather-unit', this.unit)
    },

    // 화면 테마. Element Plus는 html의 dark 클래스로 다크용 변수를 켠다.
    applyTheme() {
      document.documentElement.classList.toggle('dark', this.theme === 'dark')
    },

    toggleTheme() {
      this.theme = this.theme === 'light' ? 'dark' : 'light'
      localStorage.setItem('weather-theme', this.theme)
      this.applyTheme()
    },
  },
})
